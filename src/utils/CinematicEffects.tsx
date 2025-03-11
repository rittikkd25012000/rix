'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { motion, AnimatePresence, useAnimation, useScroll, useTransform } from 'framer-motion'

// Film Grain Effect
export function FilmGrainEffect({ intensity = 0.05 }: { intensity?: number }) {
  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none mix-blend-overlay"
      style={{ 
        backgroundImage: 'url("/effects/noise.png")', 
        opacity: intensity 
      }}
    />
  )
}

// Cinematic Black Bars
export function CinematicBars({ 
  visible = true, 
  thickness = 10,
  animate = true
}: { 
  visible?: boolean, 
  thickness?: number,
  animate?: boolean 
}) {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <motion.div 
        className="fixed top-0 left-0 right-0 bg-black"
        animate={{ 
          height: visible ? thickness : 0
        }}
        transition={{ duration: animate ? 0.8 : 0 }}
      />
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-black"
        animate={{ 
          height: visible ? thickness : 0
        }}
        transition={{ duration: animate ? 0.8 : 0 }}
      />
    </div>
  )
}

// Fade Transition
export function FadeTransition({ 
  children, 
  show = true,
  duration = 0.5
}: { 
  children: ReactNode, 
  show?: boolean,
  duration?: number
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Wipe Transition (like Star Wars)
export function WipeTransition({ 
  children, 
  show = true,
  direction = 'right-to-left',
  duration = 0.8
}: { 
  children: ReactNode, 
  show?: boolean,
  direction?: 'right-to-left' | 'left-to-right' | 'top-to-bottom' | 'bottom-to-top',
  duration?: number
}) {
  let clipPathInitial, clipPathAnimate, clipPathExit;
  
  switch (direction) {
    case 'right-to-left':
      clipPathInitial = 'inset(0 100% 0 0)';
      clipPathAnimate = 'inset(0 0 0 0)';
      clipPathExit = 'inset(0 0 0 100%)';
      break;
    case 'left-to-right':
      clipPathInitial = 'inset(0 0 0 100%)';
      clipPathAnimate = 'inset(0 0 0 0)';
      clipPathExit = 'inset(0 100% 0 0)';
      break;
    case 'top-to-bottom':
      clipPathInitial = 'inset(100% 0 0 0)';
      clipPathAnimate = 'inset(0 0 0 0)';
      clipPathExit = 'inset(0 0 100% 0)';
      break;
    case 'bottom-to-top':
      clipPathInitial = 'inset(0 0 100% 0)';
      clipPathAnimate = 'inset(0 0 0 0)';
      clipPathExit = 'inset(100% 0 0 0)';
      break;
  }
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ clipPath: clipPathInitial }}
          animate={{ clipPath: clipPathAnimate }}
          exit={{ clipPath: clipPathExit }}
          transition={{ duration, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Iris Transition (circle wipe)
export function IrisTransition({ 
  children, 
  show = true,
  duration = 0.8
}: { 
  children: ReactNode, 
  show?: boolean,
  duration?: number
}) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ clipPath: 'circle(0% at center)' }}
          animate={{ clipPath: 'circle(100% at center)' }}
          exit={{ clipPath: 'circle(0% at center)' }}
          transition={{ duration, ease: [0.7, 0, 0.3, 1] }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Vignette Effect
export function VignetteEffect({ intensity = 0.5 }: { intensity?: number }) {
  return (
    <div 
      className="fixed inset-0 z-20 pointer-events-none"
      style={{ 
        boxShadow: `inset 0 0 ${100 * intensity}px rgba(0,0,0,${intensity})`,
        mixBlendMode: 'multiply'
      }}
    />
  )
}

// Motion Blur Effect
export function MotionBlurEffect({ 
  children, 
  blur = 10, 
  active = false 
}: { 
  children: ReactNode, 
  blur?: number,
  active?: boolean 
}) {
  return (
    <motion.div
      animate={{ 
        filter: active ? `blur(${blur}px)` : 'blur(0px)'
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Parallax Scroll Effect
export function ParallaxScroll({ 
  children, 
  speed = 0.5 
}: { 
  children: ReactNode, 
  speed?: number 
}) {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, 100 * speed])
  
  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  )
}

// Zoom Blur Effect (like focusing a camera)
export function ZoomBlurEffect({ 
  children, 
  active = false,
  duration = 1.0
}: { 
  children: ReactNode, 
  active?: boolean,
  duration?: number 
}) {
  return (
    <motion.div
      animate={{ 
        scale: active ? [0.95, 1] : 1,
        filter: active ? ['blur(5px)', 'blur(0px)'] : 'blur(0px)'
      }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  )
}

// Ken Burns Effect (subtle zoom on images)
export function KenBurnsEffect({ 
  children,
  duration = 20
}: { 
  children: ReactNode,
  duration?: number 
}) {
  const controls = useAnimation()
  
  useEffect(() => {
    controls.start({
      scale: 1.1,
      transition: { duration, ease: 'linear' }
    })
  }, [controls, duration])
  
  return (
    <motion.div
      initial={{ scale: 1 }}
      animate={controls}
    >
      {children}
    </motion.div>
  )
}

// Picture-in-Picture Effect
export function PictureInPicture({ 
  children,
  insetContent,
  position = 'bottom-right',
  size = 30,
  visible = true
}: { 
  children: ReactNode,
  insetContent: ReactNode,
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
  size?: number,
  visible?: boolean
}) {
  let positionClasses = '';
  
  switch (position) {
    case 'top-left':
      positionClasses = 'top-4 left-4';
      break;
    case 'top-right':
      positionClasses = 'top-4 right-4';
      break;
    case 'bottom-left':
      positionClasses = 'bottom-4 left-4';
      break;
    case 'bottom-right':
    default:
      positionClasses = 'bottom-4 right-4';
      break;
  }
  
  return (
    <div className="relative w-full h-full">
      {children}
      
      <AnimatePresence>
        {visible && (
          <motion.div 
            className={`absolute ${positionClasses} shadow-lg rounded-lg overflow-hidden border-2 border-white/20 z-10`}
            style={{ width: `${size}%` }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            {insetContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Title Card Animation
export function TitleCardAnimation({ 
  title, 
  subtitle,
  visible = false
}: { 
  title: string, 
  subtitle?: string,
  visible?: boolean
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-center mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {title}
          </motion.h1>
          
          {subtitle && (
            <motion.p 
              className="text-xl md:text-2xl text-white/70 text-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Watchlist Add Animation
export function WatchlistAddAnimation({ 
  visible = false,
  onComplete = () => {}
}: { 
  visible?: boolean,
  onComplete?: () => void
}) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [visible, onComplete]);
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 15 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15 
            }}
            className="bg-primary-300/20 backdrop-blur-md p-8 rounded-full flex items-center justify-center"
          >
            <motion.svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-primary-300"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Audio Reactive Animation
export function AudioReactiveEffect({ 
  children,
  audioLevel = 0 // 0 to 1
}: { 
  children: ReactNode,
  audioLevel?: number
}) {
  const scale = 1 + (audioLevel * 0.05); // subtle scaling based on audio level
  
  return (
    <motion.div
      animate={{ 
        scale,
        boxShadow: `0 0 ${30 * audioLevel}px rgba(var(--primary-300-rgb), ${audioLevel})`
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  )
}

// Weather Effect for Sports (like rain)
export function WeatherEffect({ 
  type = 'rain',
  intensity = 0.5
}: { 
  type?: 'rain' | 'snow' | 'fog',
  intensity?: number
}) {
  const [droplets, setDroplets] = useState<{ id: number, x: number, delay: number, speed: number }[]>([]);
  
  useEffect(() => {
    if (type === 'rain' || type === 'snow') {
      const count = Math.floor(100 * intensity);
      const newDroplets = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.5
      }));
      
      setDroplets(newDroplets);
    }
  }, [type, intensity]);
  
  if (type === 'fog') {
    return (
      <motion.div 
        className="fixed inset-0 z-10 pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 * intensity }}
        style={{ mixBlendMode: 'overlay' }}
      />
    );
  }
  
  return (
    <div className="fixed inset-0 z-10 pointer-events-none overflow-hidden">
      {droplets.map(droplet => (
        <motion.div
          key={droplet.id}
          className={`absolute rounded-full ${type === 'rain' ? 'bg-blue-300/30 w-0.5' : 'bg-white w-1.5 h-1.5'}`}
          style={{ left: `${droplet.x}%`, top: '-20px' }}
          animate={{
            y: ['0vh', '100vh'],
            x: type === 'snow' ? [0, droplet.x % 2 === 0 ? 20 : -20] : 0
          }}
          transition={{
            duration: type === 'rain' ? 0.7 / droplet.speed : 3 / droplet.speed,
            delay: droplet.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
    </div>
  );
}

// Credits Roll Animation
export function CreditsRollAnimation({ 
  credits,
  visible = false,
  speed = 1 // pixels per second
}: { 
  credits: { role: string, name: string }[],
  visible?: boolean,
  speed?: number
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="flex flex-col items-center space-y-6 text-white"
            initial={{ y: '100vh' }}
            animate={{ y: '-100vh' }}
            transition={{ duration: 20 / speed, ease: 'linear' }}
          >
            {credits.map((credit, index) => (
              <div key={index} className="text-center">
                <div className="text-gray-400 text-sm">{credit.role}</div>
                <div className="text-xl font-bold">{credit.name}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Genre-specific animation (different effects based on genre)
export function GenreAnimation({ 
  children,
  genre = 'drama',
  intensity = 0.5
}: { 
  children: ReactNode,
  genre?: 'action' | 'horror' | 'comedy' | 'drama' | 'sci-fi',
  intensity?: number
}) {
  let effect;
  
  switch (genre) {
    case 'action':
      // Shake effect for action
      effect = {
        animate: { 
          x: intensity > 0.5 ? [0, -3, 3, -3, 0] : [0, -1, 1, -1, 0]
        },
        transition: { duration: 0.5, repeat: 1, repeatDelay: 3 }
      };
      break;
    case 'horror':
      // Dark vignette and slight distortion for horror
      return (
        <div className="relative">
          {children}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              boxShadow: `inset 0 0 100px rgba(0,0,0,${0.7 * intensity})`,
              mixBlendMode: 'multiply'
            }}
          />
          <div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("/effects/noise.png")', 
              opacity: 0.1 * intensity 
            }}
          />
        </div>
      );
    case 'comedy':
      // Bright and bouncy for comedy
      effect = {
        animate: { 
          scale: [1, 1 + (0.02 * intensity), 1]
        },
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
      };
      break;
    case 'sci-fi':
      // Subtle glow for sci-fi
      return (
        <div className="relative">
          {children}
          <motion.div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              boxShadow: `inset 0 0 50px rgba(0,255,255,${0.1 * intensity})`,
              mixBlendMode: 'screen'
            }}
            animate={{ opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      );
    case 'drama':
    default:
      // Subtle and elegant for drama
      effect = {
        animate: {}, // No animation
        transition: {}
      };
      break;
  }
  
  return (
    <motion.div {...effect}>
      {children}
    </motion.div>
  )
} 
