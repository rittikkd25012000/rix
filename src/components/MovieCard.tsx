'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiPlus, FiInfo } from 'react-icons/fi';
import Image from 'next/image';

type MovieProps = {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  release_year: number;
  genre: string[];
};

type MovieCardProps = {
  movie: MovieProps;
  onPlay: (e: React.MouseEvent) => void;
  onAddToList: (e: React.MouseEvent) => void;
  onMoreInfo: (e: React.MouseEvent) => void;
};

export default function MovieCard({ movie, onPlay, onAddToList, onMoreInfo }: MovieCardProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / 8) * -1; // More responsive rotation
    const rotateY = (x - centerX) / 8;
    
    setRotateX(rotateX);
    setRotateY(rotateY);
  };
  
  const resetRotation = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  // Card appearance variants for motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      zIndex: 10,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Button animations
  const buttonVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.05 * i,
        duration: 0.2,
        type: "spring",
        stiffness: 300
      }
    }),
    hover: { scale: 1.1 },
    tap: { scale: 0.9 }
  };

  // Fallback image if the original fails to load
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Consider it loaded to remove loading state
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'all 0.1s ease'
      }}
      className="rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 shadow-xl h-full neon-border"
    >
      {/* Movie thumbnail */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.div
          initial={{ filter: 'blur(20px)', opacity: 0.8 }}
          animate={{ 
            filter: imageLoaded ? 'blur(0px)' : 'blur(20px)', 
            opacity: 1,
            transition: { duration: 0.5 }
          }}
          className="relative w-full h-full"
        >
          {!imageError ? (
            <Image
              src={movie.thumbnail_url}
              alt={movie.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'}`}
              onLoad={() => setImageLoaded(true)}
              onError={handleImageError}
              priority={false}
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-white/50">
              <div className="text-center p-2">
                <span className="text-sm">{movie.title}</span>
              </div>
            </div>
          )}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
        </motion.div>
        
        {/* Hover overlay with controls */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex flex-col justify-end p-3 backdrop-blur-sm"
            >
              <motion.div 
                className="relative z-10 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h3 className="font-bold text-white truncate text-lg">{movie.title}</h3>
                <p className="text-xs text-gray-300 mt-1">{movie.release_year}</p>
              </motion.div>
              
              <div className="flex space-x-2 mb-2">
                <motion.button
                  custom={0}
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onPlay}
                  className="bg-primary-300 text-white p-2 rounded-full shadow-lg shadow-primary-300/30"
                  aria-label="Play"
                >
                  <FiPlay size={16} />
                </motion.button>
                <motion.button
                  custom={1}
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onAddToList}
                  className="bg-white/20 text-white p-2 rounded-full backdrop-blur-md"
                  aria-label="Add to list"
                >
                  <FiPlus size={16} />
                </motion.button>
                <motion.button
                  custom={2}
                  variants={buttonVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={onMoreInfo}
                  className="bg-white/20 text-white p-2 rounded-full backdrop-blur-md"
                  aria-label="More information"
                >
                  <FiInfo size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Movie info for non-hover state */}
      <AnimatePresence>
        {!isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-3 bg-gradient-to-t from-bg-200/80 to-bg-200/30 backdrop-blur-sm"
          >
            <h3 className="font-semibold text-white truncate">{movie.title}</h3>
            <p className="text-xs text-gray-400 mt-1">{movie.release_year}</p>
            {movie.genre && movie.genre.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {movie.genre.slice(0, 2).map((g, index) => (
                  <motion.span 
                    key={index} 
                    className="text-[10px] px-1.5 py-0.5 bg-primary-100/40 rounded-full text-primary-300 backdrop-blur-md"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 + (index * 0.1) }}
                  >
                    {g}
                  </motion.span>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}