# Booking Flow - Quick Reference Guide

## Critical Data Fields (18+ Required)

### Destination
- `destinationId` - Unique ID
- `destinationName` - Name
- `country` - Country

### Travelers
- `adults` - Minimum 1
- `children` - 0 or more
- Total members = adults + children

### Dates
- `startDate` - Must be before endDate
- `endDate` - Must be after startDate
- Duration = (endDate - startDate) in days

### Pricing
- `pricePerPerson` - Base price per person (from destination)
- `basePrice` - pricePerPerson × total_members
- `hotelPrice` (optional) - Per night, if hotel selected
- `hotelName` (optional) - Hotel name
- `roomType` (optional) - Room type
- `flightPrice` (optional) - Per person, if flight selected
- `flightNumber` (optional) - Flight identifier
- `flightDuration` (optional) - Flight duration string
- `departureTime` (optional) - Departure time
- `arrivalTime` (optional) - Arrival time
- `addOns[]` (optional) - Array of selected add-ons
- `addOnsTotal` - Sum of all add-ons
- `totalAmount` = basePrice + (hotelPrice × days) + (flightPrice × members) + addOnsTotal

### Booking Status
- `bookingStatus` - Default: "Confirmed"
- `paymentMethod` - card/upi/netbanking
- `paymentStatus` - Default: "Completed"
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### User Association
- `userId` - FROM JWT TOKEN (never from frontend)

---

## Critical Validation Rules

```javascript
// ✅ ALL validations happen at BACKEND
// Frontend validates for UX, Backend validates for security

// REQUIRED FIELDS
✓ destinationId, destinationName, country - All required
✓ startDate, endDate - Both required, endDate > startDate
✓ adults >= 1, children >= 0
✓ pricePerPerson > 0
✓ basePrice > 0
✓ totalAmount > 0

// OPTIONAL FIELDS
? Hotel: only if hotelName provided (then hotelPrice required)
? Flight: only if flightNumber provided (then flightPrice required)
? Add-ons: array can be empty

// PRICE VALIDATION
✓ totalAmount ≈ basePrice + hotelCost + flightCost + addOnsCost
  (allows ±1 rupee for rounding)

// USER ISOLATION
✓ userId extracted from JWT token
✓ Never trust frontend userId
✓ User can only see their own bookings
```

---

## Booking Flow - Step By Step

### Step 1: Destination Card → Booking Modal
```
USER CLICKS "Book Now"
  ↓
BookingModal Opens (Step 1/4)
  ├─ Shows destination name, country, rating
  ├─ Shows price per person
  ├─ User selects start date
  ├─ User selects end date
  ├─ User adjusts adults count (1+)
  ├─ User adjusts children count (0+)
  └─ Click "Continue to Hotels"
```

### Step 2: Hotel Selection
```
BookingModal (Step 2/4)
  ├─ Shows 3 hotel options
  ├─ User can select one or skip
  ├─ If selected:
  │  └─ price = hotel_price × stay_days
  └─ Click "Continue to Flights"
```

### Step 3: Flight Selection
```
BookingModal (Step 3/4)
  ├─ Shows 3 flight options
  ├─ User can select one or skip
  ├─ If selected:
  │  └─ price = flight_price × total_members
  └─ Click "Continue to Add-ons"
```

### Step 4: Add-ons & Payment
```
BookingModal (Step 4/4)
  ├─ Shows 5 add-ons (user can select multiple)
  ├─ Shows payment methods (card/UPI/Net Banking)
  ├─ Shows complete price breakdown
  ├─ User clicks "Confirm & Pay"
  └─ SUBMIT DATA TO BACKEND
```

### Step 5: Backend Processing
```
Backend Booking API
  ├─ Receives POST /api/bookings
  ├─ Validates JWT token
  │  └─ Extracts userId from token (NOT from body)
  ├─ Validates all required fields
  │  ├─ Destination details
  │  ├─ Travel dates (endDate > startDate)
  │  ├─ Travelers count
  │  ├─ Pricing (all > 0)
  │  └─ Total amount correctness
  ├─ Creates Booking document
  ├─ Pre-save validation runs
  ├─ Saves to MongoDB
  └─ Returns booking object with _id
```

### Step 6: Frontend Confirmation
```
Frontend
  ├─ Receives successful response
  ├─ Stores booking in localStorage
  ├─ Shows success toast
  ├─ Waits 2 seconds
  ├─ Closes modal
  └─ NAVIGATES TO /bookings
```

### Step 7: My Bookings Display
```
My Bookings Page
  ├─ Fetches GET /api/bookings/my
  ├─ Backend filters by userId
  ├─ Displays all user's bookings
  ├─ Shows complete details:
  │  ├─ Destination & country
  │  ├─ Travel dates & duration
  │  ├─ Travelers count
  │  ├─ Hotel info (if booked)
  │  ├─ Flight info (if booked)
  │  ├─ Add-ons (if selected)
  │  ├─ Price breakdown
  │  ├─ Total amount
  │  └─ Booking status
  └─ NEW BOOKING APPEARS IMMEDIATELY ✓
```

---

## Database Schema (Booking Collection)

```javascript
{
  _id: ObjectId,
  
  // User (from JWT)
  userId: ObjectId (ref: User),
  
  // Destination
  destinationId: String,
  destinationName: String,
  country: String,
  
  // Dates
  startDate: Date,
  endDate: Date,
  
  // Travelers
  adults: Number (min: 1),
  children: Number (min: 0),
  
  // Destination Pricing
  pricePerPerson: Number,
  basePrice: Number,
  
  // Hotel (Optional)
  hotelName: String (null if not selected),
  hotelPrice: Number (0 if not selected),
  roomType: String (null if not selected),
  
  // Flight (Optional)
  flightNumber: String (null if not selected),
  flightPrice: Number (0 if not selected),
  flightDuration: String (null if not selected),
  departureTime: String (null if not selected),
  arrivalTime: String (null if not selected),
  
  // Add-ons (Optional)
  addOns: [{
    id: String,
    label: String,
    price: Number
  }],
  addOnsTotal: Number,
  
  // Totals
  totalAmount: Number,
  
  // Status
  bookingStatus: "Confirmed" | "Pending" | "Cancelled",
  paymentMethod: "card" | "upi" | "netbanking",
  paymentStatus: "Pending" | "Completed" | "Failed",
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Endpoints

### Create Booking (PROTECTED)
```
POST /api/bookings
Headers: Authorization: Bearer <token>
Body: {
  destinationId, destinationName, country,
  startDate, endDate,
  adults, children,
  pricePerPerson, basePrice,
  [hotelName, hotelPrice, roomType],
  [flightNumber, flightPrice, flightDuration, departureTime, arrivalTime],
  [addOns], addOnsTotal,
  totalAmount,
  paymentMethod
}

Response: {
  success: true,
  message: "Booking created successfully",
  data: { _id, ...booking }
}
```

### Get User's Bookings (PROTECTED)
```
GET /api/bookings/my
Headers: Authorization: Bearer <token>

Response: {
  success: true,
  count: number,
  data: [{ bookings }]
}
```

### Cancel Booking (PROTECTED)
```
PUT /api/bookings/:id
Headers: Authorization: Bearer <token>
Body: { bookingStatus: "Cancelled" }

Response: {
  success: true,
  message: "Booking updated successfully",
  data: { updated booking }
}
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| "No token provided" | User not logged in | Check login, verify token in localStorage |
| "Invalid token" | Token expired or corrupt | Clear localStorage, login again |
| "Booking not saved" | Validation failed | Check all required fields in backend logs |
| Price mismatch | Calculation error | Verify: base + (hotel × days) + (flight × members) + addons |
| Booking not in My Bookings | userId mismatch | Verify JWT contains correct userId |
| Other user sees my booking | Security issue | Check backend filters by userId |
| Dates invalid | End date ≤ start date | Ensure endDate > startDate |

---

## Testing Quick Checklist

```
□ Create booking with destination only
□ Create booking with destination + hotel
□ Create booking with destination + flight
□ Create booking with destination + hotel + flight
□ Create booking with add-ons
□ Cancel booking and verify status change
□ Login as different user, verify can't see other's bookings
□ Verify all prices calculate correctly
□ Verify dates display in DD Mon YYYY format
□ Verify booking appears instantly in My Bookings
□ Refresh page, verify booking still there
```

---

## Performance Metrics

- Database query time: < 100ms
- API response time: < 500ms
- Booking creation end-to-end: < 2 seconds
- My Bookings load time: < 1 second

---

## Security Checklist

- [x] userId from JWT token, never frontend
- [x] All inputs validated on backend
- [x] Database indexes on userId
- [x] Protected routes with ProtectedRoute component
- [x] CORS properly configured
- [x] Passwords hashed with bcrypt
- [x] JWT tokens have expiration
- [x] No sensitive data in localStorage except token

---

**Version**: 1.0.0  
**Last Updated**: January 14, 2026  
**Status**: ✅ Production Ready
