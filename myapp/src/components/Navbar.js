import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
  <nav className="sticky top-0 z-50 bg-[#d1d1d1] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Single Letter R */}
          <div className="flex items-center space-x-2">
        <span className="text-xl font-black text-[#000000]">Rohil</span>
          </div>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-12 absolute left-1/2 transform -translate-x-1/2">
            <a href="#" className="text-black font-black text-sm hover:text-primary transition-colors duration-300">Destinations</a>
            <a href="#" className="text-black font-black text-sm hover:text-primary transition-colors duration-300">Hotels</a>
            <a href="#" className="text-black font-black text-sm hover:text-primary transition-colors duration-300">Flights</a>
            <a href="#" className="text-black font-black text-sm hover:text-primary transition-colors duration-300">Bookings</a>
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-black font-semibold text-sm hover:text-primary transition-colors">Login</button>
            <button className="px-6 py-2 bg-black text-white font-black text-sm rounded-lg hover:bg-gray-800 transition-colors duration-300 hover:scale-105">
              Sign Up
            </button>
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-black">
              <span className="text-black font-bold text-sm">EN</span>
              <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 text-black hover:bg-gray-300 rounded transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 border-t border-black/20 mt-2 pt-6 space-y-4">
            <a href="#" className="block py-2 text-black font-black text-sm hover:text-primary">Destinations</a>
            <a href="#" className="block py-2 text-black font-black text-sm hover:text-primary">Hotels</a>
            <a href="#" className="block py-2 text-black font-black text-sm hover:text-primary">Flights</a>
            <a href="#" className="block py-2 text-black font-black text-sm hover:text-primary">Bookings</a>
            <div className="flex space-x-3 mt-6 pt-4 border-t border-black/20">
              <button className="text-black font-bold text-sm flex-1">Login</button>
              <button className="px-4 py-2 bg-black text-white font-black text-sm flex-1 rounded hover:bg-gray-800 transition-colors">Sign Up</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
