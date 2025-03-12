'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';

export default function AnimatedLogoSVG({ 
  className = '', 
  linkWrapper = true, 
  scrollProgress = 0 
}) {
  // Calculate logo transformations based on scroll progress
  const logoScale = 1 - (scrollProgress * 0.3); // Scale down to 70% when fully scrolled
  const logoOpacity = 1 - (scrollProgress * 0.2); // Slightly reduce opacity

  // SVG animation variants
  const svgVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8 } }
  };

  // Path animation variants
  const pathVariants = {
    initial: { 
      pathLength: 0,
      fill: "rgba(203, 92, 232, 0)",
    },
    animate: { 
      pathLength: 1,
      fill: "rgba(203, 92, 232, 1)",
      transition: { 
        pathLength: { duration: 1.5, ease: "easeInOut" },
        fill: { duration: 1.2, delay: 0.5, ease: "easeInOut" }
      }
    }
  };

  // The SVG content with the RIX logo
  const logoContent = (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      style={{ 
        scale: logoScale,
        opacity: logoOpacity 
      }}
    >
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 blur-xl opacity-50 rounded-full"
        animate={{
          background: [
            'linear-gradient(90deg, rgba(203, 92, 232, 0.3), rgba(255, 58, 95, 0.3))',
            'linear-gradient(180deg, rgba(203, 92, 232, 0.3), rgba(255, 58, 95, 0.3))',
            'linear-gradient(270deg, rgba(203, 92, 232, 0.3), rgba(255, 58, 95, 0.3))',
            'linear-gradient(0deg, rgba(203, 92, 232, 0.3), rgba(255, 58, 95, 0.3))',
            'linear-gradient(90deg, rgba(203, 92, 232, 0.3), rgba(255, 58, 95, 0.3))'
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "loop"
        }}
      />
      
      {/* Animated SVG logo */}
      <motion.svg 
        width="160" 
        height="48" 
        viewBox="0 0 160 48" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10"
        variants={svgVariants}
        initial="initial"
        animate="animate"
      >
        {/* R */}
        <motion.path
          d="M20 8H40C42.2 8 44 9.8 44 12V16C44 18.2 42.2 20 40 20H36L44 40H36L28 20H28V40H20V8Z"
          fill="#CB5CE8"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
        {/* I */}
        <motion.path
          d="M52 8H60V40H52V8Z"
          fill="#CB5CE8"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
        {/* X */}
        <motion.path
          d="M68 8H76L84 20L92 8H100L88 24L100 40H92L84 28L76 40H68L80 24L68 8Z"
          fill="#FF3A5F"
          variants={pathVariants}
          initial="initial"
          animate="animate"
        />
        {/* Pulse effect */}
        <motion.circle
          cx="84"
          cy="24"
          r="40"
          fill="none"
          stroke="rgba(203, 92, 232, 0.3)"
          strokeWidth="1"
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ 
            scale: [0.5, 1.2, 0.5],
            opacity: [0.7, 0, 0.7]
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "loop"
          }}
        />
      </motion.svg>
    </motion.div>
  );

  if (linkWrapper) {
    return (
      <Link href='/dashboard' className="block">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
} 