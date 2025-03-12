'use client';

import { motion } from 'framer-motion';

export default function MovieCardSkeleton() {
  return (
    <motion.div 
      className="rounded-lg overflow-hidden backdrop-blur-sm border border-white/5 h-full glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(120deg, rgba(26, 26, 46, 0) 30%, rgba(59, 7, 100, 0.1) 50%, rgba(26, 26, 46, 0) 70%)'
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        />
        <motion.div 
          className="absolute inset-0 bg-bg-200/80"
          animate={{
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="p-3 bg-gradient-to-t from-bg-200/80 to-bg-200/30 backdrop-blur-sm">
        <div className="space-y-2">
          <motion.div 
            className="h-4 bg-white/5 rounded-md w-3/4"
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="h-3 bg-white/5 rounded-md w-1/2"
            animate={{
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <div className="flex gap-1 pt-1">
            <motion.div 
              className="h-3 bg-primary-100/20 rounded-full w-12"
              animate={{
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3
              }}
            />
            <motion.div 
              className="h-3 bg-primary-100/20 rounded-full w-10"
              animate={{
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4
              }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
} 