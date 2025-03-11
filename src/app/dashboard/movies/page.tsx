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
  FiFilter, 
  FiCheck,
  FiShare2,
  FiArrowDown,
  FiArrowUp,
  FiClock
} from 'react-icons/fi'

type Content = {
  id: number
  title: string
  description: string
  thumbnail_url: string
  release_year: number
  genre: string[]
  type: 'tv' | 'movie'
  duration?: number
  rating?: number
  director?: string
}

export default function MoviesPage() {
  const { user } = useAuth()
  const { addToList, removeFromList, isInList } = useMyList()
  const [content, setContent] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'title' | 'release_year' | 'rating'>('title')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [filterGenre, setFilterGenre] = useState<string | null>(null)
  const [likedContent, setLikedContent] = useState<number[]>([])

  // Sample movies data (in a real app, this would come from the database)
  const sampleMovies: Content[] = [
    {
      id: 1,
      title: "Inception",
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
      release_year: 2010,
      genre: ["Sci-Fi", "Action", "Thriller"],
      type: "movie",
      duration: 148,
      rating: 8.8,
      director: "Christopher Nolan"
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      thumbnail_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
      release_year: 1994,
      genre: ["Drama"],
      type: "movie",
      duration: 142,
      rating: 9.3,
      director: "Frank Darabont"
    },
    {
      id: 3,
      title: "The Dark Knight",
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      thumbnail_url: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      release_year: 2008,
      genre: ["Action", "Crime", "Drama"],
      type: "movie",
      duration: 152,
      rating: 9.0,
      director: "Christopher Nolan"
    },
    {
      id: 4,
      title: "Pulp Fiction",
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      thumbnail_url: "https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      release_year: 1994,
      genre: ["Crime", "Drama"],
      type: "movie",
      duration: 154,
      rating: 8.9,
      director: "Quentin Tarantino"
    },
    {
      id: 5,
      title: "The Matrix",
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      thumbnail_url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      release_year: 1999,
      genre: ["Action", "Sci-Fi"],
      type: "movie",
      duration: 136,
      rating: 8.7,
      director: "Lana Wachowski, Lilly Wachowski"
    },
    {
      id: 6,
      title: "Parasite",
      description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
      thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
      release_year: 2019,
      genre: ["Comedy", "Drama", "Thriller"],
      type: "movie",
      duration: 132,
      rating: 8.6,
      director: "Bong Joon Ho"
    }
  ];

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    // For now, we'll use the sample data
    setContent(sampleMovies);
    setLoading(false);
  }, []);

  // Sort content based on current sort settings
  const sortedContent = [...content].sort((a, b) => {
    if (sortBy === 'title') {
      return sortOrder === 'asc' 
        ? a.title.localeCompare(b.title) 
        : b.title.localeCompare(a.title);
    } else if (sortBy === 'release_year') {
      return sortOrder === 'asc' 
        ? a.release_year - b.release_year 
        : b.release_year - a.release_year;
    } else if (sortBy === 'rating') {
      const aRating = a.rating || 0;
      const bRating = b.rating || 0;
      return sortOrder === 'asc' ? aRating - bRating : bRating - aRating;
    }
    return 0;
  });

  // Filter by genre if a genre is selected
  const filteredContent = filterGenre 
    ? sortedContent.filter(item => item.genre.includes(filterGenre))
    : sortedContent;

  // Get all unique genres from the content
  const allGenres = Array.from(
    new Set(content.flatMap(item => item.genre))
  ).sort();

  const handleSort = (by: 'title' | 'release_year' | 'rating') => {
    if (sortBy === by) {
      // Toggle sort order if clicking the same sort option
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort option and default to ascending
      setSortBy(by);
      setSortOrder('asc');
    }
  };

  const handleFilterGenre = (genre: string | null) => {
    setFilterGenre(genre);
  };

  const handlePlayContent = (contentId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log(`Playing content ${contentId}`);
    window.alert(`Now playing movie ID: ${contentId}`);
  };

  const handleAddToWatchlist = (item: Content, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    const listItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      thumbnail_url: item.thumbnail_url,
      release_year: item.release_year,
      type: item.type,
      genres: item.genre
    };
    
    if (isInList(item.id)) {
      removeFromList(item.id);
      console.log(`Removed ${item.title} from My List`);
    } else {
      addToList(listItem);
      console.log(`Added ${item.title} to My List`);
    }
  };

  const handleLikeContent = (contentId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
    if (likedContent.includes(contentId)) {
      setLikedContent(likedContent.filter(id => id !== contentId));
    } else {
      setLikedContent([...likedContent, contentId]);
    }
  };

  const handleMoreInfo = (contentId: number, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    console.log(`Showing more info for content ${contentId}`);
    window.alert(`Showing details for movie ID: ${contentId}`);
  };

  // Format movie duration from minutes to hours and minutes
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (!user) return null;
  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading movies...</p>
      </motion.div>
    </div>
  );
  if (error) return <div className="text-red-500 text-center py-12">{error}</div>;

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Movies</h1>
          
          <div className="flex flex-wrap gap-3">
            {/* Sort options */}
            <div className="flex items-center">
              <span className="text-gray-400 mr-2 text-sm">Sort by:</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleSort('title')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                    sortBy === 'title' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Title
                  {sortBy === 'title' && (
                    sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                  )}
                </button>
                <button 
                  onClick={() => handleSort('release_year')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                    sortBy === 'release_year' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Year
                  {sortBy === 'release_year' && (
                    sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                  )}
                </button>
                <button 
                  onClick={() => handleSort('rating')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center ${
                    sortBy === 'rating' ? 'bg-primary text-white' : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  Rating
                  {sortBy === 'rating' && (
                    sortOrder === 'asc' ? <FiArrowUp className="ml-1" size={14} /> : <FiArrowDown className="ml-1" size={14} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Genre filter */}
            <div className="relative group">
              <button 
                className="px-3 py-1.5 rounded-md text-sm bg-gray-800 text-gray-300 flex items-center"
              >
                <FiFilter className="mr-1" size={14} />
                {filterGenre || 'All Genres'}
              </button>
              
              <div className="absolute top-full right-0 mt-1 bg-gray-900 rounded-md shadow-lg overflow-hidden z-10 hidden group-hover:block w-48">
                <div className="p-2">
                  <button 
                    onClick={() => handleFilterGenre(null)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                      filterGenre === null ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-300'
                    }`}
                  >
                    All Genres
                  </button>
                  
                  {allGenres.map(genre => (
                    <button 
                      key={genre}
                      onClick={() => handleFilterGenre(genre)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${
                        filterGenre === genre ? 'bg-primary text-white' : 'hover:bg-gray-800 text-gray-300'
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredContent.map((item) => (
            <motion.div 
              key={item.id} 
              whileHover={{ scale: 1.05 }} 
              className="group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden relative">
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => handleMoreInfo(item.id)}
                />
                
                {/* Content type badge */}
                <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                  Movie
                </div>
                
                {/* Content info overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-4">
                    <h3 className="text-sm font-semibold">{item.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
                      <span>{item.release_year}</span>
                      <span>•</span>
                      <span><FiClock className="inline mr-0.5" size={10} />{item.duration && formatDuration(item.duration)}</span>
                      <span>•</span>
                      <span>⭐ {item.rating}</span>
                    </div>
                    
                    <div className="mt-1 text-xs text-gray-400 line-clamp-2">
                      {item.description}
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex gap-2 mt-3">
                      <button 
                        className="p-2 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors"
                        onClick={(e) => handlePlayContent(item.id, e)}
                        aria-label="Play"
                      >
                        <FiPlay size={16} />
                      </button>
                      
                      <button 
                        className={`p-2 rounded-full transition-colors ${
                          isInList(item.id)
                            ? 'bg-primary/30 text-primary'
                            : 'bg-black/40 text-white/80 hover:text-white'
                        }`}
                        onClick={(e) => handleAddToWatchlist(item, e)}
                        aria-label={isInList(item.id) ? "Remove from My List" : "Add to My List"}
                      >
                        {isInList(item.id) ? <FiCheck size={16} /> : <FiPlus size={16} />}
                      </button>
                      
                      <button 
                        className={`p-2 rounded-full transition-colors ${
                          likedContent.includes(item.id)
                            ? 'bg-red-500/30 text-red-500'
                            : 'bg-black/40 text-white/80 hover:text-white'
                        }`}
                        onClick={(e) => handleLikeContent(item.id, e)}
                        aria-label={likedContent.includes(item.id) ? "Unlike" : "Like"}
                      >
                        <FiHeart size={16} />
                      </button>
                      
                      <button 
                        className="p-2 bg-black/40 rounded-full text-white/80 hover:text-white transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          const shareText = `Check out ${item.title} on RIX!`;
                          const shareUrl = `${window.location.origin}/dashboard/movies/${item.id}`;
                          
                          if (navigator.share) {
                            navigator.share({
                              title: item.title,
                              text: shareText,
                              url: shareUrl,
                            }).catch(err => console.error('Error sharing:', err));
                          } else {
                            window.alert(`Share this link: ${shareUrl}`);
                          }
                        }}
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
        
        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No movies found matching your filters.</p>
            <button 
              onClick={() => {
                setFilterGenre(null);
                setSortBy('title');
                setSortOrder('asc');
              }}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              Reset Filters
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
} 
