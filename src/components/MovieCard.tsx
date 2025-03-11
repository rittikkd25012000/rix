'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
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
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / 10) * -1; // Inverted for natural feel
    const rotateY = (x - centerX) / 10;
    
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
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ 
        scale: 1.05,
        zIndex: 10
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={resetRotation}
      style={{
        transformStyle: "preserve-3d",
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: 'all 0.1s ease'
      }}
      className="rounded-lg overflow-hidden bg-gray-900/80 backdrop-blur-sm border border-white/10 shadow-xl h-full"
    >
      {/* Movie thumbnail */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <motion.div
          initial={{ filter: 'blur(20px)', opacity: 0.8 }}
          animate={{ filter: imageLoaded ? 'blur(0px)' : 'blur(20px)', opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          <Image
            src={movie.thumbnail_url}
            alt={movie.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          )}
        </motion.div>
        
        {/* Hover overlay with controls */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 flex flex-col justify-end p-3"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex space-x-2 mb-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onPlay}
              className="bg-primary text-white p-2 rounded-full"
            >
              <FiPlay size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onAddToList}
              className="bg-white/20 text-white p-2 rounded-full"
            >
              <FiPlus size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMoreInfo}
              className="bg-white/20 text-white p-2 rounded-full"
            >
              <FiInfo size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
      
      {/* Movie info */}
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{movie.title}</h3>
        <p className="text-xs text-gray-400 mt-1">{movie.release_year}</p>
      </div>
    </motion.div>
  );
} 