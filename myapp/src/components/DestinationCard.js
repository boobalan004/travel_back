import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config/apiConfig';

const DestinationCard = ({ destination, isLoggedIn, onBookClick }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  // Button loading states
  const [loadingStates, setLoadingStates] = useState({
    save: false,
    book: false,
    pay: false
  });
  
  // Toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' // 'success' or 'error'
  });

  // Reset skeleton state on mount
  useEffect(() => {
    setShowSkeleton(true);
    setImageLoaded(false);
    setImageError(false);
  }, [destination?.id]);

  // Comprehensive image mapping with high-quality images
  const IMAGE_MAP = {
    'Paris': '/paris.jpg',
    'Tokyo': '/tokyo.jpg',
    'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=480&fit=crop&q=80',
    'Dubai': 'https://images.unsplash.com/photo-1512453475365-2d5c801ebc13?w=600&h=480&fit=crop&q=80',
    'Barcelona': '/barcelona.jpg',
    'Sydney': '/sydney.jpg',
    'Rome': '/rome.jpg',
    'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=480&fit=crop&q=80',
    'Amsterdam': 'https://images.unsplash.com/photo-1505228395891-9a51e7e86e81?w=600&h=480&fit=crop&q=80',
    'Bangkok': 'https://images.unsplash.com/photo-1552520206-7eccab78c147?w=600&h=480&fit=crop&q=80',
    'Singapore': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=480&fit=crop&q=80',
    'Venice': 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=480&fit=crop&q=80',
  };

  // Fallback travel images (used if specific destination not found)
  const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1500375592092-40eb7e9c1b16?w=600&h=480&fit=crop&q=80',
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=480&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=480&fit=crop&q=80',
  ];

  // Get image URL with guaranteed fallback
  const getImageUrl = () => {
    if (!destination?.name) return FALLBACK_IMAGES[0];
    return IMAGE_MAP[destination.name] || FALLBACK_IMAGES[Math.floor(Math.random() * FALLBACK_IMAGES.length)];
  };

  // Country flag mapping
  const COUNTRY_FLAGS = {
    'France': '🇫🇷',
    'Japan': '🇯🇵',
    'USA': '🇺🇸',
    'UAE': '🇦🇪',
    'Spain': '🇪🇸',
    'Australia': '🇦🇺',
    'Italy': '🇮🇹',
    'UK': '🇬🇧',
    'England': '🇬🇧',
    'Netherlands': '🇳🇱',
    'Thailand': '🇹🇭',
    'Singapore': '🇸🇬',
  };

  // Ensure all data is properly sanitized
  const destinationName = destination?.name || 'Unknown Destination';
  const destinationCountry = destination?.country || 'Unknown';
  const destinationDescription = destination?.description || 'Discover amazing experiences in this wonderful destination.';
  const destinationRating = Math.min(Math.max(destination?.rating || 4.5, 0), 5);
  const destinationPrice = destination?.price || '$0';

  // Get tag based on consistent rating logic
  const getTag = () => {
    if (destinationRating >= 4.7) return { text: 'Trending', color: 'bg-red-100 text-red-700' };
    if (destinationRating >= 4.6) return { text: 'Popular', color: 'bg-purple-100 text-purple-700' };
    return { text: 'Best Seller', color: 'bg-blue-100 text-blue-700' };
  };

  // Get flag emoji with fallback
  const countryFlag = COUNTRY_FLAGS[destinationCountry] || '🌍';
  const tag = getTag();
  const imageUrl = getImageUrl();

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
    setShowSkeleton(false);
  };

  // Handle image error with fallback
  const handleImageError = () => {
    setImageError(true);
    setShowSkeleton(false);
    setImageLoaded(false);
  };

  // Sanitize price display
  const displayPrice = destinationPrice.startsWith('$') || destinationPrice.startsWith('₹') 
    ? destinationPrice 
    : `$${destinationPrice}`;

  // Show toast notification
  const showToastNotification = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Handle Save Button
  const handleSave = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showToastNotification('Please login to save destinations', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoadingStates(prev => ({ ...prev, save: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/save`,
        {
          destinationId: destination?.id || destination?.name,
          destinationName,
          country: destinationCountry
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showToastNotification(response.data.alreadySaved ? 'Already saved!' : 'Destination saved successfully!');
      }
    } catch (error) {
      console.error('Save error:', error);
      showToastNotification(error.response?.data?.error || 'Failed to save destination', 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, save: false }));
    }
  };

  // Handle Book Now Button
  const handleBookNow = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showToastNotification('Please login to book', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoadingStates(prev => ({ ...prev, book: true }));
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings/book`,
        {
          destinationId: destination?.id || destination?.name,
          destinationName,
          country: destinationCountry
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        showToastNotification('Booking created! Redirecting to checkout...');
        setTimeout(() => navigate('/bookings'), 1500);
      }
    } catch (error) {
      console.error('Book Now error:', error);
      showToastNotification(error.response?.data?.error || 'Failed to create booking', 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, book: false }));
    }
  };

  // Handle Pay Now Button
  const handlePayNow = async (e) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showToastNotification('Please login to pay', 'error');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setLoadingStates(prev => ({ ...prev, pay: true }));
    
    try {
      // First, find the user's booking for this destination
      const token = localStorage.getItem('token');
      const bookingsResponse = await axios.get(
        `${API_BASE_URL}/api/bookings/my`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const booking = bookingsResponse.data.data?.find(b => 
        b.destinationId === (destination?.id || destination?.name) || 
        b.destinationName === destinationName
      );

      if (!booking) {
        showToastNotification('No booking found. Please Book Now first.', 'error');
        setLoadingStates(prev => ({ ...prev, pay: false }));
        return;
      }

      // Process payment
      const paymentResponse = await axios.post(
        `${API_BASE_URL}/api/bookings/pay`,
        {
          bookingId: booking._id
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (paymentResponse.data.success) {
        showToastNotification('Payment successful! Booking confirmed!');
        setTimeout(() => navigate('/bookings'), 1500);
      }
    } catch (error) {
      console.error('Payment error:', error);
      showToastNotification(error.response?.data?.error || 'Payment failed', 'error');
    } finally {
      setLoadingStates(prev => ({ ...prev, pay: false }));
    }
  };

  return (
    <div 
      className="group h-full cursor-pointer relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col"
      onClick={(e) => {
        if (e.target.closest('button')) return; // Don't trigger if button clicked
        if (isLoggedIn) onBookClick();
      }}
      role="article"
      aria-label={`Destination: ${destinationName}, ${destinationCountry}`}
    >
      {/* ========== HERO IMAGE SECTION (FIXED HEIGHT: 288px) ========== */}
      <div className="relative w-full h-72 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 flex-shrink-0">
        {/* Skeleton Loader - Always visible while loading or on error */}
        {showSkeleton && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse z-20" />
        )}

        {/* Image or Fallback - Always renders */}
        {!imageError ? (
          <img
            src={imageUrl}
            alt={`${destinationName}, ${destinationCountry}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ) : (
          // Gradient Fallback with Travel Icon
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-purple-100 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl" />
            </div>
            
            {/* Icon */}
            <svg 
              className="w-20 h-20 text-blue-500 relative z-10" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path d="M10.894 2.553a.75.75 0 00-1.788 0l-.894 4.771h-4.927a.75.75 0 000 1.5h4.194l-.323 1.724h-3.871a.75.75 0 000 1.5h3.138l-.893 4.771a.75.75 0 101.482.264l.821-4.4h4.822l-.894 4.771a.75.75 0 101.482.264l.821-4.4h3.871a.75.75 0 000-1.5h-3.138l.323-1.724h3.871a.75.75 0 000-1.5h-4.194l.894-4.771a.75.75 0 00-1.482-.264l-.821 4.4h-4.822l.894-4.771z" />
            </svg>
          </div>
        )}

        {/* ========== BADGE SECTION - TOP OVERLAY ========== */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-30">
          {/* Tag Badge (Left) */}
          <span 
            className={`px-3 py-1 rounded-full text-xs font-bold transition-transform duration-300 group-hover:scale-105 ${tag.color}`}
            aria-label={`Tag: ${tag.text}`}
          >
            {tag.text}
          </span>
          
          {/* Country Flag Badge (Right) */}
          <div 
            className="bg-white bg-opacity-95 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all duration-300"
            title={destinationCountry}
            aria-label={`Country: ${destinationCountry}`}
          >
            <span className="text-2xl block" role="img">{countryFlag}</span>
          </div>
        </div>

        {/* ========== RATING BADGE - BOTTOM RIGHT ========== */}
        <div 
          className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg px-3 py-1.5 shadow-md flex items-center gap-1.5 hover:bg-opacity-100 transition-all duration-300"
          aria-label={`Rating: ${destinationRating} out of 5 stars`}
        >
          <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="font-bold text-gray-900 text-sm">{destinationRating.toFixed(1)}</span>
        </div>
      </div>

      {/* ========== CONTENT SECTION ========== */}
      <div className="p-6 flex flex-col flex-grow relative z-5 gap-4">
        
        {/* Destination Header */}
        <div className="flex-shrink-0">
          <h3 
            className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1"
            title={destinationName}
          >
            {destinationName}
          </h3>
          <p className="text-sm font-semibold text-gray-500 mt-1" title={destinationCountry}>
            {destinationCountry}
          </p>
        </div>

        {/* Description */}
        <p 
          className="text-gray-700 text-sm mb-2 line-clamp-2 leading-relaxed flex-shrink-0 min-h-10"
          title={destinationDescription}
        >
          {destinationDescription}
        </p>

        {/* Features Row - Standardized */}
        <div className="flex gap-2 flex-wrap flex-shrink-0">
          <div className="flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10.893 3.5a4.365 4.365 0 00-5.843 0 4.365 4.365 0 000 6.179L10 16.129l5.207-6.03a4.236 4.236 0 000-6.179 4.365 4.365 0 00-5.314 0z" />
            </svg>
            <span className="text-xs font-semibold text-blue-700">Hotel</span>
          </div>

          <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
            <svg className="w-4 h-4 text-orange-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-3m6 3l6-3m-6-3l-6 3m6-3l6 3m0 0l-9-18" />
            </svg>
            <span className="text-xs font-semibold text-orange-700">Flight</span>
          </div>

          <div className="flex items-center gap-1 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-semibold text-green-700">Guide</span>
          </div>
        </div>

        {/* Duration Box - Consistent Style */}
        <div className="flex-shrink-0 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-colors duration-300">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Duration</p>
          <p className="text-lg font-bold text-gray-900">5 Days / 4 Nights</p>
        </div>

        {/* Price Section - Consistent Style */}
        <div className="flex-shrink-0 py-4 border-t border-b border-gray-200">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Price Per Person</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-600">{displayPrice}</span>
            <span className="text-xs text-gray-500 font-medium">per person</span>
          </div>
        </div>

        {/* ========== ACTION BUTTONS SECTION ========== */}
        <div className="flex-shrink-0 grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={loadingStates.save || !isLoggedIn}
            title={!isLoggedIn ? 'Login to save' : 'Save this destination'}
            className={`py-2.5 px-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1 ${
              !isLoggedIn
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : loadingStates.save
                ? 'bg-blue-500 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 active:scale-95'
            }`}
          >
            {loadingStates.save ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6.95 2.05l-1.414-1.414M18 12h2m0 6.95l-1.414-1.414M12 18v2m-6.95-1.414l-1.414 1.414M6 12H4m1.414-6.95l1.414 1.414" />
                </svg>
                <span>Saving</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
                <span>Save</span>
              </>
            )}
          </button>

          {/* Book Now Button */}
          <button
            onClick={handleBookNow}
            disabled={loadingStates.book || !isLoggedIn}
            title={!isLoggedIn ? 'Login to book' : 'Create a booking'}
            className={`py-2.5 px-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1 ${
              !isLoggedIn
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : loadingStates.book
                ? 'bg-purple-500 text-white'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 active:scale-95'
            }`}
          >
            {loadingStates.book ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6.95 2.05l-1.414-1.414M18 12h2m0 6.95l-1.414-1.414M12 18v2m-6.95-1.414l-1.414 1.414M6 12H4m1.414-6.95l1.414 1.414" />
                </svg>
                <span>Booking</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Book</span>
              </>
            )}
          </button>

          {/* Pay Now Button */}
          <button
            onClick={handlePayNow}
            disabled={loadingStates.pay || !isLoggedIn}
            title={!isLoggedIn ? 'Login to pay' : 'Process payment'}
            className={`py-2.5 px-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1 ${
              !isLoggedIn
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : loadingStates.pay
                ? 'bg-green-500 text-white'
                : 'bg-green-50 text-green-700 hover:bg-green-100 active:scale-95'
            }`}
          >
            {loadingStates.pay ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m6.95 2.05l-1.414-1.414M18 12h2m0 6.95l-1.414-1.414M12 18v2m-6.95-1.414l-1.414 1.414M6 12H4m1.414-6.95l1.414 1.414" />
                </svg>
                <span>Paying</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
                <span>Pay</span>
              </>
            )}
          </button>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div className={`absolute bottom-4 left-4 right-4 p-3 rounded-lg text-sm font-semibold text-white transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 shadow-lg' 
              : 'bg-red-500 shadow-lg'
          }`}>
            {toast.message}
          </div>
        )}

      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-tr from-blue-500 to-purple-500 -z-10" />
    </div>
  );
};

export default DestinationCard;
