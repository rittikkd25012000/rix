'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

// Animation types
type TransitionType = 'fade' | 'slide' | 'wipe' | 'zoom' | 'blur' | 'none'

interface AnimationContextType {
  transitionType: TransitionType
  setTransitionType: (type: TransitionType) => void
  enableParticles: boolean
  setEnableParticles: (enable: boolean) => void
  enableCinematic: boolean
  setEnableCinematic: (enable: boolean) => void
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  particleCount: number
  setParticleCount: (count: number) => void
  particleColor: string
  setParticleColor: (color: string) => void
}

const AnimationContext = createContext<AnimationContextType>({
  transitionType: 'fade',
  setTransitionType: () => {},
  enableParticles: false, // Default to false for better performance
  setEnableParticles: () => {},
  enableCinematic: true,
  setEnableCinematic: () => {},
  timeOfDay: 'morning',
  particleCount: 8, // Reduced from 12
  setParticleCount: () => {},
  particleColor: 'var(--primary-300)',
  setParticleColor: () => {}
})

export const useAnimation = () => useContext(AnimationContext)

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [transitionType, setTransitionType] = useState<TransitionType>('fade')
  const [enableParticles, setEnableParticles] = useState(false) // Disabled by default
  const [enableCinematic, setEnableCinematic] = useState(true)
  const [particles, setParticles] = useState<Particle[]>([])
  const [particleCount, setParticleCount] = useState(8) // Reduced from 12
  const [particleColor, setParticleColor] = useState('var(--primary-300)')
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning')
  const pathname = usePathname()
  const lastUpdateTime = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  // Determine time of day based on current time - run only once per session
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning')
    } else if (hour >= 12 && hour < 17) {
      setTimeOfDay('afternoon')
    } else if (hour >= 17 && hour < 21) {
      setTimeOfDay('evening')
    } else {
      setTimeOfDay('night')
    }
  }, [])

  // Initialize particles - memoized to avoid recreating on every render
  const initialParticles = useMemo(() => {
    if (!enableParticles) return []
    
    // Even fewer particles for better performance
    const optimizedCount = Math.min(particleCount, 8);
    
    return Array.from({ length: optimizedCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1, // Even smaller particles
      speedX: (Math.random() - 0.5) * 0.1, // Even slower movement
      speedY: (Math.random() - 0.5) * 0.1, // Even slower movement
      opacity: Math.random() * 0.2 + 0.1
    }))
  }, [enableParticles, particleCount])

  // Set particles only when enableParticles changes
  useEffect(() => {
    setParticles(initialParticles)
  }, [initialParticles])

  // More efficient particle animation with throttled RAF
  useEffect(() => {
    if (!enableParticles || particles.length === 0) return
    
    const updateParticles = (timestamp: number) => {
      // Only update every 100ms
      if (timestamp - lastUpdateTime.current >= 100) {
        lastUpdateTime.current = timestamp
        
        setParticles(prevParticles => 
          prevParticles.map(p => ({
            ...p,
            x: (p.x + p.speedX + 100) % 100,
            y: (p.y + p.speedY + 100) % 100,
            opacity: p.opacity // Remove random opacity changes
          }))
        )
      }
      
      animationFrameId.current = requestAnimationFrame(updateParticles)
    }
    
    animationFrameId.current = requestAnimationFrame(updateParticles)
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [enableParticles, particles.length])

  // Simplified and faster transitions
  const getTransitionVariants = useMemo(() => {
    switch (transitionType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.1 } // Even faster transition
        }
      case 'slide':
        return {
          initial: { opacity: 0, y: 10 }, // Smaller movement
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.1 }
        }
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.98 }, // Less extreme zoom
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.02 },
          transition: { duration: 0.1 }
        }
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.1 }
        }
    }
  }, [transitionType])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    transitionType,
    setTransitionType,
    enableParticles,
    setEnableParticles,
    enableCinematic,
    setEnableCinematic,
    timeOfDay,
    particleCount,
    setParticleCount,
    particleColor,
    setParticleColor
  }), [
    transitionType, 
    enableParticles, 
    enableCinematic, 
    timeOfDay, 
    particleCount, 
    particleColor
  ])

  return (
    <AnimationContext.Provider value={contextValue}>
      <div className="relative min-h-screen">
        {/* Background particles - only render if enabled */}
        {enableParticles && particles.length > 0 && (
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particleColor,
                  opacity: particle.opacity,
                }}
              />
            ))}
          </div>
        )}

        {/* Apply time-of-day adaptive styling */}
        <div 
          className="fixed inset-0 z-0 pointer-events-none"
          style={{
            opacity: 0.05, // Reduced opacity
            background: timeOfDay === 'morning' 
              ? 'linear-gradient(135deg, rgba(255, 222, 173, 0.3), rgba(255, 255, 255, 0))' 
              : timeOfDay === 'afternoon'
                ? 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0))'
                : timeOfDay === 'evening'
                  ? 'linear-gradient(135deg, rgba(255, 183, 107, 0.2), rgba(255, 255, 255, 0))'
                  : 'linear-gradient(135deg, rgba(25, 25, 112, 0.3), rgba(255, 255, 255, 0))'
          }}
        />

        {/* Page transitions with mode="sync" for faster transitions */}
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={pathname}
            className="relative z-10"
            {...getTransitionVariants}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </AnimationContext.Provider>
  )
} 
