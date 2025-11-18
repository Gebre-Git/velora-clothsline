import React from 'react';
import { type Order, OrderStatus } from '../types';

interface AdminOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

const getStatusBadgeClasses = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800';
    case OrderStatus.CONFIRMED:
      return 'bg-green-100 text-green-800';
    case OrderStatus.REJECTED:
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const AdminOrderCard: React.FC<AdminOrderCardProps> = ({ order, onUpdateStatus }) => {
  return (
    <div className="bg-velora-white rounded-lg shadow-md overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
          <div>
            <h3 className="text-xl font-bold text-velora-dark">Order ID: {order.id}</h3>
            <p className="text-sm text-gray-500">
              Received on: {order.createdAt.toLocaleString()}
            </p>
          </div>
          <span className={`px-3 py-1 mt-2 sm:mt-0 text-sm font-semibold rounded-full ${getStatusBadgeClasses(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Customer</p>
            <p className="font-semibold text-velora-text">{order.userEmail}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="font-semibold text-velora-text">{order.phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Details</p>
            <p className="font-semibold text-velora-text">
              {order.quantity} x {order.color} Unit(s)
            </p>
          </div>
        </div>

        {order.status === OrderStatus.PENDING && (
          <div className="flex justify-end space-x-3 mt-6 border-t border-gray-200 pt-4">
            <button
              onClick={() => onUpdateStatus(order.id, OrderStatus.REJECTED)}
              className="px-4 py-2 text-sm font-semibold bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, OrderStatus.CONFIRMED)}
              className="px-4 py-2 text-sm font-semibold bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrderCard;