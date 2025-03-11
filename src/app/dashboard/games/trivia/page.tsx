'use client'

import { useAuth } from '@/context/AuthContext'
import { useState, useEffect } from 'react'
import { FiArrowLeft, FiHelpCircle, FiAward, FiClock, FiCheck, FiX } from 'react-icons/fi'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// Sample trivia questions
const triviaQuestions = [
  {
    id: 1,
    question: "Which film won the Academy Award for Best Picture in 2020?",
    options: ["1917", "Joker", "Parasite", "Once Upon a Time in Hollywood"],
    correctAnswer: "Parasite",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "Who directed the 1994 film 'Pulp Fiction'?",
    options: ["Martin Scorsese", "Quentin Tarantino", "Steven Spielberg", "Francis Ford Coppola"],
    correctAnswer: "Quentin Tarantino",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "Which actor played Tony Stark / Iron Man in the Marvel Cinematic Universe?",
    options: ["Chris Evans", "Mark Ruffalo", "Robert Downey Jr.", "Chris Hemsworth"],
    correctAnswer: "Robert Downey Jr.",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "What was the first feature-length animated film ever released?",
    options: ["Snow White and the Seven Dwarfs", "Pinocchio", "Fantasia", "Bambi"],
    correctAnswer: "Snow White and the Seven Dwarfs",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "Which 1982 science fiction film features a character saying 'E.T. phone home'?",
    options: ["Star Trek II: The Wrath of Khan", "Blade Runner", "E.T. the Extra-Terrestrial", "The Thing"],
    correctAnswer: "E.T. the Extra-Terrestrial",
    difficulty: "easy"
  },
  {
    id: 6,
    question: "Who played the Joker in 'The Dark Knight' (2008)?",
    options: ["Joaquin Phoenix", "Jack Nicholson", "Jared Leto", "Heath Ledger"],
    correctAnswer: "Heath Ledger",
    difficulty: "easy"
  },
  {
    id: 7,
    question: "Which actress has won the most Academy Awards for acting?",
    options: ["Meryl Streep", "Katharine Hepburn", "Frances McDormand", "Bette Davis"],
    correctAnswer: "Katharine Hepburn",
    difficulty: "hard"
  },
  {
    id: 8,
    question: "What is the highest-grossing film of all time (not adjusted for inflation)?",
    options: ["Avatar", "Avengers: Endgame", "Titanic", "Star Wars: The Force Awakens"],
    correctAnswer: "Avatar",
    difficulty: "medium"
  },
  {
    id: 9,
    question: "Which director is known for films such as 'Inception', 'The Dark Knight', and 'Interstellar'?",
    options: ["Christopher Nolan", "James Cameron", "Ridley Scott", "Steven Spielberg"],
    correctAnswer: "Christopher Nolan",
    difficulty: "easy"
  },
  {
    id: 10,
    question: "In which film would you hear the line 'Here's looking at you, kid'?",
    options: ["Gone with the Wind", "The Maltese Falcon", "Casablanca", "Citizen Kane"],
    correctAnswer: "Casablanca",
    difficulty: "medium"
  }
];

export default function TriviaGame() {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerChecked, setIsAnswerChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [gameQuestions, setGameQuestions] = useState<typeof triviaQuestions>([])
  
  // Reset timer when moving to a new question
  useEffect(() => {
    if (gameState !== 'playing') return;
    
    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isAnswerChecked) {
            checkAnswer(null);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentQuestionIndex, gameState]);
  
  // Start game function
  const startGame = () => {
    // Shuffle and select 5 random questions
    const shuffled = [...triviaQuestions].sort(() => 0.5 - Math.random());
    setGameQuestions(shuffled.slice(0, 5));
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameState('playing');
  };
  
  // Check answer function
  const checkAnswer = (answer: string | null) => {
    if (isAnswerChecked) return;
    
    setSelectedAnswer(answer);
    setIsAnswerChecked(true);
    
    const currentQuestion = gameQuestions[currentQuestionIndex];
    if (answer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
    
    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestionIndex < gameQuestions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setSelectedAnswer(null);
        setIsAnswerChecked(false);
      } else {
        setGameState('result');
      }
    }, 1500);
  };
  
  // Restart game function
  const restartGame = () => {
    setGameState('start');
  };
  
  if (!user) return null;
  
  const currentQuestion = gameQuestions[currentQuestionIndex];
  
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
            <FiHelpCircle size={28} style={{ color: 'var(--primary-300)' }} />
            <h1 className="text-3xl font-bold">Movie Trivia Quiz</h1>
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
                Answer 5 movie-related questions against the clock. Each correct answer earns you points. Ready to challenge yourself?
              </p>
              
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <FiClock style={{ color: 'var(--accent-100)' }} size={20} />
                  <span>15 seconds per question</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiAward style={{ color: 'var(--primary-300)' }} size={20} />
                  <span>Earn badges for high scores</span>
                </div>
              </div>
              
              <button
                onClick={startGame}
                className="px-6 py-3 text-white font-bold rounded-lg transition-colors"
                style={{ backgroundColor: 'var(--primary-200)' }}
              >
                Start Quiz
              </button>
            </motion.div>
          )}
          
          {gameState === 'playing' && currentQuestion && (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800 mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="text-gray-400">
                  Question {currentQuestionIndex + 1} of {gameQuestions.length}
                </div>
                <div className="flex items-center gap-2">
                  <FiClock style={{ color: 'var(--accent-100)' }} />
                  <span className={`font-bold ${timeLeft < 5 ? 'text-red-500' : 'text-white'}`}>
                    {timeLeft}s
                  </span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold mb-8">{currentQuestion.question}</h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === currentQuestion.correctAnswer;
                  
                  let optionClass = "p-4 border border-gray-700 rounded-lg transition-all cursor-pointer hover:border-gray-500";
                  
                  if (isAnswerChecked) {
                    if (isCorrect) {
                      optionClass = "p-4 rounded-lg";
                      optionClass += " border border-primary-300 bg-primary-300/20";
                    } else if (isSelected) {
                      optionClass = "p-4 border border-accent-100 bg-accent-100/20 rounded-lg";
                    } else {
                      optionClass = "p-4 border border-gray-700 rounded-lg opacity-50";
                    }
                  } else if (isSelected) {
                    optionClass = "p-4 border rounded-lg";
                    optionClass += " border-primary-300 bg-primary-300/20";
                  }
                  
                  return (
                    <div
                      key={option}
                      className={optionClass}
                      onClick={() => !isAnswerChecked && checkAnswer(option)}
                      style={isAnswerChecked && isCorrect ? { borderColor: 'var(--primary-300)', backgroundColor: 'rgba(195, 135, 201, 0.1)' } : 
                            isAnswerChecked && isSelected && !isCorrect ? { borderColor: 'var(--accent-100)', backgroundColor: 'rgba(255, 112, 97, 0.1)' } : 
                            isSelected ? { borderColor: 'var(--primary-300)', backgroundColor: 'rgba(195, 135, 201, 0.1)' } : {}}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {isAnswerChecked && isCorrect && (
                          <FiCheck style={{ color: 'var(--primary-300)' }} size={20} />
                        )}
                        {isAnswerChecked && isSelected && !isCorrect && (
                          <FiX style={{ color: 'var(--accent-100)' }} size={20} />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 flex justify-between items-center">
                <div className="text-gray-400">Score: {score}</div>
              </div>
            </motion.div>
          )}
          
          {gameState === 'result' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-gray-900/50 p-8 rounded-xl border border-gray-800"
            >
              <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
              
              <div className="flex flex-col items-center my-10">
                <div className="text-6xl font-bold mb-2">
                  {score} / {gameQuestions.length}
                </div>
                <div className="text-xl text-gray-300 mb-6">
                  {score === gameQuestions.length 
                    ? "Perfect! You're a movie expert!" 
                    : score >= gameQuestions.length / 2 
                      ? "Good job! You know your movies!" 
                      : "Better luck next time!"}
                </div>
                
                <FiAward 
                  size={80} 
                  style={{ 
                    color: score === gameQuestions.length 
                      ? 'var(--primary-300)' 
                      : score >= gameQuestions.length / 2 
                        ? 'var(--primary-200)' 
                        : '#4a4a4a'
                  }} 
                />
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={restartGame}
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
