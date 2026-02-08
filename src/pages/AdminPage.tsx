import React, { useState } from 'react';
import AdminOrderCard from '../../components/AdminOrderCard';
import AdminReviewCard from '../../components/AdminReviewCard';
import { type Order, OrderStatus, type Review, ReviewStatus } from '../../types';

interface AdminPageProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reviews: Review[];
  updateReviewStatus: (reviewId: string, status: ReviewStatus) => void;
  loading?: boolean;
}

type OrderTab = 'pending' | 'accepted' | 'rejected';
type ReviewTab = 'pending' | 'accepted' | 'rejected';

const AdminPage: React.FC<AdminPageProps> = ({ orders, updateOrderStatus, reviews, updateReviewStatus, loading }) => {
  const [activeOrderTab, setActiveOrderTab] = useState<OrderTab>('pending');
  const [activeReviewTab, setActiveReviewTab] = useState<ReviewTab>('pending');

  // Filter orders by status (case-insensitive)
  const pendingOrders = orders.filter(o => o.status.toLowerCase() === 'pending');
  const acceptedOrders = orders.filter(o => o.status.toLowerCase() === 'accepted'); // Matches "Accepted" or "accepted"
  const rejectedOrders = orders.filter(o => o.status.toLowerCase() === 'rejected');

  // Filter reviews by status (case-insensitive)
  const pendingReviews = reviews.filter(r => r.status.toLowerCase() === 'pending');
  const acceptedReviews = reviews.filter(r => r.status.toLowerCase() === 'accepted');
  const rejectedReviews = reviews.filter(r => r.status.toLowerCase() === 'rejected');

  // Get current orders based on active tab
  const getCurrentOrders = () => {
    switch (activeOrderTab) {
      case 'pending': return pendingOrders;
      case 'accepted': return acceptedOrders;
      case 'rejected': return rejectedOrders;
    }
  };

  // Get current reviews based on active tab
  const getCurrentReviews = () => {
    switch (activeReviewTab) {
      case 'pending': return pendingReviews;
      case 'accepted': return acceptedReviews;
      case 'rejected': return rejectedReviews;
    }
  };

  const currentOrders = getCurrentOrders();
  const currentReviews = getCurrentReviews();

  if (loading) {
    console.log('AdminPage loading state active');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-velora-light">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-velora-green mb-4"></div>
        <h2 className="text-xl font-semibold text-velora-dark">Fetching from Database...</h2>
      </div>
    );
  }

  console.log('AdminPage Rendering with:', {
    ordersCount: orders.length,
    reviewsCount: reviews.length,
    activeOrderTab,
    activeReviewTab
  });

  return (
    <div className="bg-velora-light min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-velora-dark">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">Manage incoming customer orders and reviews for VELORA™.</p>
        </div>

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-velora-dark mb-6 border-l-4 border-velora-green pl-4">Order Management</h2>

          {/* Order Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveOrderTab('pending')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeOrderTab === 'pending'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Pending ({pendingOrders.length})
            </button>
            <button
              onClick={() => setActiveOrderTab('accepted')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeOrderTab === 'accepted'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Accepted ({acceptedOrders.length})
            </button>
            <button
              onClick={() => setActiveOrderTab('rejected')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeOrderTab === 'rejected'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Rejected ({rejectedOrders.length})
            </button>
          </div>

          {/* Order Content */}
          {currentOrders.length > 0 ? (
            <div className="space-y-6">
              {currentOrders.map(order => (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-velora-white p-10 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-700">No {activeOrderTab} Orders</h2>
              <p className="mt-2 text-gray-500">
                {activeOrderTab === 'pending' && 'New orders from customers will appear here.'}
                {activeOrderTab === 'accepted' && 'Accepted orders will appear here.'}
                {activeOrderTab === 'rejected' && 'Rejected orders will appear here.'}
              </p>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold text-velora-dark mb-6 border-l-4 border-velora-green pl-4">Review Management</h2>

          {/* Review Tabs */}
          <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 p-2 rounded-lg">
            <button
              onClick={() => setActiveReviewTab('pending')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeReviewTab === 'pending'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Pending ({pendingReviews.length})
            </button>
            <button
              onClick={() => setActiveReviewTab('accepted')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeReviewTab === 'accepted'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Accepted ({acceptedReviews.length})
            </button>
            <button
              onClick={() => setActiveReviewTab('rejected')}
              className={`flex-1 min-w-[120px] py-3 px-4 rounded-md font-semibold transition-all text-sm sm:text-base ${activeReviewTab === 'rejected'
                ? 'bg-white text-velora-dark shadow-md'
                : 'text-gray-600 hover:text-velora-dark'
                }`}
            >
              Rejected ({rejectedReviews.length})
            </button>
          </div>

          {/* Review Content */}
          {currentReviews.length > 0 ? (
            <div className="space-y-6">
              {currentReviews.map(review => (
                <AdminReviewCard
                  key={review.id}
                  review={review}
                  onUpdateStatus={updateReviewStatus}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-velora-white p-10 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-700">No {activeReviewTab} Reviews</h2>
              <p className="mt-2 text-gray-500">
                {activeReviewTab === 'pending' && 'New reviews from customers will appear here.'}
                {activeReviewTab === 'accepted' && 'Accepted reviews will appear here.'}
                {activeReviewTab === 'rejected' && 'Rejected reviews will appear here.'}
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;