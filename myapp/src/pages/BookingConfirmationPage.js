import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const BookingConfirmationPage = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve booking details from localStorage
    const bookingData = localStorage.getItem('lastBooking');
    if (bookingData) {
      try {
        setBooking(JSON.parse(bookingData));
      } catch (err) {
        console.error('Error parsing booking data:', err);
      }
    }
    setLoading(false);
  }, []);

  const handleDownloadInvoice = () => {
    if (!booking) return;
    
    // Generate mock invoice text
    const invoiceText = `
BOOKING INVOICE
====================
Booking ID: ${booking.bookingId}
Date: ${booking.bookingDate || new Date().toLocaleDateString()}

DESTINATION DETAILS
Destination: ${booking.destinationName}
Country: ${booking.destinationCountry}

TRAVELER INFORMATION
Adults: ${booking.adults}
Children: ${booking.children}
Total Members: ${booking.adults + booking.children}

TRAVEL DATES
Start Date: ${booking.startDate}
End Date: ${booking.endDate}

PRICE BREAKDOWN
Base Price: ₹${booking.basePrice.toLocaleString('en-IN')}
${booking.addOns && booking.addOns.length > 0 ? `Add-ons Total: ₹${booking.addOnsTotal.toLocaleString('en-IN')}\n` : ''}Total Amount: ₹${booking.totalPrice.toLocaleString('en-IN')}

PAYMENT METHOD
${booking.paymentMethod === 'card' ? 'CREDIT/DEBIT CARD' : booking.paymentMethod === 'upi' ? 'UPI' : 'NET BANKING'}

====================
Thank you for booking with us!
    `;

    // Create blob and download
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceText));
    element.setAttribute('download', `Invoice_${booking.bookingId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="bg-black text-white min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Oops!</h1>
            <p className="text-gray-400 mb-8">No booking found. Please make a booking first.</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded"
            >
              Go to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <div className="flex-1 px-4 md:px-20 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-5xl font-bold mb-2 text-green-400">Booking Confirmed!</h1>
          <p className="text-xl text-gray-400">Your travel is all set. Have a wonderful trip!</p>
        </div>

        {/* Booking Details Card */}
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-4">Booking Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">BOOKING ID</p>
                <p className="text-2xl font-bold text-blue-400">{booking.bookingId}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">DESTINATION</p>
                <p className="text-xl font-bold">{booking.destinationName}</p>
                <p className="text-gray-400">{booking.country}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">TRAVEL DATES</p>
                <p className="text-lg font-bold">{booking.startDate} to {booking.endDate}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm font-semibold mb-1">TRAVELERS</p>
                <p className="text-lg font-bold">{booking.adults} Adult(s), {booking.children} Child(ren)</p>
              </div>
            </div>

            {/* Right Column - Price Breakdown */}
            <div className="bg-gray-700/50 rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-600 pb-2">PRICE BREAKDOWN</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Base Price:</span>
                  <span className="font-semibold">₹{booking.basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Members:</span>
                  <span className="font-semibold">{booking.adults + booking.children}</span>
                </div>


                {booking.addOnsTotal > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Add-ons:</span>
                    <span className="font-semibold">+₹{booking.addOnsTotal.toLocaleString('en-IN')}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-600 pt-4">
                <div className="flex justify-between text-xl font-bold text-green-400">
                  <span>Total Amount:</span>
                  <span>₹{booking.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-gray-700/50 rounded-lg p-4 mb-8">
            <p className="text-gray-400 text-sm font-semibold mb-2">PAYMENT METHOD</p>
            <p className="text-lg font-bold capitalize">
              {booking.paymentMethod === 'card' ? 'Credit/Debit Card' : booking.paymentMethod === 'upi' ? 'UPI' : 'Net Banking'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleDownloadInvoice}
              className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all"
            >
              📥 Download Invoice
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-lg transition-all"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="max-w-3xl mx-auto bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-2">A confirmation email has been sent to your registered email address.</p>
          <p className="text-gray-400 text-sm">You can check your bookings anytime in the "My Bookings" section.</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingConfirmationPage;
