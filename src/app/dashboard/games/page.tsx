'use client'

import { useAuth } from '@/context/AuthContext'
import { FiArrowRight, FiHelpCircle, FiZap, FiClock, FiBarChart2, FiGrid } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0px 10px 30px -5px rgba(0, 0, 0, 0.3)",
    transition: { type: "spring", stiffness: 500, damping: 15 }
  },
  tap: { scale: 0.98 }
}

// Particle effect component
function ParticleEffect() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 30 }, () => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.1
    }));
    
    setParticles(initialParticles);
    
    // Animate particles
    const interval = setInterval(() => {
      setParticles(prevParticles => 
        prevParticles.map(p => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
          opacity: Math.max(0.1, Math.min(0.6, p.opacity + (Math.random() - 0.5) * 0.05))
        }))
      );
    }, 50);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          animate={{
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export default function GamesPage() {
  const { user } = useAuth()
  const [hoveredGame, setHoveredGame] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])
  
  const games = [
    {
      id: 'trivia',
      title: 'Movie Trivia Quiz',
      description: 'Test your movie knowledge with our challenging trivia questions',
      icon: FiHelpCircle,
      color: 'from-blue-600 to-blue-900',
      path: '/dashboard/games/trivia'
    },
    {
      id: 'puzzle',
      title: 'Movie Poster Puzzle',
      description: 'Solve sliding puzzles featuring iconic movie posters',
      icon: FiGrid,
      color: 'from-purple-600 to-purple-900',
      path: '/dashboard/games/puzzle'
    },
    {
      id: 'guess',
      title: 'Guess the Movie',
      description: 'Identify movies from obscured images, quotes, or short clips',
      icon: FiZap,
      color: 'from-green-600 to-green-900',
      path: '/dashboard/games/guess'
    },
    {
      id: 'timeline',
      title: 'Movie Timeline Challenge',
      description: 'Place movies in chronological order of their release',
      icon: FiClock,
      color: 'from-yellow-600 to-yellow-900',
      path: '/dashboard/games/timeline'
    },
    {
      id: 'prediction',
      title: 'Movie Prediction Game',
      description: 'Predict outcomes of upcoming movies and earn points',
      icon: FiBarChart2,
      color: 'from-red-600 to-red-900',
      path: '/dashboard/games/prediction'
    }
  ]

  if (!user) return null

  return (
    <>
      <ParticleEffect />
      
      <div className="min-h-screen pb-20 pt-24 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10"
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex items-center gap-3 mb-8"
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <FiZap size={36} className="text-primary" />
              </motion.div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                RIX Games
              </h1>
            </motion.div>

            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl text-gray-300 mb-16 max-w-3xl leading-relaxed"
            >
              Take a break between shows and test your movie knowledge with our collection of 
              interactive games. Earn badges, compete on leaderboards, and discover new films!
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  custom={index}
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onMouseEnter={() => setHoveredGame(game.id)}
                  onMouseLeave={() => setHoveredGame(null)}
                  className="relative overflow-hidden rounded-xl transform-gpu"
                >
                  <motion.div 
                    className={`bg-gradient-to-br ${game.color} p-8 h-full shadow-lg relative z-10`}
                    initial={{ backgroundPosition: '0% 0%' }}
                    animate={{ 
                      backgroundPosition: hoveredGame === game.id ? '100% 100%' : '0% 0%'
                    }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  >
                    <motion.div
                      initial={{ scale: 1, rotate: 0 }}
                      whileHover={{ scale: 1.1, rotate: [-5, 5, 0] }}
                      transition={{ duration: 0.4 }}
                      className="inline-block mb-4"
                    >
                      <game.icon size={42} className="text-white/90" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold mb-3">{game.title}</h2>
                    <p className="text-white/80 mb-8">{game.description}</p>
                    
                    <Link href={game.path} className="inline-flex items-center gap-2 text-white font-semibold">
                      <span>Play Now</span>
                      <motion.div
                        animate={{
                          x: hoveredGame === game.id ? 5 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <FiArrowRight size={18} />
                      </motion.div>
                    </Link>
                    
                    <motion.div 
                      className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl"
                      initial={{ x: '100%', y: '100%' }}
                      animate={{ 
                        x: hoveredGame === game.id ? '50%' : '100%',
                        y: hoveredGame === game.id ? '0%' : '100%',
                        opacity: hoveredGame === game.id ? 0.15 : 0
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  )
} 
