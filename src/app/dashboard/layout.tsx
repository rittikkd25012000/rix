'use client'

import { useProtectedRoute } from '@/utils/authUtils'
import { usePrefetchRoutes } from '@/utils/routePrefetch'
import DashboardNav from '@/components/navigation/DashboardNav'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiHome, FiHeart, FiUser } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useProtectedRoute()
  const pathname = usePathname()
  
  // Prefetch common routes
  usePrefetchRoutes([
    '/dashboard/movies',
    '/dashboard/tv',
    '/dashboard/mylist',
    '/dashboard/games'
  ])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-300">Loading your experience...</div>
        </div>
      </div>
    )
  }

  if (!user) return null // Router will handle redirect

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: FiHome },
    { path: '/dashboard/support', label: 'Support Us', icon: FiHeart },
    { path: '/dashboard/profile', label: 'My Profile', icon: FiUser },
  ]

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="pt-24"
      >
        {children}
      </motion.main>
      
      {/* Bottom Navigation */}
      <motion.nav 
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.1 }}
        className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50"
      >
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.path)
            
            return (
              <Link 
                key={item.path}
                href={item.path} 
                className="flex flex-col items-center space-y-1 relative"
              >
                <motion.div
                  animate={{ 
                    color: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 0.6)',
                    scale: isActive ? 1.1 : 1
                  }}
                  whileHover={{ color: isActive ? 'var(--primary)' : 'rgba(255, 255, 255, 1)' }}
                  className="flex flex-col items-center"
                >
                  <item.icon size={24} />
                  <span className="text-xs">{item.label}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 w-1.5 h-1.5 bg-primary rounded-full"
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>
      </motion.nav>
    </div>
  )
} 
