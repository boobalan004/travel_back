import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
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
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      
      // Store token and user info
      localStorage.setItem('token', response.data.sessionId);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Dispatch custom event to update UI immediately
      window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: { username: response.data.user.name } }));
      
      // Remove alert and navigate (the welcome banner will show immediately)
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-center mb-12">Create Account</h1>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-600 text-white p-4 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-300 mb-2 font-semibold">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full bg-gray-800 text-white px-4 py-3 rounded border border-gray-700 focus:border-blue-500 outline-none transition-colors"
              />
            </div>

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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 font-semibold"
            >
              Sign In Here
            </button>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterPage;
