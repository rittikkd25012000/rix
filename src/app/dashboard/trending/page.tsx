'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyList } from '@/context/MyListContext'
import { motion } from 'framer-motion'
import { FiPlay, FiPlus, FiCheck, FiInfo, FiTrendingUp } from 'react-icons/fi'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// Define the Movie type
interface Movie {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  release_year: number;
  genres: string[];
  trending: boolean;
}

export default function TrendingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addToList, removeFromList, isInList } = useMyList()
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        setLoading(true)
        // In a real app, you would fetch this from a real API
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(30)

        if (error) throw error
        
        // Mark some movies as trending based on some criteria (e.g., view count)
        // For demo purposes, we'll mark every third movie as trending
        const trendingData = data.map((movie: any) => ({
          ...movie,
          genres: movie.genres || [],
          trending: true
        }))

        setTrendingMovies(trendingData)
      } catch (error) {
        console.error('Error fetching trending movies:', error)
        setError('Failed to load trending movies')
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [])

  const handlePlayMovie = (movieId: number) => {
    console.log(`Playing movie ${movieId}`)
    // In a real app, this would navigate to a player or start streaming
    router.push(`/dashboard/watch/${movieId}`)
  }

  const handleToggleMyList = (movie: Movie) => {
    if (isInList(movie.id)) {
      removeFromList(movie.id)
      console.log(`Removed ${movie.title} from My List`)
    } else {
      addToList({
        id: movie.id,
        title: movie.title,
        description: movie.description,
        thumbnail_url: movie.thumbnail_url,
        release_year: movie.release_year,
        type: 'movie',
        genres: movie.genres
      })
      console.log(`Added ${movie.title} to My List`)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-24"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiTrendingUp className="text-primary" />
              Trending Now
            </h1>
            <p className="text-gray-400 mt-1">
              The most popular content currently streaming on RIX
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-gray-900/50 rounded-lg p-8 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {trendingMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800 group hover:border-gray-700 transition-all"
              >
                <div className="aspect-[2/3] relative">
                  <img 
                    src={movie.thumbnail_url} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    <FiTrendingUp className="inline mr-1" size={12} /> Trending
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex gap-2 mb-3">
                        <button 
                          onClick={() => handlePlayMovie(movie.id)}
                          className="flex-1 flex items-center justify-center gap-1 bg-primary text-white text-sm py-2 rounded-md"
                        >
                          <FiPlay size={14} /> Play
                        </button>
                        <button 
                          onClick={() => handleToggleMyList(movie)}
                          className="p-2 bg-gray-800/80 rounded-full text-white/80 hover:text-white"
                          aria-label={isInList(movie.id) ? "Remove from My List" : "Add to My List"}
                        >
                          {isInList(movie.id) ? <FiCheck size={16} /> : <FiPlus size={16} />}
                        </button>
                        <Link 
                          href={`/dashboard/movies/${movie.id}`}
                          className="p-2 bg-gray-800/80 rounded-full text-white/80 hover:text-white"
                        >
                          <FiInfo size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span>{movie.release_year}</span>
                    {movie.genres && movie.genres.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{movie.genres[0]}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {movie.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
