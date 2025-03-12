'use client';

import { AuthProvider } from '@/context/AuthContext'
import { MyListProvider } from '@/context/MyListContext'
import { RatingsProvider } from '@/context/RatingsContext'
import { ContinueWatchingProvider } from '@/context/ContinueWatchingContext'
import { SocialProvider } from '@/context/SocialContext'
import SimpleLogo from "@/components/minimal/SimpleLogo"
import { usePathname } from 'next/navigation'
import { Suspense, memo } from 'react'

// Memoize static components to prevent unnecessary re-renders
const MemoizedSimpleLogo = memo(SimpleLogo);

// Simple loading fallback
const SimpleLoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-100">
    <div className="text-white text-xl">Loading...</div>
  </div>
);

export default function SimpleTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  
  return (
    <div className="min-h-screen flex flex-col bg-bg-100 relative">
      <AuthProvider>
        <MyListProvider>
          <RatingsProvider>
            <ContinueWatchingProvider>
              <SocialProvider>
                <div className="w-full flex-1 relative z-10">
                  {!isAuthPage && (
                    <header className="py-4 px-6 border-b border-white/5 sticky top-0 z-40 bg-black/80 backdrop-blur-sm">
                      <MemoizedSimpleLogo className="h-10 w-auto" />
                    </header>
                  )}
                  
                  <Suspense fallback={<SimpleLoadingFallback />}>
                    {children}
                  </Suspense>
                </div>
              </SocialProvider>
            </ContinueWatchingProvider>
          </RatingsProvider>
        </MyListProvider>
      </AuthProvider>
    </div>
  );
} 