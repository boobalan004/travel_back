import React, { useState, useEffect } from "react";

// Default featured destinations (used when user has not added custom cities)
const defaultDestinations = [
  {
    id: 1,
    name: "Paris",
    country: "France",
    description: "The City of Light and endless romance",
    rating: 4.9,
    reviews: 4156,
    price: "99600",
    image: "/paris.jpg",
    currency: "INR"
  },
  {
    id: 2,
    name: "Rome",
    country: "Italy",
    description: "Ancient history and timeless romance",
    rating: 4.8,
    reviews: 2415,
    price: "91300",
    image: "/rome.jpg",
    currency: "INR"
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    description: "Modern energy meets ancient tradition",
    rating: 4.8,
    reviews: 2687,
    price: "124500",
    image: "/tokyo.jpg",
    currency: "INR"
  },
  {
    id: 4,
    name: "New York",
    country: "United States",
    description: "The city that never sleeps",
    rating: 4.7,
    reviews: 3892,
    price: "74700",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 6,
    name: "Sydney",
    country: "Australia",
    description: "Beaches, harbors and sunny escapes",
    rating: 4.7,
    reviews: 2174,
    price: "107900",
    image: "/sydney.jpg",
    currency: "INR"
  }
  ,
  {
    id: 11,
    name: "Berlin",
    country: "Germany",
    description: "History, nightlife, and creative energy",
    rating: 4.5,
    reviews: 1320,
    price: "70550",
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 12,
    name: "Los Angeles",
    country: "United States",
    description: "Beaches, film industry and sunny vibes",
    rating: 4.4,
    reviews: 2890,
    price: "78850",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 14,
    name: "Venice",
    country: "Italy",
    description: "Romantic canals and Renaissance architecture",
    rating: 4.6,
    reviews: 2876,
    price: "87150",
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 15,
    name: "Amsterdam",
    country: "Netherlands",
    description: "Charming canals and world-class museums",
    rating: 4.7,
    reviews: 2654,
    price: "74700",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 16,
    name: "Singapore",
    country: "Singapore",
    description: "Modern metropolis with lush gardens",
    rating: 4.8,
    reviews: 2743,
    price: "91300",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
    currency: "INR"
  },
  {
    id: 17,
    name: "Montreal",
    country: "Canada",
    description: "French charm with North American energy",
    rating: 4.5,
    reviews: 1892,
    price: "82900",
    image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=800&h=600&fit=crop",
    currency: "INR"
  },
];

/**
 * DestinationCard Component
 * Enterprise-grade reusable card for destination booking UI.
 * 
 * Props:
 *   - destination: Object with { id, name, country, description, rating, reviews, price, image }
 * 
 * Features:
 *   - Fixed 16:9 aspect ratio with zero layout shift
 *   - Graceful image fallback without icons or emojis
 *   - Professional typography hierarchy with proper font weights
 *   - Accessible button with focus/active states
 *   - Premium hover elevation with smooth transitions
 *   - Mobile-first responsive design
 *   - Full width CTA button with proper accessibility
 */
const DestinationCard = ({ destination }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => setImageLoaded(true);
  const handleImageError = () => setImageError(true);

  // Format price with proper thousand separators
  const formattedPrice = (price) => {
    const numPrice = parseInt(price);
    return isNaN(numPrice) ? "0" : numPrice.toLocaleString("en-US");
  };

  // Format review count with thousand separators
  const formattedReviews = destination.reviews.toLocaleString("en-US");

  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col h-full shadow-md hover:shadow-2xl transition-all duration-200 hover:-translate-y-2 border border-gray-100 hover:border-gray-200">
      
      {/* IMAGE CONTAINER - Fixed 16:9 aspect ratio, zero layout shift */}
      <div className="w-full aspect-video bg-gray-100 overflow-hidden flex-shrink-0 relative group">
        {!imageError && destination.image ? (
          <img
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        ) : (
          /* Stylish animated placeholder with custom SVG illustration */
          <div className="w-full h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center relative overflow-hidden">
            {/* Decorative floating circles */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-blue-100 rounded-full opacity-30 placeholder-circle-1"></div>
            <div className="absolute bottom-6 left-6 w-24 h-24 bg-purple-100 rounded-full opacity-20 placeholder-circle-2"></div>
            
            {/* Custom SVG for destination - Sydney Opera House style */}
            {destination.id === 6 ? (
              <svg className="w-32 h-32 placeholder-animated" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Water waves */}
                <path d="M20 140 Q50 130 80 140 T140 140 T200 140" stroke="#3B82F6" strokeWidth="3" opacity="0.6"/>
                <path d="M10 155 Q45 145 80 155 T160 155 T200 155" stroke="#2563EB" strokeWidth="2" opacity="0.5"/>
                
                {/* Opera house shells */}
                <path d="M60 120 Q75 80 90 120" stroke="#60A5FA" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M90 120 Q105 80 120 120" stroke="#3B82F6" strokeWidth="4" fill="none" strokeLinecap="round"/>
                <path d="M120 120 Q135 80 150 120" stroke="#2563EB" strokeWidth="4" fill="none" strokeLinecap="round"/>
                
                {/* Bridge line */}
                <line x1="30" y1="100" x2="170" y2="100" stroke="#93C5FD" strokeWidth="2" opacity="0.7"/>
              </svg>
            ) : destination.id === 7 ? (
              /* Sagrada Familia style for Barcelona */
              <svg className="w-32 h-32 placeholder-animated" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Main tower */}
                <rect x="85" y="40" width="30" height="100" stroke="#7C3AED" strokeWidth="3" fill="none"/>
                
                {/* Spires */}
                <polygon points="100,30 95,50 105,50" fill="#7C3AED" opacity="0.8"/>
                <polygon points="75,70 70,90 80,90" fill="#A78BFA" opacity="0.7"/>
                <polygon points="125,70 120,90 130,90" fill="#A78BFA" opacity="0.7"/>
                
                {/* Geometric patterns */}
                <circle cx="100" cy="60" r="12" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                <circle cx="100" cy="90" r="12" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                <circle cx="100" cy="120" r="12" stroke="#8B5CF6" strokeWidth="2" fill="none"/>
                
                {/* Arches */}
                <path d="M70 140 Q100 130 130 140" stroke="#A78BFA" strokeWidth="2" fill="none" opacity="0.8"/>
              </svg>
            ) : (
              /* Default icon */
              <div className="relative z-10 text-center placeholder-animated">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center placeholder-icon">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-600 placeholder-text">Image Gallery</p>
              </div>
            )}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200"></div>
      </div>

      {/* CONTENT SECTION - Premium typography system */}
      <div className="flex-1 p-6 sm:p-7 flex flex-col justify-between">
        
        {/* Header: City Name + Country */}
        <div className="mb-4">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-tight mb-1">
            {destination.name}
          </h3>
          <p className="text-sm font-normal text-gray-600">
            {destination.country}
          </p>
        </div>

        {/* Description - Multiline, muted */}
        <p className="text-sm leading-relaxed text-gray-700 mb-6 line-clamp-2">
          {destination.description}
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-5" />

        {/* Rating - Plain text, no emoji */}
        <div className="mb-6">
          <p className="text-sm font-normal text-gray-700">
            <span className="font-semibold text-gray-900">Rating:</span> {destination.rating}
            <span className="text-gray-600 ml-2">
              ({formattedReviews} reviews)
            </span>
          </p>
        </div>

        {/* Price - Always numeric, properly formatted */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide letter-spacing mb-2">
            Price per person
          </p>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-semibold text-gray-600">INR</span>
            <p className="text-3xl sm:text-4xl font-bold text-green-600">
              ₹{formattedPrice(destination.price)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopDestinations = () => {
  const [destinations, setDestinations] = useState(() => {
    try {
      // Clear old localStorage data to force reset to defaultDestinations
      localStorage.removeItem('topDestinations');
      return defaultDestinations;
    } catch (e) {
      return defaultDestinations;
    }
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', country: '', description: '', price: '0', image: '', rating: 4.5, reviews: 0 });

  useEffect(() => {
    try {
      localStorage.setItem('topDestinations', JSON.stringify(destinations));
    } catch (e) {
      // ignore
    }
  }, [destinations]);

  const addCity = (e) => {
    e.preventDefault();
    const newCity = { ...form, id: Date.now() };
    setDestinations(prev => [newCity, ...prev]);
    setForm({ name: '', country: '', description: '', price: '0', image: '', rating: 4.5, reviews: 0 });
    setShowForm(false);
  };

  const removeCity = (id) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  return (
    <section className="w-full py-20 md:py-28 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header - Premium minimal design */}
        <div className="flex items-start justify-between mb-14 md:mb-16 lg:mb-20">
          <div className="text-left">
            <p className="text-blue-600 font-bold text-xs sm:text-sm uppercase tracking-widest mb-4 letter-spacing">
              Top Destinations
            </p>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-5 sm:mb-6 leading-tight tracking-tight">
              Discover World-Class Destinations
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl leading-relaxed font-medium">
              Handpicked travel experiences with premium accommodations and unforgettable memories
            </p>
          </div>

          <div className="text-right">
            <button
              onClick={() => setShowForm(s => !s)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
            >
              {showForm ? 'Close' : 'Add Custom City'}
            </button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={addCity} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="City name (e.g. Paris)" className="p-3 border rounded" />
            <input required value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} placeholder="Country" className="p-3 border rounded" />
            <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Image URL (optional)" className="p-3 border rounded" />
            <input value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="Price (numbers only)" className="p-3 border rounded" />
            <input value={form.rating} onChange={e => setForm(f => ({ ...f, rating: parseFloat(e.target.value) }))} placeholder="Rating" type="number" step="0.1" min="0" max="5" className="p-3 border rounded" />
            <button type="submit" className="px-4 py-3 bg-green-600 text-white rounded">Add City</button>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" className="p-3 border rounded md:col-span-3" />
          </form>
        )}

        {/* Destinations Grid - Responsive 1→2→3-4 columns with consistent spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 md:gap-8 lg:gap-9">
          {destinations.map((destination) => (
            <div key={destination.id} className="relative">
              <DestinationCard destination={destination} />
              <button onClick={() => removeCity(destination.id)} title="Remove" className="absolute top-3 right-3 bg-white rounded-full p-1 shadow text-gray-500 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
