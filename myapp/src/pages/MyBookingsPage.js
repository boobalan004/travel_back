import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import SkeletonLoader from '../components/SkeletonLoader';

function MyBookingsPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    fetchUserBookings();
  }, [refreshTrigger]);

  // Handle payment for a booking
  const handlePayment = async (bookingId) => {
    console.log('🔵 [PAYMENT] Processing payment for booking:', bookingId);
    setIsProcessingPayment(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('sessionId') || localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ [PAYMENT] No token found');
        setToast({
          show: true,
          message: 'Authentication token not found. Please log in again.',
          type: 'error'
        });
        navigate('/login');
        return;
      }

      console.log('🔵 [PAYMENT] Sending payment request to backend...');
      const response = await axios.post(
        `http://localhost:5000/api/bookings/${bookingId}/payment`,
        {
          paymentMethod: paymentMethod,
          cardData: paymentMethod === 'card' ? { /* card details would go here */ } : {}
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('🟢 [PAYMENT] Payment processed successfully:', response.data);

      if (response.data.success) {
        console.log('🟢 [PAYMENT] Booking status updated to:', response.data.data.bookingStatus);
        setToast({
          show: true,
          message: 'Payment processed successfully! Booking confirmed.',
          type: 'success'
        });
        setShowPaymentModal(false);
        setSelectedBooking(null);
        setPaymentMethod('card');
        // Refresh bookings list
        setRefreshTrigger(prev => prev + 1);
      } else {
        console.error('❌ [PAYMENT] Server error:', response.data.error);
        setToast({
          show: true,
          message: response.data.error || 'Failed to process payment',
          type: 'error'
        });
      }
    } catch (err) {
      console.error('❌ [PAYMENT] Exception:', err);
      const errorMsg = err.response?.data?.error || 'Failed to process payment';
      setToast({
        show: true,
        message: errorMsg,
        type: 'error'
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    fetchUserBookings();
  }, [refreshTrigger]);

  // Listen for booking creation events for real-time updates
  useEffect(() => {
    const handleBookingCreated = (event) => {
      console.log('🟢 [MY_BOOKINGS] Booking created event received:', event.detail);
      // Trigger immediate refresh
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('bookingCreated', handleBookingCreated);
    return () => window.removeEventListener('bookingCreated', handleBookingCreated);
  }, []);

  const fetchUserBookings = async () => {
    try {
      // Only show loading spinner on first load
      if (refreshTrigger === 0) {
        setLoading(true);
      }
      setError(null);

      // Get token from localStorage - try multiple keys for compatibility
      const token = localStorage.getItem('token') || localStorage.getItem('sessionId') || localStorage.getItem('authToken');
      console.log('🔵 [MY_BOOKINGS] Fetching bookings with token:', { hasToken: !!token, refreshTrigger });

      if (!token) {
        console.error('❌ [MY_BOOKINGS] No token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Fetch user's bookings
      console.log('🔵 [MY_BOOKINGS] Sending GET request to /api/bookings/my');
      const response = await axios.get(
        'http://localhost:5000/api/bookings/my',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('🟢 [MY_BOOKINGS] Response received:', response.data);

      if (response.data.success) {
        console.log('🟢 [MY_BOOKINGS] Bookings loaded:', response.data.data?.length || 0);
        // Sort bookings by creation date, newest first
        const sortedBookings = (response.data.data || []).sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setBookings(sortedBookings);
      } else {
        console.error('❌ [MY_BOOKINGS] Server returned error:', response.data.error);
        setError(response.data.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      console.error('❌ [MY_BOOKINGS] Exception:', {
        message: err.message,
        status: err.response?.status,
        serverError: err.response?.data?.error
      });
      if (err.response?.status === 401) {
        console.error('❌ [MY_BOOKINGS] Unauthorized - redirecting to login');
        navigate('/login');
      } else {
        const errorMsg = err.response?.data?.error || 'Failed to fetch bookings. Please try again.';
        console.error('❌ [MY_BOOKINGS] Setting error:', errorMsg);
        setError(errorMsg);
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
      const token = localStorage.getItem('token') || localStorage.getItem('sessionId') || localStorage.getItem('authToken');

      const response = await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}`,
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
      case 'PENDING_PAYMENT':
        return 'bg-yellow-600 text-white font-bold';
      case 'PAID':
        return 'bg-green-600 text-white font-bold';
      case 'CONFIRMED':
        return 'bg-blue-600 text-white font-bold';
      case 'Confirmed':
        return 'bg-green-600 text-white font-bold';
      case 'Pending':
        return 'bg-yellow-600 text-white font-bold';
      case 'Cancelled':
        return 'bg-red-600 text-white font-bold';
      default:
        return 'bg-blue-600 text-white font-bold';
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
              <div className="mb-6 flex justify-center">
                <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-3m6 3l6-3M7 11l6-3m6 3l-6-3m0 0L7 8m6 3v8m0-8l-6-3m6 3l6-3" />
                </svg>
              </div>
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
                  className="bg-gray-850 border-2 border-blue-500 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all"
                >
                  {/* Header with Destination */}
                  <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-2 text-white">
                          {booking.destinationName}
                        </h3>
                        <div className="flex items-center gap-2 text-blue-50 font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {booking.country}
                      </div>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap flex-shrink-0 ${getStatusBadgeColor(
                          booking.bookingStatus
                        )}`}
                      >
                        {booking.bookingStatus}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6 space-y-4 bg-gray-900">
                    {/* Dates */}
                    <div className="border-l-4 border-blue-500 bg-blue-900/30 p-4 rounded">
                      <div className="flex items-center gap-2 text-blue-300 text-sm font-bold mb-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </svg>
                        Travel Dates
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <p className="text-gray-300 text-xs font-semibold">Departure</p>
                          <p className="text-base font-bold text-white">
                            {formatDate(booking.startDate)}
                          </p>
                        </div>
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-blue-300 font-bold">→</p>
                            <span className="text-lg font-bold text-blue-300">
                              {calculateDays(booking.startDate, booking.endDate)}d
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-300 text-xs font-semibold">Return</p>
                          <p className="text-base font-bold text-white">
                            {formatDate(booking.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="border-l-4 border-green-500 bg-green-900/30 p-4 rounded">
                      <div className="flex items-center gap-2 text-green-300 text-sm font-bold mb-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM16.35 13.42H4.65A2.65 2.65 0 002 16v1a1 1 0 001 1h14a1 1 0 001-1v-1a2.65 2.65 0 00-2.65-2.58z" />
                        </svg>
                        Travelers
                      </div>
                      <div className="flex gap-6">
                        <div>
                          <p className="text-gray-300 text-xs font-semibold">Adults</p>
                          <p className="text-2xl font-bold text-green-400">
                            {booking.adults}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-300 text-xs font-semibold">Children</p>
                          <p className="text-2xl font-bold text-blue-400">
                            {booking.children}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Hotel Details (if booked) */}
                    {booking.hotelName && (
                      <div className="border-l-4 border-purple-500 bg-purple-900/30 p-4 rounded">
                        <div className="flex items-center gap-2 text-purple-300 text-sm font-bold mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 7v10a1 1 0 001 1h2m4-6l2-3m0 0l7-4v10a1 1 0 01-1 1h-2m4-5a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Hotel Booking
                        </div>
                        <p className="text-lg font-bold text-white mb-1">{booking.hotelName}</p>
                        <p className="text-sm text-gray-200 font-semibold">Room Type: {booking.roomType}</p>
                        <p className="text-sm text-purple-200 font-semibold">
                          ₹{Number(booking.hotelPrice).toLocaleString('en-IN')}/night × {calculateDays(booking.startDate, booking.endDate)} nights
                        </p>
                        <p className="text-base font-bold text-purple-300 mt-1">
                          = ₹{Number(booking.hotelPrice * calculateDays(booking.startDate, booking.endDate)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {/* Flight Details (if booked) */}
                    {booking.flightNumber && (
                      <div className="border-l-4 border-cyan-500 bg-cyan-900/30 p-4 rounded">
                        <div className="flex items-center gap-2 text-cyan-300 text-sm font-bold mb-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Flight Booking
                        </div>
                        <p className="text-lg font-bold text-white mb-1">Flight {booking.flightNumber}</p>
                        <p className="text-sm text-cyan-200 font-semibold">
                          {booking.departureTime} → {booking.arrivalTime} ({booking.flightDuration})
                        </p>
                        <p className="text-sm text-cyan-200 font-semibold">
                          ₹{Number(booking.flightPrice).toLocaleString('en-IN')}/person × {booking.adults + booking.children} travelers
                        </p>
                        <p className="text-base font-bold text-cyan-300 mt-1">
                          = ₹{Number(booking.flightPrice * (booking.adults + booking.children)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}

                    {/* Add-ons */}
                    {booking.addOns && booking.addOns.length > 0 && (
                      <div className="border-l-4 border-yellow-500 bg-yellow-900/30 p-4 rounded">
                        <div className="flex items-center gap-2 text-yellow-300 text-sm font-bold mb-3">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          Add-ons Selected
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {booking.addOns.map((addon, idx) => (
                            <span
                              key={idx}
                              className="px-4 py-2 bg-yellow-700 border-2 border-yellow-500 rounded-full text-sm text-white font-semibold"
                            >
                              {addon.label || addon}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 border-2 border-green-600">
                      <div className="flex items-center gap-2 text-green-300 text-sm font-bold mb-3">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        Price Breakdown
                      </div>
                      <div className="space-y-2 mb-3 text-sm">
                        <div className="flex justify-between text-gray-200 font-semibold">
                          <span>Destination ({booking.adults + booking.children} travelers)</span>
                          <span className="text-white">₹{Number(booking.basePrice).toLocaleString('en-IN')}</span>
                        </div>
                        {booking.hotelPrice && booking.hotelPrice > 0 && (
                          <div className="flex justify-between text-gray-200 font-semibold">
                            <span>Hotel ({calculateDays(booking.startDate, booking.endDate)} nights)</span>
                            <span className="text-white">₹{Number(booking.hotelPrice * calculateDays(booking.startDate, booking.endDate)).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {booking.flightPrice && booking.flightPrice > 0 && (
                          <div className="flex justify-between text-gray-200 font-semibold">
                            <span>Flight ({booking.adults + booking.children} travelers)</span>
                            <span className="text-white">₹{Number(booking.flightPrice * (booking.adults + booking.children)).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        {booking.addOnsTotal > 0 && (
                          <div className="flex justify-between text-gray-200 font-semibold">
                            <span>Add-ons</span>
                            <span className="text-white">₹{Number(booking.addOnsTotal).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                        <div className="border-t-2 border-green-600 pt-3 mt-2 flex justify-between font-bold text-lg">
                          <span className="text-white">Total Amount</span>
                          <span className="text-green-300 text-xl">
                            ₹{Number(booking.totalAmount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-400 bg-gray-800 p-3 rounded border border-gray-700">
                      <p className="font-semibold">Booking ID: <span className="text-blue-300 font-mono">{booking._id}</span></p>
                      <p className="font-semibold">Booked on: <span className="text-blue-300">{formatDate(booking.createdAt)}</span></p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      {booking.bookingStatus === 'PENDING_PAYMENT' && (
                        <button
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowPaymentModal(true);
                            setPaymentMethod('card');
                          }}
                          className="flex-1 py-3 px-4 bg-green-600 hover:bg-green-700 border-2 border-green-500 rounded-lg font-bold text-white transition-colors text-base flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          Complete Payment
                        </button>
                      )}
                      {booking.bookingStatus !== 'Cancelled' && (
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className={`${booking.bookingStatus === 'PENDING_PAYMENT' ? 'flex-1' : 'w-full'} py-3 px-4 bg-red-600 hover:bg-red-700 border-2 border-red-500 rounded-lg font-bold text-white transition-colors mt-4 text-base`}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md bg-gray-900 rounded-lg shadow-2xl p-8">
            <button
              onClick={() => {
                setShowPaymentModal(false);
                setSelectedBooking(null);
                setPaymentMethod('card');
              }}
              className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black p-2 rounded-full z-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <h2 className="text-3xl font-bold mb-2 text-white">Complete Payment</h2>
            <p className="text-gray-400 mb-6">Book ID: {selectedBooking._id}</p>

            {/* Booking Summary */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-blue-500">
              <h3 className="text-lg font-bold text-white mb-3">{selectedBooking.destinationName}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Travelers</span>
                  <span className="font-semibold text-white">{selectedBooking.adults + selectedBooking.children} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Duration</span>
                  <span className="font-semibold text-white">{calculateDays(selectedBooking.startDate, selectedBooking.endDate)} days</span>
                </div>
                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between">
                  <span className="text-gray-300 font-bold">Total Amount</span>
                  <span className="font-bold text-green-400 text-lg">₹{Number(selectedBooking.totalAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <h3 className="text-lg font-bold text-white mb-4">Payment Method</h3>
            <div className="space-y-3 mb-6">
              {['card', 'upi', 'netbanking'].map((method) => (
                <label key={method} className="flex items-center p-3 border-2 border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800 transition-all" style={{ borderColor: paymentMethod === method ? '#10b981' : '' }}>
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-white capitalize font-semibold flex items-center gap-2">
                    {method === 'card' && (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        Credit/Debit Card
                      </>
                    )}
                    {method === 'upi' && (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        UPI
                      </>
                    )}
                    {method === 'netbanking' && (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3.5a1 1 0 01-1-1v-2a1 1 0 10-2 0v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 5a1 1 0 100-2 1 1 0 000 2zm2 4a1 1 0 11-2 0 1 1 0 012 0z" />
                        </svg>
                        Net Banking
                      </>
                    )}
                  </span>
                </label>
              ))}
            </div>

            <div className="bg-blue-900/30 border-2 border-blue-500 p-4 rounded mb-6 flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-blue-300 text-sm">
                In a real scenario, you'll be redirected to a payment gateway. Here, we'll simulate the payment.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedBooking(null);
                  setPaymentMethod('card');
                }}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayment(selectedBooking._id)}
                disabled={isProcessingPayment}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition-colors ${
                  isProcessingPayment
                    ? 'bg-gray-700 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessingPayment ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MyBookingsPage;
