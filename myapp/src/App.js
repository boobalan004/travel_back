import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import HotelsPage from './pages/HotelsPage';
import FlightsPage from './pages/FlightsPage';
import BookingsPage from './pages/BookingsPage';
import MyBookingsPage from './pages/MyBookingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';

function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <div className="font-poppins bg-gray-50 min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<ProtectedRoute element={<DestinationsPage />} />} />
          <Route path="/hotels" element={<ProtectedRoute element={<HotelsPage />} />} />
          <Route path="/flights" element={<ProtectedRoute element={<FlightsPage />} />} />
          <Route path="/bookings" element={<ProtectedRoute element={<MyBookingsPage />} />} />
          <Route path="/booking-confirmation" element={<BookingConfirmationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
