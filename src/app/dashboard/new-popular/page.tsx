'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { motion, Variants } from 'framer-motion'
import { FiCalendar, FiTrendingUp, FiPlay, FiInfo, FiPlus, FiCode, FiTool } from 'react-icons/fi'
import Link from 'next/link'

// Import sample data for demonstration
import { sampleMovies } from '../genre/genreData'

// Add some sample TV shows and upcoming releases
const sampleTVShows = [
  {
    id: 101,
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.",
    thumbnail_url: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2016,
    genres: ["sci-fi", "horror", "drama"],
    type: "tv",
    rating: 8.7,
    trending: true
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
  }
];

const upcomingReleases = [
  {
    id: 201,
    title: "Avatar 3",
    description: "The third installment in the Avatar franchise, continuing the story of the Na'vi and their struggle against human exploitation of Pandora.",
    thumbnail_url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_date: "2025-12-20",
    genres: ["sci-fi", "action", "adventure"],
    type: "movie"
  },
  {
    id: 202,
    title: "Stranger Things: Season 5",
    description: "The final season of the hit series, wrapping up the story of Eleven and her friends as they face the ultimate threat from the Upside Down.",
    thumbnail_url: "https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_date: "2024-07-04",
    genres: ["sci-fi", "horror", "drama"],
    type: "tv"
  },
  {
    id: 203,
    title: "The Mandalorian: Season 4",
    description: "The continuing adventures of Din Djarin and Grogu as they navigate the dangerous galaxy after the fall of the Empire.",
    thumbnail_url: "https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
    release_date: "2024-12-25",
    genres: ["sci-fi", "action", "adventure"],
    type: "tv"
  }
];

// Combine and mark trending content
const allContent = [
  ...sampleMovies.map(movie => ({
    ...movie, 
    type: 'movie',
    trending: movie.id % 3 === 0 // Mark some movies as trending
  })),
  ...sampleTVShows
];

// Get trending content
const trendingContent = allContent.filter(item => item.trending);

// Code animation text
const codeLines = [
  "import { useState, useEffect } from 'react';",
  "import { motion } from 'framer-motion';",
  "import axios from 'axios';",
  "",
  "const NewAndPopularPage = () => {",
  "  const [trending, setTrending] = useState([]);",
  "  const [upcoming, setUpcoming] = useState([]);",
  "  const [loading, setLoading] = useState(true);",
  "",
  "  useEffect(() => {",
  "    const fetchData = async () => {",
  "      try {",
  "        const trendingRes = await axios.get('/api/trending');",
  "        const upcomingRes = await axios.get('/api/upcoming');",
  "        ",
  "        setTrending(trendingRes.data);",
  "        setUpcoming(upcomingRes.data);",
  "        setLoading(false);",
  "      } catch (error) {",
  "        console.error('Error fetching data:', error);",
  "      }",
  "    };",
  "",
  "    fetchData();",
  "  }, []);",
  "",
  "  // Render content...",
];

export default function NewAndPopularPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'trending' | 'upcoming'>('trending')
  const [loading, setLoading] = useState(true)
  const [showDevelopmentMode, setShowDevelopmentMode] = useState(true)
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    // Code typing animation effect
    const codeInterval = setInterval(() => {
      if (currentLine < codeLines.length) {
        setCurrentLine(prev => prev + 1);
      } else {
        clearInterval(codeInterval);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      clearInterval(codeInterval);
    }
  }, [currentLine])

  if (!user) return null

  // Development mode animation
  if (showDevelopmentMode) {
    return (
      <div className="min-h-screen pb-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto pt-24"
        >
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold">New & Popular</h1>
            <button 
              onClick={() => setShowDevelopmentMode(false)}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm flex items-center gap-2"
            >
              <FiPlay size={16} />
              Preview Content
            </button>
          </div>
          
          <div className="bg-gray-900/70 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
              <div className="flex items-center gap-2">
                <FiCode size={18} className="text-primary" />
                <span className="font-mono text-sm">new-popular-feature.tsx</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
            </div>
            
            <div className="p-6 font-mono text-sm overflow-hidden">
              <div className="relative">
                <div className="absolute top-0 left-0 w-10 h-full flex flex-col items-end pr-2 text-gray-500 select-none">
                  {codeLines.map((_, index) => (
                    <div key={index} className={`h-6 ${index < currentLine ? 'opacity-100' : 'opacity-0'}`}>
                      {index + 1}
                    </div>
                  ))}
                </div>
                
                <div className="ml-10">
                  {codeLines.map((line, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: index < currentLine ? 1 : 0 }}
                      className="h-6 text-gray-300"
                    >
                      {line}
                    </motion.div>
                  ))}
                  
                  {currentLine >= codeLines.length && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 p-3 bg-gray-800 rounded-md text-green-400"
                    >
                      // Building New & Popular feature... 
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 4, duration: 1 }}
            className="mt-8 bg-gray-900/50 rounded-lg p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <FiTool size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Under Development</h3>
                <p className="text-gray-400 text-sm">Our team is working on exciting new features</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">✓</div>
                <span className="text-green-400">API Integration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-xs text-white">✓</div>
                <span className="text-green-400">Data Models</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="animate-pulse">⋯</span>
                </div>
                <span className="text-yellow-400">UI Components <span className="text-xs">(in progress)</span></span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                <span className="text-gray-400">Testing</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-gray-600"></div>
                <span className="text-gray-400">Deployment</span>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-800 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Development Progress</span>
                <span className="text-sm text-primary">45%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "45%" }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="bg-primary h-2 rounded-full"
                ></motion.div>
              </div>
            </div>
            
            <p className="mt-6 text-center text-gray-400 text-sm">
              Expected completion: Soon™
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-24"
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">New & Popular</h1>
          <button 
            onClick={() => setShowDevelopmentMode(true)}
            className="px-4 py-2 bg-gray-800 text-white rounded-md text-sm flex items-center gap-2 hover:bg-gray-700"
          >
            <FiCode size={16} />
            Show Development
          </button>
        </div>
        
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'trending' 
                ? 'bg-primary text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FiTrendingUp size={16} />
            <span>Trending Now</span>
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'bg-primary text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <FiCalendar size={16} />
            <span>Coming Soon</span>
          </button>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'trending' ? (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp size={20} className="text-primary" />
              <span>Trending Now</span>
            </h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {trendingContent.map((item) => (
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
                        
                        <div className="mt-2 flex gap-2">
                          <button className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1 rounded-full">
                            <FiPlay size={12} /> Play
                          </button>
                          <button className="flex items-center gap-1 bg-gray-700 text-white text-xs px-3 py-1 rounded-full">
                            <FiInfo size={12} /> More Info
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FiCalendar size={20} className="text-primary" />
              <span>Coming Soon</span>
            </h2>
            
            <div className="space-y-6">
              {upcomingReleases.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-900/50 rounded-lg overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4">
                      <div className="aspect-video md:aspect-[2/3] relative">
                        <img 
                          src={item.thumbnail_url} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="p-4 md:w-2/3 lg:w-3/4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <div className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full">
                          {new Date(item.release_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span className="bg-gray-800 px-2 py-0.5 rounded">
                          {item.type === 'movie' ? 'Movie' : 'TV Show'}
                        </span>
                        {item.genres.map((genre, index) => (
                          <Link 
                            key={index}
                            href={`/dashboard/genre/${genre}`}
                            className="hover:text-primary transition-colors"
                          >
                            {genre.charAt(0).toUpperCase() + genre.slice(1)}
                          </Link>
                        ))}
                      </div>
                      
                      <p className="text-sm text-gray-300 mb-4">{item.description}</p>
                      
                      <div className="flex gap-3">
                        <button className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-md transition-colors">
                          <FiPlus size={16} /> Add to My List
                        </button>
                        <button className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-white text-sm px-4 py-2 rounded-md transition-colors">
                          <FiInfo size={16} /> More Info
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
} 
