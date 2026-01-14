# Quick Start Guide - Destination Card Booking Buttons

## What Was Added?

Three action buttons on each destination card:
- 🔖 **Save** - Save destination for later
- 📝 **Book Now** - Create a booking
- 💳 **Pay Now** - Process payment

## Button Behavior at a Glance

```
┌─────────────────┬──────────────────────────┬──────────────────┐
│ Button          │ When User Not Logged In  │ When Logged In    │
├─────────────────┼──────────────────────────┼──────────────────┤
│ Save            │ Disabled (gray)          │ Active (blue)     │
│ Book Now        │ Disabled (gray)          │ Active (purple)   │
│ Pay Now         │ Disabled (gray)          │ Active (green)    │
└─────────────────┴──────────────────────────┴──────────────────┘
```

## Testing the Feature

### 1. Test Save Button
```
1. Go to Destinations page (while logged in)
2. Click "Save" on any destination card
3. See green success toast: "Destination saved successfully!"
4. Card stays visible (no redirect)
5. Go to /bookings - should see destination with "saved" status
```

### 2. Test Book Now Button
```
1. Click "Book Now" on any destination
2. See purple success toast: "Booking created! Redirecting..."
3. After 1.5 seconds: redirects to /bookings
4. New booking appears with "pending" status
```

### 3. Test Pay Now Button
```
1. Click "Pay Now" on a destination with existing booking
2. See green success toast: "Payment successful!"
3. After 1.5 seconds: redirects to /bookings
4. Booking now shows "confirmed" status and "paid"
```

### 4. Test Login Requirement
```
1. Logout or use incognito window
2. Try to click any button
3. All buttons are disabled (grayed out)
4. Hover shows tooltip
5. Click shows error toast
6. After 1.5s: redirects to login page
```

## Database Schema

### Booking Collection
```javascript
{
  userId: ObjectId,           // Reference to user
  destinationId: String,      // Destination identifier
  destinationName: String,    // e.g., "Paris"
  country: String,            // e.g., "France"
  
  // NEW FIELDS
  status: String,             // "saved" | "pending" | "confirmed" | "cancelled"
  paymentStatus: String,      // "not_paid" | "paid" | "failed"
  
  // Optional fields (not required for saved bookings)
  startDate: Date,
  endDate: Date,
  adults: Number,
  children: Number,
  pricePerPerson: Number,
  basePrice: Number,
  totalAmount: Number,
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints Reference

### Save Destination
```
POST /api/bookings/save
Authorization: Bearer <token>

Body:
{
  "destinationId": "1",
  "destinationName": "Paris",
  "country": "France"
}

Response:
{
  "success": true,
  "message": "Destination saved successfully",
  "data": { booking object }
}
```

### Create Booking (Book Now)
```
POST /api/bookings/book
Authorization: Bearer <token>

Body:
{
  "destinationId": "1",
  "destinationName": "Paris",
  "country": "France"
}

Response:
{
  "success": true,
  "message": "Booking created successfully",
  "data": { booking object with status: "pending" }
}
```

### Process Payment (Pay Now)
```
POST /api/bookings/pay
Authorization: Bearer <token>

Body:
{
  "bookingId": "507f1f77bcf86cd799439011"
}

Response:
{
  "success": true,
  "message": "Payment processed successfully",
  "data": { booking object with status: "confirmed", paymentStatus: "paid" }
}
```

### Get Saved Destinations
```
GET /api/bookings/saved
Authorization: Bearer <token>

Response:
{
  "success": true,
  "count": 3,
  "data": [ { booking objects with status: "saved" } ]
}
```

## Key Code Locations

### Backend

**Model Definition:**
- File: `backend/models/Booking.js`
- Lines: See status and paymentStatus fields

**API Routes:**
- File: `backend/routes/bookings.js`
- Line ~551: `/save` endpoint
- Line ~602: `/book` endpoint  
- Line ~656: `/pay` endpoint
- Line ~705: `/saved` endpoint

### Frontend

**Component:**
- File: `myapp/src/components/DestinationCard.js`
- Line ~1-25: State setup
- Line ~130-220: Button handlers
- Line ~400-480: Button UI elements
- Line ~485-495: Toast notification

## Common Issues & Solutions

### Issue: "Please login to save" appears even when logged in
**Solution:** Check if token is in localStorage
```javascript
// In browser console:
localStorage.getItem('token')
// Should return a JWT token, not null
```

### Issue: Button click does nothing
**Solution:** Check browser console for errors
```javascript
// Press F12 in browser, check Console tab
// Look for network errors or JS errors
```

### Issue: "Failed to save destination" error
**Solution:** Check backend server
```bash
# Terminal should show:
cd backend
npm start
# Should see: "✓ MongoDB connected successfully"
```

### Issue: Redirect to login happens immediately
**Solution:** Token may be expired
```javascript
// Login again to get fresh token
// Token stored in localStorage after login
```

## Troubleshooting Checklist

- [ ] Backend server running on port 5000
- [ ] MongoDB connected
- [ ] Frontend server running on port 3000
- [ ] User is logged in
- [ ] Check browser console for errors
- [ ] Check network tab in DevTools
- [ ] Verify token in localStorage
- [ ] Check backend server logs

## Quick Development Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd myapp && npm start

# Test API endpoint (from terminal)
curl -X POST http://localhost:5000/api/bookings/save \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "destinationId": "1",
    "destinationName": "Paris",
    "country": "France"
  }'
```

## Visual Reference

### Button States

**Default (Not Hovered):**
- Save: Light blue background
- Book: Light purple background  
- Pay: Light green background

**Hovered:**
- Slightly darker shade
- Smooth transition

**Disabled (Not Logged In):**
- Gray background
- Text is lighter gray
- Cursor shows "not-allowed"

**Loading (API Call In Progress):**
- Color darkens
- Spinning icon appears
- Label changes to "Saving..." / "Booking..." / "Paying..."

## File Structure

```
project-root/
├── backend/
│   ├── models/
│   │   └── Booking.js (✅ UPDATED)
│   └── routes/
│       └── bookings.js (✅ UPDATED)
└── myapp/
    └── src/
        └── components/
            └── DestinationCard.js (✅ UPDATED)
```

## Next Steps (Optional Enhancements)

1. **Add date/traveler picker in card** - let users select dates before booking
2. **Real payment gateway** - integrate Stripe or PayPal
3. **Email confirmations** - send booking confirmation emails
4. **Booking history** - show all past bookings
5. **Cancellation** - allow users to cancel bookings

---

**Ready to test?** 🚀
1. Start the backend: `cd backend && npm start`
2. Start the frontend: `cd myapp && npm start`
3. Login or register
4. Navigate to Destinations page
5. Try clicking the buttons!

