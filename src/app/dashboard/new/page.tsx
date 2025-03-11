'use client'

import { motion } from 'framer-motion'
import { FiTool, FiClock, FiAlertCircle } from 'react-icons/fi'

export default function NewPage() {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  // Construction animation for the gear
  const gearAnimation = {
    rotate: [0, 360],
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 bg-gradient-to-b from-background to-gray-900/50">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center max-w-2xl"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
            Coming Soon
          </span>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Currently Under Progress
          </h1>
          <p className="text-gray-400">Our team is working hard to bring you this exciting new feature</p>
        </motion.div>
        
        <motion.div 
          className="w-48 h-48 mx-auto mb-8 relative"
          animate={pulseAnimation}
        >
          {/* Construction animation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="absolute w-full h-full"
              animate={gearAnimation}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full text-primary">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </motion.div>
            
            <motion.div 
              className="absolute"
              animate={{ rotate: -360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-24 h-24 text-yellow-400">
                <path d="M12 2L2 12h5v8h10v-8h5L12 2z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <FiTool className="text-primary mb-2" size={24} />
            <h3 className="font-semibold mb-1">Under Construction</h3>
            <p className="text-sm text-gray-400">We're building something amazing for you</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <FiClock className="text-primary mb-2" size={24} />
            <h3 className="font-semibold mb-1">Coming Soon</h3>
            <p className="text-sm text-gray-400">The wait will be worth it</p>
          </div>
          
          <div className="bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10">
            <FiAlertCircle className="text-primary mb-2" size={24} />
            <h3 className="font-semibold mb-1">Stay Tuned</h3>
            <p className="text-sm text-gray-400">We'll notify you when it's ready</p>
          </div>
        </motion.div>
        
        <motion.button 
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Dashboard
        </motion.button>
      </motion.div>
    </div>
  )
} 
