import React, { useState } from 'react';

const Partners = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const partners = [
    {
      id: 1,
      name: 'Axon',
      icon: 'plane',
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-purple-600',
      svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z',
    },
    {
      id: 2,
      name: 'Jetstar',
      icon: 'takeoff',
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-blue-600',
      svgPath: 'M21 16v-2h-3V9h-2v5h-4V9.852c-.751-.448-2.57-1.314-4-1.673V7h-2v1.703C6.187 7.77 4.281 6.802 3 5.973V19h2v-3h14v3h2V16z',
    },
    {
      id: 3,
      name: 'Expedia',
      icon: 'globe',
      color: 'text-yellow-600',
      bgColor: 'from-yellow-500 to-yellow-600',
      svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5h3V9h4v3h3l-5 5zm6-7h-1.5V9h1.5v1zm0 2h-1.5v-1h1.5v1z',
    },
    {
      id: 4,
      name: 'Qantas',
      icon: 'kangaroo',
      color: 'text-red-600',
      bgColor: 'from-red-500 to-red-600',
      svgPath: 'M13 2c-.55 0-1 .45-1 1v2c0 .55.45 1 1 1s1-.45 1-1V3c0-.55-.45-1-1-1zm-2 4c-.55 0-1 .45-1 1v1H8c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1V9h2c.55 0 1-.45 1-1s-.45-1-1-1h-2V7c0-.55-.45-1-1-1zm6 1c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z',
    },
    {
      id: 5,
      name: 'Alitalia',
      icon: 'italy',
      color: 'text-green-600',
      bgColor: 'from-green-500 to-green-600',
      svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl md:text-3xl font-bold text-dark mb-4">Our Partners</h3>
          <p className="text-gray text-sm md:text-base">Trusted by leading travel and airline companies</p>
        </div>

        {/* Partners Grid */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredId(partner.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div
                className={`
                  px-8 md:px-12 py-6 rounded-xl border-2 border-lightGray
                  transition-all duration-300 transform hover:scale-110
                  flex items-center justify-center
                  ${
                    hoveredId === partner.id
                      ? `bg-gradient-to-br ${partner.bgColor} text-white border-transparent shadow-lg`
                      : 'bg-lightGray border-transparent text-gray-400 group-hover:text-gray-500'
                  }
                `}
              >
                <svg 
                  className="w-12 h-12 md:w-16 md:h-16" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d={partner.svgPath} />
                </svg>
              </div>
              <p className="text-xs text-center mt-3 text-gray font-medium">{partner.name}</p>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">50+</p>
            <p className="text-sm text-gray mt-1">Travel Partners</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">100+</p>
            <p className="text-sm text-gray mt-1">Destinations</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">10M+</p>
            <p className="text-sm text-gray mt-1">Happy Travelers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">99%</p>
            <p className="text-sm text-gray mt-1">Satisfaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
