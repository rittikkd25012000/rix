'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiZap, FiEye, FiHelpCircle, FiMessageCircle, FiClock } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Sample movies for the guessing game
const movies = [
  {
    id: 1,
    title: "The Godfather",
    hint1: "A 1972 American crime film",
    hint2: "Based on a novel by Mario Puzo",
    hint3: "Features Marlon Brando as Vito Corleone",
    quote: "I'm gonna make him an offer he can't refuse.",
    blurredImage: "https://imgs.search.brave.com/JK5IOoXcJ6pPhlfxSCsj5j2uu41TnCQRZf25Z67XojM/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk5UQTNORE0w/WkRrdE1HUmlNeTAw/TURsbUxUaGxZVEF0/Wm1GaU9EazROV1po/TXpFMVhrRXlYa0Zx/Y0dkZVFWUnlZWFJs/Y3pBeU1qSTBOalk1/TXpRQC5qcGc",
    difficulty: "medium"
  },
  {
    id: 2,
    title: "Jurassic Park",
    hint1: "A 1993 science fiction film",
    hint2: "Directed by Steven Spielberg",
    hint3: "Features genetically engineered dinosaurs",
    quote: "Life, uh, finds a way.",
    blurredImage: "https://imgs.search.brave.com/P-AlJDPEYjbCtHH_xmXLH6_bZyBbvM6FHXsLhU-3Fl4/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk1XTmxaamsx/TXpJdE5UZGxNeTAw/WVRFNExUaGxNamt0/TlRKalpXSTBOVFV5/TlRsbVhrRXlYa0Zx/Y0dkZVFYVnlkR2wx/Ylc5M01ESXdNREEz/TlRnd0AuanBn",
    difficulty: "easy"
  },
  {
    id: 3,
    title: "The Matrix",
    hint1: "A 1999 science fiction film",
    hint2: "Features a dystopian future",
    hint3: "Stars Keanu Reeves as Neo",
    quote: "Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.",
    blurredImage: "https://imgs.search.brave.com/vVQBBkzP5pUFsZe8v4sryQzvwCW02GSGkbvF3HfN2AE/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk56UXpPR1V3/TldVdE1tTXdOeTAw/TmpKbUxUaGxNVFl0/WkRJNE1qUTFNek0w/TURobVhrRXlYa0Zx/Y0dkZVFWTmpiMjB3/T0RBeU1qYzNNekVA/LmpwZw",
    difficulty: "medium"
  },
  {
    id: 4,
    title: "The Silence of the Lambs",
    hint1: "A 1991 psychological horror film",
    hint2: "Based on a novel by Thomas Harris",
    hint3: "Features Anthony Hopkins as Dr. Hannibal Lecter",
    quote: "A census taker once tried to test me. I ate his liver with some fava beans and a nice Chianti.",
    blurredImage: "https://imgs.search.brave.com/5HFG5_NGGw6SmXUQaY01B_AQXPmTUDZHYO3-KOVxKYA/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk5UazJPVFJo/TkRjdE1tVTVOQzAw/TmpCaExUbGlZMlF0/TXpJME16TTNORGMy/T0RKbVhrRXlYa0Zx/Y0dkZVFYVnlkR2wx/Ylc5M01ESXdNREUw/TnpFQC5qcGc",
    difficulty: "hard"
  },
  {
    id: 5,
    title: "Pulp Fiction",
    hint1: "A 1994 black comedy crime film",
    hint2: "Directed by Quentin Tarantino",
    hint3: "Features John Travolta, Samuel L. Jackson, and Uma Thurman",
    quote: "Say 'what' again. Say 'what' again, I dare you, I double dare you...",
    blurredImage: "https://imgs.search.brave.com/eoBTTnOCW4xZuQKZ85XpWYs6wFwzJrdZZgW9L5Y7h-0/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL00v/TVY1Qk5HTmhNRE0w/WXpndE9XTXdPQzAw/T0RNeExUZ3pPVEF0/TVRGaU1URmlPRFUz/WVRjeVhrRXlYa0Zx/Y0dkZVFYVnlkR2wx/Ylc5M01ESXdNREE0/T1RnQC5qcGc",
    difficulty: "medium"
  }
];

export default function GuessGame() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start')
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [currentMovie, setCurrentMovie] = useState<typeof movies[0] | null>(null)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null)
  const [filteredMovies, setFilteredMovies] = useState<typeof movies>([])
  
  // Filter movies by difficulty
  useEffect(() => {
    if (selectedDifficulty === 'easy') {
      setFilteredMovies(movies.filter(m => m.difficulty === 'easy'));
    } else if (selectedDifficulty === 'hard') {
      setFilteredMovies(movies.filter(m => m.difficulty === 'hard'));
    } else {
      // Medium includes both easy and medium
      setFilteredMovies(movies.filter(m => m.difficulty === 'medium' || m.difficulty === 'easy'));
    }
  }, [selectedDifficulty]);
  
  // Start game function
  const startGame = () => {
    // Randomly select a movie from the filtered list
    const randomMovie = filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
    setCurrentMovie(randomMovie);
    setHintsRevealed(0);
    setGuess('');
    setAttempts(0);
    setTimeLeft(60);
    setGameResult(null);
    setGameState('playing');
  };
  
  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing' || gameResult) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setGameResult('lost');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState, gameResult]);
  
  // Reveal next hint
  const revealHint = () => {
    if (hintsRevealed < 3) {
      setHintsRevealed(hintsRevealed + 1);
    }
  };
  
  // Submit guess
  const submitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMovie || !guess.trim() || gameResult) return;
    
    setAttempts(attempts + 1);
    
    // Check if guess is correct (case insensitive)
    if (guess.toLowerCase() === currentMovie.title.toLowerCase()) {
      setGameResult('won');
    } else if (attempts >= 2) {
      // If this was the third wrong attempt, game over
      setGameResult('lost');
    }
  };
  
  // Calculate score based on hints revealed and time taken
  const calculateScore = () => {
    if (!gameResult || gameResult === 'lost') return 0;
    
    // Base score: 100
    let score = 100;
    
    // Subtract points for each hint revealed (except the first one which is free)
    score -= (hintsRevealed - 1) * 15;
    
    // Subtract points for attempts
    score -= (attempts - 1) * 10;
    
    // Add points for remaining time (max 30 points)
    score += Math.min(timeLeft / 2, 30);
    
    return Math.max(Math.round(score), 10); // Minimum score is 10
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
              <h2 className="text-2xl font-bold mb-4">How Well Do You Know Movies?</h2>
              <p className="text-gray-300 mb-6">
                Test your movie knowledge by guessing films from clues, quotes, and obscured images. 
                Choose your difficulty level to begin.
              </p>
              
              <div className="flex flex-col gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-bold mb-3">Select Difficulty:</h3>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setSelectedDifficulty('easy')}
                      className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                        selectedDifficulty === 'easy' 
                          ? 'text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      style={selectedDifficulty === 'easy' ? { backgroundColor: 'var(--primary-200)' } : {}}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => setSelectedDifficulty('medium')}
                      className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                        selectedDifficulty === 'medium' 
                          ? 'text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      style={selectedDifficulty === 'medium' ? { backgroundColor: 'var(--primary-200)' } : {}}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => setSelectedDifficulty('hard')}
                      className={`px-6 py-3 font-bold rounded-lg transition-colors ${
                        selectedDifficulty === 'hard' 
                          ? 'text-white' 
                          : 'bg-gray-800 text-gray-300'
                      }`}
                      style={selectedDifficulty === 'hard' ? { backgroundColor: 'var(--primary-200)' } : {}}
                    >
                      Hard
                    </button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-3">How to Play:</h3>
                  <ul className="space-y-2 text-gray-300 list-disc pl-5">
                    <li>You'll get a blurred image and have to guess the movie</li>
                    <li>Reveal up to 3 hints to help you guess</li>
                    <li>You have 3 attempts to guess correctly</li>
                    <li>60 seconds time limit per movie</li>
                    <li>Score is based on time left, hints used, and attempts made</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={startGame}
                disabled={filteredMovies.length === 0}
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
                <div className="flex items-center gap-2">
                  <span className="font-bold">Difficulty:</span>
                  <span className="capitalize">{selectedDifficulty}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiClock style={{ color: timeLeft < 10 ? 'var(--accent-100)' : 'var(--primary-300)' }} />
                  <span className={`font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <div className="flex-1">
                  <div 
                    className="w-full relative rounded-lg overflow-hidden mb-4"
                    style={{ filter: `blur(${10 - hintsRevealed * 3}px)` }}
                  >
                    <img 
                      src={currentMovie.blurredImage} 
                      alt="Guess this movie" 
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-400">Attempts: {attempts}/3</span>
                    <button
                      onClick={revealHint}
                      disabled={hintsRevealed >= 3 || gameResult !== null}
                      className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg ${
                        hintsRevealed >= 3 || gameResult ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: 'var(--accent-100)' }}
                    >
                      <FiEye size={16} />
                      Reveal Hint ({hintsRevealed}/3)
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <div className="bg-gray-800 p-4 rounded-lg mb-4 flex-1">
                    <h3 className="text-lg font-bold mb-3">Hints:</h3>
                    <ul className="space-y-4">
                      <AnimatePresence>
                        {hintsRevealed >= 1 && (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2"
                          >
                            <FiHelpCircle style={{ color: 'var(--primary-300)' }} className="mt-1" />
                            <span>{currentMovie.hint1}</span>
                          </motion.li>
                        )}
                        
                        {hintsRevealed >= 2 && (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2"
                          >
                            <FiHelpCircle style={{ color: 'var(--primary-300)' }} className="mt-1" />
                            <span>{currentMovie.hint2}</span>
                          </motion.li>
                        )}
                        
                        {hintsRevealed >= 3 && (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-start gap-2"
                          >
                            <FiHelpCircle style={{ color: 'var(--primary-300)' }} className="mt-1" />
                            <span>{currentMovie.hint3}</span>
                          </motion.li>
                        )}
                      </AnimatePresence>
                      
                      <li className="border-t border-gray-700 pt-4 flex items-start gap-2">
                        <FiMessageCircle style={{ color: 'var(--accent-100)' }} className="mt-1" />
                        <span>"{currentMovie.quote}"</span>
                      </li>
                    </ul>
                  </div>
                  
                  <form onSubmit={submitGuess} className="mt-auto">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="guess" className="text-lg font-bold">
                        Your Guess:
                      </label>
                      <input
                        type="text"
                        id="guess"
                        value={guess}
                        onChange={(e) => setGuess(e.target.value)}
                        disabled={gameResult !== null}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                        placeholder="Enter movie title..."
                      />
                      
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-400">
                          {3 - attempts} guesses remaining
                        </span>
                        <button
                          type="submit"
                          disabled={!guess.trim() || gameResult !== null}
                          className={`px-6 py-2 text-white font-bold rounded-lg transition-colors ${
                            !guess.trim() || gameResult ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          style={{ backgroundColor: 'var(--primary-200)' }}
                        >
                          Submit Guess
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              
              <AnimatePresence>
                {gameResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      gameResult === 'won' ? 'bg-primary-300/20' : 'bg-accent-100/20'
                    }`}
                    style={{ 
                      borderColor: gameResult === 'won' ? 'var(--primary-300)' : 'var(--accent-100)',
                      borderWidth: '1px'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">
                        {gameResult === 'won' ? 'Correct!' : 'Game Over!'}
                      </h3>
                      
                      <button
                        onClick={() => {
                          if (gameResult === 'won') {
                            startGame(); // Start a new round
                          } else {
                            setGameState('result'); // Go to results screen
                          }
                        }}
                        className="px-4 py-2 text-white rounded-lg"
                        style={{ 
                          backgroundColor: gameResult === 'won' 
                            ? 'var(--primary-200)' 
                            : 'var(--accent-100)' 
                        }}
                      >
                        {gameResult === 'won' ? 'Next Movie' : 'See Results'}
                      </button>
                    </div>
                    
                    {gameResult === 'won' && (
                      <div className="mt-2">
                        <p>You scored: <strong>{calculateScore()} points</strong></p>
                      </div>
                    )}
                    
                    {gameResult === 'lost' && (
                      <div className="mt-2">
                        <p>The movie was: <strong>{currentMovie.title}</strong></p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {gameState === 'result' && currentMovie && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4">Game Results</h2>
              
              <div className="flex flex-col md:flex-row items-center gap-8 my-10">
                <img 
                  src={currentMovie.blurredImage} 
                  alt={currentMovie.title} 
                  className="w-full md:w-1/3 rounded-md" 
                />
                
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{currentMovie.title}</h3>
                  <div className="space-y-2 mb-6 text-gray-300">
                    <p><strong>Quote:</strong> "{currentMovie.quote}"</p>
                    <p><strong>Hints:</strong></p>
                    <ul className="list-disc pl-5">
                      <li>{currentMovie.hint1}</li>
                      <li>{currentMovie.hint2}</li>
                      <li>{currentMovie.hint3}</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-bold mb-3">Your Performance:</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Hints Used</p>
                        <p className="font-bold">{hintsRevealed}/3</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Attempts</p>
                        <p className="font-bold">{attempts}/3</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Time Remaining</p>
                        <p className="font-bold">{timeLeft}s</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Result</p>
                        <p className="font-bold">
                          {gameResult === 'won' ? 'Correct' : 'Incorrect'}
                        </p>
                      </div>
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
