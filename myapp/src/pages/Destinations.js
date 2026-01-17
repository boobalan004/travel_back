import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/apiConfig';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/destinations`);
        if (!response.ok) throw new Error('Failed to fetch destinations');
        const data = await response.json();
        console.log('🟢 [DESTINATIONS] API Response:', data);
        
        // Handle both formats: direct array and {data: array}
        let destArray = [];
        if (Array.isArray(data)) {
          destArray = data;
        } else if (data && Array.isArray(data.data)) {
          destArray = data.data;
        }
        
        console.log('🟢 [DESTINATIONS] Processed array:', destArray);
        setDestinations(destArray);
        setLoading(false);
      } catch (err) {
        console.error('❌ [DESTINATIONS] Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) return <div className="text-white text-center py-20 text-2xl bg-gray-950 min-h-screen flex items-center justify-center">Loading destinations...</div>;
  if (error) return <div className="text-red-500 text-center py-20 text-2xl bg-gray-950 min-h-screen flex items-center justify-center">Error: {error}</div>;
  if (!destinations || destinations.length === 0) return <div className="text-yellow-400 text-center py-20 text-2xl bg-gray-950 min-h-screen flex items-center justify-center">No destinations available</div>;

  const getImageUrl = (destinationName) => {
    const nameMap = {
      'Paris': '/paris.jpg',
      'Rome': '/rome.jpg',
      'Tokyo': '/tokyo.jpg',
      'New York': '/newyork.jpg',
      'Sydney': '/sydney.jpg',
      'Los Angeles': '/losangeles.jpg',
      'Berlin': '/berlin.jpg',
      'Venice': '/venice.jpg',
      'Amsterdam': '/amsterdam.jpg',
      'Singapore': '/singapore.jpg'
    };
    return nameMap[destinationName] || '/default-destination.jpg';
  };

  return (
    <div className="min-h-screen bg-gray-950 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-5xl font-black mb-16 text-center">Top Destinations</h1>
        <p className="text-gray-400 text-center mb-12">Found {destinations.length} destinations</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform duration-300 shadow-lg flex flex-col h-full">
              <div 
                className="h-40 bg-cover bg-center relative flex items-center justify-center"
                style={{ backgroundImage: `url('${getImageUrl(destination.name)}')` }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <span className="text-5xl relative z-10">{destination.emoji}</span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-white text-lg font-black mb-1 text-center">{destination.name}</h3>
                  <p className="text-orange-500 text-xs font-semibold text-center mb-3">{destination.country}</p>
                  <p className="text-gray-400 text-xs text-center mb-4 line-clamp-2">{destination.description}</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-500 font-bold text-sm mb-2">{destination.attractions} Attractions</p>
                  <p className="text-green-400 font-bold text-lg mb-3">{destination.price}</p>
                  <button className="w-full px-3 py-2 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors">
                    Explore
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Destinations;
