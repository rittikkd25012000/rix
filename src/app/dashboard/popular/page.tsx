'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiPlus, FiCheck, FiArrowLeft, FiFilter, FiHeart, FiBookmark, FiTrendingUp } from 'react-icons/fi'
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

export default function PopularPage() {
  const router = useRouter()
  const { addToList, removeFromList, isInList } = useMyList()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [likedMovies, setLikedMovies] = useState<number[]>([])
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    async function fetchMovies() {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('release_year', { ascending: false })
          .limit(20) // For demonstration purposes

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
  
  const handleLikeMovie = (movieId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (likedMovies.includes(movieId)) {
      setLikedMovies(likedMovies.filter(id => id !== movieId));
    } else {
      setLikedMovies([...likedMovies, movieId]);
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
        <p className="text-gray-400">Loading Popular Content...</p>
      </motion.div>
    </div>
  )
  
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>

  const filters = [
    { id: 'all', name: 'All', icon: FiFilter },
    { id: 'trending', name: 'Trending Now', icon: FiTrendingUp },
    { id: 'watchlist', name: 'Most Watchlisted', icon: FiBookmark },
    { id: 'liked', name: 'Most Liked', icon: FiHeart }
  ]

  return (
    <div className="min-h-screen pb-20">
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
          <h1 className="text-3xl font-bold">Popular Now</h1>
        </div>
        
        <div className="px-4 sm:px-6 md:px-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {Array(15).fill(0).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))}
            </div>
          ) : (
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
          )}
        </div>
      </motion.div>
    </div>
  )
} 
