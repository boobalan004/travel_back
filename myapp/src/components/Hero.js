import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 md:pt-36 md:pb-48">
      {/* Premium Background Design - ONLY for Hero */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50"></div>
      
      {/* Soft Abstract Pattern - Premium Feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl -z-0 animate-pulse"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-200/12 rounded-full blur-3xl -z-0" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-purple-200/10 rounded-full blur-3xl -z-0" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left - Text Content (8 cols on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            <p className="text-primary font-black text-xs md:text-sm tracking-widest uppercase animate-fade-in-down">
              Best Destinations Around the World
            </p>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-[#000000] leading-tight tracking-tight animate-fade-in-up drop-shadow-lg" style={{ animationDelay: '0.1s' }}>
              Travel, <span className="italic text-primary">enjoy</span> and<br />
              live a <span className="italic text-primary">new and full</span> life
            </h1>
            
            <p className="text-lg md:text-xl text-[#4b5563] leading-relaxed max-w-lg font-semibold animate-fade-in-up drop-shadow-sm" style={{ animationDelay: '0.2s' }}>
              Built Wicket longer admire do barton vanity itself do in it. Preferred to sportsmen it engrossed listening.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 pt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <button className="px-10 py-4 bg-white text-black font-black text-sm rounded-full shadow-2xl hover:shadow-3xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 border-3 border-black drop-shadow-xl active:scale-95">
                Find out more
              </button>
              <button className="px-10 py-4 bg-primary hover:bg-orange-600 text-white font-black text-sm rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 group drop-shadow-xl border-2 border-orange-600 active:scale-95">
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" fill="white"/>
                </svg>
                Watch Demo
              </button>
            </div>
          </div>

          {/* Right - Hero Image (4 cols on desktop, visually dominant) */}
          <div className="lg:col-span-7 relative w-full h-auto flex items-center justify-center animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
            {/* Premium Image Container */}
            <div className="relative w-full max-w-4xl">
              {/* Decorative backdrop for premium feel */}
              <div className="absolute -inset-6 bg-gradient-to-br from-primary/10 to-orange-400/5 rounded-3xl blur-xl opacity-50"></div>
              
              <img
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1000&q=85"
                alt="Travel essentials - Camera, map, backpack, field notes"
                className="relative w-full h-auto rounded-3xl shadow-2xl hover:shadow-3xl object-cover transition-all duration-300 hover:scale-105 border-2 border-white/50"
              />
              
              {/* Premium shine effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
