This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Deployment Steps for RIX

1. **Prepare your repository**
   - Ensure all changes are committed to your GitHub repository
   - Make sure your code is free of errors and builds successfully locally

2. **Set up environment variables**
   - Copy the variables from `ENV_VARIABLES_EXAMPLE.md` to your Vercel project
   - Add your Supabase URL and anon key in the Vercel dashboard
   - Any other environment variables needed for your project

3. **Deploy on Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project" and import your GitHub repository
   - Configure the project settings:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: next build
   - Click "Deploy"

4. **Post-deployment checks**
   - Verify that authentication works correctly
   - Check that movie data is loading properly
   - Test responsive design on different devices
   - Ensure all images and assets are loading

5. **Custom domain (optional)**
   - Add a custom domain in the Vercel dashboard
   - Update the `NEXT_PUBLIC_SITE_URL` environment variable

For more detailed instructions, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## Project Structure

RIX is a movie streaming platform built with:
- Next.js for the frontend framework
- Tailwind CSS for styling
- Supabase for backend services and authentication
- TypeScript for type safety

Key directories:
- `/src/app`: Main application pages
- `/src/components`: Reusable UI components
- `/src/lib`: Utility functions and libraries
- `/src/types`: TypeScript type definitions
