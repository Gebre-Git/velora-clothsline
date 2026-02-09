import React, { useState, FormEvent } from 'react';
import { type Order } from '../types';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderData: Omit<Order, 'id' | 'status' | 'userEmail' | 'createdAt'>) => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [quantity, setQuantity] = useState(5);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [color, setColor] = useState('White');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Auto-close success message
  if (isSuccess) {
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3500);
  }

  const handleSubmitOrder = async (e: FormEvent) => {
    e.preventDefault();
    if (quantity < 5) {
      setError('Minimum order quantity is 5 items.');
      return;
    }
    if (!phoneNumber.match(/^[0-9-+\s()]*$/) || phoneNumber.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }
    if (!name) {
      setError('Please fill in your name.');
      return;
    }
    setError('');

    const PRICE_PER_UNIT = 1500; // Product price in your currency
    const total = quantity * PRICE_PER_UNIT;

    const payload = {
      customerName: name,
      phoneNumber,
      items: [
        {
          color,
          quantity,
        },
      ],
      total,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        // Show success animation
        setIsSuccess(true);

        // Reset form for next time
        setQuantity(5);
        setPhoneNumber('');
        setColor('White');
        setName('');
        setError('');

        // Notify parent
        onSubmit({
          quantity,
          phoneNumber,
          color,
          customerName: name,
          items: [{ color, quantity }],
          total
        });
      } else {
        const err = await res.json().catch(() => ({}));
        setError(err.message || 'Failed to place order.');
      }
    } catch (err) {
      setError('Network error: could not reach server.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-center items-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={isSuccess ? undefined : onClose}
      />

      {isSuccess ? (
        <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-sm m-4 flex flex-col items-center justify-center animate-fade-in-up text-center border border-white/20">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner animate-bounce-slow">
            <svg
              className="w-12 h-12 text-velora-green drop-shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
                className="animate-draw-check"
                style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: 'drawCheck 0.6s ease-out forwards 0.2s' }}
              />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-velora-dark mb-2 tracking-tight">Success!</h2>
          <p className="text-gray-600 mb-6">Your order has been placed successfully.</p>

          {/* Confetti decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-full h-full pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{ animationDuration: '1s' }}></div>
            <div className="absolute top-20 right-10 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDuration: '1.5s', animationDelay: '0.2s' }}></div>
            <div className="absolute bottom-10 left-20 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.4s' }}></div>
          </div>

          <button
            onClick={() => { setIsSuccess(false); onClose(); }}
            className="text-sm text-gray-400 hover:text-velora-dark transition-colors mt-2"
          >
            Close now
          </button>
        </div>
      ) : (
        <div className="bg-velora-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 relative animate-fade-in-up z-10" onClick={e => e.stopPropagation()}>
          <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-800 text-xl transition-colors" aria-label="Close modal">&times;</button>
          <h2 className="text-2xl font-bold text-velora-dark mb-4 text-center">Place Order</h2>
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</label>
              <input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-velora-green focus:border-velora-green transition-shadow"
                placeholder="Your Name"
                required
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={e => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-velora-green focus:border-velora-green transition-shadow"
                placeholder="e.g., 091-123-4567"
                required
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="quantity" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  value={isNaN(quantity) ? 5 : quantity}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) ? 5 : val);
                  }}
                  min="5"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-velora-green focus:border-velora-green transition-shadow"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum order: 5 items</p>
              </div>
              <div className="flex-1">
                <label htmlFor="color" className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Color</label>
                <select
                  id="color"
                  value={color}
                  onChange={e => setColor(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-velora-green focus:border-velora-green transition-shadow"
                >
                  <option>White</option>
                  <option>Classic Cream</option>
                  <option>Woodland Gray</option>
                </select>
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center animate-pulse">{error}</p>}

            <button
              type="submit"
              disabled={quantity < 5}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 shadow-md ${quantity < 5 ? 'bg-gray-400 cursor-not-allowed' : 'bg-velora-green hover:bg-velora-dark hover:shadow-lg transform hover:-translate-y-0.5 text-white'}`}
            >
              Submit Order
            </button>
          </form>
        </div>
      )}

      {/* Inline styles for checkmark animation if global CSS isn't preferred right now */}
      <style>{`
        @keyframes drawCheck {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

export default OrderModal;