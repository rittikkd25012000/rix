'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the shared content type
export interface SharedContent {
  id: string;
  userId: string;
  contentId: string | number;
  contentType: 'movie' | 'tv' | 'playlist';
  title: string;
  thumbnail_url: string;
  message: string;
  platform: 'facebook' | 'twitter' | 'email' | 'copy' | 'whatsapp';
  timestamp: number;
}

// Define recommendation type
export interface Recommendation {
  id: string;
  fromUserId: string;
  toUserId: string;
  contentId: string | number;
  contentType: 'movie' | 'tv' | 'playlist';
  title: string;
  thumbnail_url: string;
  message: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected';
}

// Define group watch type
export interface GroupWatch {
  id: string;
  creatorId: string;
  contentId: string | number;
  contentType: 'movie' | 'tv';
  title: string;
  thumbnail_url: string;
  scheduledTime: number;
  participants: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Define the context type
interface SocialContextType {
  sharedContent: SharedContent[];
  recommendations: Recommendation[];
  groupWatches: GroupWatch[];
  shareContent: (
    contentId: string | number, 
    contentType: 'movie' | 'tv' | 'playlist', 
    title: string, 
    thumbnail_url: string, 
    message: string, 
    platform: 'facebook' | 'twitter' | 'email' | 'copy' | 'whatsapp'
  ) => Promise<boolean>;
  getShareHistory: () => SharedContent[];
  recommendToFriend: (
    toUserId: string,
    contentId: string | number,
    contentType: 'movie' | 'tv' | 'playlist',
    title: string,
    thumbnail_url: string,
    message: string
  ) => void;
  getRecommendations: () => Recommendation[];
  updateRecommendationStatus: (recommendationId: string, status: 'accepted' | 'rejected') => void;
  createGroupWatch: (
    contentId: string | number,
    contentType: 'movie' | 'tv',
    title: string,
    thumbnail_url: string,
    scheduledTime: number,
    participants: string[]
  ) => void;
  getGroupWatches: () => GroupWatch[];
  updateGroupWatchStatus: (groupWatchId: string, status: 'completed' | 'cancelled') => void;
  joinGroupWatch: (groupWatchId: string) => void;
  leaveGroupWatch: (groupWatchId: string) => void;
}

// Create the context with default values
const SocialContext = createContext<SocialContextType>({
  sharedContent: [],
  recommendations: [],
  groupWatches: [],
  shareContent: async () => false,
  getShareHistory: () => [],
  recommendToFriend: () => {},
  getRecommendations: () => [],
  updateRecommendationStatus: () => {},
  createGroupWatch: () => {},
  getGroupWatches: () => [],
  updateGroupWatchStatus: () => {},
  joinGroupWatch: () => {},
  leaveGroupWatch: () => {},
});

// Create a provider component
export function SocialProvider({ children }: { children: ReactNode }) {
  const [sharedContent, setSharedContent] = useState<SharedContent[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [groupWatches, setGroupWatches] = useState<GroupWatch[]>([]);
  
  // Mock user ID (in a real app this would come from auth)
  const mockUserId = "current-user-123";

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedShares = localStorage.getItem('sharedContent');
    const savedRecommendations = localStorage.getItem('recommendations');
    const savedGroupWatches = localStorage.getItem('groupWatches');
    
    if (savedShares) {
      try {
        setSharedContent(JSON.parse(savedShares));
      } catch (error) {
        console.error('Error parsing shared content:', error);
      }
    }
    
    if (savedRecommendations) {
      try {
        setRecommendations(JSON.parse(savedRecommendations));
      } catch (error) {
        console.error('Error parsing recommendations:', error);
      }
    }
    
    if (savedGroupWatches) {
      try {
        setGroupWatches(JSON.parse(savedGroupWatches));
      } catch (error) {
        console.error('Error parsing group watches:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('sharedContent', JSON.stringify(sharedContent));
  }, [sharedContent]);
  
  useEffect(() => {
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
  }, [recommendations]);
  
  useEffect(() => {
    localStorage.setItem('groupWatches', JSON.stringify(groupWatches));
  }, [groupWatches]);

  // Share content to a platform
  const shareContent = async (
    contentId: string | number, 
    contentType: 'movie' | 'tv' | 'playlist', 
    title: string, 
    thumbnail_url: string, 
    message: string, 
    platform: 'facebook' | 'twitter' | 'email' | 'copy' | 'whatsapp'
  ): Promise<boolean> => {
    try {
      // In a real app, we would have actual sharing logic
      // For now, we'll just simulate it
      
      // Generate a URL to share
      const shareUrl = `https://RIX.com/share/${contentType}/${contentId}`;
      
      // Different sharing methods based on platform
      switch (platform) {
        case 'copy':
          await navigator.clipboard.writeText(`${message} ${shareUrl}`);
          break;
        case 'email':
          window.open(`mailto:?subject=Check out ${title} on RIX&body=${message} ${shareUrl}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(message)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`);
          break;
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(`${message} ${shareUrl}`)}`);
          break;
      }
      
      // Record the share
      const newShare: SharedContent = {
        id: `share-${Date.now()}`,
        userId: mockUserId,
        contentId,
        contentType,
        title,
        thumbnail_url,
        message,
        platform,
        timestamp: Date.now()
      };
      
      setSharedContent(prev => [...prev, newShare]);
      return true;
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  };

  // Get share history
  const getShareHistory = (): SharedContent[] => {
    return [...sharedContent].sort((a, b) => b.timestamp - a.timestamp);
  };

  // Recommend content to a friend
  const recommendToFriend = (
    toUserId: string,
    contentId: string | number,
    contentType: 'movie' | 'tv' | 'playlist',
    title: string,
    thumbnail_url: string,
    message: string
  ) => {
    const newRecommendation: Recommendation = {
      id: `rec-${Date.now()}`,
      fromUserId: mockUserId,
      toUserId,
      contentId,
      contentType,
      title,
      thumbnail_url,
      message,
      timestamp: Date.now(),
      status: 'pending'
    };
    
    setRecommendations(prev => [...prev, newRecommendation]);
  };

  // Get recommendations
  const getRecommendations = (): Recommendation[] => {
    return [...recommendations].sort((a, b) => b.timestamp - a.timestamp);
  };

  // Update recommendation status
  const updateRecommendationStatus = (recommendationId: string, status: 'accepted' | 'rejected') => {
    setRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId ? { ...rec, status } : rec
    ));
  };

  // Create a group watch
  const createGroupWatch = (
    contentId: string | number,
    contentType: 'movie' | 'tv',
    title: string,
    thumbnail_url: string,
    scheduledTime: number,
    participants: string[]
  ) => {
    const newGroupWatch: GroupWatch = {
      id: `group-${Date.now()}`,
      creatorId: mockUserId,
      contentId,
      contentType,
      title,
      thumbnail_url,
      scheduledTime,
      participants: [mockUserId, ...participants],
      status: 'scheduled'
    };
    
    setGroupWatches(prev => [...prev, newGroupWatch]);
  };

  // Get group watches
  const getGroupWatches = (): GroupWatch[] => {
    return [...groupWatches].sort((a, b) => a.scheduledTime - b.scheduledTime);
  };

  // Update group watch status
  const updateGroupWatchStatus = (groupWatchId: string, status: 'completed' | 'cancelled') => {
    setGroupWatches(prev => prev.map(watch => 
      watch.id === groupWatchId ? { ...watch, status } : watch
    ));
  };

  // Join a group watch
  const joinGroupWatch = (groupWatchId: string) => {
    setGroupWatches(prev => prev.map(watch => {
      if (watch.id === groupWatchId && !watch.participants.includes(mockUserId)) {
        return { ...watch, participants: [...watch.participants, mockUserId] };
      }
      return watch;
    }));
  };

  // Leave a group watch
  const leaveGroupWatch = (groupWatchId: string) => {
    setGroupWatches(prev => prev.map(watch => {
      if (watch.id === groupWatchId && watch.participants.includes(mockUserId)) {
        return { 
          ...watch, 
          participants: watch.participants.filter(id => id !== mockUserId) 
        };
      }
      return watch;
    }));
  };

  return (
    <SocialContext.Provider value={{
      sharedContent,
      recommendations,
      groupWatches,
      shareContent,
      getShareHistory,
      recommendToFriend,
      getRecommendations,
      updateRecommendationStatus,
      createGroupWatch,
      getGroupWatches,
      updateGroupWatchStatus,
      joinGroupWatch,
      leaveGroupWatch
    }}>
      {children}
    </SocialContext.Provider>
  );
}

// Custom hook to use the social context
export function useSocial() {
  const context = useContext(SocialContext);
  if (context === undefined) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
} 
