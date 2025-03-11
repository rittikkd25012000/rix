'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyList } from '@/context/MyListContext'
import { motion } from 'framer-motion'
import { FiPlay, FiInfo, FiDownload, FiExternalLink, FiFilter, FiCalendar, FiPlus, FiCheck } from 'react-icons/fi'
import Link from 'next/link'

// Define types for the movie data
interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  release_year: number;
  genres: string[];
  source: string;
  url: string;
}

// Sample free movie data (in a real app, this would come from an API)
const sampleFreeMovies: Movie[] = [
  {
    id: 'night_of_the_living_dead',
    title: 'Night of the Living Dead',
    description: 'A group of people try to survive when the dead start to come back to life and eat the living in this classic horror film that started the zombie genre.',
    thumbnail_url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    release_year: 1968,
    genres: ['horror', 'classic', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/night_of_the_living_dead'
  },
  {
    id: 'the_little_shop_of_horrors',
    title: 'The Little Shop of Horrors',
    description: 'A clumsy young man nurtures a plant and discovers that it\'s carnivorous, forcing him to kill to feed it.',
    thumbnail_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    release_year: 1960,
    genres: ['comedy', 'horror', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/the_little_shop_of_horrors'
  },
  {
    id: 'plan_9_from_outer_space',
    title: 'Plan 9 from Outer Space',
    description: 'Aliens resurrect dead humans as zombies and vampires to stop humanity from creating a sun-driven bomb.',
    thumbnail_url: 'https://images.unsplash.com/photo-1518331647614-7a1f04cd34cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80',
    release_year: 1959,
    genres: ['sci-fi', 'horror', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/plan_9_from_outer_space'
  },
  {
    id: 'nosferatu',
    title: 'Nosferatu',
    description: 'Vampire Count Orlok expresses interest in a new residence and real estate agent Hutter\'s wife.',
    thumbnail_url: 'https://images.unsplash.com/photo-1605106702734-205df224ecce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    release_year: 1922,
    genres: ['horror', 'silent', 'classic', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/nosferatu'
  },
  {
    id: 'the_phantom_of_the_opera',
    title: 'The Phantom of the Opera',
    description: 'A disfigured musical genius haunts the Paris Opera House and falls in love with a beautiful soprano.',
    thumbnail_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80',
    release_year: 1925,
    genres: ['horror', 'silent', 'classic', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/the_phantom_of_the_opera'
  },
  {
    id: 'charade',
    title: 'Charade',
    description: 'A woman is pursued by several men who want a fortune her murdered husband had stolen. She seeks help from a mysterious stranger.',
    thumbnail_url: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
    release_year: 1963,
    genres: ['mystery', 'romance', 'thriller', 'public domain'],
    source: 'archive.org',
    url: 'https://archive.org/details/charade'
  }
];

// In a real app, this would be an API call
async function fetchArchiveMovies(): Promise<Movie[]> {
  // This is a placeholder - in a real app, you would fetch from the Internet Archive API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sampleFreeMovies);
    }, 1000);
  });
}

export default function FreeMoviesPage() {
  const { user } = useAuth()
  const { addToList, removeFromList, isInList } = useMyList()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [activeGenre, setActiveGenre] = useState('all')

  useEffect(() => {
    async function loadMovies() {
      setLoading(true);
      try {
        // In a real app, this would be a real API call
        const data = await fetchArchiveMovies();
        setMovies(data);
      } catch (error) {
        console.error('Error loading free movies:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  if (!user) return null;

  // Get unique genres from all movies
  const allGenres = Array.from(
    new Set(
      movies.flatMap(movie => movie.genres)
    )
  );

  // Filter movies by selected genre
  const filteredMovies = activeGenre === 'all' 
    ? movies 
    : movies.filter(movie => movie.genres.includes(activeGenre));

  // Handle adding/removing a movie to/from My List
  const handleAddToList = (movie: Movie) => {
    const listItem = {
      id: movie.id,
      title: movie.title,
      description: movie.description,
      thumbnail_url: movie.thumbnail_url,
      release_year: movie.release_year,
      type: 'movie',
      genres: movie.genres
    };
    
    if (isInList(movie.id)) {
      removeFromList(movie.id);
    } else {
      addToList(listItem);
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-24"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Free Movies</h1>
          <p className="text-gray-400">
            Enjoy these public domain classics completely free and legally
          </p>
        </div>

        {/* Genre filter */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveGenre('all')}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeGenre === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              All Movies
            </button>
            
            {allGenres.map((genre: string, index: number) => (
              <button
                key={index}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  activeGenre === genre
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800"
              >
                <div className="aspect-[2/3] relative">
                  <img 
                    src={movie.thumbnail_url} 
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                    Free
                  </div>
                  <div className="absolute top-2 right-2 bg-gray-900/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <FiCalendar size={10} />
                    {movie.release_year}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 p-4 w-full">
                      <div className="flex gap-2 mb-2">
                        <Link 
                          href={`/dashboard/free-movies/${movie.id}`}
                          className="flex-1 flex items-center justify-center gap-1 bg-primary text-white text-sm py-2 rounded-md"
                        >
                          <FiPlay size={14} /> Play
                        </Link>
                        <button 
                          onClick={() => handleAddToList(movie)}
                          className={`p-2 rounded-full ${
                            isInList(movie.id)
                              ? 'bg-primary/30 text-primary'
                              : 'bg-gray-800/80 text-white/80 hover:text-white'
                          }`}
                          aria-label={isInList(movie.id) ? "Remove from My List" : "Add to My List"}
                        >
                          {isInList(movie.id) ? <FiCheck size={16} /> : <FiPlus size={16} />}
                        </button>
                        <a 
                          href={movie.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 bg-gray-800/80 rounded-full text-white/80 hover:text-white"
                        >
                          <FiExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{movie.title}</h3>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {movie.genres.slice(0, 3).map((genre: string, index: number) => (
                      <span 
                        key={index} 
                        className="text-xs bg-gray-800 px-2 py-0.5 rounded text-gray-300"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                    {movie.description}
                  </p>
                  
                  <div className="flex gap-2">
                    <Link 
                      href={`/dashboard/free-movies/${movie.id}`}
                      className="flex items-center gap-1 bg-primary text-white text-sm px-3 py-1.5 rounded-md flex-1 justify-center"
                    >
                      <FiPlay size={14} /> Watch
                    </Link>
                    <button
                      onClick={() => handleAddToList(movie)}
                      className={`flex items-center gap-1 ${
                        isInList(movie.id)
                          ? 'bg-primary/20 text-primary'
                          : 'bg-gray-800 text-white'
                      } text-sm px-3 py-1.5 rounded-md hover:bg-gray-700`}
                    >
                      {isInList(movie.id) ? <FiCheck size={14} /> : <FiPlus size={14} />} 
                      {isInList(movie.id) ? 'In List' : 'My List'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-900/50 rounded-lg">
            <p className="text-gray-400">No free movies found in this category</p>
            <button 
              onClick={() => setActiveGenre('all')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            >
              View All Free Movies
            </button>
          </div>
        )}

        <div className="mt-12 bg-gray-900/30 rounded-lg p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">About Free Movies</h2>
          <p className="text-gray-300 mb-4">
            All movies in this section are in the public domain, which means their copyright has expired 
            or they were released without copyright protection. These films can be legally watched, 
            downloaded, and shared without any copyright restrictions.
          </p>
          <p className="text-gray-400 text-sm">
            Sources include the Internet Archive (archive.org) and other public domain film repositories. 
            RIX does not host these movies directly but provides links to legal sources.
          </p>
        </div>
      </motion.div>
    </div>
  )
} 
