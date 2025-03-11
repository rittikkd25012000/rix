'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiFilter } from 'react-icons/fi'
import Link from 'next/link'

export default function GenrePage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  
  const genres = [
    { id: 'action', name: 'Action', color: 'from-red-500/20 to-red-800/30', count: 28 },
    { id: 'adventure', name: 'Adventure', color: 'from-green-500/20 to-green-800/30', count: 42 },
    { id: 'animation', name: 'Animation', color: 'from-blue-500/20 to-blue-800/30', count: 15 },
    { id: 'comedy', name: 'Comedy', color: 'from-yellow-500/20 to-yellow-800/30', count: 68 },
    { id: 'crime', name: 'Crime', color: 'from-indigo-500/20 to-indigo-800/30', count: 22 },
    { id: 'documentary', name: 'Documentary', color: 'from-gray-500/20 to-gray-800/30', count: 19 },
    { id: 'drama', name: 'Drama', color: 'from-purple-500/20 to-purple-800/30', count: 92 },
    { id: 'family', name: 'Family', color: 'from-pink-500/20 to-pink-800/30', count: 34 },
    { id: 'fantasy', name: 'Fantasy', color: 'from-teal-500/20 to-teal-800/30', count: 26 },
    { id: 'history', name: 'History', color: 'from-amber-500/20 to-amber-800/30', count: 14 },
    { id: 'horror', name: 'Horror', color: 'from-red-900/20 to-red-950/30', count: 31 },
    { id: 'music', name: 'Music', color: 'from-sky-500/20 to-sky-800/30', count: 9 },
    { id: 'mystery', name: 'Mystery', color: 'from-violet-500/20 to-violet-800/30', count: 17 },
    { id: 'romance', name: 'Romance', color: 'from-rose-500/20 to-rose-800/30', count: 39 },
    { id: 'scifi', name: 'Science Fiction', color: 'from-blue-700/20 to-blue-950/30', count: 29 },
    { id: 'thriller', name: 'Thriller', color: 'from-slate-600/20 to-slate-900/30', count: 43 },
    { id: 'war', name: 'War', color: 'from-stone-500/20 to-stone-800/30', count: 11 },
    { id: 'western', name: 'Western', color: 'from-orange-500/20 to-orange-800/30', count: 7 }
  ]

  const handleGenreClick = (genreId: string) => {
    setSelectedGenre(genreId)
    // In a real app, this would navigate to a genre-specific page
    // window.location.href = `/dashboard/genre/${genreId}`
  }

  return (
    <div className="pb-16 px-4">
      <div className="py-6 flex items-center">
        <Link href="/dashboard" className="mr-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-2 rounded-full bg-gray-800/80"
          >
            <FiArrowLeft size={20} />
          </motion.button>
        </Link>
        <h1 className="text-3xl font-bold">Browse by Genre</h1>
      </div>
      
      <div className="bg-gradient-to-r from-gray-800 to-black p-4 rounded-lg mb-8">
        <div className="flex items-center mb-2">
          <FiFilter className="mr-2 text-primary" />
          <h2 className="text-xl font-semibold">All Genres</h2>
        </div>
        <p className="text-gray-300">Explore our content categorized by genre. Click on any genre to see the associated movies and shows.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {genres.map((genre, index) => (
          <motion.div 
            key={genre.id}
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            onClick={() => handleGenreClick(genre.id)}
          >
            <div className={`aspect-video rounded-lg overflow-hidden relative bg-gradient-to-br ${genre.color}`}>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-lg font-semibold mb-1">{genre.name}</h3>
                <p className="text-xs text-white/80">{genre.count} titles</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Genre Mood Selector - a more fun way to discover content */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Find by Mood</h2>
        <div className="flex flex-wrap gap-3">
          {['Feel-good', 'Exciting', 'Suspenseful', 'Romantic', 'Scary', 'Thought-provoking', 'Emotional', 'Light-hearted'].map((mood) => (
            <motion.button
              key={mood}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gray-800/50 text-white rounded-full hover:bg-primary/50 transition-colors"
            >
              {mood}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
} 
