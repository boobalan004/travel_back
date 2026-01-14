import React, { useEffect, useState } from 'react';

const GenericToast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'from-green-600 to-emerald-600' : 'from-red-600 to-red-700';
  const icon = isSuccess ? '✓' : '⚠';

  return (
    <div className="fixed top-6 right-6 z-[60] animate-slideInRight">
      <div className={`bg-gradient-to-r ${bgColor} text-white rounded-lg shadow-2xl p-4 sm:p-6 max-w-sm`}>
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="text-2xl sm:text-3xl flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <p className="text-sm sm:text-base font-semibold">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenericToast;
