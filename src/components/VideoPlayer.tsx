'use client'

import { useEffect, useRef, useState } from 'react'
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize, FiMinimize, FiSkipBack, FiSkipForward, FiInfo, FiX } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnimation } from '@/utils/AnimationProvider'
import { 
  CinematicBars,
  VignetteEffect,
  MotionBlurEffect,
  AudioReactiveEffect,
  IrisTransition,
  TitleCardAnimation
} from '@/utils/CinematicEffects'
import Image from 'next/image'

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onEnded?: () => void;
  className?: string;
}

export default function VideoPlayer({ 
  src, 
  poster, 
  title, 
  autoPlay = false,
  onEnded,
  className = ''
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [volume, setVolume] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showCinematicBars, setShowCinematicBars] = useState(false);
  const [showVignette, setShowVignette] = useState(true);
  const [showTitleCard, setShowTitleCard] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeedChange, setIsSpeedChange] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { enableCinematic } = useAnimation();

  // Initialize audio analyzer for reactive animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (!audioContextRef.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 32;
        }
      } catch (error) {
        console.error("Error creating AudioContext:", error);
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        analyserRef.current = null;
      }
    };
  }, []);

  // Show title card on mount
  useEffect(() => {
    if (title && enableCinematic) {
      setShowTitleCard(true);
      
      // Hide title card after a delay
      const titleTimer = setTimeout(() => {
        setShowTitleCard(false);
      }, 3000);
      
      return () => clearTimeout(titleTimer);
    }
  }, [title, enableCinematic]);

  // Connect video to audio analyzer
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !audioContextRef.current || !analyserRef.current) return;
    
    try {
      const source = audioContextRef.current.createMediaElementSource(video);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    } catch (error) {
      // Already connected or other error
      console.log("Audio connection error (safely ignorable):", error);
    }
    
    // Analyze audio for reactive effects
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateAudioLevel = () => {
      if (!analyserRef.current || !isPlaying) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Get average level
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length / 255;
      setAudioLevel(avg);
      
      if (isPlaying) {
        requestAnimationFrame(updateAudioLevel);
      }
    };
    
    if (isPlaying) {
      requestAnimationFrame(updateAudioLevel);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set up event listeners
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onVolumeChange = () => {
      setIsMuted(video.muted);
      setVolume(video.volume);
    };
    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100 || 0);
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
    };
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    const onVideoEnded = () => {
      if (onEnded) onEnded();
    };
    const onWaiting = () => {
      setIsBuffering(true);
    };
    const onCanPlay = () => {
      setIsBuffering(false);
    };

    // Add event listeners
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('volumechange', onVolumeChange);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('ended', onVideoEnded);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    document.addEventListener('fullscreenchange', onFullscreenChange);

    // Clean up
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('volumechange', onVolumeChange);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('ended', onVideoEnded);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [onEnded]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    const showControls = () => {
      setIsControlsVisible(true);
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };

    const container = document.getElementById('video-container');
    if (container) {
      container.addEventListener('mousemove', showControls);
      container.addEventListener('click', showControls);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', showControls);
        container.removeEventListener('click', showControls);
      }
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  // Format time (seconds) to MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Play/pause toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      
      // Show cinematic bars briefly when starting playback
      if (enableCinematic) {
        setShowCinematicBars(true);
        setTimeout(() => setShowCinematicBars(false), 2000);
      }
    } else {
      video.pause();
    }
  };

  // Mute/unmute toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    const container = document.getElementById('video-container');
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle progress bar click
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    
    // Add motion blur effect during seeking
    setIsSpeedChange(true);
    
    videoRef.current.currentTime = clickPosition * duration;
    
    // Remove motion blur after a brief delay
    setTimeout(() => setIsSpeedChange(false), 300);
  };

  // Skip forward/backward
  const skipTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    // Add motion blur effect during seeking
    setIsSpeedChange(true);
    
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
    
    // Remove motion blur after a brief delay
    setTimeout(() => setIsSpeedChange(false), 300);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    video.muted = newVolume === 0;
  };

  // Toggle info panel
  const toggleInfo = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  return (
    <div 
      id="video-container" 
      className={`relative overflow-hidden bg-black rounded-lg shadow-2xl ${className}`}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
    >
      {/* Title card animation */}
      {enableCinematic && (
        <TitleCardAnimation 
          title={title || "Now Playing"} 
          subtitle="Enjoy your movie"
          visible={showTitleCard}
        />
      )}
    
      {/* Glow effect background for video */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-purple-500/20 opacity-50" />
      
      {/* Cinematic bars */}
      {enableCinematic && (
        <CinematicBars 
          visible={showCinematicBars} 
          thickness={isFullscreen ? 60 : 30}
          animate={true}
        />
      )}
      
      {/* Vignette effect */}
      {enableCinematic && showVignette && (
        <VignetteEffect intensity={0.3} />
      )}
      
      {/* Audio reactive container */}
      <AudioReactiveEffect audioLevel={audioLevel}>
        <MotionBlurEffect active={isSpeedChange} blur={5}>
          <IrisTransition show={isPlaying && !isBuffering} duration={1.0}>
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              className="w-full h-full object-contain relative z-10"
              onClick={togglePlay}
              autoPlay={autoPlay}
              playsInline
            />
          </IrisTransition>
        </MotionBlurEffect>
      </AudioReactiveEffect>

      {/* Loading indicator */}
      <AnimatePresence>
        {isBuffering && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <motion.div 
              className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Big play button in the center */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-primary/80 rounded-full flex items-center justify-center z-10 backdrop-blur-sm"
            onClick={togglePlay}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiPlay size={36} className="text-white ml-2" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Quick skip backward/forward buttons */}
      <AnimatePresence>
        {isControlsVisible && (
          <>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.8, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-1/2 left-8 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center z-10 backdrop-blur-sm"
              onClick={() => skipTime(-10)}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSkipBack size={20} className="text-white" />
            </motion.button>
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.8, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute top-1/2 right-8 transform -translate-y-1/2 w-12 h-12 bg-black/50 rounded-full flex items-center justify-center z-10 backdrop-blur-sm"
              onClick={() => skipTime(10)}
              whileHover={{ scale: 1.1, opacity: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FiSkipForward size={20} className="text-white" />
            </motion.button>
          </>
        )}
      </AnimatePresence>

      {/* Video title */}
      <AnimatePresence>
        {title && isControlsVisible && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent"
          >
            <h3 className="text-white font-medium">{title}</h3>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isControlsVisible ? 1 : 0,
            y: isControlsVisible ? 0 : 20,
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 20 
          }}
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 z-20 ${
            !isControlsVisible && 'pointer-events-none'
          }`}
        >
          {/* Progress bar */}
          <div 
            ref={progressBarRef}
            className="relative flex items-center mb-3 cursor-pointer group"
            onClick={handleProgressBarClick}
          >
            <div className="w-full h-1 bg-gray-600/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
                layout
              />
            </div>
            
            {/* Progress marker */}
            <motion.div 
              className="absolute h-3 w-3 bg-primary rounded-full -ml-1.5 opacity-0 group-hover:opacity-100 pointer-events-none"
              style={{ left: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Play/Pause button */}
              <motion.button 
                onClick={togglePlay} 
                className="text-white hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
              </motion.button>

              {/* Volume control */}
              <div 
                className="flex items-center gap-2 relative"
                onMouseEnter={() => setShowVolumeControl(true)}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                <motion.button 
                  onClick={toggleMute} 
                  className="text-white hover:text-primary"
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isMuted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
                </motion.button>
                
                <AnimatePresence>
                  {showVolumeControl && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 80, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Time display */}
              <div className="text-white text-sm">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
              
              {/* Info button */}
              <motion.button
                onClick={toggleInfo}
                className="text-white hover:text-primary"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiInfo size={18} />
              </motion.button>
            </div>

            {/* Fullscreen button */}
            <motion.button 
              onClick={toggleFullscreen} 
              className="text-white hover:text-primary"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Info panel */}
      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 p-8 overflow-auto"
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">{title || "Video Information"}</h2>
              <motion.button
                onClick={toggleInfo}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700"
              >
                <FiX size={20} className="text-white" />
              </motion.button>
            </div>
            
            <div className="space-y-4 text-white/80">
              <div>
                <h3 className="text-white font-bold mb-1">Video Controls</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Play/Pause: Click video or play button</li>
                  <li>Skip Forward: Right arrow or skip button (10 seconds)</li>
                  <li>Skip Backward: Left arrow or skip button (10 seconds)</li>
                  <li>Volume: Hover over volume icon</li>
                  <li>Progress: Click anywhere on the progress bar</li>
                  <li>Fullscreen: Click the fullscreen button</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-bold mb-1">Video Details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>Duration:</div>
                  <div>{formatTime(duration)}</div>
                  <div>Current Time:</div>
                  <div>{formatTime(currentTime)}</div>
                  <div>Source:</div>
                  <div className="truncate">{src.split('/').pop()}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
