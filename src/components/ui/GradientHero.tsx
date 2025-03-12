'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GradientHero({ 
  title, 
  subtitle,
  className = '' 
}: { 
  title: string;
  subtitle?: string;
  className?: string;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 z-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(203,92,232,0.3) 0%, rgba(0,0,0,0) 50%)',
            'radial-gradient(circle at 100% 100%, rgba(255,58,95,0.3) 0%, rgba(0,0,0,0) 50%)',
            'radial-gradient(circle at 100% 0%, rgba(203,92,232,0.3) 0%, rgba(0,0,0,0) 50%)',
            'radial-gradient(circle at 0% 100%, rgba(255,58,95,0.3) 0%, rgba(0,0,0,0) 50%)',
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Interactive gradient overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-50"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(203,92,232,0.2) 0%, rgba(0,0,0,0) 50%)`
        }}
      />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 z-10 opacity-20 mix-blend-soft-light"
        style={{ backgroundImage: 'url(/effects/noise.png)' }}
      />

      {/* Content */}
      <div className="relative z-20 p-8 md:p-12 lg:p-16">
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            className="text-lg md:text-xl text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            border: '2px solid transparent',
            backgroundImage: 'linear-gradient(90deg, rgba(203,92,232,0.3), rgba(255,58,95,0.3))',
            backgroundClip: 'padding-box',
            WebkitBackgroundClip: 'padding-box',
          }}
          animate={{
            borderColor: [
              'rgba(203,92,232,0.3)',
              'rgba(255,58,95,0.3)',
              'rgba(203,92,232,0.3)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>
    </div>
  );
} 