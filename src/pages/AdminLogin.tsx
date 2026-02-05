import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC<{ onLogin: (email: string) => boolean }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(email.trim());
    if (ok) {
      navigate('/admin');
    } else {
      setError('Unauthorized email or invalid credentials.');
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

          <button type="submit" className="w-full bg-velora-green text-white py-2 rounded font-semibold">Sign in</button>
        </form>
        <p className="text-sm text-gray-500 mt-3">Only authorized admin emails are allowed for testing.</p>
      </div>
    </div>
  );
};

export default AdminLogin;
