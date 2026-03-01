# ASHA Worker App - Vercel Deployment Guide

This guide explains how to deploy the ASHA Worker App on Vercel.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository with this project
- Node.js 18+ and pnpm installed locally

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Select your GitHub repository containing the ASHA Worker App
4. Click **"Import"**

### 2. Configure Build Settings

Vercel will auto-detect the project as an Expo/React Native app. Ensure these settings:

- **Framework Preset:** Expo
- **Build Command:** `pnpm build`
- **Output Directory:** `dist`
- **Install Command:** `pnpm install`

### 3. Set Environment Variables

In Vercel Project Settings → **Environment Variables**, add:

```
NODE_ENV=production
API_URL=https://your-api-domain.com
EXPO_PUBLIC_API_URL=https://your-api-domain.com
ENABLE_OFFLINE_MODE=true
ENABLE_PUSH_NOTIFICATIONS=true
ENABLE_QR_SCANNER=true
ENABLE_MAPS=true
```

### 4. Deploy

Click **"Deploy"** and wait for the build to complete.

## Post-Deployment

### Access Your App

- **Web Preview:** `https://your-project.vercel.app`
- **Mobile Testing:** Use Expo Go to scan the QR code from the deployment logs

### Monitor Deployment

- Check build logs in Vercel Dashboard
- View analytics and performance metrics
- Monitor function execution times

## Troubleshooting

### Build Fails with "Module not found"

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

Ensure all TypeScript files compile:

```bash
pnpm check
```

### Dependencies Issues

Update all dependencies:

```bash
pnpm update
```

## Database Configuration (Optional)

If using the backend database:

1. Set `DATABASE_URL` in Vercel Environment Variables
2. Ensure database is accessible from Vercel (whitelist Vercel IPs)
3. Run migrations before deployment:

```bash
pnpm db:push
```

## Performance Optimization

### Image Optimization

- All images in `assets/images/` are automatically optimized
- Use WebP format for better compression

### Code Splitting

- Expo Router automatically handles code splitting
- No additional configuration needed

### Caching

- Static assets are cached with long-term expiration
- API responses are cached based on `Cache-Control` headers

## Monitoring

### Error Tracking

- Vercel automatically captures deployment errors
- Check "Deployments" tab for detailed logs

### Performance Metrics

- Monitor Core Web Vitals in Vercel Analytics
- Check function execution times

## Rollback

To rollback to a previous deployment:

1. Go to Vercel Dashboard → **Deployments**
2. Find the previous deployment
3. Click **"Promote to Production"**

## Support

For deployment issues:

- Check Vercel documentation: https://vercel.com/docs
- Review build logs in Vercel Dashboard
- Contact Vercel support for infrastructure issues

## Next Steps

1. **Custom Domain:** Add your custom domain in Vercel Settings
2. **SSL Certificate:** Automatically provisioned by Vercel
3. **Analytics:** Enable Vercel Analytics for performance insights
4. **Monitoring:** Set up error tracking and alerts

---

**App Name:** ASHA Worker  
**Version:** 1.0.0  
**Last Updated:** 2026-02-28
