import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const languages = ["English", "Hindi", "Kannada", "Malayalam", "Tamil", "Telugu"];
  
  // User avatar initials
  const getUserInitials = () => {
    if (!user || !user.name) return '?';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved) setSelectedLang(saved);
    
    // Listen for storage changes to sync login state across tabs
    const handleStorageChange = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom login event from LoginPage/RegisterPage
    const handleUserLoggedIn = () => {
      setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    };
    window.addEventListener('userLoggedIn', handleUserLoggedIn);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  const handleProtectedNavigation = (path) => {
    if (!user) {
      alert('Please login or register to continue');
      return;
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Navigation Bar - 56px (7rem * 8px grid) */}
        <div className="flex items-center justify-between h-14">
          
          {/* LEFT GROUP: Brand + User Identity */}
          <div className="flex items-center gap-8 min-w-0">
            {/* Brand Logo */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer hover:opacity-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg px-2 py-1.5 hover:bg-blue-50"
            >
              {/* Rohil Logo - Premium 3D Airplane Design */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    {/* Multi-layer Gradients */}
                    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="50%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    
                    <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#60a5fa" opacity="0.6"/>
                      <stop offset="100%" stopColor="#2563eb" opacity="0.2"/>
                    </radialGradient>
                    
                    <linearGradient id="planeHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ffffff" opacity="0.8"/>
                      <stop offset="50%" stopColor="#ffffff" opacity="0.4"/>
                      <stop offset="100%" stopColor="#0ea5e9" opacity="0.2"/>
                    </linearGradient>
                    
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3"/>
                    </filter>
                    
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Outer Glow Circle */}
                  <circle cx="60" cy="60" r="56" fill="url(#glowGradient)" opacity="0.4" filter="url(#glow)"/>
                  
                  {/* Main Background Circle */}
                  <circle cx="60" cy="60" r="54" fill="url(#mainGradient)" filter="url(#shadow)"/>
                  
                  {/* Inner Light Circle Border */}
                  <circle cx="60" cy="60" r="52" fill="none" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                  
                  {/* Decorative Accent Lines */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="white" strokeWidth="0.8" opacity="0.15"/>
                  <circle cx="60" cy="60" r="44" fill="none" stroke="white" strokeWidth="0.8" opacity="0.1"/>
                  
                  {/* Premium Airplane Design */}
                  <g filter="url(#shadow)">
                    {/* Fuselage (Main Body) */}
                    <path d="M 60 18 Q 62 35 62 50 Q 62 65 60 80 Q 58 65 58 50 Q 58 35 60 18 Z" fill="url(#planeHighlight)" stroke="#1e40af" strokeWidth="1.2" strokeLinejoin="round"/>
                    
                    {/* Left Wing - Gradient */}
                    <path d="M 25 52 Q 42 54 60 56 Q 62 58 60 60 Q 42 58 25 56 Z" 
                      fill="url(#planeHighlight)" stroke="#1e40af" strokeWidth="1.2" strokeLinejoin="round" opacity="0.95"/>
                    
                    {/* Right Wing - Gradient */}
                    <path d="M 95 52 Q 78 54 60 56 Q 58 58 60 60 Q 78 58 95 56 Z" 
                      fill="url(#planeHighlight)" stroke="#1e40af" strokeWidth="1.2" strokeLinejoin="round" opacity="0.95"/>
                    
                    {/* Tail Section - Upper */}
                    <path d="M 60 60 Q 62 72 60 82 Q 58 72 60 60 Z" fill="#0ea5e9" stroke="#1e40af" strokeWidth="1.2" strokeLinejoin="round"/>
                    
                    {/* Vertical Stabilizer */}
                    <path d="M 60 65 Q 64 72 62 82 Q 60 76 60 65 Z" fill="#1e40af" opacity="0.8" stroke="#0c4a8f" strokeWidth="0.8"/>
                    
                    {/* Cockpit - Premium Design */}
                    <ellipse cx="60" cy="28" rx="4.5" ry="5.5" fill="#1e40af" stroke="#0c4a8f" strokeWidth="1"/>
                    <ellipse cx="60" cy="27" rx="3" ry="3.5" fill="#60a5fa" opacity="0.9"/>
                    
                    {/* Landing Gear Details */}
                    <g opacity="0.6">
                      <line x1="54" y1="58" x2="52" y2="68" stroke="#1e40af" strokeWidth="1"/>
                      <line x1="66" y1="58" x2="68" y2="68" stroke="#1e40af" strokeWidth="1"/>
                      <circle cx="52" cy="70" r="2" fill="#1e40af"/>
                      <circle cx="68" cy="70" r="2" fill="#1e40af"/>
                    </g>
                  </g>
                  
                  {/* Dynamic Motion Lines */}
                  <g stroke="white" strokeWidth="1.5" opacity="0.35" strokeLinecap="round" strokeDasharray="2,2">
                    <line x1="8" y1="48" x2="20" y2="50" />
                    <line x1="10" y1="58" x2="22" y2="58" />
                    <line x1="8" y1="68" x2="20" y2="66" />
                    
                    <line x1="112" y1="48" x2="100" y2="50" />
                    <line x1="110" y1="58" x2="98" y2="58" />
                    <line x1="112" y1="68" x2="100" y2="66" />
                  </g>
                  
                  {/* Top Highlight Shine */}
                  <ellipse cx="50" cy="30" rx="8" ry="10" fill="white" opacity="0.15" filter="url(#glow)"/>
                  
                  {/* Outer Ring - Premium Touch */}
                  <circle cx="60" cy="60" r="56" fill="none" stroke="url(#mainGradient)" strokeWidth="0.5" opacity="0.5"/>
                </svg>
              </div>
              
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent tracking-tighter">Rohil</span>
            </button>
            
            {/* User Identity (Desktop only) - Shows name + avatar when logged in */}
            {user && (
              <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">{getUserInitials()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900 leading-none">{user.name}</span>
                  <span className="text-xs font-normal text-gray-500 mt-1">Traveler</span>
                </div>
              </div>
            )}
          </div>

          {/* CENTER GROUP: Navigation Tabs */}
          <div className="hidden md:flex items-center gap-8">
            <NavTabItem
              label="Destinations"
              path="/destinations"
              isActive={location.pathname === '/destinations'}
              onClick={() => handleProtectedNavigation('/destinations')}
              user={user}
            />
            <NavTabItem
              label="Hotels"
              path="/hotels"
              isActive={location.pathname === '/hotels'}
              onClick={() => handleProtectedNavigation('/hotels')}
              user={user}
            />
            <NavTabItem
              label="Flights"
              path="/flights"
              isActive={location.pathname === '/flights'}
              onClick={() => handleProtectedNavigation('/flights')}
              user={user}
            />
            <NavTabItem
              label="Bookings"
              path="/bookings"
              isActive={location.pathname === '/bookings'}
              onClick={() => handleProtectedNavigation('/bookings')}
              user={user}
            />
          </div>

          {/* RIGHT GROUP: Language + Logout/Auth + Avatar */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-md"
              >
                <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5.951-1.429 5.951 1.429a1 1 0 001.169-1.409l-7-14z"/>
                </svg>
                <span className="hidden sm:inline">{selectedLang}</span>
                <svg className="w-4 h-4 text-gray-400 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>

              {languageOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        localStorage.setItem("lang", lang);
                        setLanguageOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                        selectedLang === lang
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth Actions or User Avatar */}
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="py-4 px-2 space-y-2">
              <MobileNavItem
                label="Destinations"
                isActive={location.pathname === '/destinations'}
                onClick={() => { handleProtectedNavigation('/destinations'); setIsMenuOpen(false); }}
                user={user}
              />
              <MobileNavItem
                label="Hotels"
                isActive={location.pathname === '/hotels'}
                onClick={() => { handleProtectedNavigation('/hotels'); setIsMenuOpen(false); }}
                user={user}
              />
              <MobileNavItem
                label="Flights"
                isActive={location.pathname === '/flights'}
                onClick={() => { handleProtectedNavigation('/flights'); setIsMenuOpen(false); }}
                user={user}
              />
              <MobileNavItem
                label="Bookings"
                isActive={location.pathname === '/bookings'}
                onClick={() => { handleProtectedNavigation('/bookings'); setIsMenuOpen(false); }}
                user={user}
              />

              {/* Mobile Language Selector */}
              <div className="pt-4 border-t border-gray-200 mt-4">
                <div className="space-y-2">
                  {languages.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang);
                        localStorage.setItem("lang", lang);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${
                        selectedLang === lang
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Auth Actions */}
              {user ? (
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              ) : (
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <button
                    onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { navigate('/register'); setIsMenuOpen(false); }}
                    className="w-full text-left px-3 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

/* Professional Tab Component with underline indicator */
const NavTabItem = ({ label, path, isActive, onClick, user }) => {
  return (
    <button
      onClick={onClick}
      className={`relative px-1 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-sm ${
        isActive
          ? 'text-blue-600'
          : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {label}
      {/* Bottom border indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0'
      }`}/>
    </button>
  );
};

/* Mobile Navigation Item */
const MobileNavItem = ({ label, isActive, onClick, user }) => {
  return (
    <button
      onClick={onClick}
      className={`block w-full text-left px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );
};

export default Navbar;
