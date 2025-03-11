'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

type Movie = {
  id: number
  title: string
  description: string
  thumbnail_url: string
  release_year: number
  genre: string[]
}

type WatchlistItem = {
  movie_id: number
  movies: Movie | null
}

export default function WatchlistPage() {
  const { user } = useAuth()
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWatchlist() {
      if (!user) {
        setError('Please sign in to view your watchlist')
        setLoading(false)
        return
      }

      try {
        console.log('Fetching watchlist for user:', user.id)
        const { data, error: watchlistError } = await supabase
          .from('user_watchlist')
          .select(`
            movie_id,
            movies (
              id,
              title,
              description,
              thumbnail_url,
              release_year,
              genre
            )
          `)
          .eq('user_id', user.id)

        if (watchlistError) {
          console.error('Watchlist fetch error:', watchlistError)
          throw watchlistError
        }

        if (!data) {
          setMovies([])
          return
        }

        // Extract movies from the joined query
        const watchlistMovies = (data as unknown as WatchlistItem[])
          .map(item => item.movies)
          .filter((movie): movie is Movie => movie !== null)

        console.log('Watchlist movies:', watchlistMovies)
        setMovies(watchlistMovies)
      } catch (error) {
        console.error('Error in fetchWatchlist:', error)
        setError(error instanceof Error ? error.message : 'Failed to load watchlist')
      } finally {
        setLoading(false)
      }
    }

    fetchWatchlist()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading watchlist...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error}</div>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          Back to Movies
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Watchlist</h1>
        <Link href="/dashboard" className="text-blue-500 hover:underline">
          ← Back to Movies
        </Link>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your watchlist is empty
          </p>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/dashboard/movies/${movie.id}`}
              className="block group"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
                <img
                  src={movie.thumbnail_url}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="mt-2">
                <h2 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                  {movie.title}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span>{movie.release_year}</span>
                  <span>•</span>
                  <span>{movie.genre.join(', ')}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {movie.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
} 
