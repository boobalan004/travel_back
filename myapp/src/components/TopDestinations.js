import React from "react";

const destinations = [
  {
    id: 1,
    name: "Rome, Italy",
    price: "$5,42k",
    duration: "10 Days Trip",
    gradient: "from-orange-400/80 to-orange-600/80",
    icon: "building",
    image:
      "https://images.unsplash.com/photo-1552832860-cfb67165eaf0?w=1200&q=80",
  },
  {
    id: 2,
    name: "London, UK",
    price: "$4,20k",
    duration: "08 Days Trip",
    gradient: "from-blue-400/80 to-blue-600/80",
    icon: "castle",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  },
  {
    id: 3,
    name: "Europe, Spain",
    price: "$6,80k",
    duration: "14 Days Trip",
    gradient: "from-red-400/80 to-red-600/80",
    icon: "utensils",
    image:
      "https://images.unsplash.com/photo-1562883676-8c5a99ccccd1?w=1200&q=80",
  },
  {
    id: 4,
    name: "Paris, France",
    price: "$5,90k",
    duration: "12 Days Trip",
    gradient: "from-pink-400/80 to-pink-600/80",
    icon: "tower",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  },
  {
    id: 5,
    name: "Tokyo, Japan",
    price: "$7,20k",
    duration: "15 Days Trip",
    gradient: "from-purple-400/80 to-purple-600/80",
    icon: "map",
    image:
      "https://images.unsplash.com/photo-1540959375944-7049f642e9b5?w=1200&q=80",
  },
  {
    id: 6,
    name: "Dubai, UAE",
    price: "$4,80k",
    duration: "09 Days Trip",
    gradient: "from-yellow-400/80 to-yellow-600/80",
    icon: "sun",
    image:
      "https://images.unsplash.com/photo-1512453492713-9c4bbb5d7935?w=1200&q=80",
  },
];

const TopDestinations = () => {
  return (
    <section className="py-20 md:py-32 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-primary font-black text-xs md:text-sm tracking-widest uppercase mb-3">
            Top Selling
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#000000] mb-6">
            Top Destinations
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((item) => (
            <div
              key={item.id}
              className="relative h-[320px] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl group transition-all duration-300 hover:scale-105"
            >
              {/* BACKGROUND IMAGE */}
              <img
                src={item.image}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition duration-500"
              />

              {/* COLOR OVERLAY */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
              />

              {/* DECORATIVE PATTERN */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px]" />

              {/* CONTENT */}
              <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">
                {/* Top - Icon */}
                <div className="text-4xl drop-shadow-lg">📍</div>

                {/* Bottom - Info & Button */}
                <div>
                  <h3 className="text-2xl font-black mb-2 drop-shadow-md">{item.name}</h3>
                  <p className="text-sm font-semibold opacity-95 mb-6 drop-shadow-md">{item.duration}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black drop-shadow-md">{item.price}</span>
                    <button className="w-12 h-12 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-md hover:bg-white/50 transition-all transform hover:scale-110 group-hover:translate-x-1">
                      <svg className="w-6 h-6 text-white font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
