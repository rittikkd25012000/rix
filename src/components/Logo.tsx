'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Logo({ className = '', linkWrapper = true, scrollProgress = 0 }) {
  // Calculate logo transformations based on scroll progress
  const logoScale = 1 - (scrollProgress * 0.3); // Scale down to 70% when fully scrolled
  const logoOpacity = 1 - (scrollProgress * 0.2); // Slightly reduce opacity

  const logoContent = (
    <motion.div 
      className={className}
      style={{ 
        scale: logoScale,
        opacity: logoOpacity,
      }}
    >
      <Image src='/logo.png' alt='RIX' width={160} height={48} priority />
    </motion.div>
  );

  if (linkWrapper) {
    return (
      <Link href='/dashboard'>{logoContent}</Link>
    );
  }

  return logoContent;
}
