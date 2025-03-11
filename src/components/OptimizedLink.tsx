'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'

interface OptimizedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  isPriority?: boolean
  prefetchDelay?: number
}

export default function OptimizedLink({
  href,
  children,
  className = '',
  onClick,
  isPriority = false,
  prefetchDelay = 0
}: OptimizedLinkProps) {
  const router = useRouter()
  const [prefetched, setPrefetched] = useState(false)
  const linkRef = useRef<HTMLAnchorElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Handle priority prefetching
  useEffect(() => {
    if (isPriority && !prefetched) {
      router.prefetch(href)
      setPrefetched(true)
    }
  }, [router, href, isPriority, prefetched])

  // Handle hover prefetching with delay
  const handleMouseEnter = () => {
    if (prefetched) return
    
    if (prefetchDelay > 0) {
      timeoutRef.current = setTimeout(() => {
        router.prefetch(href)
        setPrefetched(true)
      }, prefetchDelay)
    } else {
      router.prefetch(href)
      setPrefetched(true)
    }
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  // Click handler for touch devices (detects touch)
  const handleTouchStart = () => {
    if (!prefetched) {
      router.prefetch(href)
      setPrefetched(true)
    }
  }

  return (
    <Link
      ref={linkRef}
      href={href}
      className={className}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      prefetch={false} // We handle prefetching ourselves
    >
      {children}
    </Link>
  )
} 
