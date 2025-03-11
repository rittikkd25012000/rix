'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

// Common animation variants
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

export const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    }
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

export const slideIn = {
  hidden: { x: 30, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 30 
    }
  },
  exit: { 
    x: -30, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
}

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    }
  },
  exit: { 
    scale: 0.9, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// Page transition component
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={fadeIn}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  )
}

// Staggered list animation component
export function StaggeredList({ 
  children, 
  className = "", 
  itemVariants = slideUp,
  containerVariants = staggerContainer
}: { 
  children: ReactNode, 
  className?: string,
  itemVariants?: any,
  containerVariants?: any
}) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Animated item component
export function AnimatedItem({ 
  children, 
  className = "",
  variants = slideUp,
  delay = 0
}: { 
  children: ReactNode, 
  className?: string,
  variants?: any,
  delay?: number
}) {
  return (
    <motion.div
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Hover effect component
export function HoverEffect({ 
  children, 
  className = "",
  scale = 1.05,
  brightness = 1.1
}: { 
  children: ReactNode, 
  className?: string,
  scale?: number,
  brightness?: number
}) {
  return (
    <motion.div
      whileHover={{ 
        scale, 
        filter: `brightness(${brightness})`,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Parallax effect component
export function ParallaxContainer({ 
  children, 
  className = "",
}: { 
  children: ReactNode, 
  className?: string,
}) {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
      }}
    >
      {children}
    </motion.div>
  )
}

// Loading spinner component
export function LoadingSpinner({ size = 40, color = "primary" }: { size?: number, color?: string }) {
  return (
    <div className="flex justify-center items-center">
      <motion.div
        className="rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{
          width: size,
          height: size,
          borderWidth: size/10,
          borderColor: 'var(--primary-300)',
          borderTopColor: 'transparent',
          borderRadius: '50%'
        }}
      />
    </div>
  )
}

// Microinteraction button component
export function AnimatedButton({ 
  children, 
  onClick,
  className = "",
  activeColor = "var(--primary-100)",
  hoverColor = "var(--primary-300)",
  baseColor = "var(--primary-200)"
}: { 
  children: ReactNode, 
  onClick: () => void,
  className?: string,
  activeColor?: string,
  hoverColor?: string,
  baseColor?: string
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-white ${className}`}
      initial={{ backgroundColor: baseColor }}
      whileHover={{ 
        backgroundColor: hoverColor,
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        backgroundColor: activeColor
      }}
    >
      {children}
    </motion.button>
  )
}

// Text reveal animation
export function RevealText({ 
  text, 
  className = "",
  delay = 0,
  duration = 0.5
}: { 
  text: string, 
  className?: string,
  delay?: number,
  duration?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.03,
            delayChildren: delay
          }
        }
      }}
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: duration }
            }
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  )
} 
