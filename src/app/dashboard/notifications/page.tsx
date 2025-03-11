'use client'

import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowLeft, FiServer, FiDatabase, FiCpu, FiHardDrive, FiWifi, FiCloud, FiBox, FiVolume2, FiVolumeX } from 'react-icons/fi'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

interface Particle {
  id: number;
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showPulse, setShowPulse] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])
  const [isSoundEnabled, setIsSoundEnabled] = useState(false)
  const [serverStatus, setServerStatus] = useState({
    cpu: Math.random() * 100,
    memory: Math.random() * 100,
    network: Math.random() * 100,
    storage: Math.random() * 100
  })
  const audioRef = useRef<HTMLAudioElement>(null)

  const steps = [
    { icon: FiServer, text: "Initializing servers...", color: "text-blue-400" },
    { icon: FiDatabase, text: "Setting up database...", color: "text-green-400" },
    { icon: FiCpu, text: "Configuring processors...", color: "text-purple-400" },
    { icon: FiHardDrive, text: "Allocating storage...", color: "text-yellow-400" },
    { icon: FiWifi, text: "Testing connectivity...", color: "text-pink-400" },
    { icon: FiCloud, text: "Syncing cloud services...", color: "text-cyan-400" },
    { icon: FiBox, text: "Packaging updates...", color: "text-orange-400" }
  ]

  useEffect(() => {
    if (isSoundEnabled && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Audio playback error:", error);
        setIsSoundEnabled(false);
      });
    }
  }, [currentStep, isSoundEnabled])

  useEffect(() => {
    const createParticle = () => ({
      id: Math.random(),
      x: Math.random() * 256,
      y: Math.random() * 256,
      direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)] as 'up' | 'down' | 'left' | 'right'
    })

    const particleInterval = setInterval(() => {
      setParticles(prev => {
        const newParticles = [...prev]
        if (newParticles.length < 20) {
          newParticles.push(createParticle())
        }
        return newParticles.map(p => ({
          ...p,
          x: p.direction === 'left' ? p.x - 1 : p.direction === 'right' ? p.x + 1 : p.x,
          y: p.direction === 'up' ? p.y - 1 : p.direction === 'down' ? p.y + 1 : p.y
        })).filter(p => p.x >= 0 && p.x <= 256 && p.y >= 0 && p.y <= 256)
      })
    }, 50)

    return () => clearInterval(particleInterval)
  }, [])

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setServerStatus({
        cpu: 50 + Math.sin(Date.now() / 1000) * 30,
        memory: 60 + Math.cos(Date.now() / 1000) * 20,
        network: 70 + Math.sin(Date.now() / 800) * 25,
        storage: 40 + Math.cos(Date.now() / 1200) * 15
      })
    }, 1000)

    return () => clearInterval(statusInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 0.5
      })
    }, 50)

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % steps.length)
      setShowPulse(true)
      setTimeout(() => setShowPulse(false), 500)
    }, 2000)

    return () => {
      clearInterval(interval)
      clearInterval(stepInterval)
    }
  }, [])

  if (!user) return null

  const StepIcon = steps[currentStep].icon

  return (
    <div className="min-h-screen pb-20 px-4">
      <audio 
        ref={audioRef} 
        src={isSoundEnabled ? "/sounds/step-change.mp3" : undefined} 
        preload="none"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto pt-24"
      >
        <div className="mb-6 flex justify-between items-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              title={isSoundEnabled ? "Mute sound effects" : "Enable sound effects"}
            >
              {isSoundEnabled ? (
                <FiVolume2 size={20} className="text-primary" />
              ) : (
                <FiVolumeX size={20} className="text-gray-500" />
              )}
            </button>
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-lg p-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <FiServer size={24} className="text-primary" />
            <h1 className="text-3xl font-bold">Notifications</h1>
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative w-64 h-64 mb-8">
              <svg className="absolute inset-0 z-0" width="256" height="256">
                {particles.map(particle => (
                  <motion.circle
                    key={particle.id}
                    cx={particle.x}
                    cy={particle.y}
                    r="2"
                    className="fill-primary/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1 }}
                  />
                ))}
              </svg>

              <motion.div 
                className="absolute inset-0 grid grid-cols-2 gap-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {[...Array(4)].map((_, i) => {
                  const Icon = steps[(currentStep + i) % steps.length].icon
                  const color = steps[(currentStep + i) % steps.length].color
                  return (
                    <Tooltip.Provider key={i}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <motion.div
                            className="bg-gray-800 rounded-lg p-4 flex items-center justify-center relative overflow-hidden"
                            initial={{ opacity: 0.5 }}
                            animate={{ 
                              opacity: [0.5, 1, 0.5],
                              backgroundColor: ['#1f2937', '#374151', '#1f2937']
                            }}
                            transition={{ 
                              repeat: Infinity, 
                              duration: 2,
                              delay: i * 0.5 
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                              animate={{ 
                                x: ['-100%', '100%'],
                              }}
                              transition={{
                                repeat: Infinity,
                                duration: 3,
                                delay: i * 0.5
                              }}
                            />
                            <Icon 
                              size={24}
                              className={`${color} relative z-10`}
                            />
                            <div className="absolute bottom-1 right-1 flex gap-1">
                              {['cpu', 'memory', 'network', 'storage'].map((metric, j) => (
                                <div
                                  key={metric}
                                  className={`w-1 h-1 rounded-full ${
                                    serverStatus[metric as keyof typeof serverStatus] > 80
                                      ? 'bg-red-500'
                                      : serverStatus[metric as keyof typeof serverStatus] > 60
                                      ? 'bg-yellow-500'
                                      : 'bg-green-500'
                                  }`}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="bg-gray-900 text-white text-sm px-3 py-2 rounded shadow-lg"
                            sideOffset={5}
                          >
                            <div className="space-y-1">
                              <div>CPU: {serverStatus.cpu.toFixed(1)}%</div>
                              <div>Memory: {serverStatus.memory.toFixed(1)}%</div>
                              <div>Network: {serverStatus.network.toFixed(1)}%</div>
                              <div>Storage: {serverStatus.storage.toFixed(1)}%</div>
                            </div>
                            <Tooltip.Arrow className="fill-gray-900" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )
                })}
              </motion.div>
            </div>

            <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-lg font-medium ${steps[currentStep].color} flex items-center gap-2`}
              >
                <motion.div
                  animate={showPulse ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <StepIcon size={18} />
                </motion.div>
                {steps[currentStep].text}
              </motion.div>
            </AnimatePresence>

            <p className="text-gray-500 mt-8 text-center">
              We're currently implementing notifications. <br />
              This feature will be available soon!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
