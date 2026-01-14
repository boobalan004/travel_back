const express = require('express');
const router = express.Router();

// Mock flights data
const flights = [
  {
    id: 1,
    airline: 'SkyAir Airlines',
    departure: 'New York (JFK)',
    arrival: 'Paris (CDG)',
    departureTime: '10:30 AM',
    arrivalTime: '10:45 PM',
    duration: '7h 15m',
    price: '₹45,650',
    seats: 45,
    currency: 'INR'
  },
  {
    id: 2,
    airline: 'Global Airways',
    departure: 'New York (JFK)',
    arrival: 'Tokyo (NRT)',
    departureTime: '2:00 PM',
    arrivalTime: '4:30 PM (Next Day)',
    duration: '14h 30m',
    price: '₹56,440',
    seats: 32,
    currency: 'INR'
  },
  {
    id: 3,
    airline: 'Premium Flights',
    departure: 'Dubai (DXB)',
    arrival: 'Paris (CDG)',
    departureTime: '11:00 AM',
    arrivalTime: '3:30 PM',
    duration: '6h 30m',
    price: '₹34,860',
    seats: 60,
    currency: 'INR'
  },
  {
    id: 4,
    airline: 'Express Travel',
    departure: 'Sydney (SYD)',
    arrival: 'Dubai (DXB)',
    departureTime: '6:00 PM',
    arrivalTime: '1:15 AM (Next Day)',
    duration: '14h 15m',
    price: '₹48,140',
    seats: 28,
    currency: 'INR'
  }
];

// GET all flights
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: flights.length,
    data: flights
  });
});

// GET flights by route
router.get('/search/:departure/:arrival', (req, res) => {
  const { departure, arrival } = req.params;
  const filteredFlights = flights.filter(f => 
    f.departure.toLowerCase().includes(departure.toLowerCase()) &&
    f.arrival.toLowerCase().includes(arrival.toLowerCase())
  );
  
  res.status(200).json({
    success: true,
    route: `${departure} to ${arrival}`,
    count: filteredFlights.length,
    data: filteredFlights
  });
});

// GET flight by ID
router.get('/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  
  res.status(200).json({
    success: true,
    data: flight
  });
});

// POST book a flight (test endpoint)
router.post('/book/:id', (req, res) => {
  const flight = flights.find(f => f.id === parseInt(req.params.id));
  
  if (!flight) {
    return res.status(404).json({ error: 'Flight not found' });
  }
  
  res.status(201).json({
    success: true,
    message: 'Flight booking request received',
    bookingId: `BK${Date.now()}`,
    flightId: req.params.id,
    flightDetails: flight,
    status: 'Pending Confirmation'
  });
});

module.exports = router;
