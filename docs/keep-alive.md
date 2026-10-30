# Backend Keep-Alive System

## Problem
Render's free tier puts inactive services to sleep after 15 minutes of inactivity, causing 504 errors when users first visit the site.

## Solution
This project implements a multi-layered keep-alive system to keep the backend warm:

### 1. Client-Side Keep-Alive (Primary)
**File:** `src/components/KeepAlive.tsx`

- Runs in the browser on every page
- Pings the backend `/health` endpoint every 2 minutes
- Starts immediately when the page loads
- Lightweight and doesn't impact user experience

**How it works:**
- Mounted in the root layout (`src/app/layout.tsx`)
- Uses `setInterval` to ping every 120000ms (2 minutes)
- Logs status to browser console for monitoring

### 2. API Route for External Monitoring (Optional)
**File:** `src/app/api/keep-alive/route.ts`

- Provides a server-side endpoint at `/api/keep-alive`
- Can be called by external cron services
- Returns JSON status of backend health

**Usage with external services:**
You can set up free cron services to call this endpoint:
- [UptimeRobot](https://uptimerobot.com/) - Free monitoring every 5 minutes
- [Cron-Job.org](https://cron-job.org/) - Free cron jobs
- [EasyCron](https://www.easycron.com/) - Free tier available

### 3. Vercel Cron Job (If deployed on Vercel)
**File:** `vercel.json`

- Automatically pings `/api/keep-alive` every 2 minutes
- Only works if deployed on Vercel
- Zero configuration needed after deployment

## Configuration

### Environment Variables
Ensure these are set in your environment files:

**`.env.local`** (Development):
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

**`.env.production`** (Production):
```env
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://mommentum-backend.onrender.com
```

### Backend Requirements
Your backend must have a `/health` endpoint that:
- Responds with 200 OK status
- Is lightweight (doesn't query database unnecessarily)
- Completes quickly (< 1 second)

## Testing

### Test Client-Side Keep-Alive
1. Open your website in a browser
2. Open browser console (F12)
3. Look for logs:
   - `🔄 Backend keep-alive service started`
   - `✅ Backend keep-alive ping successful at [time]`

### Test API Route
Visit or curl:
```bash
curl https://your-domain.com/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "message": "Backend is alive",
  "timestamp": "2026-06-08T10:30:00.000Z"
}
```

## Monitoring

### Browser Console Logs
- ✅ Green checkmark = Successful ping
- ⚠️ Warning = Backend returned non-200 status
- ❌ Red X = Failed to reach backend

### Ping Frequency
- **Every 2 minutes** is optimal for Render's 15-minute timeout
- Keeps backend warm without excessive requests
- Minimal cost impact on Render usage

## Troubleshooting

### Backend Still Going to Sleep
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_MEDUSA_BACKEND_URL` is correct
3. Ensure `/health` endpoint exists on backend
4. Check if browser tab is active (some browsers throttle intervals in background tabs)

### Too Many Requests
If you're hitting rate limits:
1. Increase interval from 2 minutes to 5 minutes
2. Change `120000` to `300000` in `KeepAlive.tsx`

### Vercel Cron Not Working
1. Ensure you're on a paid Vercel plan (crons require Hobby or Pro)
2. Check Vercel dashboard → Project → Settings → Cron Jobs
3. Review execution logs in Vercel

## Alternative Solutions

If you need more reliability:
1. **Upgrade Render Plan** - Paid plans don't sleep
2. **Use BetterStack** - Uptime monitoring with alerting
3. **AWS Lambda + EventBridge** - Scheduled pings from AWS
4. **GitHub Actions** - Free cron jobs via GitHub workflows

## Cost Considerations

- **Client-side pings**: Free (runs in user's browser)
- **Vercel crons**: Included in Hobby plan ($20/mo)
- **External cron services**: Free tiers available
- **Render bandwidth**: Minimal impact (~1KB per ping)

## Notes

- The keep-alive component renders nothing (returns `null`)
- Works in both development and production
- Automatically adapts to environment variables
- No user-facing performance impact
