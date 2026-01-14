const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  destinationId: {
    type: String,
    required: [true, 'Destination ID is required']
  },
  destinationName: {
    type: String,
    required: [true, 'Destination name is required']
  },
  country: {
    type: String,
    required: [true, 'Country is required']
  },
  // Travel Dates (optional for saved bookings)
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  // Travelers
  adults: {
    type: Number,
    default: 1,
    min: [1, 'At least 1 adult is required']
  },
  children: {
    type: Number,
    default: 0,
    min: [0, 'Children count cannot be negative']
  },
  totalTravelers: {
    type: Number,
    default: 0,
    min: [0, 'Total travelers cannot be negative']
  },
  // Destination Duration (for auto-calculating end date)
  duration: {
    type: Number,
    default: null
  },
  // Hotel Selection (optional)
  hotelName: {
    type: String,
    default: null
  },
  hotelPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  roomType: {
    type: String,
    default: null,
    enum: ['Single', 'Double', 'Suite', null]
  },
  // Flight Selection (optional)
  flightNumber: {
    type: String,
    default: null
  },
  flightPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  flightDuration: {
    type: String,
    default: null
  },
  departureTime: {
    type: String,
    default: null
  },
  arrivalTime: {
    type: String,
    default: null
  },
  // Pricing Breakdown
  pricePerPerson: {
    type: Number,
    required: [true, 'Price per person is required'],
    min: [0, 'Price cannot be negative']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Base price cannot be negative']
  },
  // Add-ons
  addOns: [
    {
      id: String,
      label: String,
      price: Number
    }
  ],
  addOnsTotal: {
    type: Number,
    default: 0,
    min: [0, 'Add-ons total cannot be negative']
  },
  // Total Amount
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  // Booking Status
  status: {
    type: String,
    enum: ['saved', 'pending', 'confirmed', 'cancelled'],
    default: 'saved',
    required: true
  },
  // Legacy bookingStatus field (for backward compatibility)
  bookingStatus: {
    type: String,
    enum: ['PENDING_PAYMENT', 'CONFIRMED', 'PAID', 'Cancelled'],
    default: 'PENDING_PAYMENT',
    required: false
  },
  // Payment Info
  paymentStatus: {
    type: String,
    enum: ['not_paid', 'pending', 'paid', 'failed', 'PENDING_PAYMENT', 'COMPLETED', 'FAILED'],
    default: 'not_paid'
  },
  // Legacy paymentStatus field (for backward compatibility)
  paymentStatusLegacy: {
    type: String,
    enum: ['PENDING_PAYMENT', 'COMPLETED', 'FAILED', 'not_paid', 'pending', 'paid', 'failed'],
    default: 'pending'
  },
  // Payment Method
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'netbanking'],
    default: 'card'
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
bookingSchema.index({ userId: 1, createdAt: -1 });
bookingSchema.index({ destinationId: 1, userId: 1 }); // For finding existing bookings
bookingSchema.index({ destinationName: 1, country: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ createdAt: -1 });

// Pre-save middleware to validate critical data based on status
bookingSchema.pre('save', function(next) {
  // Validate destination details - always required
  if (!this.destinationId || !this.destinationName || !this.country) {
    return next(new Error('Destination ID, name, and country are required'));
  }
  
  // For 'saved' status bookings - minimal validation
  if (this.status === 'saved') {
    // Saved bookings don't require dates, travelers, or pricing
    this.updatedAt = new Date();
    return next();
  }
  
  // For 'pending', 'confirmed' statuses - full validation
  if (this.status === 'pending' || this.status === 'confirmed') {
    // Validate dates
    if (!this.startDate || !this.endDate) {
      return next(new Error('Both start and end dates are required for booking'));
    }
    
    if (this.startDate >= this.endDate) {
      return next(new Error('End date must be after start date'));
    }
    
    // Validate travelers
    if (!Number.isInteger(this.adults) || this.adults < 1) {
      return next(new Error('At least 1 adult is required'));
    }
    
    if (!Number.isInteger(this.children) || this.children < 0) {
      return next(new Error('Children count cannot be negative'));
    }
    
    // Validate pricing
    if (this.pricePerPerson <= 0) {
      return next(new Error('Price per person must be greater than 0'));
    }
    
    if (this.basePrice <= 0) {
      return next(new Error('Base price must be greater than 0'));
    }
    
    if (this.totalAmount <= 0) {
      return next(new Error('Total amount must be greater than 0'));
    }
    
    // Validate pricing consistency
    if (this.totalAmount < this.basePrice) {
      return next(new Error('Total amount must be at least equal to base price'));
    }
  }
  
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
