'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiGrid, FiClock, FiRefreshCw, FiImage, FiAward } from 'react-icons/fi'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Sample puzzle data
const puzzleData = [
  {
    id: 1,
    title: 'The Dark Knight',
    imageUrl: '/images/dark-knight-poster.jpg',
    difficulty: 'medium',
    gridSize: 3
  },
  {
    id: 2,
    title: 'Inception',
    imageUrl: '/images/inception-poster.jpg',
    difficulty: 'hard',
    gridSize: 4
  },
  {
    id: 3,
    title: 'Pulp Fiction',
    imageUrl: '/images/pulp-fiction-poster.jpg',
    difficulty: 'medium',
    gridSize: 3
  }
]

export default function PuzzleGame() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>(() => {
    // Try to restore game state from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('puzzleGameState')
      if (savedState) {
        return JSON.parse(savedState).gameState || 'start'
      }
    }
    return 'start'
  })
  const [selectedPuzzle, setSelectedPuzzle] = useState<typeof puzzleData[0] | null>(() => {
    // Try to restore selected puzzle from localStorage
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('puzzleGameState')
      if (savedState) {
        return JSON.parse(savedState).selectedPuzzle || null
      }
    }
    return null
  })
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && gameState === 'playing') {
      localStorage.setItem('puzzleGameState', JSON.stringify({
        gameState,
        selectedPuzzle,
        tiles,
        moves,
        timeElapsed
      }))
    }
  }, [gameState, selectedPuzzle, tiles, moves, timeElapsed])

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
        localStorage.removeItem('puzzleGameState')
      }
    }
  }, [])

  const startGame = (puzzle: typeof puzzleData[0]) => {
    try {
      setSelectedPuzzle(puzzle)
      setMoves(0)
      setTimeElapsed(0)
      
      // Create shuffled tiles array
      const size = puzzle.gridSize * puzzle.gridSize
      const shuffledTiles = Array.from({ length: size }, (_, i) => i)
        .sort(() => Math.random() - 0.5)
      
      // Verify puzzle is solvable
      let inversions = 0
      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          if (shuffledTiles[i] > shuffledTiles[j]) {
            inversions++
          }
        }
      }
      
      // If puzzle is not solvable, swap last two tiles
      if (inversions % 2 !== 0) {
        [shuffledTiles[size - 2], shuffledTiles[size - 1]] = 
        [shuffledTiles[size - 1], shuffledTiles[size - 2]]
      }
      
      setTiles(shuffledTiles)
      setGameState('playing')
      setError(null)
    } catch (err: any) {
      setError('Failed to start game. Please try again.')
      console.error('Error starting game:', err)
    }
  }

  const moveTile = (index: number) => {
    try {
      if (gameState !== 'playing' || !selectedPuzzle) return
      
      const size = selectedPuzzle.gridSize
      const emptyIndex = tiles.indexOf(size * size - 1)
      
      // Check if tile is adjacent to empty space
      const row = Math.floor(index / size)
      const col = index % size
      const emptyRow = Math.floor(emptyIndex / size)
      const emptyCol = emptyIndex % size
      
      if (
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow)
      ) {
        const newTiles = [...tiles]
        ;[newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]]
        setTiles(newTiles)
        setMoves((prev: number) => prev + 1)
        
        // Check if puzzle is solved
        if (newTiles.every((tile, i) => tile === i)) {
          setGameState('result')
          // Save high score
          if (typeof window !== 'undefined') {
            const highScore = localStorage.getItem(`puzzleHighScore_${selectedPuzzle.id}`)
            const currentScore = moves + timeElapsed
            if (!highScore || currentScore < parseInt(highScore)) {
              localStorage.setItem(`puzzleHighScore_${selectedPuzzle.id}`, currentScore.toString())
            }
          }
        }
      }
    } catch (err: any) {
      setError('Failed to move tile. Please try again.')
      console.error('Error moving tile:', err)
    }
  }

  const restartGame = () => {
    try {
      setGameState('start')
      setSelectedPuzzle(null)
      setTiles([])
      setMoves(0)
      setTimeElapsed(0)
      setError(null)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('puzzleGameState')
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
      <div className="max-w-4xl mx-auto">
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
            <FiGrid size={28} style={{ color: 'var(--primary-300)' }} />
            <h1 className="text-3xl font-bold">Movie Poster Puzzle</h1>
          </div>
          
          {gameState === 'start' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">Solve the Puzzle!</h2>
              <p className="text-gray-300 mb-6">
                Rearrange the pieces to complete the movie poster. Choose a poster and difficulty level to begin.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
                {puzzleData.map(puzzle => (
                  <div 
                    key={puzzle.id} 
                    className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => startGame(puzzle)}
                  >
                    <img 
                      src={puzzle.imageUrl} 
                      alt={puzzle.title} 
                      className="w-full h-48 object-cover rounded-md mb-3" 
                    />
                    <h3 className="font-bold">{puzzle.title}</h3>
                    <p className="text-sm text-gray-400 capitalize">{puzzle.difficulty} difficulty</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
          
          {gameState === 'playing' && selectedPuzzle && (
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{selectedPuzzle.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiRefreshCw style={{ color: 'var(--accent-100)' }} />
                    <span className="font-bold">{moves} moves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock style={{ color: 'var(--primary-300)' }} />
                    <span className="font-bold">{timeElapsed} seconds</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div 
                  className="relative mb-6"
                  style={{
                    width: `${selectedPuzzle.gridSize * 80}px`,
                    height: `${selectedPuzzle.gridSize * 80}px`
                  }}
                >
                  {tiles.map((tile, index) => {
                    if (tile === selectedPuzzle.gridSize * selectedPuzzle.gridSize - 1) {
                      // Empty tile
                      return (
                        <div
                          key={index}
                          style={{
                            position: 'absolute',
                            top: `${Math.floor(index / selectedPuzzle.gridSize) * 80}px`,
                            left: `${(index % selectedPuzzle.gridSize) * 80}px`,
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#1f1f1f',
                            border: '1px solid #333',
                            transition: 'all 0.2s ease'
                          }}
                        ></div>
                      );
                    }
                    
                    const row = Math.floor(tile / selectedPuzzle.gridSize);
                    const col = tile % selectedPuzzle.gridSize;
                    
                    return (
                      <motion.div
                        key={tile}
                        style={{
                          position: 'absolute',
                          top: `${Math.floor(index / selectedPuzzle.gridSize) * 80}px`,
                          left: `${(index % selectedPuzzle.gridSize) * 80}px`,
                          width: '80px',
                          height: '80px',
                          backgroundImage: `url(${selectedPuzzle.imageUrl})`,
                          backgroundSize: `${selectedPuzzle.gridSize * 80}px ${selectedPuzzle.gridSize * 80}px`,
                          backgroundPosition: `-${col * 80}px -${row * 80}px`,
                          border: '1px solid #333',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => moveTile(index)}
                      ></motion.div>
                    );
                  })}
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setGameState('start')}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg transition-colors hover:bg-gray-600"
                  >
                    Choose Another Image
                  </button>
                  <button
                    onClick={() => {
                      const newTiles = Array.from({ length: selectedPuzzle.gridSize * selectedPuzzle.gridSize }, (_, i) => i);
                      startGame(selectedPuzzle);
                    }}
                    className="px-6 py-2 text-white rounded-lg transition-colors"
                    style={{ backgroundColor: 'var(--accent-100)' }}
                  >
                    Restart
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {gameState === 'result' && selectedPuzzle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8 my-10">
                <img 
                  src={selectedPuzzle.imageUrl} 
                  alt={selectedPuzzle.title} 
                  className="w-full md:w-1/3 rounded-md" 
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedPuzzle.title}</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FiAward size={20} style={{ color: 'var(--accent-100)' }} />
                      <span className="text-lg">Completed in <strong>{moves} moves</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Time: <strong>{timeElapsed} seconds</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiImage size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Puzzle size: <strong>{selectedPuzzle.gridSize}×{selectedPuzzle.gridSize}</strong></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setGameState('start')}
                  className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--primary-200)' }}
                >
                  Play Again
                </button>
                <Link 
                  href="/dashboard/games" 
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-colors"
                >
                  Back to Games
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 
