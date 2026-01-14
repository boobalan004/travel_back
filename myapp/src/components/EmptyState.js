import React from 'react';

const EmptyState = ({ searchTerm, selectedCountry, onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration SVG */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>
        <svg className="w-32 h-32 text-blue-400 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      {/* Main Message */}
      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
        No Destinations Found
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-center mb-2 max-w-md">
        {searchTerm || selectedCountry !== 'all'
          ? 'We couldn\'t find any destinations matching your filters. Try adjusting your search criteria.'
          : 'No destinations are currently available. Please check back soon!'}
      </p>

      {/* Icon Message */}
      <p className="text-4xl mb-8 animate-bounce">🌍</p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {(searchTerm || selectedCountry !== 'all') && (
          <>
            <button
              onClick={onReset}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 1119.414 4.414.5.5 0 00-.707.707A8.002 8.002 0 115.888 2.112A2.5 2.5 0 005 2.5V4a1 1 0 01-1 1H2a1 1 0 01-1-1V3a1 1 0 011-1h2z" clipRule="evenodd" />
              </svg>
              Clear Filters
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Go Home
            </button>
          </>
        )}
        {!searchTerm && selectedCountry === 'all' && (
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Back to Home
          </button>
        )}
      </div>

      {/* Suggestions */}
      <div className="mt-12 pt-8 border-t border-gray-200 max-w-md w-full">
        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 text-center">
          Popular Destinations
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {['Paris', 'Tokyo', 'New York', 'Dubai', 'Sydney', 'Barcelona'].map((dest) => (
            <button
              key={dest}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg text-sm transition-colors duration-200"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
