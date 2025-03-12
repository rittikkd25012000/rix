'use client'

import { AuthProvider } from '@/context/AuthContext'
import { MyListProvider } from '@/context/MyListContext'
import { RatingsProvider } from '@/context/RatingsContext'
import { ContinueWatchingProvider } from '@/context/ContinueWatchingContext'
import { SocialProvider } from '@/context/SocialContext'
import Logo from "@/components/Logo"
import AnimatedLogo from "@/components/AnimatedLogo"
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion'
import { useState, useEffect, Suspense, memo } from 'react'
import { usePriorityPrefetch } from '@/utils/routePrefetch'

// Memoize static components to prevent unnecessary re-renders
const MemoizedLogo = memo(Logo)
const MemoizedAnimatedLogo = memo(AnimatedLogo)

// Enhanced loading fallback with animated gradient
const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="w-full max-w-md">
      <div className="h-1 w-full bg-bg-300/30 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-primary-300 to-accent-100"
          initial={{ width: "0%" }}
          animate={{ 
            width: ["0%", "100%", "0%"],
            x: ["0%", "0%", "100%"]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        />
      </div>
    </div>
  </div>
)

// Animated background gradient orbs
const AnimatedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-full opacity-30">
      {/* Animated gradient orbs */}
      <motion.div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ 
          background: 'radial-gradient(circle, rgba(203,92,232,0.3) 0%, rgba(108,27,142,0.1) 70%, rgba(0,0,0,0) 100%)',
          top: '-10%',
          left: '30%',
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div 
        className="absolute w-[300px] h-[300px] rounded-full blur-[80px]"
        style={{ 
          background: 'radial-gradient(circle, rgba(255,58,95,0.2) 0%, rgba(185,0,34,0.1) 70%, rgba(0,0,0,0) 100%)',
          bottom: '10%',
          right: '20%',
        }}
        animate={{
          x: [0, -70, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
    </div>
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
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen flex flex-col bg-bg-100 relative">
        {/* Animated background */}
        <AnimatedBackground />
        
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
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center bg-bg-100 z-50"
                      >
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 1.2, opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 20 
                          }}
                        >
                          <MemoizedAnimatedLogo className="h-24 w-auto" />
                          <motion.div 
                            className="mt-6 h-1 w-40 mx-auto bg-bg-300/30 rounded-full overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <motion.div 
                              className="h-full bg-gradient-to-r from-primary-300 to-accent-100"
                              initial={{ width: "0%" }}
                              animate={{ width: "100%" }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="main-content"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex-1 relative z-10"
                      >
                        {!isAuthPage && (
                          <motion.header 
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                            className="py-4 px-6 border-b border-white/5 sticky top-0 z-40 bg-blur"
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
