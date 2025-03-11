'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the watch progress type
export interface WatchProgress {
  id: string | number;
  title: string;
  thumbnail_url: string;
  type: 'movie' | 'tv';
  progress: number; // 0-100 percentage
  duration: number; // Total duration in seconds
  currentTime: number; // Current position in seconds
  lastWatched: number; // Timestamp
}

// Define the context type
interface ContinueWatchingContextType {
  watchProgress: WatchProgress[];
  updateProgress: (
    id: string | number, 
    title: string, 
    thumbnail_url: string, 
    type: 'movie' | 'tv', 
    currentTime: number, 
    duration: number
  ) => void;
  removeFromProgress: (id: string | number) => void;
  getProgress: (id: string | number) => WatchProgress | null;
  getRecentlyWatched: (limit?: number) => WatchProgress[];
  clearAllProgress: () => void;
}

// Create the context with default values
const ContinueWatchingContext = createContext<ContinueWatchingContextType>({
  watchProgress: [],
  updateProgress: () => {},
  removeFromProgress: () => {},
  getProgress: () => null,
  getRecentlyWatched: () => [],
  clearAllProgress: () => {},
});

// Create a provider component
export function ContinueWatchingProvider({ children }: { children: ReactNode }) {
  const [watchProgress, setWatchProgress] = useState<WatchProgress[]>([]);

  // Load saved progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('continueWatching');
    if (savedProgress) {
      try {
        setWatchProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Error parsing saved watch progress:', error);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('continueWatching', JSON.stringify(watchProgress));
  }, [watchProgress]);

  // Update the watch progress for a title
  const updateProgress = (
    id: string | number, 
    title: string, 
    thumbnail_url: string, 
    type: 'movie' | 'tv', 
    currentTime: number, 
    duration: number
  ) => {
    // Don't track if it's at the very beginning (less than 10 seconds)
    if (currentTime < 10) return;
    
    // Calculate progress percentage
    const progressPercentage = Math.min(Math.round((currentTime / duration) * 100), 100);
    
    // Check if it's already in the list
    const existingProgress = watchProgress.find(item => item.id === id);
    
    if (existingProgress) {
      // Update existing entry
      setWatchProgress(prev => prev.map(item => 
        item.id === id
          ? {
              ...item,
              currentTime,
              progress: progressPercentage,
              lastWatched: Date.now()
            }
          : item
      ));
    } else {
      // Add new entry
      const newProgress: WatchProgress = {
        id,
        title,
        thumbnail_url,
        type,
        progress: progressPercentage,
        duration,
        currentTime,
        lastWatched: Date.now()
      };
      
      setWatchProgress(prev => [...prev, newProgress]);
    }
  };

  // Remove an item from the progress list
  const removeFromProgress = (id: string | number) => {
    setWatchProgress(prev => prev.filter(item => item.id !== id));
  };

  // Get the progress for a specific title
  const getProgress = (id: string | number): WatchProgress | null => {
    return watchProgress.find(item => item.id === id) || null;
  };

  // Get recently watched items, sorted by last watched
  const getRecentlyWatched = (limit: number = 10): WatchProgress[] => {
    return [...watchProgress]
      .sort((a, b) => b.lastWatched - a.lastWatched)
      .slice(0, limit);
  };

  // Clear all progress
  const clearAllProgress = () => {
    setWatchProgress([]);
  };

  return (
    <ContinueWatchingContext.Provider value={{
      watchProgress,
      updateProgress,
      removeFromProgress,
      getProgress,
      getRecentlyWatched,
      clearAllProgress
    }}>
      {children}
    </ContinueWatchingContext.Provider>
  );
}

// Custom hook to use the continue watching context
export function useContinueWatching() {
  const context = useContext(ContinueWatchingContext);
  if (context === undefined) {
    throw new Error('useContinueWatching must be used within a ContinueWatchingProvider');
  }
  return context;
} 
