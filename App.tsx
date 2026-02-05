import React, { useState, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import ClientPage from './src/pages/ClientPage';
import AdminPage from './src/pages/AdminPage';
import GuidelinesPage from './src/pages/GuidelinesPage';
import AdminLogin from './src/pages/AdminLogin';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { type Order, OrderStatus, type Review, ReviewStatus } from './types';

// Mock initial data for demonstration
const initialOrders: Order[] = [
  {
    id: 'ord-1689374',
    quantity: 1,
    phoneNumber: '555-0101',
    color: 'White',
    userEmail: 'jane.doe@example.com',
    status: OrderStatus.PENDING,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 'ord-9438210',
    quantity: 2,
    phoneNumber: '555-0102',
    color: 'Classic Cream',
    userEmail: 'john.smith@example.com',
    status: OrderStatus.CONFIRMED,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

const initialReviews: Review[] = [
    {
        id: 'rev-1',
        name: 'Alex Johnson',
        rating: 5,
        comment: 'This is the best clothesline I have ever owned. The retractable feature is a lifesaver for my small balcony. Super sturdy and looks great!',
        status: ReviewStatus.APPROVED,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
        id: 'rev-2',
        name: 'Maria Garcia',
        rating: 4,
        comment: 'Great product! Installation was straightforward. My only wish is that it came in more colors. Otherwise, it works perfectly.',
        status: ReviewStatus.APPROVED,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    }
]

function App() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const allowedAdminEmails = ['gebre2024mail@gmail.com', 'gebreone777@gmail.com'];

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const email = localStorage.getItem('velora_admin_email');
      return email !== null && allowedAdminEmails.includes(email);
    } catch {
      return false;
    }
  });

  const addOrder = useCallback((newOrderData: Omit<Order, 'id' | 'status' | 'userEmail' | 'createdAt'>) => {
    const newOrder: Order = {
      ...newOrderData,
      id: `ord-${Math.random().toString(36).substr(2, 7)}`,
      status: OrderStatus.PENDING,
      userEmail: 'customer@example.com', // Mocked user email
      createdAt: new Date(),
    };
    setOrders(prevOrders => [newOrder, ...prevOrders]);
    return newOrder.id;
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);
  
  const getOrderById = useCallback((orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  }, [orders]);

  const addReview = useCallback((newReviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newReview: Review = {
        ...newReviewData,
        id: `rev-${Math.random().toString(36).substr(2, 7)}`,
        status: ReviewStatus.PENDING,
        createdAt: new Date(),
    };
    setReviews(prevReviews => [newReview, ...prevReviews]);
  }, []);
  
  const updateReviewStatus = useCallback((reviewId: string, status: ReviewStatus) => {
    setReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId ? { ...review, status } : review
      )
    );
  }, []);

  const handleLogin = useCallback((email: string) => {
    if (allowedAdminEmails.includes(email)) {
      localStorage.setItem('velora_admin_email', email);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('velora_admin_email');
    setIsAdmin(false);
  }, []);


  return (
    <HashRouter>
      <div className="bg-velora-light min-h-screen font-sans text-velora-text relative cursor-none">
        <CustomCursor />
        <Header isAdmin={isAdmin} onLogout={handleLogout} />
        <main>
          <Routes>
            <Route path="/admin" element={
              <ProtectedRoute isAdmin={isAdmin}>
                <AdminPage orders={orders} updateOrderStatus={updateOrderStatus} reviews={reviews} updateReviewStatus={updateReviewStatus} />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin onLogin={handleLogin} />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/" element={<ClientPage addOrder={addOrder} getOrderById={getOrderById} reviews={reviews} addReview={addReview} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;