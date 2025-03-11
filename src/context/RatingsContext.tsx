'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define the rating and review types
export interface Rating {
  id: string | number;
  userId: string;
  contentId: string | number;
  score: number; // 1-5 stars
  timestamp: number;
}

export interface Review {
  id: string | number;
  userId: string;
  contentId: string | number;
  text: string;
  timestamp: number;
  likes: number;
  dislikes: number;
}

// Define the context type
interface RatingsContextType {
  ratings: Rating[];
  reviews: Review[];
  addRating: (contentId: string | number, score: number) => void;
  updateRating: (contentId: string | number, score: number) => void;
  getUserRating: (contentId: string | number) => number | null;
  getAverageRating: (contentId: string | number) => number | null;
  addReview: (contentId: string | number, text: string) => void;
  updateReview: (reviewId: string | number, text: string) => void;
  deleteReview: (reviewId: string | number) => void;
  getContentReviews: (contentId: string | number) => Review[];
  getUserReview: (contentId: string | number) => Review | null;
  likeReview: (reviewId: string | number) => void;
  dislikeReview: (reviewId: string | number) => void;
}

// Create the context with default values
const RatingsContext = createContext<RatingsContextType>({
  ratings: [],
  reviews: [],
  addRating: () => {},
  updateRating: () => {},
  getUserRating: () => null,
  getAverageRating: () => null,
  addReview: () => {},
  updateReview: () => {},
  deleteReview: () => {},
  getContentReviews: () => [],
  getUserReview: () => null,
  likeReview: () => {},
  dislikeReview: () => {},
});

// Create a provider component
export function RatingsProvider({ children }: { children: ReactNode }) {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Mock user ID (in a real app this would come from auth)
  const mockUserId = "current-user-123";

  // Load saved ratings and reviews from localStorage on component mount
  useEffect(() => {
    const savedRatings = localStorage.getItem('userRatings');
    const savedReviews = localStorage.getItem('userReviews');
    
    if (savedRatings) {
      try {
        setRatings(JSON.parse(savedRatings));
      } catch (error) {
        console.error('Error parsing saved ratings:', error);
      }
    }
    
    if (savedReviews) {
      try {
        setReviews(JSON.parse(savedReviews));
      } catch (error) {
        console.error('Error parsing saved reviews:', error);
      }
    }
  }, []);

  // Save ratings and reviews to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userRatings', JSON.stringify(ratings));
  }, [ratings]);
  
  useEffect(() => {
    localStorage.setItem('userReviews', JSON.stringify(reviews));
  }, [reviews]);

  // Add a new rating
  const addRating = (contentId: string | number, score: number) => {
    const existingRating = ratings.find(
      r => r.userId === mockUserId && r.contentId === contentId
    );
    
    if (existingRating) {
      updateRating(contentId, score);
      return;
    }
    
    const newRating: Rating = {
      id: `rating-${Date.now()}`,
      userId: mockUserId,
      contentId,
      score,
      timestamp: Date.now()
    };
    
    setRatings(prev => [...prev, newRating]);
  };

  // Update an existing rating
  const updateRating = (contentId: string | number, score: number) => {
    setRatings(prev => prev.map(rating => 
      (rating.userId === mockUserId && rating.contentId === contentId)
        ? { ...rating, score, timestamp: Date.now() }
        : rating
    ));
  };

  // Get user's rating for a specific content
  const getUserRating = (contentId: string | number): number | null => {
    const rating = ratings.find(
      r => r.userId === mockUserId && r.contentId === contentId
    );
    return rating ? rating.score : null;
  };

  // Get average rating for a specific content
  const getAverageRating = (contentId: string | number): number | null => {
    const contentRatings = ratings.filter(r => r.contentId === contentId);
    if (contentRatings.length === 0) return null;
    
    const sum = contentRatings.reduce((total, r) => total + r.score, 0);
    return Number((sum / contentRatings.length).toFixed(1));
  };

  // Add a new review
  const addReview = (contentId: string | number, text: string) => {
    const existingReview = reviews.find(
      r => r.userId === mockUserId && r.contentId === contentId
    );
    
    if (existingReview) {
      updateReview(existingReview.id, text);
      return;
    }
    
    const newReview: Review = {
      id: `review-${Date.now()}`,
      userId: mockUserId,
      contentId,
      text,
      timestamp: Date.now(),
      likes: 0,
      dislikes: 0
    };
    
    setReviews(prev => [...prev, newReview]);
  };

  // Update an existing review
  const updateReview = (reviewId: string | number, text: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId
        ? { ...review, text, timestamp: Date.now() }
        : review
    ));
  };

  // Delete a review
  const deleteReview = (reviewId: string | number) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  // Get all reviews for a specific content
  const getContentReviews = (contentId: string | number): Review[] => {
    return reviews.filter(r => r.contentId === contentId)
      .sort((a, b) => b.timestamp - a.timestamp);
  };

  // Get user's review for a specific content
  const getUserReview = (contentId: string | number): Review | null => {
    return reviews.find(
      r => r.userId === mockUserId && r.contentId === contentId
    ) || null;
  };

  // Like a review
  const likeReview = (reviewId: string | number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId
        ? { ...review, likes: review.likes + 1 }
        : review
    ));
  };

  // Dislike a review
  const dislikeReview = (reviewId: string | number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId
        ? { ...review, dislikes: review.dislikes + 1 }
        : review
    ));
  };

  return (
    <RatingsContext.Provider value={{
      ratings,
      reviews,
      addRating,
      updateRating,
      getUserRating,
      getAverageRating,
      addReview,
      updateReview,
      deleteReview,
      getContentReviews,
      getUserReview,
      likeReview,
      dislikeReview
    }}>
      {children}
    </RatingsContext.Provider>
  );
}

// Custom hook to use the ratings context
export function useRatings() {
  const context = useContext(RatingsContext);
  if (context === undefined) {
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
} 
