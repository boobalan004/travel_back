import React from 'react';

const BookTrip = () => {
  const steps = [
    {
      id: 1,
      title: 'Choose Destination',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'map-pin',
      number: '01',
    },
    {
      id: 2,
      title: 'Make Payment',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'credit-card',
      number: '02',
    },
    {
      id: 3,
      title: 'Reach Airport',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      icon: 'plane',
      number: '03',
    },
  ];

  return (
<section className="py-20 md:py-32 bg-gradient-to-b from-gray-50 to-gray-200 relative overflow-hidden">


      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-blue-200/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold text-sm md:text-base tracking-wider mb-4">
            EASY AND FAST
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-dark mb-6">
            Book your next trip in 3 easy steps
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Steps */}
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex gap-6">
                {/* Step Number Circle */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </div>
                    {/* Connecting line */}
                    {idx < steps.length - 1 && (
                      <div className="absolute left-1/2 top-full w-1 h-12 bg-gradient-to-b from-primary to-transparent transform -translate-x-1/2"></div>
                    )}
                  </div>
                </div>

                {/* Step Content */}
                <div className="pt-2 flex-1">
                  <h3 className="text-2xl font-bold text-dark mb-2">{step.title}</h3>
                  <p className="text-gray text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Trip Card */}
          <div className="relative">
            {/* Trip Card */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              {/* Image Container */}
              <div className="relative h-64 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Mountain landscape */}
                  <path d="M0 150 L100 50 L200 120 L300 40 L400 150" fill="#60a5fa" opacity="0.3" />
                  <path d="M0 180 L80 100 L180 160 L280 80 L400 200" fill="#3b82f6" opacity="0.4" />
                  <circle cx="350" cy="50" r="30" fill="#fef3c7" opacity="0.8" />

                  {/* Airplane */}
                  <g transform="translate(200, 100)">
                    <rect x="-30" y="-5" width="60" height="10" rx="5" fill="white" />
                    <polygon points="0,-5 10,-15 10,-5" fill="white" />
                    <rect x="-35" y="-2" width="15" height="4" fill="white" />
                    <rect x="20" y="-2" width="15" height="4" fill="white" />
                  </g>
                </svg>

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>

              {/* Card Content */}
              <div className="p-8">
                <div className="mb-6">
                  <h4 className="text-xl font-bold text-dark mb-1">Bali, Indonesia</h4>
                  <p className="text-gray text-sm">8D 7N - 12 January 2024</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray">Trip Progress</span>
                    <span className="text-sm font-semibold text-primary">60%</span>
                  </div>
                  <div className="w-full bg-lightGray rounded-full h-3 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-orange-500 h-full rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                {/* People Count */}
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div>
                    <p className="text-sm text-gray mb-1">People Going</p>
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-10 h-10 rounded-full border-3 border-white flex items-center justify-center text-sm font-bold ${
                            i === 1
                              ? 'bg-blue-500 text-white'
                              : i === 2
                              ? 'bg-pink-500 text-white'
                              : i === 3
                              ? 'bg-purple-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {i <= 3 ? '👤'[0] : '+'}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="bg-primary text-white rounded-lg px-6 py-2 font-semibold hover:bg-orange-600 transition-all">
                    See Details
                  </button>
                </div>
              </div>
            </div>

            {/* Floating decorative card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs transform hover:scale-105 transition-all">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">⭐</span>
                <div>
                  <p className="font-bold text-dark text-sm">Amazing Place</p>
                  <p className="text-xs text-gray">2,500+ Reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookTrip;
