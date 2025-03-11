'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPlus, FiInfo, FiCheck, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'
import { useMyList } from '@/context/MyListContext'
import { supabase } from '@/lib/supabase'
import MovieCardSkeleton from '@/components/MovieCardSkeleton'
import MovieCard from '@/components/MovieCard'
import { useRouter } from 'next/navigation'

type Movie = {
  id: number
  title: string
  description: string
  thumbnail_url: string
  release_year: number
  genre: string[]
}

export default function OriginalsPage() {
  const router = useRouter()
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
          .limit(10) // For demonstration purposes

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

  return (
    <div className="min-h-screen pb-20">
      {loading ? (
        <div className="flex justify-center mt-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="animate-pulse flex flex-col items-center"
          >
            <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading Originals...</p>
          </motion.div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="px-4 sm:px-6 md:px-8 py-8">
            <Link href="/dashboard" className="mb-4 flex items-center text-gray-400 hover:text-white">
              <motion.button
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiArrowLeft className="mr-2" /> Back
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold">Originals</h1>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent p-4 rounded-lg mb-8 mx-4 sm:mx-6 md:mx-8"
          >
            <h2 className="text-xl font-semibold mb-2">Exclusive Content</h2>
            <p className="text-gray-300 mb-4">Enjoy our handpicked selection of exclusive original productions, available only on our platform.</p>
            <div className="flex items-center text-sm text-primary">
              <FiInfo className="mr-2" /> Updated weekly with fresh content
            </div>
          </motion.div>
          
          <div className="px-4 sm:px-6 md:px-8">
            <motion.div 
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
            >
              {movies.map((movie) => (
                <MovieCard 
                  key={movie.id} 
                  movie={movie}
                  onPlay={(e) => handlePlayMovie(movie.id, e)}
                  onAddToList={(e) => handleAddToWatchlist(movie, e)}
                  onMoreInfo={(e) => handleMoreInfo(movie.id, e)}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  )
} 
