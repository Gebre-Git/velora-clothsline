import React from 'react';
import AdminOrderCard from '../components/AdminOrderCard';
import AdminReviewCard from '../components/AdminReviewCard';
import { type Order, OrderStatus, type Review, ReviewStatus } from '../types';

interface AdminPageProps {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  reviews: Review[];
  updateReviewStatus: (reviewId: string, status: ReviewStatus) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ orders, updateOrderStatus, reviews, updateReviewStatus }) => {
  return (
    <div className="bg-velora-light min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-velora-dark">Admin Dashboard</h1>
          <p className="mt-2 text-lg text-gray-500">Manage incoming customer orders and reviews for VELORA™.</p>
        </div>
        
        <section className="mb-16">
            <h2 className="text-3xl font-bold text-velora-dark mb-6 border-l-4 border-velora-green pl-4">Order Management</h2>
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map(order => (
                  <AdminOrderCard
                    key={order.id}
                    order={order}
                    onUpdateStatus={updateOrderStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center bg-velora-white p-10 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-700">No Orders Yet</h2>
                <p className="mt-2 text-gray-500">New orders from customers will appear here.</p>
              </div>
            )}
        </section>

        <section>
            <h2 className="text-3xl font-bold text-velora-dark mb-6 border-l-4 border-velora-green pl-4">Review Management</h2>
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map(review => (
                  <AdminReviewCard
                    key={review.id}
                    review={review}
                    onUpdateStatus={updateReviewStatus}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center bg-velora-white p-10 rounded-lg shadow">
                <h2 className="text-2xl font-semibold text-gray-700">No Reviews Yet</h2>
                <p className="mt-2 text-gray-500">New reviews from customers will appear here.</p>
              </div>
            )}
        </section>
      </div>
    </div>
  );
};

export default AdminPage;