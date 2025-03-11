'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { use } from 'react'

type Movie = {
  id: number
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  release_year: number
  duration: number
  genre: string[]
}

export default function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const movieParams = use(params) // Unwrap the params promise
  const { user } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMovie() {
      try {
        console.log('Fetching movie details for ID:', movieParams.id)
        // Fetch movie details
        const { data: movieData, error: movieError } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieParams.id)
          .single()

        if (movieError) {
          console.error('Movie fetch error:', movieError)
          throw movieError
        }
        if (!movieData) {
          console.error('No movie found')
          throw new Error('Movie not found')
        }

        console.log('Movie data:', movieData)
        setMovie(movieData)

        if (user) {
          // Check if movie is in user's watchlist
          const { data: watchlistData, error: watchlistError } = await supabase
            .from('user_watchlist')
            .select('*')
            .eq('movie_id', movieParams.id)
            .eq('user_id', user.id)
            .single()

          if (watchlistError && watchlistError.code !== 'PGRST116') {
            console.error('Watchlist check error:', watchlistError)
            throw watchlistError
          }

          setIsInWatchlist(!!watchlistData)
        }
      } catch (error) {
        console.error('Error in fetchMovie:', error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMovie()
  }, [movieParams.id, user])

  const toggleWatchlist = async () => {
    if (!user || !movie) {
      console.error('Cannot toggle watchlist: user or movie is null', { user, movie });
      return;
    }

    try {
      setLoading(true);
      if (isInWatchlist) {
        console.log('Removing movie from watchlist:', { movieId: movie.id, userId: user.id });
        const { error } = await supabase
          .from('user_watchlist')
          .delete()
          .eq('movie_id', movie.id)
          .eq('user_id', user.id);

        if (error) {
          console.error('Error removing from watchlist:', error);
          throw error;
        }
        console.log('Successfully removed from watchlist');
        setIsInWatchlist(false);
      } else {
        console.log('Adding movie to watchlist:', { movieId: movie.id, userId: user.id });
        const { error } = await supabase
          .from('user_watchlist')
          .insert([{ movie_id: movie.id, user_id: user.id }]);

        if (error) {
          console.error('Error adding to watchlist:', error);
          throw error;
        }
        console.log('Successfully added to watchlist');
        setIsInWatchlist(true);
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
      setError(error instanceof Error ? error.message : 'Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading movie...</div>
      </div>
    )
  }

  if (error || !movie) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error || 'Movie not found'}</div>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Back to Movies
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Movies
        </Link>
      </div>

      {/* Video Player */}
      <div className="aspect-w-16 aspect-h-9 mb-8 bg-black rounded-lg overflow-hidden">
        <video
          src={movie.video_url}
          controls
          poster={movie.thumbnail_url}
          className="w-full h-full object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Movie Info */}
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
              <span>{movie.release_year}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
            </div>
          </div>
          <button
            onClick={toggleWatchlist}
            disabled={loading}
            className={`px-4 py-2 rounded-lg transition-colors ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isInWatchlist
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {loading ? 'Processing...' : isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
          </button>
        </div>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          {movie.genre.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>

        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {movie.description}
        </p>
      </div>
    </div>
  )
} 