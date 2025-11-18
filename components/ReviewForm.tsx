import React, { useState, FormEvent } from 'react';
import { type Review } from '../types';

interface ReviewFormProps {
  onSubmit: (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
}

const StarRating: React.FC<{ rating: number; onRatingChange: (rating: number) => void }> = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    type="button"
                    key={star}
                    className={`text-3xl transition-colors ${
                        (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => onRatingChange(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    aria-label={`Rate ${star} out of 5 stars`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || rating === 0 || !comment) {
      setError('Please fill out all fields and provide a rating.');
      return;
    }
    setError('');
    onSubmit({ name, rating, comment });
    
    // Reset form and show success message
    setName('');
    setRating(0);
    setComment('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000); // Hide message after 4 seconds
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      {submitted ? (
        <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
            <p className="font-semibold">Thank you!</p>
            <p>Your review has been submitted and is pending approval.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-velora-green focus:border-velora-green sm:text-sm"
              placeholder="e.g., John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRating rating={rating} onRatingChange={setRating} />
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Review</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-velora-green focus:border-velora-green sm:text-sm"
              placeholder="Tell us what you think..."
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-velora-green hover:bg-velora-dark text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
          >
            Submit Review
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewForm;