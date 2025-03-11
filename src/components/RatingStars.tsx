'use client'

import { useState } from 'react'
import { FiStar } from 'react-icons/fi'
import { motion } from 'framer-motion'

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  editable?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  editable = false,
  onRatingChange,
  className = ''
}: RatingStarsProps) {
  const [hoverRating, setHoverRating] = useState(0)
  
  const handleClick = (index: number) => {
    if (editable && onRatingChange) {
      onRatingChange(index)
    }
  }
  
  const handleMouseEnter = (index: number) => {
    if (editable) {
      setHoverRating(index)
    }
  }
  
  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0)
    }
  }
  
  const getStarFill = (index: number) => {
    const displayRating = hoverRating > 0 ? hoverRating : rating
    
    if (index <= displayRating) {
      if (index <= Math.floor(displayRating)) {
        return 100 // Full star
      } else {
        // Partial star (for fractional ratings)
        return (displayRating - Math.floor(displayRating)) * 100
      }
    }
    
    return 0 // Empty star
  }

  return (
    <div className={`flex items-center ${className}`}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const starIndex = index + 1
        const fill = getStarFill(starIndex)
        const isActive = starIndex <= (hoverRating || rating)
        
        return (
          <div
            key={index}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            className={`relative ${editable ? 'cursor-pointer' : ''} p-0.5`}
          >
            {/* Background star (empty) */}
            <FiStar
              size={size}
              className="text-gray-600 stroke-[1.5]"
            />
            
            {/* Filled star overlay */}
            {fill > 0 && (
              <motion.div 
                className="absolute top-0 left-0 overflow-hidden text-yellow-400 p-0.5"
                initial={{ width: 0 }}
                animate={{ width: `${fill}%` }}
                transition={{ duration: 0.2 }}
              >
                <FiStar
                  size={size}
                  className={`${isActive ? 'fill-yellow-400' : 'fill-none'} stroke-yellow-400 stroke-[1.5]`}
                />
              </motion.div>
            )}
          </div>
        )
      })}
    </div>
  )
} 
