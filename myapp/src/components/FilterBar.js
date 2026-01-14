import React from 'react';

const FilterBar = ({
  searchTerm,
  setSearchTerm,
  selectedCountry,
  setSelectedCountry,
  countries,
  priceRange,
  setPriceRange,
  resultsCount
}) => {
  return (
    <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white border-opacity-20 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Search Box */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🔍 Search Destination
          </label>
          <input
            type="text"
            placeholder="Paris, Tokyo, Dubai..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
          />
        </div>

        {/* Country Filter */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🌍 Country
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white cursor-pointer font-medium"
          >
            <option value="all">All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="lg:col-span-1">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💰 Max Price: ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="2000"
            step="100"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex gap-2 mt-2 text-xs text-gray-600">
            <span>$0</span>
            <span className="flex-1"></span>
            <span>$2000</span>
          </div>
        </div>

        {/* Results Count */}
        <div className="lg:col-span-1 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2.5 rounded-lg border border-blue-200">
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase">Results</p>
            <p className="text-2xl font-bold text-blue-600">{resultsCount}</p>
          </div>
          <svg className="w-8 h-8 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c4.72-4.72 12.372-4.72 17.092 0a1 1 0 01-1.414 1.414zM9.5 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      {/* Clear Filters Button */}
      {(searchTerm || selectedCountry !== 'all' || priceRange[1] !== 2000) && (
        <button
          onClick={() => {
            setSearchTerm('');
            setSelectedCountry('all');
            setPriceRange([0, 2000]);
          }}
          className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 underline decoration-2 underline-offset-2 transition-colors duration-200"
        >
          ✕ Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
