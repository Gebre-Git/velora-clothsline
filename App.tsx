import React, { useState, useCallback } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import GuidelinesPage from './pages/GuidelinesPage';
import Header from './components/Header';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import { type Order, OrderStatus } from './types';

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

function App() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

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


  return (
    <HashRouter>
      <div className="bg-velora-light min-h-screen font-sans text-velora-text relative cursor-none">
        <CustomCursor />
        <Header />
        <main>
          <Routes>
            <Route path="/admin" element={<AdminPage orders={orders} updateOrderStatus={updateOrderStatus} />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/" element={<ClientPage addOrder={addOrder} getOrderById={getOrderById} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default App;