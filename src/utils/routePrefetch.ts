'use client'

import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

// Enhanced prefetching to improve navigation speed
export function usePrefetchRoutes(routes: string[]) {
  const router = useRouter()
  const pathname = usePathname()
  const prefetchedRef = useRef<Set<string>>(new Set())
  
  // Immediate prefetch for all routes on mount
  useEffect(() => {
    // Clear prefetched routes when the pathname changes
    prefetchedRef.current.clear()
    
    // Prefetch all routes immediately
    routes.forEach(route => {
      if (!prefetchedRef.current.has(route)) {
        router.prefetch(route)
        prefetchedRef.current.add(route)
      }
    })
  }, [router, routes, pathname])
  
  return null
}

// Priority prefetching for specific routes
export function usePriorityPrefetch(route: string) {
  const router = useRouter()
  
  useEffect(() => {
    // Use a small timeout to avoid blocking main thread during initial load
    const timer = setTimeout(() => {
      router.prefetch(route)
    }, 50)
    
    return () => clearTimeout(timer)
  }, [router, route])
  
  return null
} 
