import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../components/Footer';
import API_BASE_URL from '../config/apiConfig';

function HotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      // Add cache-busting parameter to ensure fresh data
      const response = await axios.get(`${API_BASE_URL}/api/hotels`, {
        params: { t: new Date().getTime() }
      });
      console.log('🟢 [HOTELS] Fetched hotels:', response.data.data);
      setHotels(response.data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch hotels');
      console.error('❌ [HOTELS] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="px-4 md:px-20 py-12">
        <h1 className="text-5xl font-bold mb-8">Hotels & Accommodations</h1>
        
        {loading && <p className="text-center text-xl">Loading hotels...</p>}
        {error && <p className="text-center text-red-500 text-xl">{error}</p>}
        
        {!loading && !error && hotels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-gray-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-40 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V4z" stroke="white" strokeWidth="1.5" fill="none"/>
                    <path d="M7 8h10M7 12h10M7 16h10M3 8h2M3 12h2M3 16h2M19 8h2M19 12h2M19 16h2" stroke="white" strokeWidth="1.5"/>
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
                  <p className="text-gray-400 mb-4">{hotel.destination}</p>
                  <div className="mb-4">
                    <p className="text-gray-300 mb-2 font-semibold">Amenities:</p>
                    <div className="flex flex-wrap gap-2">
                      {hotel.amenities.map((amenity, index) => (
                        <span key={index} className="bg-gray-800 px-3 py-1 rounded text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-yellow-400">{hotel.rating}</span>
                    </div>
                    <span className="text-xl font-bold text-green-400">{hotel.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default HotelsPage;
