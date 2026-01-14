# Production Deployment Checklist

## Your Netlify Frontend URL
🌐 https://bucolic-panda-60f1e6.netlify.app

## Action Items (In Order)

### ✅ DONE - Frontend Configuration
- [x] API configuration system created (`apiConfig.js`)
- [x] Environment files created (`.env.example`, `.env.local`)
- [x] All hardcoded `localhost:5000` endpoints replaced with `API_BASE_URL`

### ⏳ TODO - Backend Deployment

1. **Deploy your backend** to a hosting service:
   - **Recommended:** Heroku, Render.com, Railway, or AWS
   - Get your backend URL (e.g., `https://rohil-api.herokuapp.com`)

2. **Set backend environment variables** on your hosting:
   ```
   FRONTEND_URL=https://bucolic-panda-60f1e6.netlify.app
   MONGO_URI=your-mongodb-connection-string
   PORT=5000 (or auto-assigned)
   ```

### ⏳ TODO - Netlify Configuration

In Netlify Dashboard → Your Site → Settings → Build & deploy → Environment:

Add these environment variables:
```
REACT_APP_API_URL = https://your-backend-url.com
```

Example (if backend is on Heroku):
```
REACT_APP_API_URL = https://rohil-api-backend.herokuapp.com
```

### ⏳ TODO - Redeploy Frontend

After setting Netlify env var:
1. Go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for build to complete
4. Test on Netlify site

### ⏳ TODO - Test the Flow

1. Go to https://bucolic-panda-60f1e6.netlify.app
2. Try to register
3. Check browser console (F12) for:
   - ✅ Should show successful POST to your backend URL
   - ❌ Should NOT show localhost:5000 errors
4. Register and login should work!

---

## Common Backend Hosting Options

| Service | Free Tier | Setup Time | Notes |
|---------|-----------|-----------|-------|
| **Heroku** | Limited | 5 min | Simple, great for Node.js |
| **Render** | Yes | 5 min | Free tier available |
| **Railway** | Yes | 5 min | Easy deploy from GitHub |
| **AWS** | Limited | 15 min | More setup required |
| **DigitalOcean** | Paid | 10 min | Affordable |

---

## Heroku Quick Deploy (Recommended)

1. Create account at heroku.com
2. Install Heroku CLI
3. Run in `backend` folder:
   ```bash
   heroku create rohil-api
   heroku config:set FRONTEND_URL=https://bucolic-panda-60f1e6.netlify.app
   heroku config:set MONGO_URI=your-mongodb-url
   git push heroku main
   ```
4. Get URL: `heroku apps:info rohil-api`
5. Use that URL in Netlify `REACT_APP_API_URL`

---

## Next Steps

1. Choose a backend hosting service
2. Deploy backend and get the URL
3. Set `REACT_APP_API_URL` in Netlify to that URL
4. Trigger Netlify redeploy
5. Test the app!

Need help with any step? Ask! 🚀
