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


function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const allowedAdminEmails = ['gebre2024mail@gmail.com', 'gebreone777@gmail.com'];

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      const token = localStorage.getItem('velora_admin_token');
      const email = localStorage.getItem('velora_admin_email');
      return token !== null && email !== null && allowedAdminEmails.includes(email);
    } catch {
      return false;
    }
  });

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, []);

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const data = await response.json();
          setReviews(data);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, []);

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

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        );
      }
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
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

  const updateReviewStatus = useCallback(async (reviewId: string, status: ReviewStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId ? { ...review, status } : review
          )
        );
      }
    } catch (err) {
      console.error('Failed to update review status:', err);
    }
  }, []);

  const handleLogin = useCallback((token: string, email: string) => {
    if (allowedAdminEmails.includes(email)) {
      localStorage.setItem('velora_admin_token', token);
      localStorage.setItem('velora_admin_email', email);
      setIsAdmin(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('velora_admin_token');
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