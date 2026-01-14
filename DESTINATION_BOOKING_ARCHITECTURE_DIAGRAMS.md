# Destination Booking Modal - Architecture & Flow Diagrams

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        TRAVEL BOOKING APP                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   FRONTEND (React)                       │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                          │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │         DestinationsPage.js                       │  │   │
│  │  │  - Displays destination cards                    │  │   │
│  │  │  - Handles "Book Now" click                      │  │   │
│  │  └──────────────────┬──────────────────────────────┘  │   │
│  │                     │                                  │   │
│  │                     ↓                                  │   │
│  │  ┌───────────────────────────────────────────────────┐  │   │
│  │  │    DestinationBookingModal.js                     │  │   │
│  │  │  - Modal overlay                                 │  │   │
│  │  │  - Date picker                                  │  │   │
│  │  │  - Traveler selectors                          │  │   │
│  │  │  - Price calculation                           │  │   │
│  │  │  - Action buttons (Save, Save & Pay, Cancel)  │  │   │
│  │  │  - Form validation                             │  │   │
│  │  └──────┬─────────────────┬──────────────────┬────┘  │   │
│  │         │                 │                  │        │   │
│  │    Save │           Save & Pay          Cancel        │   │
│  │         ↓                 ↓                  ↓        │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │     GenericToast.js                          │   │   │
│  │  │  - Success notification                      │   │   │
│  │  │  - Error notification                        │   │   │
│  │  │  - Auto-dismiss                              │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  └──────────────────────────────────────────────────────┘   │
│                     │                  │                     │
│         Axios Call  │              Modal Closed              │
│                     ↓                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │     HTTP Client (Axios)                             │   │
│  │  - Adds JWT token to headers                        │   │
│  │  - Sends JSON payload                              │   │
│  │  - Handles response/errors                         │   │
│  └────────────┬────────────────────────────────────────┘   │
│               │                                             │
└───────────────┼─────────────────────────────────────────────┘
                │
                │ HTTP POST
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js)                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐  │
│  │              Routes (bookings.js)                   │  │
│  │                                                     │  │
│  │  POST /api/bookings/save                          │  │
│  │  ├─ authMiddleware (verify JWT)                   │  │
│  │  ├─ Validate input                                │  │
│  │  ├─ Create Booking (status: "saved")             │  │
│  │  └─ Return response                               │  │
│  │                                                     │  │
│  │  POST /api/bookings/book-and-pay                  │  │
│  │  ├─ authMiddleware (verify JWT)                   │  │
│  │  ├─ Validate input (stricter)                     │  │
│  │  ├─ Create Booking (status: "pending")           │  │
│  │  └─ Return response                               │  │
│  │                                                     │  │
│  └────────────────────┬────────────────────────────┘  │
│                       │                              │
│                       ↓                              │
│  ┌─────────────────────────────────────────────────┐  │
│  │      Mongoose (Booking.js Model)               │  │
│  │                                                │  │
│  │  Schema:                                      │  │
│  │  - userId (ObjectId)                         │  │
│  │  - destinationId (String)                    │  │
│  │  - startDate (Date)                          │  │
│  │  - endDate (Date)                            │  │
│  │  - adults (Number)                           │  │
│  │  - children (Number)                         │  │
│  │  - totalTravelers (Number)                   │  │
│  │  - pricePerPerson (Number)                   │  │
│  │  - totalAmount (Number)                      │  │
│  │  - status (saved|pending|confirmed|...)      │  │
│  │  - paymentStatus (not_paid|pending|paid|...) │  │
│  │  - createdAt, updatedAt                      │  │
│  │                                                │  │
│  │  Validation:                                  │  │
│  │  - Required fields check                     │  │
│  │  - Date validation                           │  │
│  │  - Traveler count validation                 │  │
│  │                                                │  │
│  │  Indexes:                                     │  │
│  │  - { userId, createdAt }                     │  │
│  │  - { destinationId, userId }                 │  │
│  │  - { status }                                 │  │
│  │                                                │  │
│  └────────────────┬─────────────────────────────┘  │
│                   │                               │
└───────────────────┼───────────────────────────────┘
                    │
                    │ Mongoose ODM
                    │
                    ↓
┌─────────────────────────────────────────────────┐
│         MongoDB Database                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Collections:                                  │
│  ├─ bookings (Booking documents)              │
│  ├─ users (User documents)                    │
│  ├─ destinations (Destination data)           │
│  └─ ...                                        │
│                                                 │
│  Booking Document Example:                    │
│  {                                             │
│    _id: ObjectId,                             │
│    userId: ObjectId,                          │
│    destinationId: "paris-001",                │
│    destinationName: "Paris",                  │
│    country: "France",                         │
│    startDate: Date("2025-02-15"),             │
│    endDate: Date("2025-02-20"),               │
│    adults: 2,                                 │
│    children: 0,                               │
│    totalTravelers: 2,                         │
│    pricePerPerson: 50000,                     │
│    totalAmount: 100000,                       │
│    status: "saved",                           │
│    paymentStatus: "not_paid",                 │
│    createdAt: Date,                           │
│    updatedAt: Date                            │
│  }                                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Component Hierarchy

```
App
├── DestinationsPage
│   ├── FilterBar
│   ├── DestinationCard (multiple)
│   │   └── [On Book Click] Opens Modal
│   │
│   ├── DestinationBookingModal (conditional)
│   │   ├── Header (destination details)
│   │   ├── Body
│   │   │   ├── DatePicker
│   │   │   ├── TravelerSelector
│   │   │   │   ├── AdultCount
│   │   │   │   ├── ChildrenCount
│   │   │   │   └── TotalDisplay
│   │   │   ├── ErrorDisplay (conditional)
│   │   │   └── PriceSummary
│   │   │
│   │   └── Footer
│   │       ├── SaveButton
│   │       ├── SaveAndPayButton
│   │       └── CancelButton
│   │
│   ├── GenericToast (conditional)
│   │   └── Message + Auto-dismiss
│   │
│   └── Footer
```

---

## Data Flow Diagram

### Save for Later Flow
```
┌─────────────────────────────────────┐
│  User clicks "Book Now"             │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Modal Opens                        │
│  setSelectedDestination(dest)       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  User fills form:                   │
│  - selectDate                       │
│  - selectTravelers                  │
│  - viewPriceCalculation             │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  User clicks "Save for Later"       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Frontend Validation                │
│  ✓ Date selected                    │
│  ✓ Date not in past                 │
│  ✓ At least 1 adult                 │
└──────────────┬──────────────────────┘
               │ (if valid)
               ↓
┌─────────────────────────────────────┐
│  Prepare Request Data               │
│  {                                  │
│    destinationId,                   │
│    destinationName,                 │
│    country,                         │
│    startDate,                       │
│    endDate,                         │
│    adults,                          │
│    children,                        │
│    totalTravelers,                  │
│    pricePerPerson,                  │
│    totalAmount,                     │
│    duration                         │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  POST /api/bookings/save            │
│  Headers: Authorization: Bearer JWT │
│  Body: JSON data                    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Backend Processing                 │
│  - authMiddleware validates token   │
│  - Validate request data            │
│  - Create Booking model             │
│  - status: "saved"                  │
│  - paymentStatus: "not_paid"        │
│  - Save to MongoDB                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Response Success                   │
│  {                                  │
│    success: true,                   │
│    bookingId: "_id",                │
│    message: "saved successfully",   │
│    data: { booking }                │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Frontend Receives Response         │
│  - setShowToast(true)               │
│  - setToastMessage(success)         │
│  - setToastType("success")          │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Display Success Toast              │
│  "Booking saved successfully!"      │
│  (Auto-dismiss after 4 seconds)     │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Close Modal                        │
│  setSelectedDestination(null)       │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Stay on Destinations Page          │
│  Booking saved to database          │
│  User can view in "My Bookings"     │
└─────────────────────────────────────┘
```

### Save & Pay Flow
```
[Same as above until user clicks "Save & Pay"]

               ↓
┌─────────────────────────────────────┐
│  User clicks "Save & Pay"           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Frontend Validation (stricter)     │
│  ✓ Date selected                    │
│  ✓ Date not in past                 │
│  ✓ At least 1 adult                 │
│  ✓ Both dates provided               │
│  ✓ End date > start date            │
└──────────────┬──────────────────────┘
               │ (if valid)
               ↓
┌─────────────────────────────────────┐
│  POST /api/bookings/book-and-pay    │
│  Headers: Authorization: Bearer JWT │
│  Body: JSON data                    │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Backend Processing                 │
│  - authMiddleware validates token   │
│  - Validate request data            │
│  - Create Booking model             │
│  - status: "pending"                │
│  - paymentStatus: "pending"         │
│  - Save to MongoDB                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Response Success                   │
│  {                                  │
│    success: true,                   │
│    bookingId: "_id",                │
│    message: "Proceed to payment",   │
│    data: { booking }                │
│  }                                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Display Success Toast              │
│  "Proceeding to payment..."         │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Redirect to Payment                │
│  navigate(`/booking-confirmation/   │
│           ${bookingId}`)            │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Payment Page Loads                 │
│  - Load booking details             │
│  - Show payment options             │
│  - Process payment                  │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  After Payment Success              │
│  - Update booking status to         │
│    "confirmed"                      │
│  - Update paymentStatus to "paid"   │
│  - Show confirmation page           │
└──────────────┬──────────────────────┘
               │
               ↓
┌─────────────────────────────────────┐
│  Booking Complete                   │
│  - Shows in "My Bookings" as        │
│    "Confirmed"                      │
│  - Confirmation email sent          │
│  - Itinerary ready for download     │
└─────────────────────────────────────┘
```

---

## State Management Diagram

```
DestinationBookingModal Component
│
├─ showToast: false
│  └─ Controls GenericToast visibility
│
├─ toastMessage: ""
│  └─ Message displayed in toast
│
├─ toastType: "success" | "error"
│  └─ Determines toast color
│
├─ isProcessing: false
│  └─ True during API call, disables buttons
│
├─ error: null
│  └─ Displays error messages in modal
│
└─ formData: {
   ├─ startDate: ""
   │  └─ Selected travel date
   │
   ├─ adults: 1
   │  └─ Adult count (min: 1)
   │
   └─ children: 0
      └─ Children count (min: 0)
      
   Derived Values (computed):
   ├─ totalTravelers: adults + children
   ├─ endDate: startDate + duration
   ├─ totalPrice: totalTravelers × pricePerPerson
   └─ isFormValid: startDate && adults >= 1
```

---

## API Request/Response Flow

### Save Booking Request
```
Frontend sends:
═══════════════════════════════════════════
POST /api/bookings/save HTTP/1.1
Host: localhost:5000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1...

{
  "destinationId": "destination_123",
  "destinationName": "Paris",
  "country": "France",
  "startDate": "2025-02-15",
  "endDate": "2025-02-20",
  "adults": 2,
  "children": 0,
  "totalTravelers": 2,
  "pricePerPerson": 50000,
  "totalAmount": 100000,
  "duration": 5
}
═══════════════════════════════════════════

Backend processes and sends:
═══════════════════════════════════════════
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "message": "Booking saved successfully",
  "bookingId": "65a1b2c3d4e5f6g7h8i9j0k1",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
    "userId": "user_456",
    "destinationId": "destination_123",
    "destinationName": "Paris",
    "country": "France",
    "startDate": "2025-02-15T00:00:00Z",
    "endDate": "2025-02-20T00:00:00Z",
    "adults": 2,
    "children": 0,
    "totalTravelers": 2,
    "pricePerPerson": 50000,
    "totalAmount": 100000,
    "duration": 5,
    "status": "saved",
    "paymentStatus": "not_paid",
    "createdAt": "2025-01-14T10:30:00Z",
    "updatedAt": "2025-01-14T10:30:00Z"
  }
}
═══════════════════════════════════════════
```

---

## Error Handling Flow

```
┌──────────────────────────────────┐
│  User Action (Save/Save & Pay)   │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Frontend Validation             │
└────────┬─────────────────────────┘
         │
    ┌────┴─────┐
    │           │
    ↓           ↓
   PASS       FAIL
    │           │
    │      ┌────────────────────────┐
    │      │ Show Error Toast       │
    │      │ + Keep Modal Open      │
    │      └────────────────────────┘
    │
    ↓
┌──────────────────────────────────┐
│  API Call (POST /save)           │
└────────┬─────────────────────────┘
         │
         ↓
    ┌────┴──────────┐
    │               │
    ↓               ↓
 SUCCESS         FAILURE
    │               │
    │          ┌────────────────┐
    │          │ Status Codes:  │
    │          │ - 400: Invalid │
    │          │ - 401: Auth    │
    │          │ - 500: Server  │
    │          └────────────────┘
    │               │
    │          Extract Error
    │               │
    │          ┌────────────────────────┐
    │          │ Show Error Toast       │
    │          │ + Keep Modal Open      │
    │          │ + Clear isProcessing   │
    │          │ + Enable buttons       │
    │          └────────────────────────┘
    │
    ↓
┌──────────────────────────────────┐
│  Save to Database                │
│  - Create Booking doc            │
│  - Set status                    │
│  - Return ID                     │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Success Response                │
└────────┬─────────────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  Frontend Receives Response      │
│  - Show Success Toast            │
│  - Close Modal                   │
│  - Reset Form                    │
│  - Call onSuccess() callback     │
└──────────────────────────────────┘
```

---

## Database Interaction Diagram

```
Booking Collection
╔════════════════════════════════════════╗
║  Document: {                           ║
║    _id: ObjectId                       ║
║    userId: ObjectId (indexed)          ║
║    destinationId: String               ║
║    destinationName: String             ║
║    country: String                     ║
║    startDate: Date                     ║
║    endDate: Date                       ║
║    adults: Number                      ║
║    children: Number                    ║
║    totalTravelers: Number              ║
║    pricePerPerson: Number              ║
║    totalAmount: Number                 ║
║    status: String (indexed)            ║
║    paymentStatus: String (indexed)     ║
║    duration: Number                    ║
║    createdAt: Date (indexed)           ║
║    updatedAt: Date                     ║
║  }                                     ║
╚════════════════════════════════════════╝

Indexes for Performance:
┌─────────────────────────────────────┐
│ 1. { userId: 1, createdAt: -1 }    │
│    Purpose: Get user bookings      │
│                                     │
│ 2. { destinationId: 1, userId: 1 } │
│    Purpose: Find existing bookings │
│                                     │
│ 3. { status: 1 }                   │
│    Purpose: Filter by status       │
│                                     │
│ 4. { paymentStatus: 1 }            │
│    Purpose: Filter by payment      │
│                                     │
│ 5. { createdAt: -1 }               │
│    Purpose: Sort by date           │
└─────────────────────────────────────┘

Query Examples:
┌─────────────────────────────────────────────────┐
│ Find saved bookings:                            │
│ db.bookings.find({                              │
│   userId: ObjectId(...),                        │
│   status: "saved"                               │
│ })                                              │
│                                                 │
│ Find pending bookings:                          │
│ db.bookings.find({                              │
│   userId: ObjectId(...),                        │
│   status: "pending"                             │
│ })                                              │
│                                                 │
│ Find by destination and user:                   │
│ db.bookings.findOne({                           │
│   destinationId: "...",                         │
│   userId: ObjectId(...)                         │
│ })                                              │
└─────────────────────────────────────────────────┘
```

---

**Generated**: January 14, 2026  
**Purpose**: Visual documentation of architecture and data flows  
**Status**: Complete
