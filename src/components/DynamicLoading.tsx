'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface DynamicLoadingProps {
  children: React.ReactNode
  initialDelay?: number
}

export default function DynamicLoading({ 
  children, 
  initialDelay = 0 
}: DynamicLoadingProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Use requestIdleCallback if available for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const timerId = setTimeout(() => {
        window.requestIdleCallback(() => {
          setIsLoaded(true)
        }, { timeout: 500 })
      }, initialDelay)
      
      return () => clearTimeout(timerId)
    } else {
      // Fallback for browsers without requestIdleCallback
      const timerId = setTimeout(() => {
        setIsLoaded(true)
      }, initialDelay)
      
      return () => clearTimeout(timerId)
    }
  }, [initialDelay])

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
} 
