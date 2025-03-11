'use client';

import { motion } from 'framer-motion';

export default function MovieCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-800/50 h-full">
      <motion.div 
        className="aspect-[2/3] bg-gray-700/50"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <div className="p-3">
        <motion.div 
          className="h-4 bg-gray-700/50 rounded w-3/4 mb-2"
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="h-3 bg-gray-700/50 rounded w-1/2"
          animate={{
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2
          }}
        />
      </div>
    </div>
  );
} 