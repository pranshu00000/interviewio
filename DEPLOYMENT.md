# Render Deployment Guide - Keep-Alive Setup

## Overview
This project includes a keep-alive mechanism to prevent Render free tier instances from spinning down after 15 minutes of inactivity.

## How It Works

### Backend
- **Health Endpoint**: `GET /health` - Returns server status and uptime
- This endpoint is lightweight and doesn't hit rate limits

### Frontend
- **Auto-Ping**: Pings the `/health` endpoint every 12 minutes when the app is open
- **No User Action Required**: Runs automatically in the background
- **Smart Timing**: 12-minute interval stays well within Render's limits

## Deployment Steps

### 1. Backend (Server)
1. Deploy to Render as a **Web Service**
2. Set environment variables:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`

### 2. Frontend (Client)
1. Deploy to Render as a **Static Site** or **Web Service**
2. Set environment variable:
   ```
   VITE_SERVER_URL=https://your-backend-url.onrender.com
   ```
3. Build Command: `npm install && npm run build`
4. Publish Directory: `dist`

## Additional Keep-Alive Options

While the built-in keep-alive works when users have the app open, you can add external monitoring for 24/7 uptime:

### Recommended Free Services:
1. **UptimeRobot** (uptimerobot.com)
   - Set up HTTP monitor
   - URL: `https://your-backend-url.onrender.com/health`
   - Check interval: Every 5 minutes

2. **Cron-Job.org** (cron-job.org)
   - Create a job to hit `/health`
   - Schedule: Every 10 minutes

3. **BetterUptime** (betteruptime.com)
   - Free tier includes uptime monitoring
   - Set check interval to 3 minutes

## Environment Variables

### Client (.env)
```env
VITE_SERVER_URL=https://your-backend-url.onrender.com
```

### Server (.env)
```env
MONGO_URI=mongodb+srv://...
PORT=5000
```

## Testing Keep-Alive

1. Open browser console
2. You should see: `🚀 Keep-alive started - pinging every 12 minutes`
3. Every 12 minutes you'll see: `✅ Keep-alive ping successful`

## Notes
- Render free tier spins down after 15 minutes of inactivity
- This keep-alive pings every 12 minutes (safe margin)
- External monitoring provides backup even when no users are active
- Rate limiting is avoided by using reasonable intervals
