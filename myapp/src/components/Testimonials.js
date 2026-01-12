import React, { useState } from 'react';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Travel Enthusiast',
      rating: 5,
      review: '"This platform made my travel planning so easy! The destinations are amazing and the prices are unbeatable. Highly recommend!"',
      initials: 'SJ',
      destination: 'Rome, Italy',
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Adventure Seeker',
      rating: 5,
      review: '"Best travel app I\'ve used. The customer service is exceptional and booking was seamless. Can\'t wait for my next trip!"',
      initials: 'MC',
      destination: 'Tokyo, Japan',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Wanderlust Blogger',
      rating: 5,
      review: '"Amazing experience from start to finish. The personalized recommendations helped me discover hidden gems!"',
      initials: 'ER',
      destination: 'Paris, France',
    },
    {
      id: 4,
      name: 'James Wilson',
      role: 'Business Traveler',
      rating: 5,
      review: '"Reliable, affordable, and user-friendly. This is my go-to platform for all my business trips."',
      initials: 'JW',
      destination: 'London, UK',
    },
  ];

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
  <section className="py-20 md:py-32 max-w-6xl mx-auto rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-40 h-40 bg-blue-200/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-purple-200/15 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm md:text-base tracking-wider mb-4">
            TESTIMONIALS
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            What people say about us
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto"></div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left - Current Testimonial */}
            <div className="flex flex-col justify-center">
              <div className="relative">
                {/* Glow background for active card */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300/25 via-purple-300/20 to-purple-400/20 rounded-3xl blur-3xl opacity-80 animate-pulse"></div>
                
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 relative border border-white transition-all duration-500 ease-out hover:shadow-3xl">
                  {/* Quote Icon */}
                  <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white transition-all duration-500 hover:scale-110">
                    <span className="text-3xl">💬</span>
                  </div>

                  {/* Review Text */}
                  <p className="text-xl md:text-2xl font-serif italic text-dark mb-8 mt-4 leading-relaxed font-medium">
                    {testimonials[activeIndex].review}
                  </p>

                  {/* Stars */}
                  <div className="flex gap-2 mb-8">
                    {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 text-yellow-400 drop-shadow-md transition-all duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* User Info */}
                  <div className="border-t-2 border-gray-200 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-2 border-white transition-all duration-300">
                        {testimonials[activeIndex].initials}
                      </div>
                      <div>
                        <p className="font-black text-dark text-lg">{testimonials[activeIndex].name}</p>
                        <p className="text-sm text-gray font-semibold">{testimonials[activeIndex].role}</p>
                        <p className="text-xs text-primary font-bold tracking-wide">{testimonials[activeIndex].destination}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Other Testimonials Grid */}
            <div className="grid grid-cols-1 gap-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  onClick={() => setActiveIndex(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-500 ease-out transform ${
                    index === activeIndex
                      ? 'bg-white text-dark shadow-2xl scale-105 border-2 border-white ring-4 ring-blue-300/50'
                      : 'bg-white/50 hover:bg-white/70 text-gray opacity-75 hover:opacity-90 border-2 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`text-3xl flex-shrink-0 transition-all duration-300 ${index === activeIndex ? 'scale-110' : 'scale-100'}`}>
                      {testimonial.initials && (
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${index === activeIndex ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg' : 'bg-slate-200 text-dark'}`}>
                          {testimonial.initials}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-base transition-all duration-300 ${index === activeIndex ? 'text-dark drop-shadow-sm' : 'text-gray'}`}>
                        {testimonial.name}
                      </p>
                      <p className={`text-sm transition-all duration-300 font-medium ${index === activeIndex ? 'text-dark' : 'text-gray-500'}`}>
                        {testimonial.destination}
                      </p>
                      <div className="flex gap-1.5 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 transition-all duration-300 ${index === activeIndex ? 'text-yellow-400 drop-shadow-sm scale-110' : 'text-yellow-300 scale-100'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-12">
            <button
              onClick={prevSlide}
              className="w-12 h-12 rounded-full bg-slate-200/50 hover:bg-blue-500 text-slate-600 hover:text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
