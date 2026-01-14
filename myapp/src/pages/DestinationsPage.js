import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import DestinationBookingModal from '../components/DestinationBookingModal';
import DestinationCard from '../components/DestinationCard';
import FilterBar from '../components/FilterBar';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import GenericToast from '../components/GenericToast';

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 2000]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    fetchDestinations();
  }, []);

  // Apply filters whenever any filter changes
  useEffect(() => {
    applyFilters();
  }, [destinations, searchTerm, selectedCountry, priceRange]);

  // Fallback popular destinations to ensure the page shows a minimum number
  const fallbackDestinations = [
    { id: 'f-paris', name: 'Paris', country: 'France', description: 'The City of Light and endless romance', price: '1399', image: '/paris.jpg', rating: 4.9, reviews: 4156 },
    { id: 'f-tokyo', name: 'Tokyo', country: 'Japan', description: 'Modern energy meets ancient tradition', price: '1599', image: '/tokyo.jpg', rating: 4.8, reviews: 2687 },
    { id: 'f-newyork', name: 'New York', country: 'United States', description: 'The city that never sleeps', price: '1299', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop', rating: 4.7, reviews: 3892 },
    { id: 'f-london', name: 'London', country: 'United Kingdom', description: 'Historic sights and modern culture', price: '1499', image: 'https://images.unsplash.com/photo-1505765051173-6f6b6f3d6b8b?w=800&h=600&fit=crop', rating: 4.8, reviews: 3021 },
    { id: 'f-sydney', name: 'Sydney', country: 'Australia', description: 'Beaches, harbors and sunny escapes', price: '1399', image: '/sydney.jpg', rating: 4.7, reviews: 2174 },
    { id: 'f-barcelona', name: 'Barcelona', country: 'Spain', description: "Gaudí architecture and Mediterranean beaches", price: '1199', image: '/barcelona.jpg', rating: 4.6, reviews: 1987 },
    { id: 'f-istanbul', name: 'Istanbul', country: 'Turkey', description: 'A crossroads of cultures with historic bazaars', price: '999', image: 'https://images.unsplash.com/photo-1543349682-5f6f4f8c1a3b?w=800&h=600&fit=crop', rating: 4.5, reviews: 1743 },
    { id: 'f-bangkok', name: 'Bangkok', country: 'Thailand', description: 'Vibrant street life and ornate temples', price: '899', image: 'https://images.unsplash.com/photo-1505765051173-6f6b6f3d6b8b?w=800&h=600&fit=crop', rating: 4.4, reviews: 2560 },
    { id: 'f-sanfran', name: 'San Francisco', country: 'United States', description: 'Iconic Golden Gate and rolling hills', price: '1599', image: 'https://images.unsplash.com/photo-1505765051173-6f6b6f3d6b8b?w=800&h=600&fit=crop', rating: 4.6, reviews: 2102 },
    { id: 'f-dubai', name: 'Dubai', country: 'United Arab Emirates', description: 'Luxury shopping and stunning desert views', price: '1299', image: 'https://images.unsplash.com/photo-1512453475868-bada1adc6f33?w=800&h=600&fit=crop', rating: 4.7, reviews: 3245 },
    { id: 'f-venice', name: 'Venice', country: 'Italy', description: 'Romantic canals and Renaissance architecture', price: '1349', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop', rating: 4.6, reviews: 2876 },
    { id: 'f-amsterdam', name: 'Amsterdam', country: 'Netherlands', description: 'Charming canals and world-class museums', price: '1199', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', rating: 4.7, reviews: 2654 },
    { id: 'f-singapore', name: 'Singapore', country: 'Singapore', description: 'Modern metropolis with lush gardens', price: '1449', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop', rating: 4.8, reviews: 2743 },
    { id: 'f-montreal', name: 'Montreal', country: 'Canada', description: 'French charm with North American energy', price: '999', image: 'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop', rating: 4.5, reviews: 1892 },
    { id: 'f-vienna', name: 'Vienna', country: 'Austria', description: 'Imperial palaces and classical music heritage', price: '1249', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=600&fit=crop', rating: 4.6, reviews: 2134 }
  ];

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/destinations');
      const fetched = response.data.data || [];

      // If backend returned fewer than 9 destinations, append non-duplicate fallbacks
      if (fetched.length < 9) {
        const existingNames = new Set(fetched.map(d => (d.name || '').toLowerCase()));
        const needed = 9 - fetched.length;
        const toAdd = fallbackDestinations.filter(d => !existingNames.has((d.name || '').toLowerCase())).slice(0, needed);
        setDestinations([...fetched, ...toAdd]);
      } else {
        setDestinations(fetched);
      }
      setError(null);
    } catch (err) {
      setError('Failed to fetch destinations. Please try again later.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = destinations;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dest =>
        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Country filter
    if (selectedCountry !== 'all') {
      filtered = filtered.filter(dest => dest.country === selectedCountry);
    }

    // Price filter
    const priceValue = parseInt(priceRange[1]) * 100; // Convert to cents for comparison
    filtered = filtered.filter(dest => {
      let price;
      // Handle both backend format (price_per_person as number) and fallback format (price as string)
      if (typeof dest.price_per_person === 'number') {
        price = dest.price_per_person;
      } else if (typeof dest.price === 'string') {
        price = parseInt(dest.price.replace(/\D/g, ''));
      } else {
        price = 0;
      }
      return price <= priceValue;
    });

    setFilteredDestinations(filtered);
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(destinations.map(d => d.country))];
    return countries.sort();
  };

  const handleDestinationClick = (destination) => {
    console.log('🔵 [DESTINATION] Book Now button clicked');
    console.log('🔵 [DESTINATION] Selected destination:', destination);
    console.log('🔵 [DESTINATION] User logged in:', isLoggedIn);
    
    if (!isLoggedIn) {
      console.warn('⚠️ [DESTINATION] User not logged in, showing alert');
      alert('Please log in to book a destination');
      return;
    }
    
    console.log('🟢 [DESTINATION] Setting selected destination and opening modal...');
    setSelectedDestination(destination);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header Section */}
      <div className="relative py-12 md:py-16 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-down">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-widest rounded-full mb-4">
              ✈️ Explore the World
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              Discover Amazing <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Destinations</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Explore breathtaking locations around the globe and book your next unforgettable adventure
            </p>
          </div>

          {/* Filter Bar */}
          {!loading && destinations.length > 0 && (
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={getUniqueCountries()}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              resultsCount={filteredDestinations.length}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <SkeletonLoader key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-1">Something went wrong</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && !error && (
          <>
            {filteredDestinations.length > 0 ? (
              <div className="animate-fade-in-up">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {filteredDestinations.length} {filteredDestinations.length === 1 ? 'Destination' : 'Destinations'} Found
                  </h2>
                  <p className="text-gray-600 mt-2">Select a destination to start your journey</p>
                </div>
                
                {/* Special NYC Section removed per request */}

                {/* Special Dubai Section */}
                {filteredDestinations.some(d => d.name === 'Dubai') && (
                  <div className="mb-12 p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="lg:col-span-2">
                        <h3 className="text-3xl font-bold text-gray-900 mb-3">Dubai</h3>
                        <p className="text-gray-600 text-lg mb-4">Luxury desert oasis with world-class experiences</p>
                        <p className="text-gray-500 mb-6">Experience the perfect blend of modernity and Arabian heritage. From stunning skyscrapers to pristine beaches, enjoy luxury shopping, desert adventures, and unforgettable dining experiences.</p>
                        <ul className="space-y-2 text-gray-700">
                          <li>✓ Burj Khalifa & iconic skyline</li>
                          <li>✓ Desert safari adventures</li>
                          <li>✓ Luxury shopping malls</li>
                          <li>✓ Arabian heritage experiences</li>
                        </ul>
                      </div>
                      <div className="lg:col-span-1">
                        <img 
                          src="https://images.unsplash.com/photo-1518684913975-61bd4e6c6c37?w=500&h=600&fit=crop" 
                          alt="Dubai Skyline" 
                          className="w-full h-80 object-cover rounded-xl shadow-lg"
                        />
                        <p className="text-center text-sm text-gray-500 mt-3">Dubai Skyline</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Special Venice Section - Canal Highlight */}
                {filteredDestinations.some(d => d.name === 'Venice') && (
                  <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg border border-blue-100">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="lg:col-span-1">
                        <img 
                          src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&h=600&fit=crop" 
                          alt="Venice Canals" 
                          className="w-full h-80 object-cover rounded-xl shadow-lg"
                        />
                        <p className="text-center text-sm text-gray-600 mt-3">Romantic Canal City</p>
                      </div>
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-4xl">🚤</span>
                          <h3 className="text-3xl font-bold text-gray-900">Venice</h3>
                        </div>
                        <p className="text-blue-600 font-semibold text-lg mb-4">The City of Canals & Waterways</p>
                        <p className="text-gray-600 mb-6">Discover the enchanting beauty of Venice with its intricate network of romantic canals, historic bridges, and Renaissance architecture. Navigate through waterways by gondola and experience centuries of Venetian heritage.</p>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-gray-900">🚤 Grand Canal Tours</p>
                            <p className="text-xs text-gray-600 mt-1">Experience iconic waterway routes</p>
                          </div>
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-gray-900">🏛️ Historic Palaces</p>
                            <p className="text-xs text-gray-600 mt-1">Renaissance architecture & art galleries</p>
                          </div>
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-gray-900">🌉 Iconic Bridges</p>
                            <p className="text-xs text-gray-600 mt-1">Rialto & other historic crossings</p>
                          </div>
                          <div className="bg-white bg-opacity-60 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm font-semibold text-gray-900">🎭 Cultural Events</p>
                            <p className="text-xs text-gray-600 mt-1">Carnival & festivals year-round</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredDestinations.map((destination, index) => (
                    <div
                      key={destination.id}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <DestinationCard
                        destination={destination}
                        isLoggedIn={isLoggedIn}
                        onBookClick={() => handleDestinationClick(destination)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                searchTerm={searchTerm}
                selectedCountry={selectedCountry}
                onReset={() => {
                  setSearchTerm('');
                  setSelectedCountry('all');
                  setPriceRange([0, 2000]);
                }}
              />
            )}
          </>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDestination && (
        <DestinationBookingModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onSuccess={() => {
            setShowSuccessToast(true);
            setSelectedDestination(null);
          }}
        />
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <GenericToast
          message="Booking saved successfully! Check your bookings page."
          type="success"
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default DestinationsPage;
