const express = require('express');
const router = express.Router();

// Destinations data with comprehensive booking details
const destinations = [
  {
    _id: '1',
    id: 1,
    name: 'Paris',
    country: 'France',
    description: 'The City of Light - Experience romance, art, and culture',
    image: 'paris.jpg',
    emoji: '🗼',
    attractions: 45,
    rating: 4.8,
    price: '₹99,600',
    price_per_person: 99600,
    currency: 'INR'
  },
  {
    _id: '2',
    id: 2,
    name: 'Rome',
    country: 'Italy',
    description: 'Ancient history and Renaissance charm combined',
    image: 'rome.jpg',
    emoji: '🏛️',
    attractions: 40,
    rating: 4.8,
    price: '₹91,300',
    price_per_person: 91300,
    currency: 'INR'
  },
  {
    _id: '3',
    id: 3,
    name: 'Tokyo',
    country: 'Japan',
    description: 'Modern metropolis blending tradition and innovation',
    image: 'tokyo.jpg',
    emoji: '🗾',
    attractions: 50,
    rating: 4.7,
    price: '₹124,500',
    price_per_person: 124500,
    currency: 'INR'
  },
  {
    _id: '4',
    id: 4,
    name: 'New York',
    country: 'USA',
    description: 'The city that never sleeps - Iconic landmarks and vibrant culture',
    image: 'newyork.jpg',
    emoji: '🗽',
    attractions: 55,
    rating: 4.6,
    price: '₹74,700',
    price_per_person: 74700,
    currency: 'INR'
  },
  {
    _id: '5',
    id: 5,
    name: 'Sydney',
    country: 'Australia',
    description: 'Stunning harbour views and pristine beaches',
    image: 'sydney.jpg',
    emoji: '🦘',
    attractions: 35,
    rating: 4.7,
    price: '₹107,900',
    price_per_person: 107900,
    currency: 'INR'
  },
  {
    _id: '6',
    id: 6,
    name: 'Los Angeles',
    country: 'USA',
    description: 'Entertainment capital with beaches and mountains',
    image: 'losangeles.jpg',
    emoji: '🌞',
    attractions: 42,
    rating: 4.5,
    price: '₹78,850',
    price_per_person: 78850,
    currency: 'INR'
  },
  {
    _id: '7',
    id: 7,
    name: 'Berlin',
    country: 'Germany',
    description: 'Rich history, vibrant culture, and modern innovation',
    image: 'berlin.jpg',
    emoji: '🕌',
    attractions: 38,
    rating: 4.6,
    price: '₹70,550',
    price_per_person: 70550,
    currency: 'INR'
  },
  {
    _id: '8',
    id: 8,
    name: 'Venice',
    country: 'Italy',
    description: 'Romantic canals and historic architecture',
    image: 'venice.jpg',
    emoji: '🚤',
    attractions: 30,
    rating: 4.7,
    price: '₹87,150',
    price_per_person: 87150,
    currency: 'INR'
  },
  {
    _id: '9',
    id: 9,
    name: 'Amsterdam',
    country: 'Netherlands',
    description: 'Charming canals, bicycles, and cultural treasures',
    image: 'amsterdam.jpg',
    emoji: '🚲',
    attractions: 35,
    rating: 4.6,
    price: '₹74,700',
    price_per_person: 74700,
    currency: 'INR'
  },
  {
    _id: '10',
    id: 10,
    name: 'Singapore',
    country: 'Singapore',
    description: 'Modern city-state with futuristic architecture and gardens',
    image: 'singapore.jpg',
    emoji: '🌃',
    attractions: 28,
    rating: 4.7,
    price: '₹91,300',
    price_per_person: 91300,
    currency: 'INR'
  }
];

// GET all destinations
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: destinations.length,
    data: destinations
  });
});

// GET single destination by ID
router.get('/:id', (req, res) => {
  const destination = destinations.find(d => d.id === parseInt(req.params.id));
  
  if (!destination) {
    return res.status(404).json({ error: 'Destination not found' });
  }
  
  res.status(200).json({
    success: true,
    data: destination
  });
});

module.exports = router;
