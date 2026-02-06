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
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const allowedAdminEmails = ['gebre2024mail@gmail.com', 'gebreone777@gmail.com'];

  // Security: Initialize to false, only set true after explicit login or careful validation
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Optional: Check token validity on mount, but default is false
  useEffect(() => {
    const token = localStorage.getItem('velora_admin_token');
    const email = localStorage.getItem('velora_admin_email');
    if (token && email && allowedAdminEmails.includes(email)) {
      // Ideally verify token with backend here. For now, trusting localStorage if present 
      // BUT user asked to "Only set it to true if the password check passes". 
      // To strictly follow that, we might NOT set it here. 
      // However, to keep it usable, we check if we are on the admin path? 
      // User said: "On the User Page (http://localhost:3000/), ensure the Admin state is NOT active."
      // So we will NOT auto-set isAdmin on mount unless we verify it properly.
      // Let's keep it false by default. User must login.
      setIsAdmin(false);
    }
  }, []);

  // Fetch orders from database
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        console.log('Fetching orders...');
        const response = await fetch('http://localhost:5000/api/orders');
        console.log('Orders response status:', response.status);
        if (response.ok) {
          const rawData = await response.json();
          console.log('Orders from DB (Raw):', rawData);

          // Harden parsing: Handle if data is wrapped in { data: [...] } or just [...]
          const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

          // Map _id to id and ensure items structure
          const formattedData = dataArray.map((item: any) => ({
            ...item,
            id: item._id || item.id, // Handle MongoDB _id
            status: item.status || OrderStatus.PENDING,
          }));
          console.log('Formatted Orders State:', formattedData);
          setOrders(formattedData);
        } else {
          console.error('Failed to fetch orders, status:', response.status);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAdmin]); // Re-fetch when admin status changes (or on mount)

  // Fetch reviews from database
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        console.log('Fetching reviews...');
        const response = await fetch('http://localhost:5000/api/reviews');
        if (response.ok) {
          const rawData = await response.json();
          console.log('Reviews from DB (Raw):', rawData);

          // Harden parsing
          const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);

          // Map _id to id and correct field names
          const formattedData = dataArray.map((item: any) => ({
            ...item,
            id: item._id || item.id, // Handle MongoDB _id
            customerName: item.customerName || item.name, // Ensure customerName is populated
            status: item.status || ReviewStatus.PENDING
          }));
          console.log('Formatted Reviews State:', formattedData);
          setReviews(formattedData);
        } else {
          console.error('Failed to fetch reviews, status:', response.status);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };
    fetchReviews();
  }, [isAdmin]);

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
    console.log('Updating order status:', orderId, 'to', status);
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        console.log('Order status updated successfully');
        // Optimistic update
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order.id === orderId ? { ...order, status } : order
          )
        );

        // Explicitly re-fetch to ensure sync with backend and trigger UI refresh
        // We use the same logic as the initial fetch
        try {
          const fetchResponse = await fetch('http://localhost:5000/api/orders');
          if (fetchResponse.ok) {
            const rawData = await fetchResponse.json();
            const dataArray = Array.isArray(rawData) ? rawData : (rawData.data || []);
            const formattedData = dataArray.map((item: any) => ({
              ...item,
              id: item._id || item.id,
              status: item.status || OrderStatus.PENDING,
            }));
            setOrders(formattedData);
          }
        } catch (fetchErr) {
          console.error('Failed to re-fetch orders after update:', fetchErr);
        }

      } else {
        console.error('Failed to update order status, response:', response.status);
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
    console.log('Updating review status:', reviewId, 'to', status);
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        console.log('Review status updated successfully');
        // Local Optimistic Update (Option B: Update local array state)
        // This will automatically move the item to the correct tab in AdminPage
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId ? { ...review, status } : review
          )
        );
      } else {
        console.error('Failed to update review status, response:', response.status);
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
                <AdminPage
                  orders={orders}
                  updateOrderStatus={updateOrderStatus}
                  reviews={reviews}
                  updateReviewStatus={updateReviewStatus}
                  loading={loading} // Pass loading state
                />
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