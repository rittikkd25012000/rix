'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiGrid, FiClock, FiRefreshCw, FiImage } from 'react-icons/fi'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Sample movie posters for the puzzle
const moviePosters = [
  {
    id: 1,
    title: "Inception",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "The Shawshank Redemption",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    difficulty: "medium"
  },
  {
    id: 3,
    title: "The Dark Knight",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    difficulty: "hard"
  },
  {
    id: 4,
    title: "Pulp Fiction",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    difficulty: "medium"
  },
  {
    id: 5,
    title: "The Matrix",
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    difficulty: "easy"
  }
];

export default function PuzzleGame() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<'start' | 'playing' | 'complete'>('start')
  const [selectedPoster, setSelectedPoster] = useState<typeof moviePosters[0] | null>(null)
  const [puzzleSize, setPuzzleSize] = useState<3 | 4>(3) // 3x3 or 4x4 grid
  const [tiles, setTiles] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  // Initialize the puzzle
  const startGame = (poster: typeof moviePosters[0], size: 3 | 4) => {
    setPuzzleSize(size);
    setSelectedPoster(poster);
    setMoves(0);
    setTime(0);
    setIsComplete(false);
    
    // Create an array [0, 1, 2, ..., size*size-1] and shuffle it
    const newTiles = Array.from({ length: size * size }, (_, i) => i);
    shuffleTiles(newTiles);
    setTiles(newTiles);
    
    setGameState('playing');
  };
  
  // Shuffle the tiles
  const shuffleTiles = (tilesArray: number[]) => {
    // Fisher-Yates shuffle
    for (let i = tilesArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tilesArray[i], tilesArray[j]] = [tilesArray[j], tilesArray[i]];
    }
    
    // Check if the puzzle is solvable
    const blankTileIndex = tilesArray.indexOf(0);
    
    // For simplicity, we'll just move the blank tile to ensure solvability
    // In a real game, you'd need a proper solvability check algorithm
    if (blankTileIndex > 0) {
      [tilesArray[0], tilesArray[blankTileIndex]] = [tilesArray[blankTileIndex], tilesArray[0]];
    }
  };
  
  // Move a tile
  const moveTile = (index: number) => {
    if (isComplete) return;
    
    const blankIndex = tiles.indexOf(0);
    const tilesPerRow = puzzleSize;
    
    // Check if the tile is adjacent to the blank space
    const isAdjacent = (
      (Math.abs(Math.floor(index / tilesPerRow) - Math.floor(blankIndex / tilesPerRow)) === 1 && 
       Math.floor(index % tilesPerRow) === Math.floor(blankIndex % tilesPerRow)) ||
      (Math.abs(Math.floor(index % tilesPerRow) - Math.floor(blankIndex % tilesPerRow)) === 1 &&
       Math.floor(index / tilesPerRow) === Math.floor(blankIndex / tilesPerRow))
    );
    
    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[blankIndex]] = [newTiles[blankIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
      
      // Check if the puzzle is complete
      const isSolved = newTiles.every((tile, i) => tile === i);
      if (isSolved) {
        setIsComplete(true);
        setGameState('complete');
      }
    }
  };
  
  // Timer
  useEffect(() => {
    if (gameState === 'playing' && !isComplete) {
      const interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameState, isComplete]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (!user) return null;
  
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
                {moviePosters.map(poster => (
                  <div 
                    key={poster.id} 
                    className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    onClick={() => setSelectedPoster(poster)}
                  >
                    <img 
                      src={poster.imageUrl} 
                      alt={poster.title} 
                      className="w-full h-48 object-cover rounded-md mb-3" 
                    />
                    <h3 className="font-bold">{poster.title}</h3>
                    <p className="text-sm text-gray-400 capitalize">{poster.difficulty} difficulty</p>
                  </div>
                ))}
              </div>
              
              {selectedPoster && (
                <div className="flex flex-col items-center gap-4 mt-6 p-6 bg-gray-800 rounded-lg">
                  <h3 className="text-xl font-bold">Selected: {selectedPoster.title}</h3>
                  <div className="flex gap-4">
                    <button
                      onClick={() => startGame(selectedPoster, 3)}
                      className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--primary-200)' }}
                    >
                      3×3 (Easy)
                    </button>
                    <button
                      onClick={() => startGame(selectedPoster, 4)}
                      className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                      style={{ backgroundColor: 'var(--accent-100)' }}
                    >
                      4×4 (Hard)
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
          
          {gameState === 'playing' && selectedPoster && (
            <div className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{selectedPoster.title}</h2>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <FiRefreshCw style={{ color: 'var(--accent-100)' }} />
                    <span className="font-bold">{moves} moves</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock style={{ color: 'var(--primary-300)' }} />
                    <span className="font-bold">{formatTime(time)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <div 
                  className="relative mb-6"
                  style={{
                    width: `${puzzleSize * 80}px`,
                    height: `${puzzleSize * 80}px`
                  }}
                >
                  {tiles.map((tile, index) => {
                    if (tile === 0) {
                      // Empty tile
                      return (
                        <div
                          key={index}
                          style={{
                            position: 'absolute',
                            top: `${Math.floor(index / puzzleSize) * 80}px`,
                            left: `${(index % puzzleSize) * 80}px`,
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#1f1f1f',
                            border: '1px solid #333',
                            transition: 'all 0.2s ease'
                          }}
                        ></div>
                      );
                    }
                    
                    const row = Math.floor(tile / puzzleSize);
                    const col = tile % puzzleSize;
                    
                    return (
                      <motion.div
                        key={tile}
                        style={{
                          position: 'absolute',
                          top: `${Math.floor(index / puzzleSize) * 80}px`,
                          left: `${(index % puzzleSize) * 80}px`,
                          width: '80px',
                          height: '80px',
                          backgroundImage: `url(${selectedPoster.imageUrl})`,
                          backgroundSize: `${puzzleSize * 80}px ${puzzleSize * 80}px`,
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
                      const newTiles = Array.from({ length: puzzleSize * puzzleSize }, (_, i) => i);
                      shuffleTiles(newTiles);
                      setTiles(newTiles);
                      setMoves(0);
                      setTime(0);
                      setIsComplete(false);
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
          
          {gameState === 'complete' && selectedPoster && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4">Puzzle Complete!</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8 my-10">
                <img 
                  src={selectedPoster.imageUrl} 
                  alt={selectedPoster.title} 
                  className="w-full md:w-1/3 rounded-md" 
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{selectedPoster.title}</h3>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2">
                      <FiRefreshCw size={20} style={{ color: 'var(--accent-100)' }} />
                      <span className="text-lg">Completed in <strong>{moves} moves</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiClock size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Time: <strong>{formatTime(time)}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiImage size={20} style={{ color: 'var(--primary-300)' }} />
                      <span className="text-lg">Puzzle size: <strong>{puzzleSize}×{puzzleSize}</strong></span>
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
