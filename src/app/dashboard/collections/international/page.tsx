'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPlus, FiInfo, FiCheck, FiArrowLeft, FiGlobe, FiDownload } from 'react-icons/fi'
import Link from 'next/link'
import { useMyList } from '@/context/MyListContext'
import { supabase } from '@/lib/supabase'

type Movie = {
  id: number
  title: string
  description: string
  thumbnail_url: string
  release_year: number
  genre: string[]
}

export default function InternationalPage() {
  const { addToList, removeFromList, isInList } = useMyList()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovies() {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('title')
          .limit(8) // For demonstration purposes

        if (error) throw error

        setMovies(data || [])
      } catch (error) {
        console.error('Error fetching movies:', error)
        setError(error instanceof Error ? error.message : 'Failed to load movies')
      } finally {
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  const handlePlayMovie = (movieId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log(`Playing movie ${movieId}`);
    window.alert(`Now playing movie ID: ${movieId}`);
  }

  const handleAddToWatchlist = (movie: Movie, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const listItem = {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      thumbnail_url: movie.thumbnail_url,
      release_year: movie.release_year,
      type: 'movie',
      genres: movie.genre
    };
    
    if (isInList(movie.id)) {
      removeFromList(movie.id);
      console.log(`Removed movie ${movie.id} from My List`);
    } else {
      addToList(listItem);
      console.log(`Added movie ${movie.id} to My List`);
    }
  }

  const handleMoreInfo = (movieId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log(`Showing more info for movie ${movieId}`);
    window.location.href = `/dashboard/movies/${movieId}`;
  }

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading International Shows...</p>
      </motion.div>
    </div>
  )
  
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>

  const regions = [
    { id: 'all', name: 'All Regions' },
    { id: 'asia', name: 'Asia' },
    { id: 'europe', name: 'Europe' },
    { id: 'latinamerica', name: 'Latin America' }
  ]

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
        <h1 className="text-3xl font-bold">International Shows</h1>
      </div>
      
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-transparent p-4 rounded-lg mb-8">
        <h2 className="text-xl font-semibold mb-2">Global Entertainment</h2>
        <p className="text-gray-300 mb-4">Explore critically acclaimed series and films from around the world. Experience diverse storytelling with subtitles or dubbing options.</p>
        <div className="flex items-center text-sm text-primary">
          <FiGlobe className="mr-2" /> Content from 190+ countries
        </div>
      </div>

      {/* Region filters */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {regions.map((region) => (
          <motion.button
            key={region.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-800/50 text-white rounded-full whitespace-nowrap"
          >
            {region.name}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <motion.div 
            key={movie.id} 
            whileHover={{ scale: 1.05 }} 
            className="group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
              <img
                src={movie.thumbnail_url}
                alt={movie.title}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handleMoreInfo(movie.id)}
              />
              <div className="absolute top-2 left-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <FiDownload className="inline mr-1" size={12} /> New
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 p-4">
                  <h3 className="text-sm font-semibold">{movie.title}</h3>
                  <p className="text-xs text-gray-300">{movie.release_year}</p>
                  
                  <div className="flex gap-2 mt-2">
                    <button 
                      className="p-2 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors"
                      onClick={(e) => handlePlayMovie(movie.id, e)}
                      aria-label="Play"
                    >
                      <FiPlay size={16} />
                    </button>
                    
                    <button 
                      className={`p-2 rounded-full transition-colors ${
                        isInList(movie.id)
                          ? 'bg-primary/30 text-primary'
                          : 'bg-black/40 text-white/80 hover:text-white'
                      }`}
                      onClick={(e) => handleAddToWatchlist(movie, e)}
                      aria-label={isInList(movie.id) ? "Remove from watchlist" : "Add to watchlist"}
                    >
                      {isInList(movie.id) ? <FiCheck size={16} /> : <FiPlus size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 
