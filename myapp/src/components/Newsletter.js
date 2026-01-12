import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Curved Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500"></div>

      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/3 right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>

      {/* Wavy decoration */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 md:h-40"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        fill="blue"
      >
        <path d="M0,50 Q300,0 600,50 T1200,50 L1200,120 L0,120 Z"></path>
      </svg>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Content */}
        <div className="text-center">
          <div className="space-y-6 mb-8">
            <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold backdrop-blur">
              Stay Updated
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">Subscribe to Our Newsletter</h2>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              Get exclusive travel tips, destination guides, and special offers delivered directly to your inbox. Join thousands of travelers today!
            </p>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl mx-0">
            <div className="flex-1 relative group">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
              </svg>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-lg text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg hover:shadow-xl transition-all"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-gray-100 text-primary font-bold py-4 px-8 rounded-lg transition-all transform hover:scale-105 shadow-lg whitespace-nowrap flex items-center justify-center gap-2"
            >
              <span>Subscribe</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>

          {/* Success Message */}
          {submitted && (
            <div className="animate-fade-in-up mb-8">
              <div className="inline-block bg-white/20 backdrop-blur text-white font-semibold text-lg px-6 py-3 rounded-lg border border-white/30">
                <svg className="w-5 h-5 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Thank you! Check your email for exclusive offers.
              </div>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm pt-8 border-t border-white/20">
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No spam, unsubscribe anytime
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Your data is secure
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <svg className="w-5 h-5 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              50K+ subscribers
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
