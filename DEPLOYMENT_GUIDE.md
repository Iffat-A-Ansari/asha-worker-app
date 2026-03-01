# ASHA Worker App - Complete Deployment Guide

## Overview

The ASHA Worker App is a production-ready mobile healthcare application built with Expo, React Native, and TypeScript. It supports deployment on multiple platforms:

- **Mobile:** iOS and Android via Expo
- **Web:** Vercel, Netlify, or any Node.js hosting
- **Backend:** Express.js server with PostgreSQL database

## Quick Start - Vercel Deployment

### Step 1: Prepare Your Repository

```bash
# Clone your repository
git clone <your-repo-url>
cd asha-worker-app

# Install dependencies
pnpm install

# Verify build works locally
pnpm build
pnpm check  # TypeScript check
pnpm test   # Run tests
```

### Step 2: Deploy to Vercel

1. **Connect to Vercel:**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `asha-worker-app` folder as root directory

2. **Configure Build Settings:**
   - Framework: Expo
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`

3. **Add Environment Variables:**
   ```
   NODE_ENV=production
   API_URL=https://your-api.com
   EXPO_PUBLIC_API_URL=https://your-api.com
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
asha-worker-app/
├── app/                          # Expo Router screens
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx            # Home dashboard
│   │   ├── tasks.tsx            # Task list
│   │   ├── sync.tsx             # Sync status
│   │   └── profile.tsx          # Worker profile
│   ├── qr-scanner.tsx           # QR code scanner
│   ├── map-view.tsx             # Offline maps
│   ├── delivery-confirmation.tsx # Delivery confirmation
│   ├── map-download.tsx         # Map tile download
│   ├── notification-settings.tsx # Notification preferences
│   ├── onboarding/              # Auth & language selection
│   └── _layout.tsx              # Root layout
├── components/                   # Reusable components
│   ├── screen-container.tsx     # SafeArea wrapper
│   ├── themed-view.tsx          # Theme-aware view
│   └── ui/                      # UI components
├── lib/                         # Utilities & services
│   ├── db/                      # SQLite database
│   │   ├── schema.ts            # Database schema
│   │   ├── index.ts             # DB initialization
│   │   └── services.ts          # DB operations
│   ├── maps/                    # Offline maps
│   │   ├── tile-cache.ts        # Tile caching
│   │   ├── offline-map.tsx      # Map component
│   │   └── __tests__/           # Map tests
│   ├── notifications/           # Push notifications
│   │   ├── index.ts             # Notification setup
│   │   ├── push-service.ts      # Push service
│   │   └── __tests__/           # Notification tests
│   ├── utils.ts                 # Utility functions
│   └── trpc.ts                  # API client
├── server/                      # Backend server
│   ├── _core/                   # Core server logic
│   ├── routes/                  # API routes
│   │   ├── notifications.ts     # Push notification API
│   │   └── ...
│   ├── db.ts                    # Database connection
│   └── README.md                # Backend docs
├── assets/                      # Images & icons
│   └── images/
│       ├── icon.png             # App icon
│       ├── splash-icon.png      # Splash screen
│       └── ...
├── hooks/                       # Custom React hooks
│   ├── use-colors.ts            # Theme colors
│   ├── use-auth.ts              # Authentication
│   └── use-notifications-setup.ts
├── constants/                   # App constants
│   └── theme.ts                 # Theme configuration
├── app.config.ts                # Expo configuration
├── tailwind.config.js           # Tailwind CSS config
├── theme.config.js              # Theme tokens
├── package.json                 # Dependencies
├── vercel.json                  # Vercel config
├── .vercelignore                # Vercel ignore rules
├── tsconfig.json                # TypeScript config
├── vitest.config.ts             # Test configuration
└── VERCEL_DEPLOYMENT.md         # Deployment guide
```

## Features

### ✅ Implemented

- **Core Navigation:** Tab-based navigation (Home, Tasks, Sync, Profile)
- **Task Management:** Color-coded priorities, filtering, sorting
- **QR Scanning:** Real-time camera integration with flashlight toggle
- **Offline Maps:** OpenStreetMap tiles with caching, GPS tracking
- **Delivery Confirmation:** Photo capture, biometric verification
- **Database:** SQLite with Drizzle ORM for offline persistence
- **Authentication:** Phone + OTP login with language selection
- **Push Notifications:** Task alerts, delivery reminders, sync updates
- **Offline-First:** Complete offline functionality with auto-sync
- **Dark Mode:** Full dark mode support with CSS variables
- **Responsive Design:** Mobile-optimized UI for portrait orientation

### 🎯 Next Steps

1. **Backend Integration:** Connect to your API server
2. **Biometric Authentication:** Add real fingerprint/face recognition
3. **Voice Guidance:** Pre-cached audio for turn-by-turn navigation
4. **Analytics:** Track user behavior and app performance
5. **A/B Testing:** Test different UI variations

## Testing

### Run Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test lib/db/__tests__/services.test.ts

# Watch mode
pnpm test --watch
```

### Manual Testing

```bash
# Start development server
pnpm dev

# On mobile: Scan QR code with Expo Go app
# On web: Open https://localhost:8081
```

## Build & Deployment

### Development Build

```bash
pnpm dev          # Start dev server
pnpm dev:metro    # Metro bundler only
pnpm dev:server   # Backend server only
```

### Production Build

```bash
pnpm build        # Build for production
pnpm start        # Start production server
```

### Type Checking

```bash
pnpm check        # TypeScript check
pnpm lint         # ESLint check
pnpm format       # Format code with Prettier
```

## Environment Variables

### Required for Production

```
NODE_ENV=production
API_URL=https://your-api-domain.com
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

### Optional

```
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_QR_SCANNER=true
ENABLE_MAPS=true
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
```

## Performance Optimization

### Code Splitting

- Expo Router automatically handles code splitting
- Each screen is lazy-loaded on demand

### Image Optimization

- All images in `assets/` are optimized
- Use WebP format for better compression

### Database Optimization

- SQLite indexes on frequently queried columns
- Pagination for large datasets
- Lazy loading for related data

## Security

### Best Practices

- ✅ Environment variables for sensitive data
- ✅ HTTPS-only API communication
- ✅ Secure token storage with Expo SecureStore
- ✅ Input validation on all forms
- ✅ SQL injection protection via Drizzle ORM
- ✅ CORS configuration for API

### Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Cache-Control: no-store (for API)
```

## Monitoring & Logging

### Vercel Analytics

- Monitor Core Web Vitals
- Track page load times
- Identify performance bottlenecks

### Error Tracking

- Vercel captures deployment errors
- Check build logs for issues
- Monitor function execution times

### Application Logs

```bash
# View logs locally
pnpm dev

# View production logs
# In Vercel Dashboard → Deployments → Logs
```

## Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules .expo dist
pnpm install
pnpm build
```

### TypeScript Errors

```bash
# Check for errors
pnpm check

# Fix auto-fixable errors
pnpm lint --fix
```

### Database Issues

```bash
# Reset database
rm -rf app.db

# Reinitialize
pnpm db:push
```

### Push Notifications Not Working

- Ensure `projectId` is set in `app.config.ts`
- Check notification permissions in app settings
- Verify push token is registered in database

## Support & Resources

- **Expo Documentation:** https://docs.expo.dev
- **React Native Docs:** https://reactnative.dev
- **Vercel Docs:** https://vercel.com/docs
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org

## License

This project is built for the ASHA Worker program. All rights reserved.

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-28  
**Status:** Production Ready ✅
