import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PriceSummary from './PriceSummary';
import AddOnsSection from './AddOnsSection';
import Toast from './Toast';

const BookingModal = ({ destination, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Ensure price is always a valid number - get from destination
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
  const hotelTotalPrice = formData.hotel ? (formData.hotel.price * (formData.endDate && formData.startDate 
    ? Math.ceil((new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24))
    : 1)) : 0;
  const flightTotalPrice = formData.flight ? (formData.flight.price * totalMembers) : 0;
  
  const addOnsTotal = addOnsOptions
    .filter(opt => formData.addOns.includes(opt.id))
    .reduce((sum, opt) => sum + opt.price, 0);
  
  const totalPrice = Number(basePrice + hotelTotalPrice + flightTotalPrice + addOnsTotal) || 0;

  const isStep1Valid = formData.startDate && formData.endDate && new Date(formData.startDate) < new Date(formData.endDate);
  const isStep2Valid = true; // Hotels and flights are optional
  const isStep3Valid = formData.paymentMethod && (
    formData.paymentMethod !== 'card' || 
    (formData.cardData.cardNumber && formData.cardData.expiryDate && formData.cardData.cvv)
  );

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

  const handleConfirmBooking = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('sessionId') || localStorage.getItem('authToken');
      
      if (!token) {
        setError('Please log in to make a booking');
        setIsProcessing(false);
        navigate('/login');
        return;
      }

      // Validate required fields
      if (!formData.startDate || !formData.endDate) {
        setError('Start date and end date are required');
        setIsProcessing(false);
        return;
      }

      if (formData.adults < 1) {
        setError('At least 1 adult is required');
        setIsProcessing(false);
        return;
      }

      // Get selected add-ons details
      const selectedAddOns = formData.addOns.map(id => 
        addOnsOptions.find(opt => opt.id === id)
      ).filter(Boolean);

      // Prepare comprehensive booking data for API
      const bookingData = {
        destinationId: destination._id || destination.id || 'dest-' + Date.now(),
        destinationName: destination.name || 'Unknown Destination',
        country: destination.country || 'Unknown Country',
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        adults: formData.adults,
        children: formData.children,
        pricePerPerson: pricePerPerson,
        basePrice: basePrice,
        
        // Hotel details (if selected)
        ...(formData.hotel && {
          hotelName: formData.hotel.name,
          hotelPrice: formData.hotel.price,
          roomType: formData.hotel.roomType
        }),
        
        // Flight details (if selected)
        ...(formData.flight && {
          flightNumber: formData.flight.number,
          flightPrice: formData.flight.price,
          flightDuration: formData.flight.duration,
          departureTime: formData.flight.departure,
          arrivalTime: formData.flight.arrival
        }),
        
        // Add-ons
        addOns: selectedAddOns,
        addOnsTotal: addOnsTotal,
        totalAmount: totalPrice,
        paymentMethod: formData.paymentMethod
      };

      // Send booking to backend
      const response = await axios.post(
        'http://localhost:5000/api/bookings',
        bookingData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        // Store last booking in localStorage for confirmation page
        localStorage.setItem('lastBooking', JSON.stringify({
          ...bookingData,
          bookingId: response.data.data._id,
          bookingDate: new Date().toLocaleDateString('en-IN'),
          status: response.data.data.bookingStatus
        }));

        // Show toast notification
        setShowToast(true);

        // Navigate after 2 seconds
        setTimeout(() => {
          setIsProcessing(false);
          onClose();
          navigate('/bookings'); // Navigate to My Bookings page
        }, 2000);
      } else {
        setError(response.data.error || 'Failed to create booking');
        setIsProcessing(false);
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to create booking. Please try again.';
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
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-6 py-3 rounded-t-lg">
            {error}
          </div>
        )}

        {/* Step 1: Destination & Travel Details */}
        {step === 1 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6">{destination.name}</h2>

            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gray-800 rounded-lg">
              <div>
                <p className="text-gray-400 text-sm">Country</p>
                <p className="text-xl font-semibold">{destination.country}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Price Per Person</p>
                <p className="text-xl font-semibold text-green-400">₹{Number(pricePerPerson).toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Rating</p>
                <p className="text-xl font-semibold">⭐ {destination.rating || 4.5}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Members</p>
                <p className="text-xl font-semibold">{totalMembers}</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Travel Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Number of Members</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Adults</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMembersChange('adults', -1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">{formData.adults}</span>
                  <button
                    onClick={() => handleMembersChange('adults', 1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    +
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-2 font-semibold">Children</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleMembersChange('children', -1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">{formData.children}</span>
                  <button
                    onClick={() => handleMembersChange('children', 1)}
                    className="px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <PriceSummary 
              pricePerPerson={pricePerPerson}
              adults={formData.adults}
              children={formData.children}
              basePrice={basePrice}
              addOnsTotal={addOnsTotal}
              totalPrice={totalPrice}
            />

            <button
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              className={`w-full py-3 rounded font-bold text-lg mt-6 transition-all ${
                isStep1Valid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Add-ons
            </button>
          </div>
        )}

        {/* Step 2: Add-ons */}
        {step === 2 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6">Optional Add-ons</h2>

            <AddOnsSection
              addOnsOptions={addOnsOptions}
              selectedAddOns={formData.addOns}
              onAddOnChange={handleAddOnChange}
            />

            <PriceSummary 
              pricePerPerson={pricePerPerson}
              adults={formData.adults}
              children={formData.children}
              basePrice={basePrice}
              addOnsTotal={addOnsTotal}
              totalPrice={totalPrice}
            />

            <div className="flex gap-4 mt-6">
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
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="p-6 md:p-8">
            <h2 className="text-3xl font-bold mb-6">Payment Method</h2>

            <div className="mb-6">
              <label className="block text-gray-300 mb-3 font-semibold">Select Payment Method</label>
              <div className="space-y-3">
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
            </div>

            {formData.paymentMethod === 'card' && (
              <div className="mb-6 p-4 bg-gray-800 rounded">
                <h3 className="text-lg font-bold mb-4">Card Details</h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    value={formData.cardData.cardNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardData: { ...prev.cardData, cardNumber: e.target.value } }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.cardData.expiryDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardData: { ...prev.cardData, expiryDate: e.target.value } }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      value={formData.cardData.cvv}
                      onChange={(e) => setFormData(prev => ({ ...prev, cardData: { ...prev.cardData, cvv: e.target.value } }))}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <PriceSummary basePrice={basePrice} addOnsTotal={addOnsTotal} totalPrice={totalPrice} />

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold"
              >
                Back
              </button>
              <button
                onClick={handleConfirmBooking}
                disabled={!isStep2Valid || isProcessing}
                className={`flex-1 py-3 rounded font-bold text-lg transition-all ${
                  isStep2Valid && !isProcessing
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Confirm & Pay'}
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
