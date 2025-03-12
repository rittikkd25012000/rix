# RIX 3.0 - Modern Movie Streaming Platform

RIX 3.0 is an enhanced version of the original RIX platform, built with Next.js 15, React 19, Tailwind CSS, and Supabase. This version features a more reliable architecture, improved UI components, and better performance.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Key Features

- 🎬 Responsive movie browsing experience
- 🌙 Dark mode optimized design
- 🔍 Advanced search functionality
- 👤 User authentication via Supabase
- 💾 Personal watchlist management
- 🔄 Continue watching progress tracking
- 🔔 Notifications system
- 📱 Fully responsive across all devices

## Architecture Improvements

RIX 3.0 includes several architectural improvements over previous versions:

- Simplified component structure for better reliability
- Enhanced error handling throughout the application
- Optimized image and asset loading
- Improved animation performance
- Minimized client-side errors with fallback components

## Project Structure

RIX 3.0 is organized as follows:

- `/src/app`: Main application pages using Next.js App Router
- `/src/components`: Reusable UI components
  - `/ui`: Basic UI elements
  - `/layout`: Layout components
  - `/minimal`: Simplified components for reliability
- `/src/lib`: Utility functions and libraries
- `/src/context`: React context providers
- `/src/types`: TypeScript type definitions

## Environment Setup

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Deployment

### Vercel Deployment

1. Push your repository to GitHub
2. Import your project in the Vercel dashboard
3. Set up the required environment variables
4. Deploy

## License

[MIT](LICENSE)

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
