# RIX Deployment Checklist

Use this checklist to ensure your application is ready for deployment to Vercel.

## Pre-Deployment Checks

- [ ] All code changes are committed to GitHub
- [ ] Application builds successfully locally (`npm run build`)
- [ ] All critical bugs are fixed
- [ ] UI is responsive on different device sizes
- [ ] Images load correctly with proper fallbacks
- [ ] Authentication flow works properly
- [ ] Movie data fetching is working correctly

## Vercel Setup

- [ ] Create a new project in Vercel dashboard
- [ ] Connect to your GitHub repository
- [ ] Set the following environment variables (see `ENV_VARIABLES_EXAMPLE.md`):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] Any other required environment variables

## Build Settings

- [ ] Framework preset: Next.js
- [ ] Build command: `next build`
- [ ] Output directory: `.next`
- [ ] Install command: `npm install`
- [ ] Node.js version: 18.x (or latest LTS)

## Post-Deployment Checks

- [ ] Visit the deployed URL and verify the site loads
- [ ] Test authentication (sign up, login, logout)
- [ ] Verify movie data loads correctly
- [ ] Check responsive design on mobile devices
- [ ] Verify all images load properly
- [ ] Test navigation between pages
- [ ] Check for any console errors

## Performance Optimization

- [ ] Run Lighthouse audit on deployed site
- [ ] Address any critical performance issues
- [ ] Optimize image loading
- [ ] Ensure proper caching headers

## Custom Domain (Optional)

- [ ] Add custom domain in Vercel dashboard
- [ ] Configure DNS settings
- [ ] Verify SSL certificate is working
- [ ] Update `NEXT_PUBLIC_SITE_URL` environment variable

## Analytics and Monitoring

- [ ] Set up error monitoring (e.g., Sentry)
- [ ] Configure analytics (e.g., Vercel Analytics)
- [ ] Set up uptime monitoring

## Final Steps

- [ ] Share the deployed URL with stakeholders
- [ ] Document any known issues
- [ ] Plan for future updates and improvements
