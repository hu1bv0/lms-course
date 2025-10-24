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

      console.log('🆕 [CourseService] Creating course with ID:', courseId);
      
      // Tạo document với custom ID
      await this.firestore.createDocument('courses', course, courseId);
      
      console.log('✅ [CourseService] Course created:', courseId);
      
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
      console.log('📚 [CourseService] getAllCourses called');
      
      // Đọc trực tiếp từ collection (nhanh nhất)
      const courses = await this.firestore.getCollection('courses');
      console.log('📚 [CourseService] Courses loaded:', courses.length);
      
      // Sort by createdAt (newest first)
      const sortedCourses = courses.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
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


  // Lấy khóa học theo ID v2.0
  async getCourseById(courseId) {
    try {
      console.log('📚 [CourseService v2.0] getCourseById called with:', courseId, new Date().toISOString());
      const courseResult = await this.firestore.getDocument('courses', courseId);
      console.log('📚 [CourseService] Firestore getDocument result:', courseResult);
      console.log('📚 [CourseService] courseResult.data:', courseResult.data);
      console.log('📚 [CourseService] courseResult.data.lessons:', courseResult.data?.lessons);
      console.log('📚 [CourseService] courseResult.data.exams:', courseResult.data?.exams);
      
      if (!courseResult.success) {
        throw new Error('Course not found');
      }
      
      const course = courseResult.data;
      console.log('📚 [CourseService] course variable:', course);
      console.log('📚 [CourseService] course.lessons:', course?.lessons);
      console.log('📚 [CourseService] course.exams:', course?.exams);

      const returnValue = {
        success: true,
        course: course
      };
      console.log('📚 [CourseService] RETURNING:', returnValue);
      console.log('📚 [CourseService] RETURNING.course.lessons:', returnValue.course?.lessons);
      console.log('📚 [CourseService] RETURNING.course.exams:', returnValue.course?.exams);

      return returnValue;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  // Cập nhật khóa học
  async updateCourse(courseId, updateData) {
    try {
      console.log('🔄 [CourseService] updateCourse called with:', { courseId, updateData });
      
      // Lấy dữ liệu course hiện tại
      const existingCourse = await this.firestore.getDocument('courses', courseId);
      
      if (!existingCourse.success) {
        console.error('❌ [CourseService] Course not found in Firestore:', courseId);
        throw new Error(`Không tìm thấy khóa học với ID: ${courseId}`);
      }

      // Chỉ update những field được truyền vào, giữ nguyên các field khác
      const fieldsToUpdate = {};
      
      // Chỉ thêm field vào update nếu nó có trong updateData
      if (updateData.title !== undefined) fieldsToUpdate.title = updateData.title;
      if (updateData.description !== undefined) fieldsToUpdate.description = updateData.description;
      if (updateData.educationLevel !== undefined) fieldsToUpdate.educationLevel = updateData.educationLevel;
      if (updateData.grade !== undefined) fieldsToUpdate.grade = updateData.grade;
      if (updateData.subject !== undefined) fieldsToUpdate.subject = updateData.subject;
      if (updateData.accessLevel !== undefined) fieldsToUpdate.accessLevel = updateData.accessLevel;
      if (updateData.difficulty !== undefined) fieldsToUpdate.difficulty = updateData.difficulty;
      if (updateData.duration !== undefined) fieldsToUpdate.duration = updateData.duration;
      if (updateData.price !== undefined) fieldsToUpdate.price = updateData.price;
      if (updateData.thumbnail !== undefined) fieldsToUpdate.thumbnail = updateData.thumbnail;
      if (updateData.tags !== undefined) fieldsToUpdate.tags = updateData.tags;
      if (updateData.objectives !== undefined) fieldsToUpdate.objectives = updateData.objectives;
      if (updateData.requirements !== undefined) fieldsToUpdate.requirements = updateData.requirements;
      if (updateData.status !== undefined) fieldsToUpdate.status = updateData.status;
      
      // Luôn update updatedAt
      fieldsToUpdate.updatedAt = new Date().toISOString();
      
      // Giữ nguyên ID
      fieldsToUpdate.id = courseId;

      console.log('📝 [CourseService] Fields to update:', fieldsToUpdate);
      console.log('📝 [CourseService] Preserving existing fields:', {
        lessons: existingCourse.data.lessons?.length || 0,
        exams: existingCourse.data.exams?.length || 0,
        enrolledStudents: existingCourse.data.enrolledStudents || 0,
        rating: existingCourse.data.rating || 0
      });
      
      await this.firestore.updateDocument('courses', courseId, fieldsToUpdate);
      
      // Verify course was updated
      const verifyResult = await this.firestore.getDocument('courses', courseId);
      if (!verifyResult.success) {
        throw new Error('Failed to update course - verification failed');
      }
      
      console.log('✅ [CourseService] Course updated and verified:', courseId);
      
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
      console.log('🗑️ [CourseService] Deleting course:', courseId);
      
      // Kiểm tra course có tồn tại không
      const courseExists = await this.firestore.getDocument('courses', courseId);
      console.log('🗑️ [CourseService] Course exists:', courseExists.success);
      
      if (!courseExists.success) {
        console.log('⚠️ [CourseService] Course not found in documents, considering deletion successful');
        return {
          success: true,
          message: 'Course not found - considered deleted'
        };
      }
      
      // Xóa tất cả enrollments liên quan đến khóa học này
      try {
        const enrollments = await this.firestore.getCollection('enrollments');
        const courseEnrollments = enrollments.filter(enrollment => enrollment.courseId === courseId);
        
        console.log('🗑️ [CourseService] Found enrollments to delete:', courseEnrollments.length);
        
        // Xóa từng enrollment
        for (const enrollment of courseEnrollments) {
          try {
            await this.firestore.deleteDocument('enrollments', enrollment.id);
            console.log('🗑️ [CourseService] Deleted enrollment:', enrollment.id);
          } catch (enrollmentDeleteError) {
            console.warn('⚠️ [CourseService] Failed to delete enrollment:', enrollment.id, enrollmentDeleteError.message);
          }
        }
      } catch (enrollmentError) {
        console.warn('⚠️ [CourseService] Error deleting enrollments:', enrollmentError.message);
        // Không throw error - vẫn tiếp tục xóa course
      }
      
      // Xóa course document
      console.log('🗑️ [CourseService] Deleting course document:', courseId);
      await this.firestore.deleteDocument('courses', courseId);
      
      // Verify course was deleted
      const verifyResult = await this.firestore.getDocument('courses', courseId);
      if (verifyResult.success) {
        throw new Error('Failed to delete course - still exists after deletion');
      }
      
      console.log('✅ [CourseService] Course deleted and verified:', courseId);
      
      return {
        success: true,
        message: 'Course deleted successfully'
      };
    } catch (error) {
      console.error('❌ [CourseService] Error deleting course:', error);
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
      
      const courseResult = await this.firestore.getDocument('courses', courseId);
      
      if (!courseResult.success || !courseResult.data) {
        throw new Error(`Course with ID ${courseId} not found`);
      }

      const course = courseResult.data;
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
      const courseResult = await this.firestore.getDocument('courses', courseId);
      
      if (!courseResult.success || !courseResult.data) {
        throw new Error('Course not found');
      }

      const course = courseResult.data;

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
      const courseResult = await this.firestore.getDocument('courses', courseId);
      
      if (!courseResult.success || !courseResult.data) {
        throw new Error('Course not found');
      }

      const course = courseResult.data;

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
      const courseResult = await this.firestore.getDocument('courses', courseId);
      
      if (!courseResult.success || !courseResult.data) {
        throw new Error('Course not found');
      }

      const course = courseResult.data;

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


  // Lấy tiến độ học tập của student
  async getStudentProgress(studentId, courseId) {
    try {
      const enrollmentId = `${studentId}_${courseId}`;
      const enrollmentResult = await this.firestore.getDocument('enrollments', enrollmentId);
      
      if (!enrollmentResult.success || !enrollmentResult.data) {
        return {
          success: false,
          message: 'Enrollment not found'
        };
      }

      const enrollment = enrollmentResult.data;

      // Handle different data structures for completedLessons
      let completedLessons = [];
      if (Array.isArray(enrollment.completedLessons)) {
        completedLessons = enrollment.completedLessons;
      } else if (typeof enrollment.completedLessons === 'number' && enrollment.completedLessons > 0) {
        // Migration case: if it's a number > 0, we need to get actual completed lessons
        // from lesson_completions collection to preserve data
        console.log('🔄 [CourseService] Migrating from number to array, fetching actual completions...');
        
        const lessonCompletionsResult = await this.firestore.getCollection('lesson_completions');
        let lessonCompletions = [];
        
        if (Array.isArray(lessonCompletionsResult)) {
          lessonCompletions = lessonCompletionsResult;
        } else if (lessonCompletionsResult?.success && Array.isArray(lessonCompletionsResult.data)) {
          lessonCompletions = lessonCompletionsResult.data;
        }

        // Get actual completed lessons for this student and course
        const studentLessonCompletions = lessonCompletions.filter(lc => 
          lc.studentId === studentId && lc.courseId === courseId
        );
        
        completedLessons = studentLessonCompletions.map(lc => lc.lessonId);
        
        // Update enrollment with correct array format
        if (completedLessons.length > 0) {
          console.log('✅ [CourseService] Updating enrollment with migrated data:', completedLessons);
          await this.firestore.updateDocument('enrollments', enrollmentId, {
            completedLessons: completedLessons
          });
        }
      }

      return {
        success: true,
        progress: enrollment.progress,
        completedLessons: completedLessons,
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
      // Ensure courseTitle is not undefined
      const safeCourseTitle = courseTitle || 'Khóa học';
      console.log('🏆 [CourseService] Creating course certificate for:', { studentId, courseId, courseTitle: safeCourseTitle });
      
      const certificateId = `${studentId}_course_${courseId}_${Date.now()}`;
      const certificateData = {
        id: certificateId,
        studentId,
        courseId,
        courseTitle: safeCourseTitle,
        type: 'course_completion',
        title: `Chứng chỉ hoàn thành khóa học "${safeCourseTitle}"`,
        description: `Bạn đã hoàn thành thành công khóa học "${safeCourseTitle}"`,
        earnedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active'
      };

      console.log('📝 [CourseService] Certificate data:', certificateData);
      
      const result = await this.firestore.createDocument('certificates', certificateData, certificateId);
      console.log('✅ [CourseService] Certificate created successfully:', result);
      
      return {
        success: true,
        certificate: certificateData
      };
    } catch (error) {
      console.error('❌ [CourseService] Error creating course certificate:', error);
      throw error;
    }
  }

  // Tạo certificate khi hoàn thành bài thi
  async createExamCertificate(studentId, courseId, examId, examTitle, score) {
    try {
      console.log('🏆 [CourseService] Creating exam certificate for:', { studentId, courseId, examId, examTitle, score });
      
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

      console.log('📝 [CourseService] Exam certificate data:', certificateData);
      
      const result = await this.firestore.createDocument('certificates', certificateData, certificateId);
      console.log('✅ [CourseService] Exam certificate created successfully:', result);
      
      return {
        success: true,
        certificate: certificateData
      };
    } catch (error) {
      console.error('❌ [CourseService] Error creating exam certificate:', error);
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
      console.log('🔍 [CourseService] Getting achievements for student:', studentId);
      
      const certificatesResult = await this.firestore.getCollection('certificates');
      console.log('📜 [CourseService] Raw certificates result:', certificatesResult);
      
      // Handle different return formats from getCollection
      let certificates = [];
      if (Array.isArray(certificatesResult)) {
        certificates = certificatesResult;
      } else if (certificatesResult?.success && Array.isArray(certificatesResult.data)) {
        certificates = certificatesResult.data;
      } else if (certificatesResult && typeof certificatesResult === 'object') {
        // If it's an object but not the expected format, try to extract data
        certificates = Object.values(certificatesResult).filter(item => 
          item && typeof item === 'object' && item.studentId
        );
      }
      
      console.log('📋 [CourseService] Processed certificates:', certificates.length);
      
      const studentCertificates = certificates.filter(cert => 
        cert.studentId === studentId
      );
      
      console.log('🎯 [CourseService] Student certificates found:', studentCertificates.length);
      
      // Convert certificates to achievements format
      const achievements = studentCertificates.map(cert => ({
        id: cert.id,
        title: cert.title || 'Thành tích',
        description: cert.description || '',
        type: cert.type || 'general',
        earned: true,
        date: cert.earnedAt || cert.createdAt,
        earnedAt: cert.earnedAt || cert.createdAt,
        courseTitle: cert.courseTitle || '',
        examTitle: cert.examTitle || '',
        score: cert.score || null,
        certificate: cert
      }));
      
      console.log('🏆 [CourseService] Final achievements:', achievements.length);
      
      return {
        success: true,
        achievements
      };
    } catch (error) {
      console.error('❌ [CourseService] Error getting student achievements:', error);
      return {
        success: false,
        error: error.message,
        achievements: []
      };
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
        score: typeof score === 'object' ? (score.percentage || score.earned || 0) : (score || 0), // Ensure score is a number
        earnedPoints: typeof score === 'object' ? (score.earned || 0) : 0,
        totalPoints: typeof score === 'object' ? (score.total || 0) : 0,
        percentage: typeof score === 'object' ? (score.percentage || 0) : (score || 0),
        completedAt: new Date().toISOString(),
        timestamp: Date.now()
      };

      await this.firestore.createDocument('exam_results', examResult, examResultId);

      // Tạo certificate khi hoàn thành bài thi (chỉ tạo 1 lần)
      try {
        console.log('🔍 [CourseService] Checking for exam certificate creation...');
        const course = await this.firestore.getDocument('courses', courseId);
        const exam = course?.exams?.find(exam => exam.id === examId);
        
        if (exam) {
          console.log('📋 [CourseService] Found exam:', exam.title);
          
          // Kiểm tra xem đã có certificate cho bài thi này chưa
          const certificatesResult = await this.firestore.getCollection('certificates');
          let certificates = [];
          
          if (Array.isArray(certificatesResult)) {
            certificates = certificatesResult;
          } else if (certificatesResult?.success && Array.isArray(certificatesResult.data)) {
            certificates = certificatesResult.data;
          }
          
          const existingCert = certificates.find(cert => 
            cert.studentId === studentId && 
            cert.courseId === courseId && 
            cert.examId === examId && 
            cert.type === 'exam_completion'
          );
          
          if (!existingCert) {
            console.log('🏆 [CourseService] Creating new exam certificate...');
            await this.createExamCertificate(studentId, courseId, examId, exam.title, score);
          } else {
            console.log('✅ [CourseService] Exam certificate already exists, skipping creation');
          }
        } else {
          console.log('⚠️ [CourseService] Exam not found in course');
        }
      } catch (certError) {
        console.error('❌ [CourseService] Error creating exam certificate:', certError);
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

  // Helper method to safely get course data
  async getCourseDataSafely(courseId) {
    try {
      // Try getDocument first
      const courseResult = await this.firestore.getDocument('courses', courseId);
      if (courseResult.success && courseResult.data) {
        return courseResult.data;
      }

      // Fallback to collection search
      console.warn('⚠️ [CourseService] getDocument failed, trying collection lookup for:', courseId);
      const allCourses = await this.firestore.getCollection('courses');
      const course = allCourses.find(c => c.id === courseId);
      
      if (course) {
        console.log('✅ [CourseService] Found course in collection');
        return course;
      }

      throw new Error(`Course with ID ${courseId} not found`);
    } catch (error) {
      console.error('❌ [CourseService] Error getting course data:', error);
      throw error;
    }
  }

  // Đăng ký khóa học cho student
  async enrollCourse(studentId, courseId) {
    try {
      console.log('🔍 [CourseService] enrollCourse called with:', { studentId, courseId });
      
      // Lấy thông tin khóa học một cách an toàn
      const course = await this.getCourseDataSafely(courseId);
      console.log('🔍 [CourseService] Course data:', course);

      // Validate và set default values nếu cần
      if (!course.title) {
        console.warn('⚠️ [CourseService] Course missing title, using default');
        course.title = 'Khóa học';
      }
      if (!course.subject) {
        console.warn('⚠️ [CourseService] Course missing subject, using default');
        course.subject = 'Chung';
      }
      if (!course.grade) {
        console.warn('⚠️ [CourseService] Course missing grade, using default');
        course.grade = '1';
      }

      // Kiểm tra student đã đăng ký chưa
      const enrollmentId = `${studentId}_${courseId}`;
      console.log('🔍 [CourseService] Checking existing enrollment:', enrollmentId);
      const enrollmentResult = await this.firestore.getDocument('enrollments', enrollmentId);
      console.log('🔍 [CourseService] Enrollment check result:', enrollmentResult);
      
      if (enrollmentResult.success && enrollmentResult.data) {
        console.log('⚠️ [CourseService] Student already enrolled');
        return {
          success: false,
          message: 'Student already enrolled in this course'
        };
      }

      // Tạo enrollment record
      console.log('✅ [CourseService] Creating new enrollment...');
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

      console.log('🔍 [CourseService] Enrollment data:', enrollmentData);
      await this.firestore.createDocument('enrollments', enrollmentData, enrollmentData.id);
      console.log('✅ [CourseService] Enrollment created successfully');

      // Cập nhật số lượng học sinh đăng ký trong khóa học (optional - không block enrollment nếu thất bại)
      try {
        const updateData = {
          enrolledStudents: (course.enrolledStudents || 0) + 1,
          updatedAt: new Date().toISOString()
        };
        console.log('🔍 [CourseService] Updating course with:', updateData);
        await this.firestore.updateDocument('courses', courseId, updateData);
        console.log('✅ [CourseService] Course updated successfully');
      } catch (updateError) {
        console.warn('⚠️ [CourseService] Failed to update course enrolled count, trying to recreate course document:', updateError.message);
        
        // Thử tạo lại course document nếu không tồn tại
        try {
          const courseWithUpdatedCount = {
            ...course,
            enrolledStudents: (course.enrolledStudents || 0) + 1,
            updatedAt: new Date().toISOString()
          };
          await this.firestore.createDocument('courses', courseWithUpdatedCount, courseId);
          console.log('✅ [CourseService] Course document recreated successfully');
        } catch (recreateError) {
          console.warn('⚠️ [CourseService] Failed to recreate course document, but enrollment still successful:', recreateError.message);
          // Vẫn không throw error - enrollment đã thành công
        }
      }

      console.log('🎉 [CourseService] Enrollment completed successfully!');
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

      // Cập nhật số lượng học sinh đăng ký trong khóa học (optional)
      try {
        const courseResult = await this.firestore.getDocument('courses', courseId);
        if (courseResult.success && courseResult.data) {
          await this.firestore.updateDocument('courses', courseId, {
            enrolledStudents: Math.max((courseResult.data.enrolledStudents || 0) - 1, 0),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (updateError) {
        console.warn('⚠️ [CourseService] Failed to update course enrolled count during unenroll:', updateError.message);
        // Không throw error - unenrollment vẫn thành công
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

      // Always reload completedLessons from database to ensure accuracy
      console.log('🔄 [CourseService] Reloading completedLessons from database...');
      
      const lessonCompletionsResult = await this.firestore.getCollection('lesson_completions');
      let lessonCompletions = [];
      
      if (Array.isArray(lessonCompletionsResult)) {
        lessonCompletions = lessonCompletionsResult;
      } else if (lessonCompletionsResult?.success && Array.isArray(lessonCompletionsResult.data)) {
        lessonCompletions = lessonCompletionsResult.data;
      }

      // Get actual completed lessons for this student and course
      const studentLessonCompletions = lessonCompletions.filter(lc => 
        lc.studentId === studentId && lc.courseId === courseId
      );
      
      let completedLessons = studentLessonCompletions.map(lc => lc.lessonId);
      console.log('✅ [CourseService] Reloaded completedLessons from database:', completedLessons);
      
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
          console.log('🔍 [CourseService] Checking for course completion certificate...');
          const course = await this.firestore.getDocument('courses', courseId);
          
          if (course) {
            // Handle different course data structures
            let courseTitle = course.title || course.data?.title || 'Khóa học';
            console.log('📋 [CourseService] Found course:', courseTitle);
            
            // Kiểm tra xem đã có certificate cho khóa học này chưa
            const certificatesResult = await this.firestore.getCollection('certificates');
            let certificates = [];
            
            if (Array.isArray(certificatesResult)) {
              certificates = certificatesResult;
            } else if (certificatesResult?.success && Array.isArray(certificatesResult.data)) {
              certificates = certificatesResult.data;
            }
            
            const existingCert = certificates.find(cert => 
              cert.studentId === studentId && 
              cert.courseId === courseId && 
              cert.type === 'course_completion'
            );
            
            if (!existingCert) {
              console.log('🏆 [CourseService] Creating new course completion certificate...');
              await this.createCourseCertificate(studentId, courseId, courseTitle);
            } else {
              console.log('✅ [CourseService] Course completion certificate already exists, skipping creation');
            }
          } else {
            console.log('⚠️ [CourseService] Course not found');
          }
        } catch (certError) {
          console.error('❌ [CourseService] Error creating course certificate:', certError);
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
          // Handle score object properly - extract percentage or use default
          let points = 80; // Default points
          if (typeof result.score === 'object' && result.score !== null) {
            points = result.score.percentage || result.score.earned || 80;
          } else if (typeof result.score === 'number') {
            points = result.score;
          }
          
          activities.push({
            id: result.id,
            type: 'quiz_completed',
            title: `Hoàn thành bài kiểm tra: ${exam.title}`,
            course: course.title,
            points: points,
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
      console.log('🔍 [CourseService] Getting completed parts:', { studentId, courseId, lessonId });
      
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

      console.log('📋 [CourseService] Student enrollment:', {
        found: !!studentEnrollment,
        completedLessons: studentEnrollment?.completedLessons,
        includesLesson: studentEnrollment?.completedLessons?.includes(lessonId)
      });

      // Always check actual part completions, regardless of lesson completion status
      console.log('📝 [CourseService] Checking actual part completions...');

      // Check individual part completions
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

      console.log('🔍 [CourseService] Found part completions:', lessonSpecificPartCompletions.length);
      console.log('🔍 [CourseService] Part completions details:', lessonSpecificPartCompletions.map(c => ({
        id: c.id,
        lessonId: c.lessonId,
        partIndex: c.partIndex,
        completedAt: c.completedAt
      })));
      
      // Debug: Log all part completions for this student and course
      const allStudentPartCompletions = partCompletions.filter(completion => 
        completion.studentId === studentId && completion.courseId === courseId
      );
      // Check for duplicates and auto-cleanup
      const completionMap = new Map();
      const duplicates = [];
      
      allStudentPartCompletions.forEach(completion => {
        const key = `${completion.lessonId}_${completion.partIndex}`;
        if (completionMap.has(key)) {
          duplicates.push({
            key,
            existing: completionMap.get(key),
            duplicate: completion
          });
        } else {
          completionMap.set(key, completion);
        }
      });
      
      if (duplicates.length > 0) {
        // Auto-cleanup duplicates
        for (const duplicate of duplicates) {
          try {
            // Keep the one with later timestamp, delete the older one
            const toDelete = duplicate.duplicate.timestamp < duplicate.existing.timestamp 
              ? duplicate.duplicate 
              : duplicate.existing;
            
            await this.firestore.deleteDocument('part_completions', toDelete.id);
          } catch (error) {
            console.error('❌ [CourseService] Error deleting duplicate:', error);
          }
        }
      }
      
      // Get course data for validation
      const courseResult = await this.firestore.getDocument('courses', courseId);
      let course;
      if (courseResult && typeof courseResult === 'object') {
        if (courseResult.success !== undefined) {
          course = courseResult.data;
        } else {
          course = courseResult;
        }
      }

      const completedParts = new Set();
      const invalidPartCompletions = [];
      
      lessonSpecificPartCompletions.forEach(completion => {
        if (typeof completion.partIndex === 'number') {
          // Check if partIndex is valid for this lesson
          const lesson = course?.lessons?.find(l => l.id === lessonId);
          if (lesson && lesson.parts) {
            // partIndex is 0-based, so it should be < lesson.parts.length
            if (completion.partIndex >= lesson.parts.length) {
              console.log('⚠️ [CourseService] Found completion with invalid partIndex:', {
                lessonId,
                partIndex: completion.partIndex,
                totalParts: lesson.parts.length,
                completionId: completion.id,
                lessonParts: lesson.parts.map((p, idx) => ({ index: idx, id: p.id, title: p.title }))
              });
              invalidPartCompletions.push(completion);
            } else {
              completedParts.add(completion.partIndex);
            }
          } else {
            console.log('⚠️ [CourseService] Lesson not found or has no parts:', {
              lessonId,
              lessonFound: !!lesson,
              hasParts: lesson?.parts?.length > 0
            });
            invalidPartCompletions.push(completion);
          }
        }
      });
      
      // Auto-cleanup invalid part completions
      if (invalidPartCompletions.length > 0) {
        for (const invalidCompletion of invalidPartCompletions) {
          try {
            await this.firestore.deleteDocument('part_completions', invalidCompletion.id);
          } catch (error) {
            console.error('❌ [CourseService] Error deleting invalid part completion:', error);
          }
        }
      }

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

  // Clean up duplicate part completions based on lessonId + partIndex
  async cleanupDuplicatePartCompletions(studentId, courseId) {
    try {
      console.log('🧹 [CourseService] Cleaning up duplicate part completions...');
      
      // Get all part completions for this student and course
      const partCompletionsResult = await this.firestore.getCollection('part_completions');
      let partCompletions = [];
      
      if (Array.isArray(partCompletionsResult)) {
        partCompletions = partCompletionsResult;
      } else if (partCompletionsResult?.success && Array.isArray(partCompletionsResult.data)) {
        partCompletions = partCompletionsResult.data;
      }

      const studentPartCompletions = partCompletions.filter(pc => 
        pc.studentId === studentId && pc.courseId === courseId
      );

      console.log('🔍 [CourseService] Found part completions:', studentPartCompletions.length);

      // Group by lessonId and partIndex to find duplicates
      const completionMap = new Map();
      const duplicates = [];

      studentPartCompletions.forEach(completion => {
        const key = `${completion.lessonId}_${completion.partIndex}`;
        if (completionMap.has(key)) {
          // Found duplicate - keep the one with later timestamp
          const existing = completionMap.get(key);
          if (completion.timestamp > existing.timestamp) {
            // Current completion is newer, replace existing
            duplicates.push(existing);
            completionMap.set(key, completion);
            console.log('⚠️ [CourseService] Found newer duplicate completion:', {
              id: completion.id,
              lessonId: completion.lessonId,
              partIndex: completion.partIndex,
              completedAt: completion.completedAt,
              timestamp: completion.timestamp
            });
          } else {
            // Existing completion is newer, mark current as duplicate
            duplicates.push(completion);
            console.log('⚠️ [CourseService] Found older duplicate completion:', {
              id: completion.id,
              lessonId: completion.lessonId,
              partIndex: completion.partIndex,
              completedAt: completion.completedAt,
              timestamp: completion.timestamp
            });
          }
        } else {
          completionMap.set(key, completion);
        }
      });

      if (duplicates.length > 0) {
        console.log('🗑️ [CourseService] Removing duplicate part completions...');
        
        // Delete duplicates (keep the first one)
        for (const duplicate of duplicates) {
          try {
            await this.firestore.deleteDocument('part_completions', duplicate.id);
            console.log('✅ [CourseService] Deleted duplicate completion:', duplicate.id);
          } catch (error) {
            console.error('❌ [CourseService] Error deleting duplicate:', duplicate.id, error);
          }
        }

        return {
          success: true,
          message: `Cleaned up ${duplicates.length} duplicate part completions`,
          cleanedCount: duplicates.length
        };
      }

      return {
        success: true,
        message: 'No duplicate data found',
        cleanedCount: 0
      };
    } catch (error) {
      console.error('❌ [CourseService] Error cleaning up duplicate data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Clean up inconsistent part completions (parts that don't exist in lessons)
  async cleanupInconsistentPartCompletions(studentId, courseId) {
    try {
      console.log('🧹 [CourseService] Cleaning up inconsistent part completions...');
      
      // Get course data to validate part completions
      const courseResult = await this.firestore.getDocument('courses', courseId);
      let course;
      if (courseResult && typeof courseResult === 'object') {
        if (courseResult.success !== undefined) {
          if (!courseResult.success) {
            return { success: false, message: 'Course not found' };
          }
          course = courseResult.data;
        } else {
          course = courseResult;
        }
      } else {
        return { success: false, message: 'Course not found' };
      }

      if (!course || !course.lessons) {
        return { success: false, message: 'Course has no lessons' };
      }

      // Get all part completions for this student and course
      const partCompletionsResult = await this.firestore.getCollection('part_completions');
      let partCompletions = [];
      
      if (Array.isArray(partCompletionsResult)) {
        partCompletions = partCompletionsResult;
      } else if (partCompletionsResult?.success && Array.isArray(partCompletionsResult.data)) {
        partCompletions = partCompletionsResult.data;
      }

      const studentPartCompletions = partCompletions.filter(pc => 
        pc.studentId === studentId && pc.courseId === courseId
      );

      console.log('🔍 [CourseService] Found part completions:', studentPartCompletions.length);

      // Find truly inconsistent part completions (parts that don't exist in lessons)
      const inconsistentCompletions = [];
      
      for (const completion of studentPartCompletions) {
        const lesson = course.lessons.find(l => l.id === completion.lessonId);
        
        if (!lesson) {
          // Lesson doesn't exist
          console.log('⚠️ [CourseService] Part completion for non-existent lesson:', completion.lessonId);
          inconsistentCompletions.push(completion);
        } else if (!lesson.parts || completion.partIndex >= lesson.parts.length) {
          // Part doesn't exist in lesson
          console.log('⚠️ [CourseService] Part completion for non-existent part:', {
            lessonId: completion.lessonId,
            partIndex: completion.partIndex,
            totalParts: lesson.parts?.length || 0
          });
          inconsistentCompletions.push(completion);
        }
      }

      console.log('⚠️ [CourseService] Found truly inconsistent completions:', inconsistentCompletions.length);

      if (inconsistentCompletions.length > 0) {
        console.log('🗑️ [CourseService] Removing truly inconsistent part completions...');
        
        // Delete truly inconsistent part completions
        for (const completion of inconsistentCompletions) {
          try {
            await this.firestore.deleteDocument('part_completions', completion.id);
            console.log('✅ [CourseService] Deleted inconsistent completion:', completion.id);
          } catch (error) {
            console.error('❌ [CourseService] Error deleting completion:', completion.id, error);
          }
        }

        return {
          success: true,
          message: `Cleaned up ${inconsistentCompletions.length} inconsistent part completions`,
          cleanedCount: inconsistentCompletions.length
        };
      }

      return {
        success: true,
        message: 'No inconsistent data found',
        cleanedCount: 0
      };
    } catch (error) {
      console.error('❌ [CourseService] Error cleaning up inconsistent data:', error);
      return {
        success: false,
        error: error.message
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
