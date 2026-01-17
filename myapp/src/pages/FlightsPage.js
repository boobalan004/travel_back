import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/apiConfig';

function FlightsPage() {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingFlightId, setSavingFlightId] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [memberCount, setMemberCount] = useState({
    adults: 1,
    children: 0
  });

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/flights`);
      console.log('🟢 [FLIGHTS] API Response:', response.data);
      const flightData = response.data.data || response.data || [];
      console.log('🟢 [FLIGHTS] Processed flights:', flightData);
      setFlights(Array.isArray(flightData) ? flightData : []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch flights');
      console.error('❌ [FLIGHTS] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save flight booking to backend
  const handleBookFlight = (flight) => {
    console.log('🔵 [FLIGHT] Book button clicked for flight:', flight.id);
    setSelectedFlight(flight);
    setShowMemberModal(true); // Show modal to ask for member count
  };

  // Save booking with member count
  const saveFlightBooking = async (shouldNavigateToPay = false) => {
    if (!selectedFlight) return;

    console.log('🔵 [FLIGHT] Saving booking with members:', memberCount);
    console.log('🔵 [FLIGHT] Selected flight:', selectedFlight);
    
    setSavingFlightId(selectedFlight.id);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('sessionId') || localStorage.getItem('authToken');
      
      if (!token) {
        console.error('❌ [FLIGHT] No authentication token found');
        setToast({
          show: true,
          message: 'Please log in to save bookings',
          type: 'error'
        });
        setSavingFlightId(null);
        navigate('/login');
        return;
      }

      const totalTravelers = memberCount.adults + memberCount.children;
      
      // Extract price safely - handle both string and number formats
      let pricePerPerson = 0;
      if (selectedFlight.price) {
        const priceStr = String(selectedFlight.price);
        // Extract all digits (handles both ₹45,650 and $550 formats)
        const extracted = parseInt(priceStr.replace(/\D/g, ''));
        pricePerPerson = extracted && extracted > 0 ? extracted : 5000;
      } else {
        pricePerPerson = 5000;
      }
      
      const totalPrice = pricePerPerson * totalTravelers;

      console.log('🔵 [FLIGHT] Calculated prices:', { pricePerPerson, totalPrice });

      // Validate prices are numbers and greater than 0
      if (pricePerPerson <= 0 || totalPrice <= 0) {
        setToast({
          show: true,
          message: 'Invalid pricing data: ' + JSON.stringify({ pricePerPerson, totalPrice }),
          type: 'error'
        });
        setSavingFlightId(null);
        return;
      }

      // Create dates properly
      const now = new Date();
      const startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);

      // Prepare booking data - compatible with existing /api/bookings endpoint
      const bookingData = {
        destinationId: `flight-${selectedFlight.id}`,
        destinationName: `${selectedFlight.departure} → ${selectedFlight.arrival}`,
        country: 'International',
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        adults: parseInt(memberCount.adults),
        children: parseInt(memberCount.children),
        pricePerPerson: parseInt(pricePerPerson),
        basePrice: parseInt(totalPrice),
        flightNumber: `FL-${selectedFlight.id}`,
        flightPrice: parseInt(totalPrice),
        flightDuration: selectedFlight.duration || '0h 0m',
        departureTime: selectedFlight.departureTime || '00:00',
        arrivalTime: selectedFlight.arrivalTime || '00:00',
        addOns: [],
        addOnsTotal: 0,
        totalAmount: parseInt(totalPrice),
        paymentMethod: 'card'
      };

      console.log('📤 [FLIGHT] Sending flight booking data:', bookingData);

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

      console.log('🟢 [FLIGHT] Response:', response.data);

      if (response.data.success) {
        // Dispatch event for My Bookings to refresh
        window.dispatchEvent(new CustomEvent('bookingCreated', {
          detail: {
            bookingId: response.data.data._id,
            destinationName: `${selectedFlight.departure} → ${selectedFlight.arrival}`,
            totalAmount: totalPrice,
            bookingStatus: response.data.data.bookingStatus
          }
        }));

        setToast({
          show: true,
          message: `✅ Flight booked for ${totalTravelers} traveler(s)!`,
          type: 'success'
        });

        // Reset modal
        setShowMemberModal(false);
        setSelectedFlight(null);
        setMemberCount({ adults: 1, children: 0 });
        setSavingFlightId(null);

        // Navigate to payment if requested
        if (shouldNavigateToPay) {
          setTimeout(() => {
            console.log('🔵 [FLIGHT] Navigating to My Bookings for payment...');
            navigate('/bookings');
          }, 1500);
        } else {
          setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
          }, 2000);
        }
      } else {
        console.error('❌ [FLIGHT] Server error:', response.data.error);
        setToast({
          show: true,
          message: response.data.error || 'Failed to save booking',
          type: 'error'
        });
        setSavingFlightId(null);
      }
    } catch (err) {
      console.error('❌ [FLIGHT] Exception:', err.message);
      console.error('❌ [FLIGHT] Full error:', err);
      console.error('❌ [FLIGHT] Response status:', err.response?.status);
      console.error('❌ [FLIGHT] Response data:', err.response?.data);
      
      let errorMsg = 'Failed to save flight booking';
      
      if (err.response?.data?.error) {
        errorMsg = err.response.data.error;
        console.error('❌ [FLIGHT] Backend error message:', errorMsg);
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setToast({
        show: true,
        message: errorMsg,
        type: 'error'
      });
      setSavingFlightId(null);
    }
  };

  const handleCancelModal = () => {
    setShowMemberModal(false);
    setSelectedFlight(null);
    setMemberCount({ adults: 1, children: 0 });
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="px-4 md:px-20 py-12">
        <h1 className="text-5xl font-bold mb-8">Find Flights</h1>
        
        {loading && <p className="text-center text-xl">Loading flights...</p>}
        {error && <p className="text-center text-red-500 text-xl">{error}</p>}
        
        {!loading && !error && flights.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {flights.map((flight) => (
              <div
                key={flight.id}
                className="bg-gray-900 rounded-lg p-6 hover:shadow-lg transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div className="mb-4 md:mb-0 flex-1">
                  <h3 className="text-xl font-bold mb-2">{flight.airline}</h3>
                  <p className="text-gray-400 mb-2">
                    {flight.departure} → {flight.arrival}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {flight.departureTime} - {flight.arrivalTime}
                  </p>
                  <p className="text-gray-300 text-sm">Duration: {flight.duration}</p>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start md:items-center w-full md:w-auto">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Available Seats</p>
                    <p className="text-2xl font-bold text-blue-400">{flight.seats}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Price (INR)</p>
                    <p className="text-3xl font-bold text-green-400">{flight.price}</p>
                  </div>
                  <div className="flex gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleBookFlight(flight)}
                      disabled={savingFlightId === flight.id}
                      className={`px-6 py-2 rounded font-bold text-sm transition-all whitespace-nowrap ${
                        savingFlightId === flight.id
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {savingFlightId === flight.id ? '✈️ Booking...' : '✈️ Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg font-semibold text-white shadow-lg ${
            toast.type === 'success' 
              ? 'bg-green-600' 
              : 'bg-red-600'
          }`}>
            {toast.message}
          </div>
        )}

        {/* Member Count Modal */}
        {showMemberModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-2xl border border-blue-500">
              <h2 className="text-2xl font-bold mb-6 text-white">
                Select Number of Travelers
              </h2>
              
              {selectedFlight && (
                <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
                  <p className="text-blue-300 font-semibold text-sm mb-2">Flight Details:</p>
                  <p className="text-white font-bold">{selectedFlight.airline}</p>
                  <p className="text-gray-300 text-sm">{selectedFlight.departure} → {selectedFlight.arrival}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {selectedFlight.departureTime} - {selectedFlight.arrivalTime}
                  </p>
                </div>
              )}

              {/* Adults Count */}
              <div className="mb-6">
                <label className="block text-white font-bold mb-3">Adults</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMemberCount(prev => ({...prev, adults: Math.max(1, prev.adults - 1)}))}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-blue-400 w-12 text-center">
                    {memberCount.adults}
                  </span>
                  <button
                    onClick={() => setMemberCount(prev => ({...prev, adults: prev.adults + 1}))}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Count */}
              <div className="mb-8">
                <label className="block text-white font-bold mb-3">Children</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setMemberCount(prev => ({...prev, children: Math.max(0, prev.children - 1)}))}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                  >
                    −
                  </button>
                  <span className="text-3xl font-bold text-green-400 w-12 text-center">
                    {memberCount.children}
                  </span>
                  <button
                    onClick={() => setMemberCount(prev => ({...prev, children: prev.children + 1}))}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              <div className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-500 p-4 rounded-lg mb-6">
                <p className="text-gray-300 text-sm mb-2">Total Travelers:</p>
                <p className="text-3xl font-bold text-white">
                  {memberCount.adults + memberCount.children}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCancelModal}
                  disabled={savingFlightId !== null}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveFlightBooking(false)}
                  disabled={savingFlightId !== null}
                  className={`flex-1 px-4 py-3 rounded font-bold transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    savingFlightId !== null
                      ? 'bg-gray-600'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {savingFlightId !== null ? '💾 Saving...' : '💾 Save'}
                </button>
                <button
                  onClick={() => saveFlightBooking(true)}
                  disabled={savingFlightId !== null}
                  className={`flex-1 px-4 py-3 rounded font-bold transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                    savingFlightId !== null
                      ? 'bg-gray-600'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {savingFlightId !== null ? '💳 Processing...' : '💳 Save & Pay'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FlightsPage;
