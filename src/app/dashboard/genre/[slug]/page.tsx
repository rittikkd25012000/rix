'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { 
  FiArrowLeft,
  FiFilter,
  FiStar
} from 'react-icons/fi'

// Import the genre data and combinations from the main genre page
// In a real app, this would be in a shared file or fetched from an API
import { genreData, genreCombinations, sampleMovies } from '../genreData'

export default function GenreDetailPage() {
  const params = useParams()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState<any[]>([])
  const [genreInfo, setGenreInfo] = useState<any>(null)
  const [isCombination, setIsCombination] = useState(false)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 800)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!params || !params.slug) return

    // Convert to string in case it's an array
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug
    
    // Check if this is a combination (contains a +)
    if (slug.includes('+')) {
      setIsCombination(true)
      const genreIds = slug.split('+')
      
      // Find the combination in our predefined list
      const combination = genreCombinations.find(c => c.id === slug)
      if (combination) {
        setGenreInfo(combination)
        
        // Filter sample movies that match all genres in the combination
        const filtered = sampleMovies.filter(movie => 
          genreIds.every(genreId => movie.genres.includes(genreId))
        )
        setContent(filtered)
      } else {
        // Handle custom combinations not in our predefined list
        const genres = genreIds.map(id => genreData.find(g => g.id === id)).filter(Boolean)
        if (genres.length > 0) {
          setGenreInfo({
            name: genres.map(g => g?.name).join(' & '),
            description: `Movies that combine ${genres.map(g => g?.name.toLowerCase()).join(' and ')}`,
            gradient: 'from-gray-700 to-gray-900' // Default gradient
          })
          
          // Filter sample movies that match all genres in the combination
          const filtered = sampleMovies.filter(movie => 
            genreIds.every(genreId => movie.genres.includes(genreId))
          )
          setContent(filtered)
        }
      }
    } else {
      // Single genre
      setIsCombination(false)
      const genre = genreData.find(g => g.id === slug)
      if (genre) {
        setGenreInfo({
          ...genre,
          description: `Explore our collection of ${genre.name} titles`,
          gradient: genre.color
        })
        
        // Filter sample movies that match this genre
        const filtered = sampleMovies.filter(movie => 
          movie.genres.includes(slug)
        )
        setContent(filtered)
      }
    }
  }, [params])

  if (!user) return null
  
  if (loading || !genreInfo) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading content...</p>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-6"
      >
        <div className="mb-8">
          <Link href="/dashboard/genre" className="text-primary hover:underline flex items-center gap-1 mb-4">
            <FiArrowLeft size={16} />
            <span>Back to Genres</span>
          </Link>
          
          <div className={`bg-gradient-to-r ${genreInfo.gradient} p-8 rounded-xl`}>
            <h1 className="text-3xl font-bold mb-2">{genreInfo.name}</h1>
            <p className="text-white/80 max-w-2xl">{genreInfo.description}</p>
            
            {isCombination && (
              <div className="flex items-center gap-2 mt-4">
                <FiStar className="text-yellow-400" size={16} />
                <span className="text-sm text-white/80">Popular genre combination</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content grid */}
        {content.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">{content.length} Titles</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {content.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  className="rounded-lg overflow-hidden"
                >
                  <div className="aspect-[2/3] relative">
                    <img 
                      src={item.thumbnail_url} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 p-3">
                        <h4 className="text-sm font-semibold">{item.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                          <span>{item.release_year}</span>
                          <span>•</span>
                          <span>⭐ {item.rating}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">No titles found for this genre combination.</p>
            <Link href="/dashboard/genre">
              <button className="mt-4 px-4 py-2 bg-primary text-white rounded-md">
                Browse All Genres
              </button>
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  )
} 