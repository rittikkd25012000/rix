'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverScale?: number;
}

export default function GlassCard({ 
  children, 
  className = '',
  hoverScale = 1.02
}: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-xl
        bg-white/5 backdrop-blur-lg
        border border-white/10
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: hoverScale }}
      transition={{
        opacity: { duration: 0.5 },
        y: { duration: 0.5 },
        scale: { duration: 0.2 }
      }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          transform: 'translateX(-100%)',
        }}
        whileHover={{
          opacity: 1,
          x: ['0%', '100%'],
          transition: {
            x: { duration: 1, repeat: Infinity }
          }
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom highlight */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </motion.div>
  );
} 