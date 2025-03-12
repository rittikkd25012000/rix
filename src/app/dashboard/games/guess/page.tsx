'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiZap, FiClock, FiAward, FiHeart } from 'react-icons/fi'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Sample movie data for guessing
const movieData = [
  {
    id: 1,
    title: 'The Matrix',
    imageUrl: '/images/matrix.jpg',
    hints: [
      'Released in 1999',
      'Features a character named Neo',
      'About a simulated reality',
      'Directed by the Wachowskis'
    ]
  },
  {
    id: 2,
    title: 'Inception',
    imageUrl: '/images/inception.jpg',
    hints: [
      'Released in 2010',
      'Features dreams within dreams',
      'Directed by Christopher Nolan',
      'Stars Leonardo DiCaprio'
    ]
  },
  {
    id: 3,
    title: 'The Shawshank Redemption',
    imageUrl: '/images/shawshank.jpg',
    hints: [
      'Released in 1994',
      'Based on a Stephen King story',
      'Set in a prison',
      'Stars Morgan Freeman'
    ]
  }
]

export default function GuessGame() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>(() => {
    // Try to restore game state from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).gameState || 'start'
      }
    }
    return 'start'
  })
  const [currentMovie, setCurrentMovie] = useState<typeof movieData[0] | null>(() => {
    // Try to restore current movie from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).currentMovie || null
      }
    }
    return null
  })
  const [hintsUsed, setHintsUsed] = useState<number>(() => {
    // Try to restore hints used from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).hintsUsed || 0
      }
    }
    return 0
  })
  const [guessInput, setGuessInput] = useState('')
  const [attempts, setAttempts] = useState<number>(() => {
    // Try to restore attempts from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).attempts || 0
      }
    }
    return 0
  })
  const [score, setScore] = useState<number>(() => {
    // Try to restore score from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).score || 0
      }
    }
    return 0
  })
  const [timeElapsed, setTimeElapsed] = useState<number>(() => {
    // Try to restore time elapsed from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('guessGameState')
      if (savedState) {
        return JSON.parse(savedState).timeElapsed || 0
      }
    }
    return 0
  })
  const [error, setError] = useState<string | null>(null)

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && gameState === 'playing') {
      localStorage.setItem('guessGameState', JSON.stringify({
        gameState,
        currentMovie,
        hintsUsed,
        attempts,
        score,
        timeElapsed
      }))
    }
  }, [gameState, currentMovie, hintsUsed, attempts, score, timeElapsed])

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    
    if (gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed((prev: number) => prev + 1)
      }, 1000)
    }
    
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [gameState])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guessGameState')
      }
    }
  }, [])

  const startGame = () => {
    try {
      // Select a random movie
      const randomMovie = movieData[Math.floor(Math.random() * movieData.length)]
      setCurrentMovie(randomMovie)
      setHintsUsed(0)
      setAttempts(0)
      setScore(0)
      setTimeElapsed(0)
      setGuessInput('')
      setGameState('playing')
      setError(null)
    } catch (err: any) {
      setError('Failed to start game. Please try again.')
      console.error('Error starting game:', err)
    }
  }

  const useHint = () => {
    try {
      if (!currentMovie || hintsUsed >= currentMovie.hints.length) return
      setHintsUsed((prev: number) => prev + 1)
      setScore((prev: number) => Math.max(0, prev - 5)) // Penalty for using hints
    } catch (err: any) {
      setError('Failed to use hint. Please try again.')
      console.error('Error using hint:', err)
    }
  }

  const makeGuess = () => {
    try {
      if (!currentMovie || !guessInput.trim()) return

      setAttempts((prev: number) => prev + 1)
      
      const normalizedGuess = guessInput.trim().toLowerCase()
      const normalizedTitle = currentMovie.title.toLowerCase()
      
      if (normalizedGuess === normalizedTitle) {
        // Calculate score based on attempts and hints used
        const baseScore = 100
        const attemptPenalty = attempts * 10
        const hintPenalty = hintsUsed * 15
        const timePenalty = Math.floor(timeElapsed / 10)
        const finalScore = Math.max(0, baseScore - attemptPenalty - hintPenalty - timePenalty)
        
        setScore(finalScore)
        setGameState('result')
        
        // Save high score
        if (typeof window !== 'undefined') {
          const highScore = localStorage.getItem('guessHighScore')
          if (!highScore || finalScore > parseInt(highScore)) {
            localStorage.setItem('guessHighScore', finalScore.toString())
          }
        }
      } else {
        setScore((prev: number) => Math.max(0, prev - 2)) // Small penalty for wrong guess
      }
      
      setGuessInput('')
    } catch (err: any) {
      setError('Failed to process guess. Please try again.')
      console.error('Error processing guess:', err)
    }
  }

  const restartGame = () => {
    try {
      setGameState('start')
      setCurrentMovie(null)
      setHintsUsed(0)
      setAttempts(0)
      setScore(0)
      setTimeElapsed(0)
      setGuessInput('')
      setError(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('guessGameState')
      }
    } catch (err: any) {
      setError('Failed to restart game. Please try again.')
      console.error('Error restarting game:', err)
    }
  }

  if (!user) return null

  // Show error message if there's an error
  if (error) {
    return (
      <div className="min-h-screen pb-20 pt-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <p className="text-red-500">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null)
              restartGame()
            }}
            className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--primary-200)' }}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20 pt-24 px-4">
      <div className="max-w-3xl mx-auto">
        <Link 
          href="/dashboard/games" 
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
        >
          <FiArrowLeft size={16} />
          Back to Games
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FiZap size={28} style={{ color: 'var(--primary-300)' }} />
            <h1 className="text-3xl font-bold">Guess the Movie</h1>
          </div>
          
          {gameState === 'start' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Test Your Movie Knowledge!</h2>
              <p className="text-gray-300 mb-6">
                Try to guess the movie title using the image and hints provided. The faster you guess with fewer hints, the higher your score!
              </p>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <FiHeart style={{ color: 'var(--accent-100)' }} size={20} />
                  <span>Use hints wisely - each hint reduces your potential score</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiAward style={{ color: 'var(--primary-300)' }} size={20} />
                  <span>Earn points for quick, accurate guesses</span>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--primary-200)' }}
              >
                Start Game
              </button>
            </motion.div>
          )}
          
          {gameState === 'playing' && currentMovie && (
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiHeart style={{ color: 'var(--accent-100)' }} />
                    <span className="font-bold">Score: {score}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock style={{ color: 'var(--primary-300)' }} />
                    <span className="font-bold">{timeElapsed}s</span>
                  </div>
                </div>
                <div className="text-gray-400">
                  Attempts: {attempts}
                </div>
              </div>
              
              <div className="mb-8">
                <img 
                  src={currentMovie.imageUrl} 
                  alt="Movie to guess" 
                  className="w-full max-w-md mx-auto rounded-lg mb-6 filter blur-sm"
                />
                
                <div className="space-y-3">
                  {currentMovie.hints.slice(0, hintsUsed).map((hint, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-gray-800 rounded-lg"
                    >
                      {hint}
                    </div>
                  ))}
                </div>
                
                {hintsUsed < currentMovie.hints.length && (
                  <button
                    onClick={useHint}
                    className="mt-4 px-4 py-2 text-sm text-gray-300 border border-gray-600 rounded hover:bg-gray-800 transition-colors"
                  >
                    Use Hint (-5 points)
                  </button>
                )}
              </div>
              
              <div className="flex gap-3">
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && makeGuess()}
                  placeholder="Enter your guess..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-primary-300"
                />
                <button
                  onClick={makeGuess}
                  className="px-6 py-2 text-white font-bold rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--primary-200)' }}
                >
                  Guess
                </button>
              </div>
            </div>
          )}
          
          {gameState === 'result' && currentMovie && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-6">Congratulations!</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8 my-10">
                <img 
                  src={currentMovie.imageUrl} 
                  alt={currentMovie.title} 
                  className="w-full md:w-1/3 rounded-md" 
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{currentMovie.title}</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FiAward size={20} style={{ color: 'var(--accent-100)' }} />
                      <span className="text-lg">Final Score: <strong>{score}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Time: <strong>{timeElapsed} seconds</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiHeart size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Hints Used: <strong>{hintsUsed}</strong></span>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <button
                      onClick={startGame}
                      className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--primary-200)' }}
                    >
                      Play Again
                    </button>
                    <Link
                      href="/dashboard/games"
                      className="px-6 py-3 text-white font-bold rounded-lg transition-colors bg-gray-700 hover:bg-gray-600"
                    >
                      Back to Games
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
} 
