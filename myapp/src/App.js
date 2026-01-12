import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import TopDestinations from './components/TopDestinations';
import BookTrip from './components/BookTrip';
import Partners from './components/Partners';
import Testimonials from './components/Testimonials';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

function App() {
  return (
    <div className="font-poppins bg-black">
      <Navbar />
      <Hero />
      <Services />
      <TopDestinations />
      <BookTrip />
      <Partners />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;
