import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const RatingModal = ({ isOpen, onClose, courseTitle, onSubmit }) => {
  const [rating, setRating] = useState(5); // Mặc định 5 sao
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error('Vui lòng chọn từ 1 đến 5 sao');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(rating, comment);
      toast.success('Đánh giá thành công!', {
        position: "top-right",
        autoClose: 2000,
      });
      onClose();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Có lỗi xảy ra khi đánh giá');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(5);
    setComment('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 mt-0">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Đánh giá khóa học
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 flex-1">
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">
                {courseTitle}
              </h4>
              <p className="text-sm text-gray-600">
                Bạn đã hoàn thành khóa học này! Hãy chia sẻ trải nghiệm của bạn.
              </p>
            </div>

            {/* Rating Stars */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá của bạn *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`transition-colors ${
                      star <= rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-gray-400'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
                <span className="ml-3 text-sm text-gray-600">
                  {rating} sao
                </span>
              </div>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhận xét (tùy chọn)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm học tập của bạn..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {comment.length}/500
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
