'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyList } from '@/context/MyListContext'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiPlay, 
  FiPlus, 
  FiInfo, 
  FiHeart, 
  FiBookmark, 
  FiTrendingUp, 
  FiStar, 
  FiDownload,
  FiFilter,
  FiClock,
  FiCalendar,
  FiCheck,
  FiX,
  FiShare2,
  FiTag,
  FiArrowRight
} from 'react-icons/fi'
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

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { addToList, removeFromList, isInList } = useMyList()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [likedMovies, setLikedMovies] = useState<number[]>([])
  const [scrollY, setScrollY] = useState(0)

  // Scroll position for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchMovies() {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('title')

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

  if (!user) return null
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading amazing content for you...</p>
      </motion.div>
    </div>
  )
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>

  const featuredMovie = movies[0]

  // Main categories with clear purposes
  const mainCategories = [
    { id: 'trending', name: 'Trending', icon: FiTrendingUp, description: 'Most popular right now' },
    { id: 'new', name: 'New Releases', icon: FiCalendar, description: 'Recently added content' },
    { id: 'mylist', name: 'My List', icon: FiBookmark, description: 'Your saved content' },
  ]

  // Genres for content filtering
  const genres = [
    { id: 'action', name: 'Action' },
    { id: 'comedy', name: 'Comedy' },
    { id: 'drama', name: 'Drama' },
    { id: 'scifi', name: 'Sci-Fi' },
    { id: 'horror', name: 'Horror' },
    { id: 'romance', name: 'Romance' },
  ]

  const handlePlayMovie = (movieId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log(`Playing movie ${movieId}`);
    // In a real app, this would navigate to a player or start streaming
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
    // In a real app, this would navigate to a details page or open a modal
    window.location.href = `/dashboard/movies/${movieId}`;
  }

  const handleShareMovie = (movieId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    // In a real app, this would open a share dialog
    const shareText = `Check out this movie on RIX!`;
    const shareUrl = `${window.location.origin}/dashboard/movies/${movieId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Share this movie',
        text: shareText,
        url: shareUrl,
      }).catch(err => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support the Web Share API
      window.alert(`Share this link: ${shareUrl}`);
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[70vh] overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            y: scrollY * 0.2, // Parallax effect
            backgroundImage: `url(${featuredMovie?.thumbnail_url || '/placeholder-hero.jpg'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 w-full px-4 py-10 z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="container mx-auto"
          >
            <div className="max-w-2xl">
              {featuredMovie ? (
                <>
                  <motion.h1 
                    className="text-5xl font-bold mb-3 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    {featuredMovie.title}
                  </motion.h1>
                  <motion.p 
                    className="text-lg text-gray-200 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {featuredMovie.description}
                  </motion.p>
                  <div className="flex space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-full flex items-center space-x-2"
                      onClick={(e) => featuredMovie && handlePlayMovie(featuredMovie.id, e)}
                    >
                      <motion.span
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 2 
                        }}
                      >
                        <FiPlay />
                      </motion.span>
                      <span>Play Now</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                      className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-full flex items-center space-x-2 backdrop-blur-sm"
                      onClick={(e) => featuredMovie && handleMoreInfo(featuredMovie.id, e)}
                    >
                      <FiInfo />
                      <span>More Info</span>
                    </motion.button>
                  </div>
                </>
              ) : (
                // Loading skeleton for hero
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-700/50 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-700/50 rounded w-5/6 mb-6"></div>
                  <div className="flex space-x-4">
                    <div className="h-12 bg-gray-700/50 rounded-full w-32"></div>
                    <div className="h-12 bg-gray-700/50 rounded-full w-32"></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Trending Section */}
      <section className="py-10 px-4">
        <motion.h2 
          className="text-2xl font-bold mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Trending Now
        </motion.h2>

        {/* Movie Grid with Staggered Animation */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
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
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {movies.slice(0, 10).map((movie) => (
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
      </section>

      {/* Main Categories - Simplified and more useful */}
      <div className="px-4 mt-8">
        <div className="grid grid-cols-2 gap-2 mb-6">
          {mainCategories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-800/50 text-white/70 hover:bg-gray-700/50'
              }`}
            >
              <category.icon size={22} className="mb-1" />
              <span className="text-xs font-medium">{category.name}</span>
            </motion.button>
          ))}
        </div>
        
        {/* Genre filters with link to full genres page */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-white/80">Filter by Genre</h3>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </motion.button>
              
              <Link href="/dashboard/genre">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-3 py-1 rounded-full"
                >
                  <FiTag size={12} />
                  <span>All Genres</span>
                </motion.button>
              </Link>
            </div>
          </div>
          
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2"
            >
              {genres.map((genre) => (
                <motion.button
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                    activeCategory === genre.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-800/50 text-white/70 hover:bg-gray-700/50'
                  }`}
                  onClick={() => setActiveCategory(genre.id)}
                >
                  {genre.name}
                </motion.button>
              ))}
              
              <Link href="/dashboard/genre">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-full text-sm whitespace-nowrap bg-gray-800/80 text-white/90 hover:bg-gray-700/80 transition-all flex items-center gap-1"
                >
                  <span>More Genres</span>
                  <FiArrowRight size={14} />
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>

      {/* Featured Collections - More meaningful with clear purpose */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Featured Collections</h2>
          <Link href="/dashboard/genre" className="flex items-center gap-1 text-sm text-primary hover:underline">
            <span>Browse All Genres</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/collections/originals" className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 block">
              <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <FiStar className="inline mr-1" size={12} /> Exclusive
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">Originals</span>
              </div>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/collections/blockbusters" className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 block">
              <div className="absolute top-2 left-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <FiTrendingUp className="inline mr-1" size={12} /> Popular
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">Blockbuster Movies</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/dashboard/collections/international" className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-black block">
              <div className="absolute top-2 left-2 bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                <FiDownload className="inline mr-1" size={12} /> New
              </div>
              <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">International Shows</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Movie Grid - Enhanced with more meaningful actions */}
      <div className="px-4 mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Popular Right Now</h2>
          <Link href="/dashboard/popular" className="flex items-center gap-1 text-sm text-primary hover:underline">
            <span>View All</span>
          </Link>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-sm font-semibold">{movie.title}</h3>
                    <p className="text-xs text-gray-300">{movie.release_year}</p>
                    
                    {/* Movie card action buttons - More meaningful with visual feedback */}
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
                      
                      <button 
                        className={`p-2 rounded-full transition-colors ${
                          likedMovies.includes(movie.id)
                            ? 'bg-red-500/30 text-red-500'
                            : 'bg-black/40 text-white/80 hover:text-white'
                        }`}
                        onClick={(e) => handleLikeMovie(movie.id, e)}
                        aria-label={likedMovies.includes(movie.id) ? "Unlike" : "Like"}
                      >
                        <FiHeart size={16} />
                      </button>
                      
                      <button 
                        className="p-2 bg-black/40 rounded-full text-white/80 hover:text-white transition-colors"
                        onClick={(e) => handleShareMovie(movie.id, e)}
                        aria-label="Share"
                      >
                        <FiShare2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
