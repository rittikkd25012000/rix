'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  FiSearch, 
  FiFilm, 
  FiTv, 
  FiFilter,
  FiX,
  FiPlay
} from 'react-icons/fi'

// Import sample data for demonstration
import { sampleMovies } from '../genre/genreData'

// Add some sample TV shows
const sampleTVShows = [
  {
    id: 101,
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    thumbnail_url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2016,
    genres: ["sci-fi", "horror", "drama"],
    type: "tv",
    rating: 8.7
  },
  {
    id: 102,
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    thumbnail_url: "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2008,
    genres: ["crime", "drama", "thriller"],
    type: "tv",
    rating: 9.5
  },
  {
    id: 103,
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    thumbnail_url: "https://images.unsplash.com/photo-1581894158358-5ecd2c518883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2016,
    genres: ["drama", "history", "biography"],
    type: "tv",
    rating: 8.7
  }
];

// Combine movies and TV shows for search
const allContent = [...sampleMovies.map(movie => ({...movie, type: 'movie'})), ...sampleTVShows];

export default function SearchPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  
  const [searchQuery, setSearchQuery] = useState(query)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<'all' | 'movies' | 'tv'>('all')

  // Perform search when query changes
  useEffect(() => {
    setSearchQuery(query)
    
    if (query) {
      setLoading(true)
      
      // Simulate search delay
      setTimeout(() => {
        const results = allContent.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.genres.some((genre: string) => genre.toLowerCase().includes(query.toLowerCase()))
        )
        
        setSearchResults(results)
        setLoading(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }, [query])

  // Filter results by content type
  const filteredResults = activeFilter === 'all' 
    ? searchResults 
    : searchResults.filter(item => item.type === activeFilter)

  if (!user) return null

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-6"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          
          <div className="relative">
            <div className="flex items-center bg-gray-900/50 border border-gray-700 rounded-lg overflow-hidden">
              <div className="px-4 text-gray-400">
                <FiSearch size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows, genres..."
                className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    window.location.href = `/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`
                  }
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    window.location.href = '/dashboard/search'
                  }}
                  className="px-4 text-gray-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              )}
            </div>
          </div>
          
          {query && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-gray-400">
                {filteredResults.length} results for "{query}"
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setActiveFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm ${
                    activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setActiveFilter('movies')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    activeFilter === 'movies' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <FiFilm size={14} /> Movies
                </button>
                <button 
                  onClick={() => setActiveFilter('tv')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    activeFilter === 'tv' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <FiTv size={14} /> TV Shows
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
          </div>
        ) : query && filteredResults.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredResults.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                className="rounded-lg overflow-hidden"
              >
                <div className="aspect-[2/3] relative">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {item.type === 'movie' ? 'Movie' : 'TV Show'}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 p-3">
                      <h3 className="text-sm font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                        <span>{item.release_year}</span>
                        <span>•</span>
                        <span>⭐ {item.rating}</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      
                      <button className="mt-2 flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full">
                        <FiPlay size={12} /> Play
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">No results found for "{query}"</p>
            <p className="text-gray-500 mt-2">Try different keywords or browse our categories</p>
            
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'].map((genre) => (
                <Link 
                  key={genre} 
                  href={`/dashboard/genre/${genre.toLowerCase()}`}
                  className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-colors"
                >
                  {genre}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">Search for movies, TV shows, actors, or genres</p>
            <p className="text-gray-500">Try searching for "action", "comedy", or your favorite movie title</p>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Popular Searches</h2>
              <div className="flex flex-wrap gap-3 justify-center">
                {['Action', 'Comedy', 'Sci-Fi', 'Thriller', 'Drama', 'Horror'].map((term) => (
                  <Link 
                    key={term} 
                    href={`/dashboard/search?q=${term.toLowerCase()}`}
                    className="px-4 py-2 bg-gray-800 text-white rounded-full text-sm hover:bg-gray-700 transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 
