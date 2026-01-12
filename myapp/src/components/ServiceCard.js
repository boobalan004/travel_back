import React, { useState } from 'react';

const ServiceCard = ({ service, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getIcon = (iconType) => {
    const iconStyles = "w-20 h-20 transition-all duration-300";
    
    switch (iconType) {
      case 'cloud':
        return (
          <svg className={`${iconStyles} text-blue-500`} fill="currentColor" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" fill="url(#cloudGrad)" />
            <circle cx="8" cy="16" r="2" fill="white" opacity="0.3" />
            <circle cx="16" cy="15" r="1.5" fill="white" opacity="0.3" />
          </svg>
        );
      case 'plane':
        return (
          <svg className={`${iconStyles} text-blue-500`} fill="currentColor" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>
            <path d="M10.18 9 L2 13l8.18 4-1.63-2.5L2 13l4.55-1.5L10.18 9M9 2l8 11-5 3.5L9 11V2M21 13l-8-5v1l5.5 4-5.5 4v1l8-5z" fill="url(#planeGrad)" />
            <circle cx="9" cy="7" r="1.5" fill="white" opacity="0.5" />
          </svg>
        );
      case 'event':
        return (
          <svg className={`${iconStyles} text-purple-500`} fill="currentColor" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="eventGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#9333ea" />
              </linearGradient>
            </defs>
            <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" fill="url(#eventGrad)" />
            <rect x="8" y="3" width="2" height="2" fill="white" opacity="0.3" />
            <rect x="14" y="3" width="2" height="2" fill="white" opacity="0.3" />
          </svg>
        );
      case 'settings':
        return (
          <svg className={`${iconStyles} text-pink-500`} fill="currentColor" viewBox="0 0 24 24">
            <defs>
              <linearGradient id="settingsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.1-.62l-2.03-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="url(#settingsGrad)" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="group animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`h-full p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${
          isHovered
            ? 'bg-gradient-to-br from-primary to-orange-500 text-white shadow-2xl'
            : 'bg-white shadow-md hover:shadow-xl border border-gray-100'
        }`}
      >
        {/* Icon Container */}
        <div
          className={`mb-6 transition-all duration-300 flex justify-center ${
            isHovered ? 'transform scale-110' : ''
          }`}
        >
          {getIcon(service.icon)}
        </div>

        {/* Title */}
        <h3 className={`text-xl font-bold text-center mb-4 ${
          isHovered ? 'text-white' : 'text-dark'
        }`}>
          {service.title}
        </h3>

        {/* Description */}
        <p className={`text-center text-sm leading-relaxed mb-6 ${
          isHovered ? 'text-white/90' : 'text-gray'
        }`}>
          {service.description}
        </p>

        {/* Button */}
        <button className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm ${
          isHovered
            ? 'bg-white text-primary hover:bg-gray-100'
            : 'bg-primary text-white hover:bg-orange-600'
        }`}>
          Learn More
        </button>

        {/* Accent Line */}
        <div
          className={`h-1 bg-white/30 rounded-full mt-6 transition-all duration-300 ${
            isHovered ? 'w-full' : 'w-0'
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ServiceCard;
