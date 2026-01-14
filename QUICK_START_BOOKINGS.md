# Quick Start Guide - User Bookings System

## 🚀 Quick Setup

### 1. Ensure Environment Variables are Set

**Backend `.env` file:**
```env
MONGO_URI=mongodb://localhost:27017/travel-app
JWT_SECRET=your_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 2. Start Backend Server
```bash
cd backend
npm install
npm start
```
✅ Backend runs on: `http://localhost:5000`

### 3. Start Frontend Server
```bash
cd myapp
npm install
npm start
```
✅ Frontend runs on: `http://localhost:3000`

---

## 📌 Key Routes

| Route | Component | Protected | Purpose |
|-------|-----------|-----------|---------|
| `/` | HomePage | ❌ No | Landing page |
| `/register` | RegisterPage | ❌ No | New user signup |
| `/login` | LoginPage | ❌ No | User login |
| `/destinations` | DestinationsPage | ✅ Yes | Browse destinations |
| `/hotels` | HotelsPage | ✅ Yes | Browse hotels |
| `/flights` | FlightsPage | ✅ Yes | Browse flights |
| `/bookings` | MyBookingsPage | ✅ Yes | **View user's bookings** |
| `/booking-confirmation` | BookingConfirmationPage | ❌ No | Confirmation page |

---

## 🔑 Key API Endpoints

### Save Booking
```
POST /api/bookings
Headers: Authorization: Bearer {JWT_TOKEN}
Body: {destinationId, destinationName, country, startDate, endDate, adults, children, pricePerPerson, basePrice, addOns, addOnsTotal, totalAmount, paymentMethod}
Response: { success: true, data: {...} }
```

### Get User's Bookings
```
GET /api/bookings/my
Headers: Authorization: Bearer {JWT_TOKEN}
Response: { success: true, count: N, data: [...] }
```

### Cancel Booking
```
PUT /api/bookings/{bookingId}
Headers: Authorization: Bearer {JWT_TOKEN}
Body: { bookingStatus: "Cancelled" }
Response: { success: true, data: {...} }
```

---

## 🧪 Test Workflow

### Step 1: Register New User
```
1. Navigate to http://localhost:3000/register
2. Enter name, email, password
3. Click Register
4. JWT token stored in localStorage
```

### Step 2: Browse Destinations
```
1. Navigate to /destinations
2. View available destinations
3. Click "Book Now" on any destination
4. BookingModal opens
```

### Step 3: Create Booking
```
1. Fill booking form:
   - Select start date
   - Select end date
   - Choose adults/children count
   - Add optional add-ons
2. Continue to Payment
3. Select payment method
4. Click "Confirm & Pay"
5. Booking saved to database
6. Redirected to /bookings
```

### Step 4: View My Bookings
```
1. Already on /bookings page after booking
2. OR navigate to /bookings from navbar
3. See all your bookings displayed
4. Each booking shows:
   - Destination & country
   - Travel dates with duration
   - Travelers count
   - Add-ons selected
   - Price breakdown
   - Booking status
5. Can cancel booking if not Cancelled
```

### Step 5: Test Data Isolation
```
1. Create booking as User A
2. View /bookings → See User A's booking only
3. Logout
4. Register/Login as User B
5. View /bookings → See ONLY User B's bookings
6. User B cannot see User A's booking ✅
```

---

## 🐛 Troubleshooting

### Issue: "No Token Provided"
**Solution:** Make sure you're logged in. Token should be in localStorage.
```javascript
localStorage.getItem('sessionId') // or 'authToken'
```

### Issue: "Invalid or Expired Token"
**Solution:** Log in again to get new token.
```javascript
// Clear old token
localStorage.removeItem('sessionId');
// Navigate to login and create new token
```

### Issue: "Booking API returns 401"
**Solution:** Check auth header format. Should be:
```
Authorization: Bearer <token>
```
Not:
```
Authorization: <token>
```

### Issue: "Cannot see bookings"
**Solution:** 
1. Check token is being sent
2. Check MongoDB is running
3. Check backend server is running
4. Check MONGO_URI in .env

### Issue: "Getting all bookings instead of just mine"
**Solution:** Ensure using `/api/bookings/my` not `/api/bookings`

---

## 💾 Database Structure

### Booking Document
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  destinationId: String,
  destinationName: String,
  country: String,
  startDate: Date,
  endDate: Date,
  adults: Number (min: 1),
  children: Number (min: 0),
  pricePerPerson: Number,
  basePrice: Number,
  addOns: Array,
  addOnsTotal: Number,
  totalAmount: Number,
  bookingStatus: String (Confirmed/Pending/Cancelled),
  paymentMethod: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Index
```javascript
db.bookings.createIndex({ userId: 1, createdAt: -1 })
```

---

## 🔒 Security Checklist

- ✅ JWT stored in localStorage
- ✅ Token sent in Authorization header
- ✅ userId extracted from token (not request body)
- ✅ Backend verifies token before processing
- ✅ Users can only see their own bookings
- ✅ Users can only modify/delete their own bookings
- ✅ Invalid/expired tokens are rejected
- ✅ 401 unauthorized redirects to login
- ✅ 403 forbidden for unauthorized actions

---

## 📊 Testing with MongoDB Compass

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `travel-app`
4. Collection: `bookings`

**Query to see User A's bookings:**
```javascript
{ userId: ObjectId("user_a_id") }
```

**Query to see all bookings:**
```javascript
{}
```

---

## 🎯 Features Implemented

✅ User can create booking only if logged in
✅ Booking linked to logged-in user's ID
✅ User sees only their own bookings
✅ No other user can see their bookings
✅ Can cancel booking (changes status to Cancelled)
✅ Beautiful UI with loading/empty states
✅ Error handling with proper messages
✅ Responsive design for mobile/tablet
✅ Toast notifications for actions
✅ Booking details with full breakdown
✅ No console errors

---

## 🚨 Common Mistakes to Avoid

❌ DON'T send userId in request body
✅ DO extract userId from JWT token

❌ DON'T allow user to see all bookings
✅ DO filter bookings by userId in GET /api/bookings/my

❌ DON'T trust client-side userId validation
✅ DO verify on backend using token

❌ DON'T allow user to modify other's bookings
✅ DO check ownership before PUT/DELETE

❌ DON'T send JWT in URL/query string
✅ DO send in Authorization header

---

## 📞 Support

If you encounter issues:
1. Check backend is running on port 5000
2. Check frontend is running on port 3000
3. Verify JWT_SECRET is set in backend .env
4. Check MongoDB is running
5. Check network tab in browser DevTools
6. Check backend console for errors
7. Check browser console for errors

---

**Status: ✅ IMPLEMENTATION COMPLETE**

All features working as expected. Ready for production testing!
