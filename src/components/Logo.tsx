'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ className = '', linkWrapper = true, scrollProgress = 0 }) {
  // Calculate logo transformations based on scroll progress
  const logoScale = 1 - (scrollProgress * 0.3); // Scale down to 70% when fully scrolled
  const logoOpacity = 1 - (scrollProgress * 0.2); // Slightly reduce opacity

  // Logo animation variants
  const logoVariants = {
    initial: { 
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)'
    },
    animate: { 
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    },
    hover: {
      scale: 1.05,
      filter: 'drop-shadow(0 0 8px rgba(203, 92, 232, 0.7))',
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const logoContent = (
    <motion.div 
      className={`relative ${className}`}
      style={{ 
        scale: logoScale,
        opacity: logoOpacity,
      }}
      variants={logoVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Glow effect behind logo */}
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
      <Image 
        src='/logo.png' 
        alt='RIX' 
        width={160} 
        height={48} 
        priority 
        className="relative z-10"
      />
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
