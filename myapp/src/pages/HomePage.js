import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import TopDestinations from '../components/TopDestinations';
import BookTrip from '../components/BookTrip';
import Partners from '../components/Partners';
import Testimonials from '../components/Testimonials';
import Newsletter from '../components/Newsletter';

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Services />
      <TopDestinations />
      <BookTrip />
      <Partners />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default HomePage;
