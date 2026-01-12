import React from 'react';
import ServiceCard from './ServiceCard';

const Services = () => {
  const services = [
    {
      id: 1,
      title: 'Calculated Weather',
      description: 'Built Wicket longer admire do barton vanity itself do in it.',
      icon: 'cloud',
    },
    {
      id: 2,
      title: 'Best Flights',
      description: 'Engrossed listening. Park gate sell they west hard for the.',
      icon: 'plane',
    },
    {
      id: 3,
      title: 'Local Events',
      description: 'Barton vanity itself do in it. Preferred to sportsmen it engrossed.',
      icon: 'event',
    },
    {
      id: 4,
      title: 'Customization',
      description: 'Do in it. Preferred to sportsmen it engrossed listening. Park gate sell.',
      icon: 'settings',
    },
  ];

  return (
    <section className="bg-gradient-to-b from-white via-[#F8FAFF] to-white py-24 md:py-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-20 space-y-6">
          <p className="text-primary font-semibold text-xs md:text-sm tracking-widest uppercase">
            Our Services
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark">
            We Offer Best Services
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-orange-500 mx-auto rounded-full"></div>
          <p className="text-gray text-base md:text-lg max-w-2xl mx-auto">
            Discover our comprehensive suite of travel services designed to make your journey unforgettable
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
