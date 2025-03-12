'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassCard from './ui/GlassCard';

interface MovieCardProps {
  id: number;
  title: string;
  thumbnailUrl: string;
  releaseYear: number;
  genre: string[];
}

export default function MovieCard({
  id,
  title,
  thumbnailUrl,
  releaseYear,
  genre
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/dashboard/movies/${id}`}>
      <GlassCard
        className="group cursor-pointer"
      >
        {/* Thumbnail */}
        <div 
          className="relative aspect-[2/3] overflow-hidden rounded-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
          
          {/* Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.5 }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 10, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
              {title}
            </h3>
            
            <div className="flex items-center gap-2 text-sm text-white/80">
              <span>{releaseYear}</span>
              <span>•</span>
              <span className="line-clamp-1">
                {genre.join(', ')}
              </span>
            </div>

            {/* Play button */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: isHovered ? 1 : 0,
                opacity: isHovered ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg 
                  className="w-8 h-8 text-white fill-current" 
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </GlassCard>
    </Link>
  );
}