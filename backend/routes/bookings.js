const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/authMiddleware');

// GET logged-in user's bookings (PROTECTED)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    
    const bookings = await Booking.find({ userId }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all bookings (admin/public endpoint - kept for compatibility)
router.get('/', async (req, res) => {
  try {
    let query = {};
    
    // If user is authenticated, only show their bookings
    if (req.query.userId) {
      query.userId = req.query.userId;
    }
    
    const bookings = await Booking.find(query).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new booking (PROTECTED)
router.post('/', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [BACKEND] New booking request received');
    console.log('🔵 [BACKEND] Request body:', JSON.stringify(req.body, null, 2));
    
    const userId = req.userId; // Extract from authenticated token
    console.log('🔵 [BACKEND] User ID from token:', userId);
    
    const {
      destinationId,
      destinationName,
      country,
      startDate,
      endDate,
      adults,
      children,
      pricePerPerson,
      basePrice,
      hotelName,
      hotelPrice,
      roomType,
      flightNumber,
      flightPrice,
      flightDuration,
      departureTime,
      arrivalTime,
      addOns,
      addOnsTotal,
      totalAmount,
      paymentMethod
    } = req.body;

    // ===== COMPREHENSIVE VALIDATION =====
    // 1. Destination Details
    console.log('🔵 [BOOKING] Validating destination details:', { destinationId, destinationName, country });
    if (!destinationId || !destinationName || !country) {
      console.error('❌ [BOOKING] Destination validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Destination details (ID, name, country) are required' 
      });
    }

    // 2. Travel Dates
    console.log('🔵 [BOOKING] Validating travel dates:', { startDate, endDate });
    if (!startDate || !endDate) {
      console.error('❌ [BOOKING] Travel dates validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Start date and end date are required' 
      });
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    if (startDateObj >= endDateObj) {
      console.error('❌ [BOOKING] Invalid date range');
      return res.status(400).json({ 
        success: false, 
        error: 'End date must be after start date' 
      });
    }

    // 3. Travelers
    console.log('🔵 [BOOKING] Validating travelers:', { adults, children });
    if (!Number.isInteger(adults) || adults < 1) {
      console.error('❌ [BOOKING] Adults validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'At least 1 adult is required' 
      });
    }

    if (!Number.isInteger(children) || children < 0) {
      console.error('❌ [BOOKING] Children validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Children count must be 0 or more' 
      });
    }

    // 4. Pricing Details
    console.log('🔵 [BOOKING] Validating pricing:', { pricePerPerson, basePrice, totalAmount });
    if (!pricePerPerson || pricePerPerson <= 0) {
      console.error('❌ [BOOKING] Price per person validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Valid price per person is required' 
      });
    }

    if (!basePrice || basePrice <= 0) {
      console.error('❌ [BOOKING] Base price validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Valid base price is required' 
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      console.error('❌ [BOOKING] Total amount validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Valid total amount is required' 
      });
    }
    
    console.log('🟢 [BOOKING] All validations passed, creating booking...');

    // ===== CREATE BOOKING =====
    const booking = new Booking({
      userId, // Securely extracted from JWT token
      destinationId,
      destinationName,
      country,
      startDate: startDateObj,
      endDate: endDateObj,
      adults,
      children,
      pricePerPerson,
      basePrice,
      
      // Hotel details (optional)
      ...(hotelName && { hotelName }),
      ...(hotelPrice && { hotelPrice }),
      ...(roomType && { roomType }),
      
      // Flight details (optional)
      ...(flightNumber && { flightNumber }),
      ...(flightPrice && { flightPrice }),
      ...(flightDuration && { flightDuration }),
      ...(departureTime && { departureTime }),
      ...(arrivalTime && { arrivalTime }),
      
      // Add-ons
      addOns: addOns || [],
      addOnsTotal: addOnsTotal || 0,
      totalAmount,
      bookingStatus: 'PENDING_PAYMENT',
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'PENDING_PAYMENT',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Validate booking data before saving
    const validationError = booking.validateSync();
    if (validationError) {
      const messages = Object.values(validationError.errors)
        .map(err => err.message)
        .join(', ');
      console.error('❌ [BOOKING] Model validation failed:', messages);
      return res.status(400).json({ 
        success: false, 
        error: `Validation failed: ${messages}` 
      });
    }

    console.log('🔵 [BOOKING] Saving booking to database...');
    await booking.save();

    console.log(`🟢 [BOOKING] Booking created successfully with ID: ${booking._id}`);
    console.log(`🟢 [BOOKING] Full booking data:`, JSON.stringify(booking, null, 2));

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [BOOKING] Unexpected error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create booking' 
    });
  }
});

// PUT update booking (PROTECTED - only owner can update)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = req.params.id;

    // Find booking and verify ownership
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'You are not authorized to update this booking' 
      });
    }

    // Update allowed fields only
    const allowedUpdates = ['bookingStatus'];
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });
    updates.updatedAt = new Date();

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to update booking' 
    });
  }
});

// DELETE booking (PROTECTED - only owner can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const bookingId = req.params.id;

    // Find booking and verify ownership
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    if (booking.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'You are not authorized to delete this booking' 
      });
    }

    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to delete booking' 
    });
  }
});

// POST process payment for a booking (PROTECTED)
router.post('/:id/payment', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [PAYMENT] Payment request received for booking:', req.params.id);
    
    const userId = req.userId;
    const bookingId = req.params.id;
    const { paymentMethod, cardData } = req.body;

    // Find booking and verify ownership
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      console.error('❌ [PAYMENT] Booking not found:', bookingId);
      return res.status(404).json({ 
        success: false, 
        error: 'Booking not found' 
      });
    }

    if (booking.userId.toString() !== userId) {
      console.error('❌ [PAYMENT] Unauthorized payment attempt');
      return res.status(403).json({ 
        success: false, 
        error: 'You are not authorized to pay for this booking' 
      });
    }

    if (booking.paymentStatus === 'COMPLETED') {
      console.error('❌ [PAYMENT] Booking already paid');
      return res.status(400).json({ 
        success: false, 
        error: 'This booking has already been paid' 
      });
    }

    console.log('🔵 [PAYMENT] Processing payment with method:', paymentMethod);
    
    // Validate payment method
    if (!paymentMethod || !['card', 'upi', 'netbanking'].includes(paymentMethod)) {
      console.error('❌ [PAYMENT] Invalid payment method');
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid payment method' 
      });
    }

    // In a real scenario, process payment with payment gateway (Stripe, Razorpay, etc.)
    // For now, we'll simulate successful payment
    console.log('🔵 [PAYMENT] Simulating payment processing...');
    
    // Update booking status to PAID
    booking.bookingStatus = 'PAID';
    booking.paymentStatus = 'COMPLETED';
    booking.paymentMethod = paymentMethod;
    booking.updatedAt = new Date();

    await booking.save();

    console.log(`🟢 [PAYMENT] Payment processed successfully for booking: ${bookingId}`);

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [PAYMENT] Unexpected error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to process payment' 
    });
  }
});

// POST save flight booking (PROTECTED)
router.post('/save-flight', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [FLIGHT_BOOKING] New flight booking request received');
    console.log('🔵 [FLIGHT_BOOKING] Request body:', JSON.stringify(req.body, null, 2));
    
    const userId = req.userId; // Extract from authenticated token
    console.log('🔵 [FLIGHT_BOOKING] User ID from token:', userId);
    
    const {
      flightId,
      airline,
      departure,
      arrival,
      departureTime,
      arrivalTime,
      duration,
      flightPrice,
      availableSeats,
      adults,
      children,
      bookingType
    } = req.body;

    // ===== COMPREHENSIVE VALIDATION =====
    console.log('🔵 [FLIGHT_BOOKING] Validating flight details...');
    
    if (!flightId || !airline || !departure || !arrival) {
      console.error('❌ [FLIGHT_BOOKING] Flight validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Flight ID, airline, departure, and arrival are required' 
      });
    }

    if (!flightPrice || flightPrice <= 0) {
      console.error('❌ [FLIGHT_BOOKING] Flight price validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Valid flight price is required' 
      });
    }

    if (!availableSeats || availableSeats < 1) {
      console.error('❌ [FLIGHT_BOOKING] Available seats validation failed');
      return res.status(400).json({ 
        success: false, 
        error: 'Available seats must be at least 1' 
      });
    }

    // Validate travelers
    const adultCount = parseInt(adults) || 1;
    const childCount = parseInt(children) || 0;

    if (adultCount < 1) {
      console.error('❌ [FLIGHT_BOOKING] At least 1 adult is required');
      return res.status(400).json({ 
        success: false, 
        error: 'At least 1 adult is required' 
      });
    }

    console.log('🟢 [FLIGHT_BOOKING] All validations passed, creating booking...');

    // Calculate total price based on number of travelers
    const totalTravelers = adultCount + childCount;
    const totalFlightPrice = Number(flightPrice) * totalTravelers;

    // ===== CREATE FLIGHT BOOKING =====
    const booking = new Booking({
      userId, // Securely extracted from JWT token
      // Use flight info as destination
      destinationId: `flight-${flightId}`,
      destinationName: `${departure} → ${arrival}`,
      country: 'International',
      
      // Use current date as travel dates (will be updated if needed)
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Next day
      
      // Travelers - from user selection
      adults: adultCount,
      children: childCount,
      
      // Flight details
      flightNumber: `FL-${flightId}`,
      flightPrice: Number(flightPrice),
      flightDuration: duration || null,
      departureTime: departureTime || null,
      arrivalTime: arrivalTime || null,
      
      // Pricing
      pricePerPerson: Number(flightPrice),
      basePrice: Number(flightPrice) * totalTravelers,
      
      // Add-ons
      addOns: [],
      addOnsTotal: 0,
      
      // Total Amount
      totalAmount: totalFlightPrice,
      
      // Booking Status
      bookingStatus: 'PENDING_PAYMENT',
      paymentMethod: 'card',
      paymentStatus: 'PENDING_PAYMENT',
      
      // Timestamps
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Validate booking data before saving
    const validationError = booking.validateSync();
    if (validationError) {
      const messages = Object.values(validationError.errors)
        .map(err => err.message)
        .join(', ');
      console.error('❌ [FLIGHT_BOOKING] Model validation failed:', messages);
      return res.status(400).json({ 
        success: false, 
        error: `Validation failed: ${messages}` 
      });
    }

    console.log('🔵 [FLIGHT_BOOKING] Saving flight booking to database...');
    await booking.save();

    console.log(`🟢 [FLIGHT_BOOKING] Flight booking created successfully with ID: ${booking._id}`);
    console.log(`🟢 [FLIGHT_BOOKING] Booking for ${totalTravelers} traveler(s): ${adultCount} adults, ${childCount} children`);
    console.log(`🟢 [FLIGHT_BOOKING] Total amount: ${totalFlightPrice}`);

    res.status(201).json({
      success: true,
      message: 'Flight booking saved successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [FLIGHT_BOOKING] Unexpected error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to save flight booking' 
    });
  }
});

// ========== NEW ENDPOINTS FOR DESTINATION CARD ACTIONS ==========

// POST /api/bookings/save - Save a destination
router.post('/save', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [SAVE_BOOKING] Save request received');
    const userId = req.userId;
    const { destinationId, destinationName, country } = req.body;

    // Validate required fields
    if (!destinationId || !destinationName || !country) {
      return res.status(400).json({
        success: false,
        error: 'Destination ID, name, and country are required'
      });
    }

    // Check if already saved by this user
    const existingBooking = await Booking.findOne({
      userId,
      destinationId,
      status: 'saved'
    });

    if (existingBooking) {
      return res.status(200).json({
        success: true,
        message: 'Destination already saved',
        data: existingBooking,
        alreadySaved: true
      });
    }

    // Create new saved booking
    const booking = new Booking({
      userId,
      destinationId,
      destinationName,
      country,
      status: 'saved',
      paymentStatus: 'not_paid',
      adults: 1,
      children: 0,
      pricePerPerson: 0,
      basePrice: 0,
      totalAmount: 0
    });

    await booking.save();

    console.log(`🟢 [SAVE_BOOKING] Destination saved successfully with ID: ${booking._id}`);
    res.status(201).json({
      success: true,
      message: 'Destination saved successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [SAVE_BOOKING] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save destination'
    });
  }
});

// POST /api/bookings/book - Create a pending booking
router.post('/book', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [BOOK_NOW] Book Now request received');
    const userId = req.userId;
    const { destinationId, destinationName, country } = req.body;

    // Validate required fields
    if (!destinationId || !destinationName || !country) {
      return res.status(400).json({
        success: false,
        error: 'Destination ID, name, and country are required'
      });
    }

    // Check if booking already exists (any status)
    let booking = await Booking.findOne({
      userId,
      destinationId
    });

    if (booking) {
      // Update existing saved booking to pending
      if (booking.status === 'saved') {
        booking.status = 'pending';
        booking.paymentStatus = 'not_paid';
        await booking.save();

        console.log(`🟢 [BOOK_NOW] Updated saved booking to pending with ID: ${booking._id}`);
        return res.status(200).json({
          success: true,
          message: 'Booking updated to pending',
          data: booking,
          isUpdate: true
        });
      } else {
        // Booking already in pending or confirmed status
        return res.status(200).json({
          success: true,
          message: 'Booking already exists',
          data: booking,
          alreadyExists: true
        });
      }
    }

    // Create new pending booking
    booking = new Booking({
      userId,
      destinationId,
      destinationName,
      country,
      status: 'pending',
      paymentStatus: 'not_paid',
      adults: 1,
      children: 0,
      pricePerPerson: 0,
      basePrice: 0,
      totalAmount: 0
    });

    await booking.save();

    console.log(`🟢 [BOOK_NOW] New pending booking created with ID: ${booking._id}`);
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [BOOK_NOW] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create booking'
    });
  }
});

// POST /api/bookings/pay - Process payment for a booking
router.post('/pay', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [PAY_NOW] Payment request received');
    const userId = req.userId;
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        error: 'Booking ID is required'
      });
    }

    // Find the booking
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Verify ownership
    if (booking.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Unauthorized access to this booking'
      });
    }

    // Update booking status to confirmed and payment status to paid
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    await booking.save();

    console.log(`🟢 [PAY_NOW] Payment processed successfully for booking ID: ${bookingId}`);
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ [PAY_NOW] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to process payment'
    });
  }
});

// POST /api/bookings/save - Save destination booking without payment
router.post('/save', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [SAVE_BOOKING] Request received');
    const userId = req.userId;
    const {
      destinationId,
      destinationName,
      country,
      startDate,
      endDate,
      adults,
      children,
      totalTravelers,
      pricePerPerson,
      totalAmount,
      duration
    } = req.body;

    // Validation
    if (!destinationId || !destinationName || !country) {
      return res.status(400).json({
        success: false,
        error: 'Missing required destination information'
      });
    }

    if (adults < 1) {
      return res.status(400).json({
        success: false,
        error: 'At least 1 adult is required'
      });
    }

    if (!startDate) {
      return res.status(400).json({
        success: false,
        error: 'Start date is required'
      });
    }

    // Create booking with "saved" status
    const booking = new Booking({
      userId,
      destinationId,
      destinationName,
      country,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      adults,
      children,
      totalTravelers: totalTravelers || (adults + children),
      pricePerPerson,
      basePrice: totalAmount, // For saved bookings, basePrice = totalAmount
      totalAmount,
      duration,
      status: 'saved',
      paymentStatus: 'not_paid'
    });

    await booking.save();

    console.log(`🟢 [SAVE_BOOKING] Booking saved successfully with ID: ${booking._id}`);
    res.status(201).json({
      success: true,
      message: 'Booking saved successfully',
      bookingId: booking._id,
      data: booking
    });
  } catch (error) {
    console.error('❌ [SAVE_BOOKING] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to save booking'
    });
  }
});

// POST /api/bookings/book-and-pay - Save booking and proceed to payment
router.post('/book-and-pay', authMiddleware, async (req, res) => {
  try {
    console.log('🔵 [BOOK_AND_PAY] Request received');
    const userId = req.userId;
    const {
      destinationId,
      destinationName,
      country,
      startDate,
      endDate,
      adults,
      children,
      totalTravelers,
      pricePerPerson,
      totalAmount,
      duration
    } = req.body;

    // Validation
    if (!destinationId || !destinationName || !country) {
      return res.status(400).json({
        success: false,
        error: 'Missing required destination information'
      });
    }

    if (adults < 1) {
      return res.status(400).json({
        success: false,
        error: 'At least 1 adult is required'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: 'Both start and end dates are required for booking'
      });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    // Create booking with "pending" status
    const booking = new Booking({
      userId,
      destinationId,
      destinationName,
      country,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      adults,
      children,
      totalTravelers: totalTravelers || (adults + children),
      pricePerPerson,
      basePrice: totalAmount, // For destination bookings, basePrice = totalAmount
      totalAmount,
      duration,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await booking.save();

    console.log(`🟢 [BOOK_AND_PAY] Booking created with pending status, ID: ${booking._id}`);
    res.status(201).json({
      success: true,
      message: 'Booking created. Proceed to payment.',
      bookingId: booking._id,
      data: booking
    });
  } catch (error) {
    console.error('❌ [BOOK_AND_PAY] Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create booking'
    });
  }
});

// GET /api/bookings/saved - Get all saved destinations
router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const bookings = await Booking.find({ userId, status: 'saved' }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

