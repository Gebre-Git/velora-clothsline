import React from 'react';
import { type Review, ReviewStatus } from '../types';

interface AdminReviewCardProps {
  review: Review;
  onUpdateStatus: (reviewId: string, status: ReviewStatus) => void;
}

const getStatusBadgeClasses = (status: ReviewStatus) => {
  switch (status) {
    case ReviewStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case ReviewStatus.APPROVED:
      return 'bg-green-100 text-green-800';
    case ReviewStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, index) => (
            <svg
                key={index}
                className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);


const AdminReviewCard: React.FC<AdminReviewCardProps> = ({ review, onUpdateStatus }) => {
  return (
    <div className="bg-velora-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-4">
          <div>
            <div className="flex items-center space-x-4">
                <h3 className="text-xl font-bold text-velora-dark">Review from: {review.name}</h3>
                <StarDisplay rating={review.rating} />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Received on: {review.createdAt.toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 mt-2 sm:mt-0 text-sm font-semibold rounded-full ${getStatusBadgeClasses(review.status)}`}>
            {review.status}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Comment</p>
          <p className="text-velora-text bg-gray-50 p-3 rounded-md">{review.comment}</p>
        </div>

        {review.status === ReviewStatus.PENDING && (
          <div className="flex justify-end space-x-3 mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => onUpdateStatus(review.id, ReviewStatus.REJECTED)}
              className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdateStatus(review.id, ReviewStatus.APPROVED)}
              className="px-4 py-2 text-sm font-semibold bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviewCard;