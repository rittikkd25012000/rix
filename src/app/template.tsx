'use client'

import { AuthProvider } from '@/context/AuthContext'
import { MyListProvider } from '@/context/MyListContext'
import { RatingsProvider } from '@/context/RatingsContext'
import { ContinueWatchingProvider } from '@/context/ContinueWatchingContext'
import { SocialProvider } from '@/context/SocialContext'
import Logo from "@/components/Logo"
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { useState, useEffect, Suspense, memo } from 'react'
import { usePriorityPrefetch } from '@/utils/routePrefetch'

// Memoize static components to prevent unnecessary re-renders
const MemoizedLogo = memo(Logo)

// Lightweight loading fallback
const LoadingFallback = () => (
  <div className="h-1 w-full bg-gray-900">
    <div className="h-full bg-primary animate-pulse" style={{ width: '30%' }}></div>
  </div>
)

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const [isLoading, setIsLoading] = useState(true);
  
  // Prefetch dashboard routes
  usePriorityPrefetch('/dashboard')
  
  // Optimize initial page load animation
  useEffect(() => {
    // Significantly reduce loading time
    const timer = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col bg-black">
        <AuthProvider>
          <MyListProvider>
            <RatingsProvider>
              <ContinueWatchingProvider>
                <SocialProvider>
                  <AnimatePresence mode="wait" initial={false}>
                    {isLoading ? (
                      <motion.div 
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="fixed inset-0 flex items-center justify-center bg-black z-50"
                      >
                        <MemoizedLogo className="h-16 w-auto" />
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1 }}
                        className="w-full flex-1"
                      >
                        {!isAuthPage && (
                          <motion.header 
                            initial={{ y: 0 }}
                            animate={{ y: 0 }}
                            className="py-4 px-6 border-b border-gray-800 sticky top-0 z-40 bg-black/80 backdrop-blur-md"
                          >
                            {/* Logo in header removed to prevent duplication with DashboardNav */}
                          </motion.header>
                        )}
                        
                        <Suspense fallback={<LoadingFallback />}>
                          {children}
                        </Suspense>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </SocialProvider>
              </ContinueWatchingProvider>
            </RatingsProvider>
          </MyListProvider>
        </AuthProvider>
      </div>
    </LazyMotion>
  )
} 
