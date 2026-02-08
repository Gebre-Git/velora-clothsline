import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC<{ onLogin: (token: string, email: string) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log('Attempting login with:', { email: email.trim(), password: '***' });
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login failed:', errorData);
        setError(errorData.message || 'Invalid email or password');
        setLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Explicitly save to localStorage here to ensure it's available 
      // before navigation happens, fixing race conditions with ProtectedRoute
      localStorage.setItem('velora_admin_token', data.token);
      localStorage.setItem('velora_admin_email', data.email);

      onLogin(data.token, data.email);
      navigate('/admin');
    } catch (err) {
      console.error('Network error details:', err);
      setError('Failed to connect to server. Check console for details.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        {error && <div className="text-red-600 mb-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mb-4 p-2 border rounded" type="email" required />

          <label className="block mb-2 text-sm font-medium">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mb-4 p-2 border rounded" type="password" required />

          <button type="submit" disabled={loading} className="w-full bg-velora-green text-white py-2 rounded font-semibold disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-3">Only authorized admin emails are allowed for testing.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
