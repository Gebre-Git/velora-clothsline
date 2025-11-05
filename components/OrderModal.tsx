import React, { useState, FormEvent } from 'react';
import { type Order } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: Omit<Order, 'id' | 'status' | 'userEmail' | 'createdAt'>) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [color, setColor] = useState('White');
  const [error, setError] = useState('');

  if (!isOpen) return null;
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.match(/^[0-9-+\s()]*$/) || phoneNumber.length < 7) {
        setError('Please enter a valid phone number.');
        return;
    }
    setError('');
    onSubmit({ quantity, phoneNumber, color });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100]" onClick={onClose}>
      <div className="bg-velora-white rounded-lg shadow-xl p-8 w-full max-w-md m-4 relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl" aria-label="Close modal">&times;</button>
        <h2 className="text-3xl font-bold text-velora-dark mb-6 text-center">Place Your Order</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-velora-green focus:border-velora-green sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-velora-green focus:border-velora-green sm:text-sm"
              placeholder="e.g., 555-123-4567"
              required
            />
          </div>
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
            <select
              id="color"
              value={color}
              onChange={e => setColor(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-velora-green focus:border-velora-green sm:text-sm rounded-md"
            >
              <option>White</option>
              <option>Classic Cream</option>
              <option>Woodland Gray</option>
            </select>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-velora-green hover:bg-velora-dark text-white font-bold py-3 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105"
          >
            Submit Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;