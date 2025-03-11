'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeIn, slideUp } from '@/utils/animations'

const ChaiGlass = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="cursor-pointer relative w-40 h-48 group"
  >
    {/* Glass Container */}
    <motion.div
      animate={{
        y: [0, -3, 0],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0"
    >
      {/* Glass Body */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-24">
        {/* Glass Structure - Main Body */}
        <div className="absolute inset-0">
          {/* Front Glass Face */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200/10 to-white/20 rounded-lg backdrop-blur-sm border border-gray-200/30" />
          
          {/* Glass Rim */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-gray-200/30 via-white/40 to-gray-200/30 rounded-t-lg" />
          
          {/* Glass Side Reflection */}
          <div className="absolute top-0 bottom-0 left-1 w-[1px] bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
          <div className="absolute top-0 bottom-0 right-1 w-[1px] bg-gradient-to-b from-white/40 via-white/20 to-transparent" />
          
          {/* Glass Bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-200/30 via-white/40 to-gray-200/30 rounded-b-lg" />
        </div>
        
        {/* Chai Liquid */}
        <motion.div
          animate={{
            opacity: [0.8, 0.9, 0.8],
            height: ["75%", "77%", "75%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-900 rounded-lg overflow-hidden"
          style={{
            clipPath: "inset(0 1px 1px 1px round 4px)"
          }}
        >
          {/* Enhanced Chai Surface Shine */}
          <motion.div
            animate={{
              opacity: [0.5, 0.7, 0.5],
              x: [-15, 15, -15]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent"
          />
          
          {/* Enhanced Milk Swirl Effect */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 opacity-20"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
            }}
          />

          {/* Additional Swirl Effects */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`swirl-${i}`}
              animate={{
                rotate: [0, 360],
                scale: [0.8, 1, 0.8],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-8 h-8"
              style={{
                top: `${30 + i * 20}%`,
                left: `${20 + i * 20}%`,
                background: "radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)"
              }}
            />
          ))}
        </motion.div>

        {/* Glass Reflections */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-white/40" />
          
          {/* Side Highlights */}
          <div className="absolute top-0 left-2 w-[1px] h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent transform -skew-x-12" />
          <div className="absolute top-0 right-2 w-[1px] h-full bg-gradient-to-b from-white/30 via-white/20 to-transparent transform skew-x-12" />
        </div>
      </div>

      {/* Enhanced Saucer/Base */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <div className="relative">
          {/* Main Saucer */}
          <div className="w-24 h-1.5 bg-gradient-to-r from-gray-300/20 via-gray-200/30 to-gray-300/20 rounded-full backdrop-blur-sm" />
          
          {/* Saucer Rim */}
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-20 h-[2px] bg-white/20 rounded-full" />
          
          {/* Saucer Shadow */}
          <div className="w-20 h-1 bg-gradient-to-r from-gray-300/5 via-gray-200/10 to-gray-300/5 rounded-full mt-1 blur-sm" />
        </div>
      </div>

      {/* Enhanced Steam Animation */}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2"
        initial="hidden"
        animate="visible"
      >
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [-20, -80],
              x: [0, (i % 2 === 0 ? 25 : -25) * Math.random()],
              opacity: [0.9, 0],
              scale: [1, 2.5],
              rotate: [0, i % 2 === 0 ? 60 : -60]
            }}
            transition={{
              duration: 2.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeOut"
            }}
            className="absolute w-2 h-8 origin-bottom"
          >
            <div className="w-full h-full bg-gradient-to-t from-white/50 to-transparent rounded-full blur-sm" />
          </motion.div>
        ))}
        
        {/* Additional Particle Effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            animate={{
              y: [-10, -40],
              x: [0, (i % 3 - 1) * 15],
              opacity: [0.7, 0],
              scale: [0.5, 1.5]
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeOut"
            }}
            className="absolute w-1 h-1 bg-white/30 rounded-full blur-sm"
          />
        ))}
      </motion.div>

      {/* Enhanced Price Tag */}
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          rotate: [-1, 1, -1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 rounded-full shadow-lg group-hover:shadow-amber-500/20 group-hover:from-amber-600 group-hover:to-amber-700"
      >
        <span className="text-white flex items-center gap-2 font-heading">
          <span>Buy me a Cutting Chai</span>
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            ☕
          </motion.span>
        </span>
      </motion.div>
    </motion.div>
  </motion.div>
)

const Cigarette = ({ onClick }: { onClick: () => void }) => (
  <motion.div
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="cursor-pointer relative w-40 h-48 group"
  >
    {/* Cigarette Container */}
    <motion.div
      animate={{
        rotate: [-2, 2, -2]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute inset-0"
    >
      {/* Enhanced Cigarette Body */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-40">
        {/* Enhanced Filter */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-orange-300 to-orange-400 rounded-b-sm shadow-inner">
          {/* Filter Lines */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-[1px] bg-orange-900"
                style={{ top: `${i * 25}%` }}
              />
            ))}
          </div>
        </div>
        
        {/* Enhanced White Part */}
        <div className="absolute bottom-8 left-0 right-0 h-32 bg-gradient-to-b from-white to-gray-50 border border-gray-100 rounded-t-sm shadow-inner">
          {/* Paper Texture */}
          <div className="absolute inset-0 opacity-10 bg-repeat" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23999" fill-opacity="0.1"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/svg%3E")' }} />
          
          {/* Enhanced Burning Line */}
          <motion.div
            animate={{
              opacity: [1, 0.5, 1],
              y: [0, -0.5, 0],
              background: [
                "linear-gradient(90deg, #f97316 0%, #ef4444 50%, #f97316 100%)",
                "linear-gradient(90deg, #ef4444 0%, #dc2626 50%, #ef4444 100%)",
                "linear-gradient(90deg, #f97316 0%, #ef4444 50%, #f97316 100%)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute top-0 left-0 right-0 h-[2px]"
          />
        </div>

        {/* Enhanced Burning Tip */}
        <motion.div
          animate={{
            opacity: [0.8, 1, 0.8],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3"
        >
          {/* Core Ember */}
          <motion.div
            animate={{
              background: [
                "radial-gradient(circle, #ef4444 0%, #dc2626 50%, #991b1b 100%)",
                "radial-gradient(circle, #f97316 0%, #ef4444 50%, #dc2626 100%)",
                "radial-gradient(circle, #ef4444 0%, #dc2626 50%, #991b1b 100%)"
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 rounded-full shadow-lg"
          />
          
          {/* Ember Glow */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="absolute inset-0 bg-orange-500 rounded-full blur-md"
          />
        </motion.div>

        {/* Enhanced Smoke Animation */}
        <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [-20, -100],
                x: [0, (i % 2 === 0 ? 30 : -30) * Math.random()],
                opacity: [0.8, 0],
                scale: [1, 4],
                rotate: [0, i % 2 === 0 ? 90 : -90]
              }}
              transition={{
                duration: 4 + Math.random(),
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeOut"
              }}
              className="absolute w-2 h-8 bg-gradient-to-t from-gray-300/40 to-transparent rounded-full blur-lg"
            />
          ))}

          {/* Additional Smoke Particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              animate={{
                y: [-10, -60],
                x: [0, (i % 3 - 1) * 25 * Math.random()],
                opacity: [0.6, 0],
                scale: [0.5, 2],
                rotate: [0, i % 2 === 0 ? 45 : -45]
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeOut"
              }}
              className="absolute w-1 h-2 bg-gray-300/30 rounded-full blur-sm"
            />
          ))}
        </motion.div>
      </div>
    </motion.div>

    {/* Enhanced Price Tag */}
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        rotate: [-1, 1, -1]
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }}
      className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-3 rounded-full shadow-lg group-hover:shadow-gray-500/20 group-hover:from-gray-800 group-hover:to-gray-900"
    >
      <span className="text-white flex items-center gap-2 font-heading">
        <span>Buy me a Gold Flake</span>
        <motion.span
          animate={{
            rotate: [0, -10, 10, -10, 10, 0],
            opacity: [1, 0.8, 1]
          }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
        >
          🚬
        </motion.span>
      </span>
    </motion.div>
  </motion.div>
)

export default function PaymentsPage() {
  const { user } = useAuth()
  const [showQR, setShowQR] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState<5 | 10>(5)

  if (!user) {
    return (
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
        className="text-center py-12"
      >
        <div className="text-red-500 mb-4">Please sign in first</div>
        <Link href="/" className="text-blue-500 hover:underline">
          Go to Sign In
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent font-heading">
            Support My Work!
          </h1>
          <p className="text-amber-600/80 dark:text-amber-500/80 text-lg font-body">
            Choose your way to support 🙏
          </p>
        </motion.div>

        <div className="flex justify-center items-center gap-12 py-12">
          <ChaiGlass onClick={() => {
            setSelectedAmount(5)
            setShowQR(true)
          }} />
          <Cigarette onClick={() => {
            setSelectedAmount(10)
            setShowQR(true)
          }} />
        </div>

        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
                onClick={e => e.stopPropagation()}
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-2xl mb-2"
                >
                  {selectedAmount === 5 ? '☕' : '🚬'}
                </motion.div>
                <h3 className="text-xl mb-4 text-amber-600 dark:text-amber-500 font-heading">
                  {selectedAmount === 5 ? 'Your Cutting Chai is Ready!' : 'Time for a Gold Flake Break!'}
                </h3>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-4 rounded-xl inline-block mb-4">
                  <div className="w-64 h-64 bg-white dark:bg-gray-900 flex items-center justify-center rounded-lg">
                    <p className="text-amber-600 dark:text-amber-500 font-body">QR Code for ₹{selectedAmount}</p>
                  </div>
                </div>
                <p className="text-sm text-amber-600/80 dark:text-amber-500/80 mb-4 font-body">
                  Scan with any UPI app 🙏
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  className="text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors font-heading"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
