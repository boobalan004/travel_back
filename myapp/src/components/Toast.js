import React, { useEffect, useState } from 'react';

const Toast = ({ message, destination, totalPrice, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-6 right-6 z-[60] animate-slideInRight">
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg shadow-2xl p-6 max-w-sm">
        <div className="flex items-start gap-4">
          <div className="text-3xl">✓</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold mb-2">Booking Confirmed Successfully!</h3>
            <p className="text-sm text-green-100 mb-1">Destination: <span className="font-semibold">{destination}</span></p>
            <p className="text-sm text-green-100">Amount Paid: <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
