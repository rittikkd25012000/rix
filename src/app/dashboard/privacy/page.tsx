'use client'

import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCode, FiCoffee, FiKey, FiLock } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function PrivacyPage() {
  const { user } = useAuth()
  const [laughIntensity, setLaughIntensity] = useState(0)
  const [codeLines, setCodeLines] = useState<string[]>([])
  const [currentJoke, setCurrentJoke] = useState("")

  // Developer jokes
  const devJokes = [
    "Why do programmers prefer dark mode? Because light attracts bugs!",
    "I'd tell you a joke about privacy policies, but I'd have to ask for your consent first.",
    "Why was the privacy policy at a therapy session? It had too many issues.",
    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
    "The code works... I have no idea why.",
    "99 little bugs in the code, 99 bugs in the code, take one down, patch it around, 127 bugs in the code!",
    "I told a privacy joke to a friend, but they leaked it.",
    "The only place I can truly be private is in my code comments... wait, you're reading this?",
    "My code doesn't work, I have no idea why. My code works, I have no idea why.",
    "GDPR walks into a bar, and the bartender says 'I can't serve you until you consent to my terms.'"
  ]

  // Code snippets to display (deliberately silly)
  const codeSamples = [
    "if (user.readPrivacyPolicy) { /* haha, as if */ }",
    "// This is supposed to be a privacy policy",
    "function protectUserData() { return Math.random() < 0.5; }",
    "const collectData = (user) => { return everything; };",
    "try { protect_privacy(); } catch { /* oh well */ }",
    "// TODO: Add actual privacy protection",
    "let userData = 'Definitely not selling this';",
    "privacy.level = Math.min(0, profit.level);",
    "// What users don't know won't hurt them",
    "if (gdprCompliant) { /* LOL */ }",
    "function isPrivacyCompliant() { return true; // Trust me }",
    "// The following code is just for show",
    "// This privacy policy was written by ChatGPT",
    "const privacyBudget = 0;",
    "user.data.forEach(item => thirdParties.push(item));",
    "// I copied this from Stack Overflow"
  ]

  useEffect(() => {
    // Generate random code lines
    const randomCodeLines = Array(15).fill(0).map(() => 
      codeSamples[Math.floor(Math.random() * codeSamples.length)]
    )
    setCodeLines(randomCodeLines)
    
    // Change jokes periodically
    const jokeInterval = setInterval(() => {
      setCurrentJoke(devJokes[Math.floor(Math.random() * devJokes.length)])
    }, 6000)
    
    // Animate laugh intensity
    const laughInterval = setInterval(() => {
      setLaughIntensity(prev => (prev + 1) % 20)
    }, 500)
    
    return () => {
      clearInterval(jokeInterval)
      clearInterval(laughInterval)
    }
  }, [])

  if (!user) return null

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto pt-24"
      >
        <div className="mb-6">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <FiLock size={24} className="text-primary" />
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Developer character */}
            <motion.div 
              className="relative flex-shrink-0"
              animate={{ 
                rotate: [0, laughIntensity > 10 ? 5 : 2, 0, laughIntensity > 10 ? -5 : -2, 0],
                y: [0, laughIntensity > 10 ? -10 : -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: laughIntensity > 15 ? 0.3 : 0.5
              }}
            >
              <div className="w-40 h-40 bg-gray-800 rounded-full flex items-center justify-center">
                <div className="relative">
                  {/* Face */}
                  <div className="w-32 h-32 bg-amber-200 rounded-full flex items-center justify-center relative">
                    {/* Eyes */}
                    <motion.div 
                      className="absolute"
                      style={{ top: '30%', left: '25%' }}
                      animate={{ 
                        scaleY: laughIntensity > 10 ? 0.1 : [1, 0.3, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                    </motion.div>
                    <motion.div 
                      className="absolute"
                      style={{ top: '30%', right: '25%' }}
                      animate={{ 
                        scaleY: laughIntensity > 10 ? 0.1 : [1, 0.3, 1],
                      }}
                      transition={{ repeat: Infinity, duration: 3 }}
                    >
                      <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
                    </motion.div>
                    
                    {/* Mouth */}
                    <motion.div 
                      className="absolute bg-gray-900 rounded-full"
                      style={{ bottom: '25%', left: '50%', translateX: '-50%' }}
                      animate={{ 
                        width: laughIntensity > 5 ? '20px' : '10px',
                        height: laughIntensity > 5 ? '15px' : '5px',
                        borderRadius: laughIntensity > 5 ? '40%' : '50%'
                      }}
                    ></motion.div>
                  </div>
                  
                  {/* Coffee cup */}
                  <motion.div 
                    className="absolute -right-2 bottom-0"
                    animate={{ rotate: [0, 5, 0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <FiCoffee size={24} className="text-primary" />
                  </motion.div>
                  
                  {/* Code icon */}
                  <motion.div 
                    className="absolute -left-8 top-0"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  >
                    <FiCode size={20} className="text-blue-400" />
                  </motion.div>
                </div>
              </div>
              
              {/* Laugh bubbles */}
              {laughIntensity > 5 && (
                <>
                  <motion.div
                    className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    HA!
                  </motion.div>
                  {laughIntensity > 10 && (
                    <motion.div
                      className="absolute -top-6 right-8 bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      HA HA!
                    </motion.div>
                  )}
                  {laughIntensity > 15 && (
                    <motion.div
                      className="absolute -top-10 right-4 bg-white text-gray-900 rounded-full px-3 py-1 text-sm font-bold"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                    >
                      HAHAHA!
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
            
            {/* Code and joke display */}
            <div className="flex-grow">
              {/* Joke bubble */}
              <motion.div 
                className="bg-gray-800 p-4 rounded-lg mb-4 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                key={currentJoke}
              >
                <div className="absolute left-0 top-0 h-0 w-0" style={{
                  borderLeft: '10px solid transparent',
                  borderRight: '10px solid transparent',
                  borderTop: '10px solid transparent',
                  borderBottom: '10px solid #1f2937',
                  transform: 'rotate(45deg) translate(-50%, -50%)',
                }}></div>
                <p className="text-gray-300 italic">{currentJoke}</p>
              </motion.div>
              
              {/* Code display */}
              <div className="bg-gray-950 p-4 rounded-lg font-mono text-sm overflow-auto max-h-80">
                <div className="flex items-center gap-2 mb-3 text-gray-400 border-b border-gray-800 pb-2">
                  <FiKey size={14} />
                  <span>privacy_policy.js</span>
                </div>
                {codeLines.map((line, index) => (
                  <motion.div 
                    key={index}
                    className="text-gray-400 border-l-2 border-transparent hover:border-gray-700 px-2"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="text-gray-600 mr-3">{index + 1}</span>
                    <span className={line.startsWith('//') ? 'text-green-500' : 'text-blue-400'}>
                      {line}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-700 text-center">
            <p className="text-gray-400 text-sm">
              This isn't a real privacy policy. The developer is too busy laughing.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024-2025 RIX. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
