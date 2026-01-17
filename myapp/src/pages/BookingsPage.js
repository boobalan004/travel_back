import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import Footer from '../components/Footer';
import SkeletonLoader from '../components/SkeletonLoader';

function BookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('sessionId') || localStorage.getItem('authToken');

      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user's bookings
      const response = await axios.get(
        `${API_BASE_URL}/api/bookings/my`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setBookings(response.data.data || []);
      } else {
        setError(response.data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || 'Failed to fetch bookings. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('sessionId') || localStorage.getItem('authToken');

      const response = await axios.put(
        `${API_BASE_URL}/api/bookings/${bookingId}`,
        { bookingStatus: 'Cancelled' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setToast({
          show: true,
          message: 'Booking cancelled successfully',
          type: 'success'
        });
        fetchUserBookings();
      }
    } catch (err) {
      console.error('Error cancelling booking:', err);
      setToast({
        show: true,
        message: err.response?.data?.error || 'Failed to cancel booking',
        type: 'error'
      });
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const calculateDays = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 0;
    } catch {
      return 0;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-900 text-green-200';
      case 'Pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'Cancelled':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="flex-1 px-4 md:px-20 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold mb-3">My Bookings</h1>
            <p className="text-gray-400 text-lg">View and manage all your travel bookings</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-4 rounded-lg mb-8">
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonLoader key={i} />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="text-6xl mb-6">✈️</div>
              <h2 className="text-3xl font-bold mb-4">No Bookings Yet</h2>
              <p className="text-gray-400 mb-8 text-lg">
                Start your adventure! Explore destinations and make your first booking.
              </p>
              <button
                onClick={() => navigate('/destinations')}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-colors"
              >
                Explore Destinations
              </button>
            </div>
          ) : (
            // Bookings Grid
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors"
                >
                  {/* Header with Destination */}
                  <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">
                          {booking.destinationName}
                        </h3>
                        <p className="text-blue-100">📍 {booking.country}</p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusBadgeColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4">
                    {/* Dates */}
                    <div className="border-b border-gray-700 pb-4">
                      <p className="text-gray-400 text-sm mb-2">Travel Dates</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-300 text-sm">Departure</p>
                          <p className="text-lg font-semibold">
                            {formatDate(booking.startDate)}
                          </p>
                        </div>
                        <div className="text-gray-400">
                          →{' '}
                          <span className="text-white font-bold">
                            {calculateDays(booking.startDate, booking.endDate)} days
                          </span>
                        </div>
                        <div>
                          <p className="text-gray-300 text-sm">Return</p>
                          <p className="text-lg font-semibold">
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="border-b border-gray-700 pb-4">
                      <p className="text-gray-400 text-sm mb-2">Travelers</p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-gray-400 text-sm">Adults</p>
                          <p className="text-xl font-bold text-green-400">
                            {booking.adults}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm">Children</p>
                          <p className="text-xl font-bold text-blue-400">
                            {booking.children}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Add-ons */}
                    {booking.addOns && booking.addOns.length > 0 && (
                      <div className="border-b border-gray-700 pb-4">
                        <p className="text-gray-400 text-sm mb-2">Add-ons</p>
                        <div className="flex flex-wrap gap-2">
                          {booking.addOns.map((addon, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-800 border border-gray-600 rounded-full text-xs text-gray-300"
                            >
                              {addon.label || addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="bg-gray-800 rounded p-4">
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex justify-between text-gray-300">
                          <span>Base Price ({booking.adults + booking.children} travelers)</span>
                          <span>₹{Number(booking.basePrice).toLocaleString('en-IN')}</span>
                        </div>
                        {booking.addOnsTotal > 0 && (
                          <div className="flex justify-between text-gray-300">
                            <span>Add-ons</span>
                            <span>₹{Number(booking.addOnsTotal).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="border-t border-gray-600 pt-2 flex justify-between font-bold text-lg">
                          <span>Total Amount</span>
                          <span className="text-green-400">
                            ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-500">
                      <p>Booking ID: {booking._id}</p>
                      <p>Booked on: {formatDate(booking.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    {booking.bookingStatus !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="w-full py-2 px-4 bg-red-900 hover:bg-red-800 border border-red-700 rounded font-semibold transition-colors mt-4"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg font-semibold ${
              toast.type === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default BookingsPage;
