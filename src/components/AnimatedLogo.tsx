'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function AnimatedLogo({ 
  className = '', 
  linkWrapper = true, 
  scrollProgress = 0,
  autoPlay = true,
  loop = true
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  
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

  useEffect(() => {
    // Ensure video is muted to allow autoplay
    if (videoRef.current && !hasError) {
      videoRef.current.muted = true;
      
      // Play the video when component mounts if autoPlay is true
      if (autoPlay && videoRef.current.paused) {
        try {
          // Use a timeout to ensure browser allows autoplay after user interaction
          const playPromise = videoRef.current.play();
          
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.log("Autoplay prevented:", error);
              setHasError(true); // Fallback to static image on autoplay error
            });
          }
        } catch (error) {
          console.error("Video playback error:", error);
          setHasError(true);
        }
      }
    }
  }, [autoPlay, hasError]);

  const handleVideoLoaded = () => {
    setIsLoaded(true);
  };

  const handleVideoError = () => {
    console.error("Video failed to load");
    setHasError(true);
    setIsLoaded(true); // Consider it loaded to remove loading state
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
      
      {/* Placeholder while video loads */}
      {!isLoaded && (
        <div className="w-[160px] h-[48px] bg-bg-200/30 animate-pulse rounded-md"></div>
      )}
      
      {/* Show static image if video has error or fallback to video */}
      {hasError ? (
        <Image 
          src='/logo.png' 
          alt='RIX' 
          width={160} 
          height={48} 
          priority 
          className="relative z-10"
        />
      ) : (
        /* Animated logo video */
        <video 
          ref={videoRef}
          className={`relative z-10 w-[160px] h-auto rounded-md object-contain ${!isLoaded ? 'opacity-0' : 'opacity-100'}`}
          width={160}
          height={48}
          playsInline
          autoPlay={autoPlay}
          loop={loop}
          muted
          onLoadedData={handleVideoLoaded}
          onError={handleVideoError}
          style={{ transition: 'opacity 0.3s ease' }}
        >
          <source src="/videos/rix.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
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