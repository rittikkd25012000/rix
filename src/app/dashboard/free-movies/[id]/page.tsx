'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyList } from '@/context/MyListContext'
import { motion } from 'framer-motion'
import { FiPlay, FiDownload, FiExternalLink, FiArrowLeft, FiInfo, FiPlus, FiCheck } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import ReviewsSection from '@/components/ReviewsSection'

// This would be replaced with a real API call in production
async function getMovieDetails(id: string) {
  // In a real app, fetch from Archive.org API
  // For demo purposes, we'll use sample data
  const sampleMovies = {
    'night_of_the_living_dead': {
      id: 'night_of_the_living_dead',
      title: 'Night of the Living Dead',
      description: 'A group of people try to survive when the dead start to come back to life and eat the living in this classic horror film that started the zombie genre.',
      thumbnail_url: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      release_year: 1968,
      genres: ['horror', 'classic', 'public domain'],
      source: 'archive.org',
      url: 'https://archive.org/details/night_of_the_living_dead',
      stream_url: 'https://archive.org/download/night_of_the_living_dead/night_of_the_living_dead.mp4',
      director: 'George A. Romero',
      cast: ['Duane Jones', 'Judith O\'Dea', 'Karl Hardman'],
      runtime: '1h 36m'
    },
    'the_little_shop_of_horrors': {
      id: 'the_little_shop_of_horrors',
      title: 'The Little Shop of Horrors',
      description: 'A clumsy young man nurtures a plant and discovers that it\'s carnivorous, forcing him to kill to feed it.',
      thumbnail_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      release_year: 1960,
      genres: ['comedy', 'horror', 'public domain'],
      source: 'archive.org',
      url: 'https://archive.org/details/the_little_shop_of_horrors',
      stream_url: 'https://archive.org/download/the_little_shop_of_horrors/the_little_shop_of_horrors.mp4',
      director: 'Roger Corman',
      cast: ['Jonathan Haze', 'Jackie Joseph', 'Mel Welles'],
      runtime: '1h 12m'
    }
  };
  
  // Simulate API delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sampleMovies[id as keyof typeof sampleMovies] || null);
    }, 1000);
  });
}

export default function MovieDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const { addToList, removeFromList, isInList } = useMyList()
  const [movie, setMovie] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        const movieId = params.id as string;
        const data = await getMovieDetails(movieId);
        
        if (!data) {
          setError('Movie not found');
        } else {
          setMovie(data);
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadMovie();
    }
  }, [params.id]);

  // Handle adding/removing from My List
  const handleMyList = () => {
    if (!movie) return;
    
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

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900/50 rounded-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">
              {error || 'Movie not found'}
            </h1>
            <p className="text-gray-400 mb-6">
              We couldn't find the movie you're looking for.
            </p>
            <Link 
              href="/dashboard/free-movies" 
              className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md"
            >
              <FiArrowLeft size={16} />
              Back to Free Movies
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6">
          <Link 
            href="/dashboard/free-movies" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Free Movies
          </Link>
        </div>

        {!isPlaying ? (
          <div className="relative rounded-xl overflow-hidden aspect-video mb-8 group">
            <img 
              src={movie.thumbnail_url} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(true)}
                className="w-20 h-20 bg-primary/90 rounded-full flex items-center justify-center"
              >
                <FiPlay size={36} className="text-white ml-1" />
              </motion.button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-300">
                <span>{movie.release_year}</span>
                <span>•</span>
                <span>{movie.runtime}</span>
                <span>•</span>
                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded">Public Domain</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden aspect-video mb-8 bg-black">
            <VideoPlayer 
              src={movie.stream_url} 
              poster={movie.thumbnail_url}
              title={movie.title}
              onEnded={() => setIsPlaying(false)}
              className="aspect-video"
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">About this movie</h2>
            <p className="text-gray-300 mb-6">{movie.description}</p>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Director</h3>
              <p className="text-gray-300">{movie.director}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Cast</h3>
              <div className="flex flex-wrap gap-2">
                {movie.cast.map((actor: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre: string, index: number) => (
                  <span 
                    key={index} 
                    className="bg-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Watch Options</h3>
              
              <div className="space-y-4">
                <button
                  onClick={() => setIsPlaying(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-md"
                >
                  <FiPlay size={18} />
                  Play Movie
                </button>
                
                <button
                  onClick={handleMyList}
                  className={`w-full flex items-center justify-center gap-2 ${
                    isInList(movie.id)
                      ? 'bg-primary/20 text-primary border border-primary/50'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  } py-3 rounded-md transition-colors`}
                >
                  {isInList(movie.id) ? (
                    <>
                      <FiCheck size={18} />
                      Added to My List
                    </>
                  ) : (
                    <>
                      <FiPlus size={18} />
                      Add to My List
                    </>
                  )}
                </button>
                
                <a 
                  href={movie.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FiExternalLink size={18} />
                  Watch on Archive.org
                </a>
                
                <a 
                  href={movie.stream_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FiDownload size={18} />
                  Download
                </a>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-lg font-semibold mb-4">About Public Domain</h3>
                <p className="text-sm text-gray-400">
                  This film is in the public domain, which means its copyright has expired 
                  or it was released without copyright protection. You can legally watch, 
                  download, and share it without restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Add ReviewsSection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-6xl mx-auto mt-12"
      >
        <ReviewsSection contentId={movie.id} contentTitle={movie.title} />
      </motion.div>
    </div>
  )
} 