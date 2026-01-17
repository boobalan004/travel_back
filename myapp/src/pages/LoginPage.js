import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import Footer from '../components/Footer';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
        timeout: 5000
      });
      
      // Store token and user info
      localStorage.setItem('token', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Dispatch custom event to update UI immediately
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { username: response.data.user.name } }));
      
      // Navigate to home
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      
      // Provide specific error messages
      if (err.code === 'ECONNABORTED') {
        setError('Connection timeout. Please check if the backend server is running');
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please ensure the backend is running on port 5000');
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials.');
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.error || 'Please fill in all fields');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later or contact support.');
      } else if (!err.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.response?.data?.error || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-center mb-12">Sign In</h1>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-600 text-white p-4 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 rounded transition-colors"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign Up Here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default LoginPage;
