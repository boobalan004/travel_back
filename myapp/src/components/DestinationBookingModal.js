import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';
import GenericToast from './GenericToast';

const DestinationBookingModal = ({ destination, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Extract destination data
  const destinationName = destination?.name || 'Unknown';
  const country = destination?.country || 'Unknown';
  const duration = parseInt(destination?.duration) || 5; // Default 5 days
  const pricePerPerson = parseInt(destination?.price?.replace(/\D/g, '')) || 50000;

  // Form state
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0
  });

  // Calculate derived values
  const totalTravelers = formData.adults + formData.children;
  const totalPrice = totalTravelers * pricePerPerson;

  // Handlers
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleTravelerChange = (type, delta) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
    }));
  };

  const showErrorToast = (message) => {
    setToastMessage(message);
    setToastType('error');
    setShowToast(true);
    setError(message);
  };

  const showSuccessToast = (message) => {
    setToastMessage(message);
    setToastType('success');
    setShowToast(true);
  };

  // Validation
  const validateBooking = () => {
    if (!formData.startDate) {
      showErrorToast('Please select a start date');
      return false;
    }

    if (!formData.endDate) {
      showErrorToast('Please select an end date');
      return false;
    }

    if (formData.adults < 1) {
      showErrorToast('At least 1 adult is required');
      return false;
    }

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      showErrorToast('Start date cannot be in the past');
      return false;
    }

    if (endDate <= startDate) {
      showErrorToast('End date must be after start date');
      return false;
    }

    return true;
  };

  // Navigate to My Bookings
  const handleViewMyBookings = () => {
    onClose();
    navigate('/my-bookings');
  };

  // Save booking only (status: "saved")
  const handleSave = async () => {
    if (!validateBooking()) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showErrorToast('Authentication required. Please log in.');
        setIsProcessing(false);
        return;
      }

      const bookingData = {
        destinationId: destination.id,
        destinationName,
        country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adults: formData.adults,
        children: formData.children,
        totalTravelers,
        pricePerPerson,
        totalAmount: totalPrice,
        duration: Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)),
        status: 'saved',
        paymentStatus: 'not_paid'
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/save`,
        bookingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showSuccessToast('Booking saved successfully!');
        setTimeout(() => {
          onClose();
          if (onSuccess) onSuccess();
        }, 1500);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to save booking';
      showErrorToast(errorMsg);
      console.error('Save booking error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save and redirect to payment
  const handlePay = async () => {
    if (!validateBooking()) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showErrorToast('Authentication required. Please log in.');
        setIsProcessing(false);
        return;
      }

      const bookingData = {
        destinationId: destination.id,
        destinationName,
        country,
        startDate: formData.startDate,
        endDate: formData.endDate,
        adults: formData.adults,
        children: formData.children,
        totalTravelers,
        pricePerPerson,
        totalAmount: totalPrice,
        duration: Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)),
        status: 'pending',
        paymentStatus: 'pending'
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/book-and-pay`,
        bookingData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success && response.data.bookingId) {
        showSuccessToast('Proceeding to payment...');
        setTimeout(() => {
          // Redirect to payment page with booking ID
          navigate(`/booking-confirmation/${response.data.bookingId}`);
        }, 1000);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create booking';
      showErrorToast(errorMsg);
      console.error('Book and pay error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    return '₹' + price.toLocaleString('en-IN');
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal Content */}
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">{destinationName}</h2>
                <p className="text-blue-100">{country}</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-blue-500 rounded-full p-2 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-blue-100 text-xs uppercase tracking-wide">Duration</p>
                <p className="text-lg font-semibold">{duration} Days</p>
              </div>
              <div>
                <p className="text-blue-100 text-xs uppercase tracking-wide">Price/Person</p>
                <p className="text-lg font-semibold">{formatPrice(pricePerPerson)}</p>
              </div>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6">
          {/* Date Selection */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  📅 Travel Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleDateChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  📅 Travel End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleDateChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  disabled={!formData.startDate}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              {formData.startDate && formData.endDate && (
                <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <span className="font-semibold">Trip Duration:</span> {Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              )}
            </div>

            {/* Traveler Selection */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-900">
                👥 Travelers
              </label>

              {/* Adults */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Adults</p>
                  <p className="text-xs text-gray-500">Min: 1</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTravelerChange('adults', -1)}
                    disabled={formData.adults <= 1}
                    className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50 font-bold transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{formData.adults}</span>
                  <button
                    onClick={() => handleTravelerChange('adults', 1)}
                    className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-gray-900">Children</p>
                  <p className="text-xs text-gray-500">Min: 0</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleTravelerChange('children', -1)}
                    disabled={formData.children <= 0}
                    className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 disabled:opacity-50 font-bold transition"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-lg">{formData.children}</span>
                  <button
                    onClick={() => handleTravelerChange('children', 1)}
                    className="w-8 h-8 rounded-full bg-blue-500 text-white hover:bg-blue-600 font-bold transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Travelers */}
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">Total Travelers</p>
                <p className="text-2xl font-bold text-blue-600">{totalTravelers}</p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Price Summary */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Travelers × Price/Person</span>
                  <span className="font-medium text-gray-900">
                    {totalTravelers} × {formatPrice(pricePerPerson)} = {formatPrice(totalPrice)}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-300 mt-3 pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer - Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 space-y-3">
            {/* Primary Actions Row */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="py-3 bg-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Save this booking for later"
              >
                {isProcessing ? 'Processing...' : '💾 Save'}
              </button>
              
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Proceed to payment"
              >
                {isProcessing ? 'Processing...' : '💳 Pay Now'}
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleViewMyBookings}
                disabled={isProcessing}
                className="py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="View your saved and confirmed bookings"
              >
                📋 My Bookings
              </button>

              <button
                onClick={onClose}
                disabled={isProcessing}
                className="py-3 bg-white border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                title="Close this modal"
              >
                ✕ Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <GenericToast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default DestinationBookingModal;
