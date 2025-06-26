# Deployment Guide

This guide explains how to deploy the Pokedex application to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Ensure your code is pushed to a GitHub repository
3. **Node.js**: Version 16 or higher

## Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project

### 2. Configure Build Settings

Vercel should automatically detect the following settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Environment Variables (Optional)

If you want to configure analytics or other services, add these environment variables in the Vercel dashboard:

```
VITE_GOOGLE_ANALYTICS_ID=your-ga-id
VITE_SENTRY_DSN=your-sentry-dsn
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_LOGGING=true
```

### 4. Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. You'll get a URL like `https://your-project.vercel.app`

### 5. Custom Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow the DNS configuration instructions

## Performance Optimizations

The application includes several performance optimizations:

### Code Splitting

- React components are lazy-loaded using `React.lazy()`
- Routes are split into separate chunks
- Loading spinners are shown during component loading

### Image Optimization

- Images use lazy loading with Intersection Observer
- Responsive images with srcset support
- WebP format support with fallbacks
- Error handling for failed image loads

### Caching

- Static assets are cached for 1 year
- API responses are cached in localStorage
- Service worker caching (if implemented)

### Performance Monitoring

- Core Web Vitals tracking
- User timing measurements
- Error logging and reporting
- Performance budget checking

## Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Production build with environment
npm run build:prod

# Analyze bundle size
npm run analyze

# Deploy to Vercel
npm run deploy
```

## Troubleshooting

### Build Failures

- Ensure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`
- Verify Node.js version compatibility

### Performance Issues

- Run bundle analysis: `npm run analyze`
- Check Core Web Vitals in browser dev tools
- Monitor performance metrics in production

### Environment Variables

- Ensure all required environment variables are set in Vercel
- Check that variable names start with `VITE_`
- Restart deployment after adding new variables

## Monitoring

After deployment, monitor:

- Core Web Vitals (LCP, FID, CLS)
- Error rates and types
- User interaction timings
- Bundle sizes and loading times

## Security Headers

The application includes security headers:

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
