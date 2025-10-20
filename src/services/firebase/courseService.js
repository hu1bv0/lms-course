import firestoreService from './firestoreService';

class CourseService {
  constructor() {
    this.firestore = firestoreService;
  }

  // Tạo khóa học mới
  async createCourse(courseData) {
    try {
      const courseId = `course_${Date.now()}`;
      const course = {
        ...courseData,
        id: courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: [],
        exams: [],
        enrolledStudents: 0,
        rating: 0,
        status: 'active'
      };

      await this.firestore.createDocument('courses', course, courseId);
      
      return {
        success: true,
        course: course
      };
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  // Lấy tất cả khóa học
  async getAllCourses() {
    try {
      const courses = await this.firestore.getCollection('courses');
      
      // Sort by createdAt (newest first)
      const sortedCourses = courses.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      return {
        success: true,
        courses: sortedCourses
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Lấy khóa học theo ID
  async getCourseById(courseId) {
    try {
      const courseResult = await this.firestore.getDocument('courses', courseId);
      
      if (!courseResult.success) {
        throw new Error('Course not found');
      }
      
      const course = courseResult.data;

      return {
        success: true,
        course: course
      };
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  // Cập nhật khóa học
  async updateCourse(courseId, updateData) {
    try {
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      await this.firestore.updateDocument('courses', courseId, updatedData);
      
      return {
        success: true,
        message: 'Course updated successfully'
      };
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  // Xóa khóa học
  async deleteCourse(courseId) {
    try {
      await this.firestore.deleteDocument('courses', courseId);
      
      return {
        success: true,
        message: 'Course deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  // Lấy khóa học theo bộ lọc
  async getCoursesByFilter(filters = {}) {
    try {
      const { educationLevel, grade, subject, accessLevel, status } = filters;
      
      let whereConditions = [];
      
      if (educationLevel) {
        whereConditions.push({ field: 'educationLevel', operator: '==', value: educationLevel });
      }
      
      if (grade) {
        whereConditions.push({ field: 'grade', operator: '==', value: grade });
      }
      
      if (subject) {
        whereConditions.push({ field: 'subject', operator: '==', value: subject });
      }
      
      if (accessLevel) {
        whereConditions.push({ field: 'accessLevel', operator: '==', value: accessLevel });
      }
      
      if (status) {
        whereConditions.push({ field: 'status', operator: '==', value: status });
      }

      const options = whereConditions.length > 0 ? { where: whereConditions } : {};
      const courses = await this.firestore.getCollection('courses', options);
      
      // Sort by createdAt (newest first)
      const sortedCourses = courses.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return dateB - dateA;
      });

      return {
        success: true,
        courses: sortedCourses
      };
    } catch (error) {
      console.error('Error fetching courses by filter:', error);
      throw error;
    }
  }

  // Thêm bài học vào khóa học
  async addLessonToCourse(courseId, lessonData) {
    try {
      console.log('Adding lesson to course:', { courseId, lessonData });
      
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      console.log('Found course:', course);

      const lessonId = `lesson_${Date.now()}`;
      const lesson = {
        ...lessonData,
        id: lessonId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedLessons = [...(course.lessons || []), lesson];
      
      console.log('Updating course with lessons:', updatedLessons);
      
      await this.firestore.updateDocument('courses', courseId, {
        lessons: updatedLessons
      });

      return {
        success: true,
        lesson: lesson
      };
    } catch (error) {
      console.error('Error adding lesson to course:', error);
      throw error;
    }
  }

  // Thêm bài thi vào khóa học
  async addExamToCourse(courseId, examData) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      const examId = `exam_${Date.now()}`;
      const exam = {
        ...examData,
        id: examId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedExams = [...(course.exams || []), exam];
      
      await this.firestore.updateDocument('courses', courseId, {
        exams: updatedExams,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        exam: exam
      };
    } catch (error) {
      console.error('Error adding exam to course:', error);
      throw error;
    }
  }

  // Cập nhật bài học
  async updateLesson(courseId, lessonId, updateData) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedLessons = course.lessons.map(lesson => 
        lesson.id === lessonId 
          ? { ...lesson, ...updateData, updatedAt: new Date().toISOString() }
          : lesson
      );

      await this.firestore.updateDocument('courses', courseId, {
        lessons: updatedLessons,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Lesson updated successfully'
      };
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  }

  // Xóa bài học
  async deleteLesson(courseId, lessonId) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedLessons = course.lessons.filter(lesson => lesson.id !== lessonId);

      await this.firestore.updateDocument('courses', courseId, {
        lessons: updatedLessons,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Lesson deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  }

  // Lấy khóa học theo ID
  async getCourseById(courseId) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        return {
          success: false,
          message: 'Course not found'
        };
      }

      return {
        success: true,
        course: course
      };
    } catch (error) {
      console.error('Error getting course by ID:', error);
      throw error;
    }
  }

  // Lấy tiến độ học tập của student
  async getStudentProgress(studentId, courseId) {
    try {
      const enrollmentId = `${studentId}_${courseId}`;
      const enrollment = await this.firestore.getDocument('enrollments', enrollmentId);
      
      if (!enrollment) {
        return {
          success: false,
          message: 'Enrollment not found'
        };
      }

      return {
        success: true,
        progress: enrollment.progress,
        completedLessons: Array.isArray(enrollment.completedLessons) 
          ? enrollment.completedLessons 
          : (typeof enrollment.completedLessons === 'number' ? [] : []),
        completedExams: enrollment.completedExams || [],
        lastAccessedAt: enrollment.lastAccessedAt
      };
    } catch (error) {
      console.error('Error getting student progress:', error);
      throw error;
    }
  }

  // Đánh giá khóa học
  async rateCourse(studentId, courseId, rating, comment = '') {
    try {
      const ratingId = `${studentId}_${courseId}_${Date.now()}`;
      const ratingData = {
        id: ratingId,
        studentId,
        courseId,
        rating, // 1-5 stars
        comment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Lưu rating vào collection ratings
      await this.firestore.createDocument('ratings', ratingData, ratingId);

      // Cập nhật average rating của course
      await this.updateCourseAverageRating(courseId);

      return {
        success: true,
        message: 'Đánh giá thành công!'
      };
    } catch (error) {
      console.error('Error rating course:', error);
      throw error;
    }
  }

  // Cập nhật average rating của course
  async updateCourseAverageRating(courseId) {
    try {
      const ratings = await this.firestore.getCollection('ratings');
      const courseRatings = ratings.filter(rating => rating.courseId === courseId);
      
      if (courseRatings.length === 0) {
        // Không có rating nào, set về null hoặc 0
        await this.firestore.updateDocument('courses', courseId, {
          averageRating: null,
          totalRatings: 0,
          updatedAt: new Date().toISOString()
        });
        return;
      }

      const totalRating = courseRatings.reduce((sum, rating) => sum + rating.rating, 0);
      const averageRating = Math.round((totalRating / courseRatings.length) * 10) / 10; // Làm tròn 1 chữ số thập phân

      await this.firestore.updateDocument('courses', courseId, {
        averageRating,
        totalRatings: courseRatings.length,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        averageRating,
        totalRatings: courseRatings.length
      };
    } catch (error) {
      console.error('Error updating course average rating:', error);
      throw error;
    }
  }

  // Lấy rating của student cho course
  async getStudentRating(studentId, courseId) {
    try {
      const ratings = await this.firestore.getCollection('ratings');
      const studentRating = ratings.find(rating => 
        rating.studentId === studentId && rating.courseId === courseId
      );
      
      return {
        success: true,
        rating: studentRating || null
      };
    } catch (error) {
      console.error('Error getting student rating:', error);
      throw error;
    }
  }

  // Tạo certificate khi hoàn thành khóa học
  async createCourseCertificate(studentId, courseId, courseTitle) {
    try {
      const certificateId = `${studentId}_course_${courseId}_${Date.now()}`;
      const certificateData = {
        id: certificateId,
        studentId,
        courseId,
        courseTitle,
        type: 'course_completion',
        title: `Chứng chỉ hoàn thành khóa học "${courseTitle}"`,
        description: `Bạn đã hoàn thành thành công khóa học "${courseTitle}"`,
        earnedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      await this.firestore.createDocument('certificates', certificateData, certificateId);
      
      return {
        success: true,
        certificate: certificateData
      };
    } catch (error) {
      console.error('Error creating course certificate:', error);
      throw error;
    }
  }

  // Tạo certificate khi hoàn thành bài thi
  async createExamCertificate(studentId, courseId, examId, examTitle, score) {
    try {
      const certificateId = `${studentId}_exam_${examId}_${Date.now()}`;
      const certificateData = {
        id: certificateId,
        studentId,
        courseId,
        examId,
        examTitle,
        score,
        type: 'exam_completion',
        title: `Chứng chỉ hoàn thành bài thi "${examTitle}"`,
        description: `Bạn đã hoàn thành bài thi "${examTitle}"`,
        earnedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      await this.firestore.createDocument('certificates', certificateData, certificateId);
      
      return {
        success: true,
        certificate: certificateData
      };
    } catch (error) {
      console.error('Error creating exam certificate:', error);
      throw error;
    }
  }

  // Lấy certificates của student
  async getStudentCertificates(studentId) {
    try {
      const certificates = await this.firestore.getCollection('certificates');
      const studentCertificates = certificates.filter(cert => cert.studentId === studentId);
      
      return {
        success: true,
        certificates: studentCertificates
      };
    } catch (error) {
      console.error('Error getting student certificates:', error);
      throw error;
    }
  }

  // Lấy achievements của student
  async getStudentAchievements(studentId) {
    try {
      const certificates = await this.firestore.getCollection('certificates');
      const studentCertificates = certificates.filter(cert => cert.studentId === studentId);
      
      // Convert certificates to achievements format
      const achievements = studentCertificates.map(cert => ({
        id: cert.id,
        title: cert.title,
        description: cert.description,
        type: cert.type,
        earned: true,
        date: cert.earnedAt,
        certificate: cert
      }));
      
      return {
        success: true,
        achievements
      };
    } catch (error) {
      console.error('Error getting student achievements:', error);
      throw error;
    }
  }

  // Cập nhật kết quả bài thi
  async updateExamResult(studentId, courseId, examId, score) {
    try {
      const enrollmentId = `${studentId}_${courseId}`;
      const enrollment = await this.firestore.getDocument('enrollments', enrollmentId);
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      const completedExams = enrollment.completedExams || [];
      if (!completedExams.includes(examId)) {
        completedExams.push(examId);
      }

      await this.firestore.updateDocument('enrollments', enrollmentId, {
        completedExams: completedExams,
        lastAccessedAt: new Date().toISOString()
      });

      // Lưu kết quả bài thi với timestamp chính xác
      const examResultId = `${studentId}_${courseId}_${examId}`;
      const examResult = {
        id: examResultId,
        studentId,
        courseId,
        examId,
        score: score?.percentage || score || 0, // Lưu percentage hoặc score number
        earnedPoints: score?.earned || 0,
        totalPoints: score?.total || 0,
        percentage: score?.percentage || 0,
        completedAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      await this.firestore.createDocument('exam_results', examResult, examResultId);

      // Tạo certificate khi hoàn thành bài thi (chỉ tạo 1 lần)
      try {
        const course = await this.firestore.getDocument('courses', courseId);
        const exam = course?.exams?.find(exam => exam.id === examId);
        if (exam) {
          // Kiểm tra xem đã có certificate cho bài thi này chưa
          const certificates = await this.firestore.getCollection('certificates');
          const existingCert = certificates.find(cert => 
            cert.studentId === studentId && 
            cert.courseId === courseId && 
            cert.examId === examId && 
            cert.type === 'exam_completion'
          );
          
          if (!existingCert) {
            await this.createExamCertificate(studentId, courseId, examId, exam.title, score);
          }
        }
      } catch (certError) {
        console.error('Error creating exam certificate:', certError);
        // Không throw error để không ảnh hưởng đến exam result
      }

      return {
        success: true,
        message: 'Exam result updated successfully'
      };
    } catch (error) {
      console.error('Error updating exam result:', error);
      throw error;
    }
  }

  // Đăng ký khóa học cho student
  async enrollCourse(studentId, courseId) {
    try {
      // Kiểm tra khóa học có tồn tại không
      const courseResult = await this.firestore.getDocument('courses', courseId);
      if (!courseResult.success) {
        throw new Error('Course not found');
      }
      const course = courseResult.data;

      // Kiểm tra student đã đăng ký chưa
      const enrollmentResult = await this.firestore.getDocument('enrollments', `${studentId}_${courseId}`);
      if (enrollmentResult.success) {
        return {
          success: false,
          message: 'Student already enrolled in this course'
        };
      }

      // Tạo enrollment record
      const enrollmentData = {
        id: `${studentId}_${courseId}`,
        studentId,
        courseId,
        courseTitle: course.title,
        courseSubject: course.subject,
        courseGrade: course.grade,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessons: [],
        totalLessons: course.lessons?.length || 0,
        lastAccessedAt: new Date().toISOString(),
        status: 'active'
      };

      await this.firestore.createDocument('enrollments', enrollmentData, enrollmentData.id);

      // Cập nhật số lượng học sinh đăng ký trong khóa học
      await this.firestore.updateDocument('courses', courseId, {
        enrolledStudents: (course.enrolledStudents || 0) + 1,
        updatedAt: new Date().toISOString()
      });

      return {
        success: true,
        message: 'Successfully enrolled in course',
        enrollment: enrollmentData
      };
    } catch (error) {
      console.error('Error enrolling course:', error);
      throw error;
    }
  }

  // Lấy danh sách khóa học đã đăng ký của student
  async getEnrolledCourses(studentId) {
    try {
      const enrollments = await this.firestore.getCollection('enrollments');
      
      // Lọc enrollments của student này
      const studentEnrollments = enrollments.filter(enrollment => enrollment.studentId === studentId);
      console.log('Student enrollments:', studentEnrollments);
      
      // Lấy thông tin chi tiết của từng khóa học
      const enrolledCourses = await Promise.all(
        studentEnrollments.map(async (enrollment) => {
          try {
            const courseResult = await this.firestore.getDocument('courses', enrollment.courseId);
            if (courseResult.success) {
              const course = courseResult.data;
              console.log('Course enrollment data:', {
                courseId: enrollment.courseId,
                progress: enrollment.progress,
                completedLessons: enrollment.completedLessons,
                totalLessons: enrollment.totalLessons
              });
              return {
                ...course,
                enrollment: enrollment,
                progress: enrollment.progress,
                completedLessons: Array.isArray(enrollment.completedLessons) 
                  ? enrollment.completedLessons 
                  : (typeof enrollment.completedLessons === 'number' ? [] : []),
                totalLessons: enrollment.totalLessons,
                enrolledAt: enrollment.enrolledAt,
                lastAccessedAt: enrollment.lastAccessedAt
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching course ${enrollment.courseId}:`, error);
            return null;
          }
        })
      );

      // Loại bỏ các khóa học null và sắp xếp theo thời gian đăng ký
      const validCourses = enrolledCourses
        .filter(course => course !== null)
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));

      return {
        success: true,
        courses: validCourses
      };
    } catch (error) {
      console.error('Error getting enrolled courses:', error);
      throw error;
    }
  }

  // Hủy đăng ký khóa học
  async unenrollCourse(studentId, courseId) {
    try {
      const enrollmentId = `${studentId}_${courseId}`;
      
      // Xóa enrollment record
      await this.firestore.deleteDocument('enrollments', enrollmentId);

      // Cập nhật số lượng học sinh đăng ký trong khóa học
      const course = await this.firestore.getDocument('courses', courseId);
      if (course) {
        await this.firestore.updateDocument('courses', courseId, {
          enrolledStudents: Math.max((course.enrolledStudents || 0) - 1, 0),
          updatedAt: new Date().toISOString()
        });
      }

      return {
        success: true,
        message: 'Successfully unenrolled from course'
      };
    } catch (error) {
      console.error('Error unenrolling course:', error);
      throw error;
    }
  }

  // Cập nhật tiến độ học tập
  async updateProgress(studentId, courseId, lessonId, progress) {
    try {
      const enrollmentId = `${studentId}_${courseId}`;
      const enrollment = await this.firestore.getDocument('enrollments', enrollmentId);
      
      if (!enrollment) {
        throw new Error('Enrollment not found');
      }

      // Lấy danh sách lesson đã hoàn thành hiện tại
      const completedLessons = Array.isArray(enrollment.completedLessons) 
        ? enrollment.completedLessons 
        : (typeof enrollment.completedLessons === 'number' ? [] : []);
      
      // Migrate enrollment data nếu cần (từ số sang array)
      if (typeof enrollment.completedLessons === 'number' && enrollment.completedLessons > 0) {
        console.log('Migrating enrollment data from number to array');
        // Nếu có completedLessons là số > 0, có thể có lesson đã hoàn thành
        // Nhưng không biết lesson nào, nên chỉ thêm lesson hiện tại
      }
      
      // Thêm lesson hiện tại vào danh sách nếu chưa có
      if (!completedLessons.includes(lessonId)) {
        completedLessons.push(lessonId);
        
        // Lưu lesson completion với timestamp
        const lessonCompletionId = `${studentId}_${courseId}_${lessonId}`;
        const lessonCompletion = {
          id: lessonCompletionId,
          studentId,
          courseId,
          lessonId,
          completedAt: new Date().toISOString(),
          timestamp: Date.now()
        };
        
        await this.firestore.createDocument('lesson_completions', lessonCompletion, lessonCompletionId);
      }

      // Tính progress dựa trên số lesson đã hoàn thành
      const totalLessons = enrollment.totalLessons || 1;
      const updatedProgress = Math.min((completedLessons.length / totalLessons) * 100, 100);
      
      console.log('Progress calculation:', {
        completedLessons: completedLessons.length,
        totalLessons,
        updatedProgress,
        lessonId
      });

      await this.firestore.updateDocument('enrollments', enrollmentId, {
        progress: updatedProgress,
        completedLessons: completedLessons,
        lastAccessedAt: new Date().toISOString()
      });

      // Tạo certificate khi hoàn thành khóa học (100% progress) - chỉ tạo 1 lần
      if (updatedProgress >= 100) {
        try {
          const course = await this.firestore.getDocument('courses', courseId);
          if (course) {
            // Kiểm tra xem đã có certificate cho khóa học này chưa
            const certificates = await this.firestore.getCollection('certificates');
            const existingCert = certificates.find(cert => 
              cert.studentId === studentId && 
              cert.courseId === courseId && 
              cert.type === 'course_completion'
            );
            
            if (!existingCert) {
              await this.createCourseCertificate(studentId, courseId, course.title);
            }
          }
        } catch (certError) {
          console.error('Error creating course certificate:', certError);
          // Không throw error để không ảnh hưởng đến progress update
        }
      }

      return {
        success: true,
        message: 'Progress updated successfully',
        completedLessons: completedLessons
      };
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  }

  // Thêm bài thi vào khóa học
  async addExamToCourse(courseId, examData) {
    try {
      console.log('Adding exam to course:', { courseId, examData });
      
      if (!courseId) {
        throw new Error('Course ID is required');
      }
      
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      console.log('Found course:', course);

      const examId = `exam_${Date.now()}`;
      const exam = {
        ...examData,
        id: examId,
        courseId: courseId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };

      const updatedExams = [...(course.exams || []), exam];
      
      console.log('Updating course with exams:', updatedExams);
      
      await this.firestore.updateDocument('courses', courseId, {
        exams: updatedExams
      });

      return {
        success: true,
        exam: exam
      };
    } catch (error) {
      console.error('Error adding exam to course:', error);
      throw error;
    }
  }

  // Cập nhật bài thi
  async updateExam(courseId, examId, examData) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedExams = course.exams.map(exam => 
        exam.id === examId 
          ? { ...exam, ...examData, updatedAt: new Date().toISOString() }
          : exam
      );

      await this.firestore.updateDocument('courses', courseId, {
        exams: updatedExams
      });

      return {
        success: true,
        exam: updatedExams.find(exam => exam.id === examId)
      };
    } catch (error) {
      console.error('Error updating exam:', error);
      throw error;
    }
  }

  // Xóa bài thi
  async deleteExam(courseId, examId) {
    try {
      const course = await this.firestore.getDocument('courses', courseId);
      
      if (!course) {
        throw new Error('Course not found');
      }

      const updatedExams = course.exams.filter(exam => exam.id !== examId);

      await this.firestore.updateDocument('courses', courseId, {
        exams: updatedExams
      });

      return {
        success: true,
        message: 'Exam deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting exam:', error);
      throw error;
    }
  }

  // Get student's recent activities with real timestamps
  async getStudentRecentActivities(studentId) {
    try {
      const activities = [];
      
      // Get lesson completions with real timestamps
      const lessonCompletionsResult = await this.firestore.getCollection('lesson_completions');
      let lessonCompletions = [];
      
      if (Array.isArray(lessonCompletionsResult)) {
        lessonCompletions = lessonCompletionsResult;
      } else if (lessonCompletionsResult?.success && Array.isArray(lessonCompletionsResult.data)) {
        lessonCompletions = lessonCompletionsResult.data;
      }

      const studentLessonCompletions = lessonCompletions.filter(completion => 
        completion.studentId === studentId
      );

      // Get exam results with real timestamps
      const examResultsResult = await this.firestore.getCollection('exam_results');
      let examResults = [];
      
      if (Array.isArray(examResultsResult)) {
        examResults = examResultsResult;
      } else if (examResultsResult?.success && Array.isArray(examResultsResult.data)) {
        examResults = examResultsResult.data;
      }

      const studentExamResults = examResults.filter(result => 
        result.studentId === studentId
      );

      // Get course details
      const coursesResult = await this.firestore.getCollection('courses');
      let courses = [];
      
      if (Array.isArray(coursesResult)) {
        courses = coursesResult;
      } else if (coursesResult?.success && Array.isArray(coursesResult.data)) {
        courses = coursesResult.data;
      }

      // Generate activities from lesson completions
      studentLessonCompletions.forEach(completion => {
        const course = courses.find(c => (c.id || c.uid) === completion.courseId);
        if (!course) return;

        const lesson = course.lessons?.find(l => l.id === completion.lessonId);
        if (lesson) {
          activities.push({
            id: completion.id,
            type: 'lesson_completed',
            title: `Hoàn thành bài học: ${lesson.title}`,
            course: course.title,
            points: 50, // Default points for lesson completion
            time: this.getTimeAgo(completion.completedAt),
            timestamp: completion.timestamp
          });
        }
      });

      // Generate activities from exam results
      studentExamResults.forEach(result => {
        const course = courses.find(c => (c.id || c.uid) === result.courseId);
        if (!course) return;

        const exam = course.exams?.find(e => e.id === result.examId);
        if (exam) {
          activities.push({
            id: result.id,
            type: 'quiz_completed',
            title: `Hoàn thành bài kiểm tra: ${exam.title}`,
            course: course.title,
            points: result.score || 80,
            time: this.getTimeAgo(result.completedAt),
            timestamp: result.timestamp
          });
        }
      });

      // Sort by timestamp and return recent activities
      return {
        success: true,
        activities: activities
          .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
          .slice(0, 10)
      };
    } catch (error) {
      console.error('Error getting student recent activities:', error);
      return {
        success: false,
        error: error.message,
        activities: []
      };
    }
  }

  // Update individual part completion
  async updatePartCompletion(studentId, courseId, lessonId, partIndex) {
    try {
      const partCompletionId = `${studentId}_${courseId}_${lessonId}_part_${partIndex}`;
      const partCompletion = {
        id: partCompletionId,
        studentId,
        courseId,
        lessonId,
        partIndex,
        completedAt: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      await this.firestore.createDocument('part_completions', partCompletion, partCompletionId);
      
      return {
        success: true,
        message: 'Part completion saved successfully'
      };
    } catch (error) {
      console.error('Error updating part completion:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get completed parts for a specific lesson
  async getCompletedParts(studentId, courseId, lessonId) {
    try {
      // First check if lesson is fully completed
      const enrollmentResult = await this.firestore.getCollection('enrollments');
      let enrollments = [];
      
      if (Array.isArray(enrollmentResult)) {
        enrollments = enrollmentResult;
      } else if (enrollmentResult?.success && Array.isArray(enrollmentResult.data)) {
        enrollments = enrollmentResult.data;
      }

      const studentEnrollment = enrollments.find(e => 
        e.studentId === studentId && e.courseId === courseId
      );

      if (studentEnrollment && studentEnrollment.completedLessons?.includes(lessonId)) {
        // Lesson is completed, get course to know how many parts there are
        const courseResult = await this.firestore.getDocument('courses', courseId);
        let course;
        if (courseResult && typeof courseResult === 'object') {
          if (courseResult.success !== undefined) {
            if (!courseResult.success) {
              return { success: false, completedParts: new Set() };
            }
            course = courseResult.data;
          } else {
            course = courseResult;
          }
        } else {
          return { success: false, completedParts: new Set() };
        }

        const lesson = course.lessons?.find(l => l.id === lessonId);
        if (!lesson || !lesson.parts) {
          return { success: false, completedParts: new Set() };
        }

        // Mark all parts as completed
        const completedParts = new Set();
        lesson.parts.forEach((_, index) => {
          completedParts.add(index);
        });

        return {
          success: true,
          completedParts: completedParts
        };
      }

      // Lesson not completed, check individual part completions
      const partCompletionsResult = await this.firestore.getCollection('part_completions');
      let partCompletions = [];
      
      if (Array.isArray(partCompletionsResult)) {
        partCompletions = partCompletionsResult;
      } else if (partCompletionsResult?.success && Array.isArray(partCompletionsResult.data)) {
        partCompletions = partCompletionsResult.data;
      }

      // Filter completions for this specific lesson
      const lessonSpecificPartCompletions = partCompletions.filter(completion => 
        completion.studentId === studentId && 
        completion.courseId === courseId && 
        completion.lessonId === lessonId
      );

      const completedParts = new Set();
      lessonSpecificPartCompletions.forEach(completion => {
        if (typeof completion.partIndex === 'number') {
          completedParts.add(completion.partIndex);
        }
      });

      return {
        success: true,
        completedParts: completedParts
      };
    } catch (error) {
      console.error('Error getting completed parts:', error);
      return {
        success: false,
        error: error.message,
        completedParts: new Set()
      };
    }
  }

  // Helper method to calculate time ago
  getTimeAgo(timestamp) {
    if (!timestamp) return 'Không xác định';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffInHours = Math.floor((now - time) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ngày trước`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} tuần trước`;
  }
}

const courseService = new CourseService();
export default courseService;
