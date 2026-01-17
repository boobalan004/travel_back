import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PriceSummary from './PriceSummary';
import AddOnsSection from './AddOnsSection';
import Toast from './Toast';

// THIS FILE HAS BEEN COMPLETELY REWRITTEN - Full 4-step booking flow
const BookingModal = ({ destination, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Ensure price is always a valid number
  const pricePerPerson = Number(destination?.price_per_person) || Number(destination?.price?.replace(/\D/g, '')) || 45000;

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0,
    hotel: null,
    flight: null,
    addOns: [],
    paymentMethod: 'card',
    cardData: { cardNumber: '', expiryDate: '', cvv: '' }
  });

  const addOnsOptions = [
    { id: 'airport', label: 'Airport Pickup', price: 5000 },
    { id: 'hotel', label: 'Hotel Upgrade', price: 10000 },
    { id: 'food', label: 'Food Included', price: 15000 },
    { id: 'guide', label: 'Local Guide', price: 7500 },
    { id: 'insurance', label: 'Travel Insurance', price: 20000 }
  ];

  // Sample hotels for this destination
  const hotelOptions = [
    { id: 1, name: '5-Star Luxury Hotel', price: 25000, roomType: 'Suite' },
    { id: 2, name: '4-Star Premium Hotel', price: 15000, roomType: 'Double' },
    { id: 3, name: '3-Star Standard Hotel', price: 8000, roomType: 'Double' }
  ];

  // Sample flights for this destination
  const flightOptions = [
    { id: 1, number: 'AI101', duration: '4h 30m', departure: '08:00 AM', arrival: '12:30 PM', price: 12000 },
    { id: 2, number: 'AI102', duration: '5h 15m', departure: '02:00 PM', arrival: '07:15 PM', price: 10000 },
    { id: 3, number: 'AI103', duration: '4h 45m', departure: '06:00 PM', arrival: '10:45 PM', price: 11000 }
  ];

  const handleAddOnChange = (addOnId) => {
    setFormData(prev => ({
      ...prev,
      addOns: prev.addOns.includes(addOnId)
        ? prev.addOns.filter(id => id !== addOnId)
        : [...prev.addOns, addOnId]
    }));
  };

  const handleHotelSelect = (hotel) => {
    setFormData(prev => ({
      ...prev,
      hotel: prev.hotel?.id === hotel.id ? null : hotel
    }));
  };

  const handleFlightSelect = (flight) => {
    setFormData(prev => ({
      ...prev,
      flight: prev.flight?.id === flight.id ? null : flight
    }));
  };

  const handleMembersChange = (type, delta) => {
    setFormData(prev => ({
      ...prev,
      [type]: Math.max(type === 'adults' ? 1 : 0, prev[type] + delta)
    }));
  };

  const totalMembers = formData.adults + formData.children;
  const basePrice = Number(pricePerPerson * totalMembers) || 0;
  
  const calculateStayDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    try {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    } catch {
      return 0;
    }
  };
  
  const hotelTotalPrice = formData.hotel ? (formData.hotel.price * calculateStayDays()) : 0;
  const flightTotalPrice = formData.flight ? (formData.flight.price * totalMembers) : 0;
  
  const addOnsTotal = addOnsOptions
    .filter(opt => formData.addOns.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);
  
  const totalPrice = Number(basePrice + hotelTotalPrice + flightTotalPrice + addOnsTotal) || 0;

  const isStep1Valid = formData.startDate && formData.endDate && new Date(formData.startDate) < new Date(formData.endDate);
  const isStep2Valid = true; // Hotels and flights are optional
  const isStep3Valid = true; // Add-ons are optional
  const isStep4Valid = true; // Payment happens later, no validation needed here

  const handleConfirmBooking = async () => {
    console.log('🔵 [BOOKING] Starting booking SAVE process (BEFORE PAYMENT)...');
    console.log('🔵 [BOOKING] Current state:', { step, formData, destination });
    setIsProcessing(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token') || localStorage.getItem('sessionId') || localStorage.getItem('authToken');
      console.log('🔵 [BOOKING] Token check:', { hasToken: !!token });
      
      if (!token) {
        console.error('❌ [BOOKING] No authentication token found');
        setError('Authentication token not found. Please log in again.');
        setIsProcessing(false);
        navigate('/login');
        return;
      }

      // STEP 1: Validate all required fields
      console.log('🔵 [BOOKING] Validating dates...');
      if (!formData.startDate || !formData.endDate) {
        console.error('❌ [BOOKING] Missing dates');
        setError('Start date and end date are required');
        setIsProcessing(false);
        return;
      }

      const startDateObj = new Date(formData.startDate);
      const endDateObj = new Date(formData.endDate);
      
      if (startDateObj >= endDateObj) {
        console.error('❌ [BOOKING] Invalid date range');
        setError('End date must be after start date');
        setIsProcessing(false);
        return;
      }

      if (formData.adults < 1) {
        console.error('❌ [BOOKING] Invalid adult count');
        setError('At least 1 adult is required');
        setIsProcessing(false);
        return;
      }

      if (!destination._id && !destination.id) {
        console.error('❌ [BOOKING] Invalid destination data:', destination);
        setError('Invalid destination data');
        setIsProcessing(false);
        return;
      }
      
      console.log('🟢 [BOOKING] All field validations passed');

      // STEP 2: Get selected add-ons details
      const selectedAddOns = formData.addOns.map(id => 
        addOnsOptions.find(opt => opt.id === id)
      ).filter(Boolean);

      // STEP 3: Calculate stay days for date-based calculations
      const stayDays = calculateStayDays();
      
      // STEP 4: Prepare comprehensive booking data for API (NO payment required here)
      console.log('📤 [BOOKING] Preparing booking data for SAVE (without payment)...');
      const bookingData = {
        // Destination (REQUIRED)
        destinationId: destination._id || destination.id || 'dest-' + Date.now(),
        destinationName: destination.name || 'Unknown Destination',
        country: destination.country || 'Unknown Country',
        
        // Travel Dates (REQUIRED)
        startDate: formData.startDate,
        endDate: formData.endDate,
        
        // Travelers (REQUIRED)
        adults: parseInt(formData.adults),
        children: parseInt(formData.children),
        
        // Pricing (REQUIRED)
        pricePerPerson: Number(pricePerPerson),
        basePrice: Number(basePrice),
        
        // Hotel details (OPTIONAL - only if selected)
        ...(formData.hotel && {
          hotelName: formData.hotel.name || null,
          hotelPrice: Number(formData.hotel.price) || 0,
          roomType: formData.hotel.roomType || null
        }),
        
        // Flight details (OPTIONAL - only if selected)
        ...(formData.flight && {
          flightNumber: formData.flight.number || null,
          flightPrice: Number(formData.flight.price) || 0,
          flightDuration: formData.flight.duration || null,
          departureTime: formData.flight.departure || null,
          arrivalTime: formData.flight.arrival || null
        }),
        
        // Add-ons (OPTIONAL)
        addOns: selectedAddOns || [],
        addOnsTotal: Number(addOnsTotal) || 0,
        
        // Total Amount (REQUIRED - must match all components)
        totalAmount: Number(totalPrice),
        
        // Payment Method (OPTIONAL - payment happens later)
        paymentMethod: formData.paymentMethod || 'card'
      };

      console.log('📤 [BOOKING] Sending booking data to backend:', bookingData);
      console.log('📤 [BOOKING] API Endpoint: ' + `${API_BASE_URL}/api/bookings`);
      console.log('📤 [BOOKING] Authorization header: Bearer [TOKEN]');

      // STEP 5: Send booking to backend with PENDING_PAYMENT status
      console.log('🔵 [BOOKING] Sending POST request to backend...');
      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('🟢 [BOOKING] Success! Server response:', response.data);

      if (response.data.success) {
        console.log('🟢 [BOOKING] Booking SAVED with ID:', response.data.data._id);
        console.log('🟢 [BOOKING] Booking Status:', response.data.data.bookingStatus);
        console.log('🟢 [BOOKING] Payment Status:', response.data.data.paymentStatus);
        
        // Dispatch event to notify My Bookings page to refresh
        window.dispatchEvent(new CustomEvent('bookingCreated', {
          detail: {
            bookingId: response.data.data._id,
            destinationName: bookingData.destinationName,
            totalAmount: bookingData.totalAmount,
            bookingStatus: response.data.data.bookingStatus
          }
        }));
        
        // Store complete booking details in localStorage for confirmation
        const confirmationData = {
          bookingId: response.data.data._id,
          bookingDate: new Date().toLocaleDateString('en-IN'),
          status: response.data.data.bookingStatus || 'PENDING_PAYMENT',
          // All destination info
          destinationName: bookingData.destinationName,
          country: bookingData.country,
          // All traveler info
          adults: bookingData.adults,
          children: bookingData.children,
          // All dates
          startDate: new Date(bookingData.startDate).toLocaleDateString('en-IN'),
          endDate: new Date(bookingData.endDate).toLocaleDateString('en-IN'),
          // All pricing
          pricePerPerson: bookingData.pricePerPerson,
          basePrice: bookingData.basePrice,
          totalPrice: bookingData.totalAmount,
          // Hotel if booked
          ...(formData.hotel && {
            hotelName: bookingData.hotelName,
            hotelPrice: bookingData.hotelPrice,
            roomType: bookingData.roomType
          }),
          // Flight if booked
          ...(formData.flight && {
            flightNumber: bookingData.flightNumber,
            flightPrice: bookingData.flightPrice,
            flightDuration: bookingData.flightDuration,
            departureTime: bookingData.departureTime,
            arrivalTime: bookingData.arrivalTime
          }),
          // Add-ons
          addOns: bookingData.addOns,
          addOnsTotal: bookingData.addOnsTotal,
          paymentMethod: bookingData.paymentMethod
        };
        
        localStorage.setItem('lastBooking', JSON.stringify(confirmationData));
        console.log('🟢 [BOOKING] Stored confirmation data in localStorage');

        // Show toast notification
        setShowToast(true);
        setIsProcessing(false);

        // Close modal after 2 seconds (NO NAVIGATION - user can choose Continue to Payment button or close)
        console.log('🟢 [BOOKING] Booking saved successfully! User can now choose to continue to payment or close.');
        setTimeout(() => {
          console.log('🟢 [BOOKING] Closing modal...');
          onClose();
        }, 2000);
      } else {
        console.error('❌ [BOOKING] Server returned success:false with error:', response.data.error);
        setError(response.data.error || 'Failed to save booking');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('❌ [BOOKING] Exception caught:', {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        serverError: err.response?.data?.error,
        fullResponse: err.response?.data,
        stack: err.stack
      });
      const errorMessage = err.response?.data?.error || err.message || 'Failed to save booking. Please try again.';
      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white bg-black/60 hover:bg-black p-2 rounded-full z-50"
        >
          ✕
        </button>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-3">
            {error}
          </div>
        )}

        {/* Step 1: Destination & Travel Details */}
        {step === 1 && (
          <div className="p-6 md:p-8 bg-gradient-to-br from-gray-900 to-black">
            <div className="mb-8 border-b-2 border-blue-500 pb-6">
              <h2 className="text-4xl font-bold mb-2 text-white">{destination.name}</h2>
              <p className="text-blue-400 font-bold text-sm">✈️ Step 1 of 4: Travel Details</p>
            </div>

            {/* Destination Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/40 border-2 border-blue-500 p-4 rounded-lg">
                <p className="text-blue-300 text-xs font-bold mb-2">📍 COUNTRY</p>
                <p className="text-white font-bold text-lg">{destination.country}</p>
              </div>
              <div className="bg-gradient-to-br from-green-600/20 to-green-900/40 border-2 border-green-500 p-4 rounded-lg">
                <p className="text-green-300 text-xs font-bold mb-2">💰 PRICE/PERSON</p>
                <p className="text-green-300 font-bold text-lg">₹{Number(pricePerPerson).toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-900/40 border-2 border-yellow-500 p-4 rounded-lg">
                <p className="text-yellow-300 text-xs font-bold mb-2">⭐ RATING</p>
                <p className="text-yellow-300 font-bold text-lg">{destination.rating || 4.5}/5</p>
              </div>
              <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/40 border-2 border-purple-500 p-4 rounded-lg">
                <p className="text-purple-300 text-xs font-bold mb-2">👥 MEMBERS</p>
                <p className="text-purple-300 font-bold text-lg">{totalMembers} Total</p>
              </div>
            </div>

            {/* Travel Dates Section */}
            <div className="mb-10 bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-2 border-blue-500 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-blue-300">📅 Travel Dates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-300 mb-3 font-bold text-sm">START DATE</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-blue-400 rounded-lg text-white font-semibold focus:border-blue-300 focus:bg-gray-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-blue-300 mb-3 font-bold text-sm">END DATE</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border-2 border-blue-400 rounded-lg text-white font-semibold focus:border-blue-300 focus:bg-gray-600 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Travelers Section */}
            <div className="mb-10 bg-gradient-to-br from-green-900/30 to-green-800/20 border-2 border-green-500 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6 text-green-300">👥 Number of Travelers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-green-300 mb-3 font-bold text-sm">ADULTS</label>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2 border-2 border-green-500">
                    <button
                      onClick={() => handleMembersChange('adults', -1)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-white text-lg transition-all"
                    >
                      −
                    </button>
                    <span className="text-3xl font-bold text-green-300 w-16 text-center">{formData.adults}</span>
                    <button
                      onClick={() => handleMembersChange('adults', 1)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-white text-lg transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-green-300 mb-3 font-bold text-sm">CHILDREN</label>
                  <div className="flex items-center justify-between bg-gray-800 rounded-lg p-2 border-2 border-green-500">
                    <button
                      onClick={() => handleMembersChange('children', -1)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded font-bold text-white text-lg transition-all"
                    >
                      −
                    </button>
                    <span className="text-3xl font-bold text-green-300 w-16 text-center">{formData.children}</span>
                    <button
                      onClick={() => handleMembersChange('children', 1)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-bold text-white text-lg transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 mb-6 shadow-lg border-2 border-green-400">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold text-lg">💰 Destination Base Price ({totalMembers} travelers)</span>
                <span className="text-2xl font-bold text-white">₹{Number(basePrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                isStep1Valid
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg border-2 border-blue-500'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed border-2 border-gray-600'
              }`}
            >
              ➜ Continue to Hotels
            </button>
          </div>
        )}

        {/* Step 2: Hotels Selection */}
        {step === 2 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-2">Select Hotel</h2>
            <p className="text-gray-400 mb-6">Step 2 of 4: Hotels (Optional)</p>

            <div className="space-y-4 mb-8">
              {hotelOptions.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => handleHotelSelect(hotel)}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    formData.hotel?.id === hotel.id
                      ? 'border-green-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white text-lg">{hotel.name}</p>
                      <p className="text-gray-400 text-sm">Room Type: {hotel.roomType}</p>
                      <p className="text-gray-400 text-sm">₹{Number(hotel.price).toLocaleString('en-IN')} per night</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">₹{Number(hotel.price * calculateStayDays()).toLocaleString('en-IN')}</p>
                      <p className="text-gray-400 text-sm">{calculateStayDays()} nights</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.hotel && (
              <div className="bg-gray-800 p-4 rounded mb-6">
                <p className="text-gray-300">Selected: <span className="font-bold text-green-400">{formData.hotel.name}</span></p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
              >
                Continue to Flights
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Flights Selection */}
        {step === 3 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-2">Select Flight</h2>
            <p className="text-gray-400 mb-6">Step 3 of 4: Flights (Optional)</p>

            <div className="space-y-4 mb-8">
              {flightOptions.map((flight) => (
                <div
                  key={flight.id}
                  onClick={() => handleFlightSelect(flight)}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    formData.flight?.id === flight.id
                      ? 'border-green-500 bg-gray-800'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-white text-lg">{flight.number}</p>
                      <p className="text-gray-400 text-sm">{flight.departure} → {flight.arrival}</p>
                      <p className="text-gray-400 text-sm">Duration: {flight.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">₹{Number(flight.price * totalMembers).toLocaleString('en-IN')}</p>
                      <p className="text-gray-400 text-sm">₹{Number(flight.price).toLocaleString('en-IN')} × {totalMembers}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {formData.flight && (
              <div className="bg-gray-800 p-4 rounded mb-6">
                <p className="text-gray-300">Selected: <span className="font-bold text-green-400">{formData.flight.number}</span></p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
              >
                Continue to Add-ons
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Add-ons & Payment */}
        {step === 4 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
            <p className="text-gray-400 mb-6">Step 4 of 4: Add-ons (Payment will happen on My Bookings page)</p>

            <h3 className="text-xl font-bold mb-4">Add Optional Services</h3>
            <AddOnsSection
              addOnsOptions={addOnsOptions}
              selectedAddOns={formData.addOns}
              onAddOnChange={handleAddOnChange}
            />

            <h3 className="text-xl font-bold mt-8 mb-4">Select Preferred Payment Method</h3>
            <div className="space-y-3 mb-6">
              {['card', 'upi', 'netbanking'].map((method) => (
                <label key={method} className="flex items-center p-3 border border-gray-700 rounded cursor-pointer hover:bg-gray-800">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                    className="mr-3"
                  />
                  <span className="text-white capitalize font-semibold">{method === 'card' ? 'Credit/Debit Card' : method === 'upi' ? 'UPI' : 'Net Banking'}</span>
                </label>
              ))}
            </div>

            <div className="bg-blue-900/30 border-2 border-blue-500 p-4 rounded mb-6">
              <p className="text-blue-300 text-sm">
                ℹ️ Your booking will be saved with <strong>PENDING_PAYMENT</strong> status. You can complete the payment from your My Bookings page.
              </p>
            </div>

            {/* Price Summary */}
            <div className="bg-gray-800 p-6 rounded-lg mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Destination ({totalMembers} travelers)</span>
                <span className="font-semibold">₹{Number(basePrice).toLocaleString('en-IN')}</span>
              </div>
              {formData.hotel && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Hotel ({calculateStayDays()} nights)</span>
                  <span className="font-semibold">₹{Number(hotelTotalPrice).toLocaleString('en-IN')}</span>
                </div>
              )}
              {formData.flight && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Flight ({totalMembers} travelers)</span>
                  <span className="font-semibold">₹{Number(flightTotalPrice).toLocaleString('en-IN')}</span>
                </div>
              )}
              {addOnsTotal > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Add-ons</span>
                  <span className="font-semibold">₹{Number(addOnsTotal).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="border-t border-gray-700 pt-3 flex justify-between text-xl">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold text-green-400">₹{Number(totalPrice).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={isProcessing}
                className={`flex-1 py-3 rounded font-bold text-lg transition-all ${
                  !isProcessing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Saving...' : '💾 Save Booking'}
              </button>
              <button
                onClick={() => {
                  console.log('🔵 [NAVIGATION] User clicked Continue to Payment without saving');
                  onClose();
                  navigate('/bookings');
                }}
                disabled={isProcessing}
                className={`flex-1 py-3 rounded font-bold text-lg transition-all ${
                  !isProcessing
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Payment →
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <Toast
            message="Booking Confirmed Successfully!"
            destination={destination.name}
            totalPrice={totalPrice}
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookingModal;
