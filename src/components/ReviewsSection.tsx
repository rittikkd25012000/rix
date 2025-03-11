'use client'

import { useState } from 'react'
import { useRatings } from '@/context/RatingsContext'
import RatingStars from './RatingStars'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiMessageSquare, 
  FiEdit, 
  FiTrash2, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiSend,
  FiX
} from 'react-icons/fi'

interface ReviewsSectionProps {
  contentId: string | number;
  contentTitle: string;
}

export default function ReviewsSection({ contentId, contentTitle }: ReviewsSectionProps) {
  const { 
    addRating, 
    getUserRating, 
    getAverageRating, 
    addReview, 
    getContentReviews, 
    getUserReview,
    updateReview,
    deleteReview,
    likeReview,
    dislikeReview
  } = useRatings()
  
  const [isWritingReview, setIsWritingReview] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [isEditingReview, setIsEditingReview] = useState(false)
  
  // Get user's rating and review
  const userRating = getUserRating(contentId) || 0
  const averageRating = getAverageRating(contentId) || 0
  const userReview = getUserReview(contentId)
  const contentReviews = getContentReviews(contentId)
  
  // Handle rating change
  const handleRatingChange = (rating: number) => {
    addRating(contentId, rating)
  }
  
  // Handle review submission
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (reviewText.trim()) {
      addReview(contentId, reviewText.trim())
      setReviewText('')
      setIsWritingReview(false)
      setIsEditingReview(false)
    }
  }
  
  // Handle edit review
  const handleEditReview = () => {
    if (userReview) {
      setReviewText(userReview.text)
      setIsWritingReview(true)
      setIsEditingReview(true)
    }
  }
  
  // Handle delete review
  const handleDeleteReview = () => {
    if (userReview) {
      if (window.confirm('Are you sure you want to delete your review?')) {
        deleteReview(userReview.id)
      }
    }
  }
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiMessageSquare className="mr-2" />
        Reviews & Ratings
      </h2>
      
      {/* Overall rating section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-gray-800/50 rounded-lg p-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Rate {contentTitle}</h3>
          <RatingStars 
            rating={userRating} 
            editable={true}
            size={28} 
            onRatingChange={handleRatingChange}
            className="mb-2"
          />
          {userRating > 0 && (
            <p className="text-sm text-gray-400">
              You rated this {userRating} out of 5 stars
            </p>
          )}
        </div>
        
        <div className="mt-4 md:mt-0 md:text-right">
          <div className="text-3xl font-bold text-yellow-400">
            {averageRating > 0 ? averageRating.toFixed(1) : '—'}
          </div>
          <div className="flex justify-center md:justify-end mb-1">
            <RatingStars rating={averageRating} size={16} />
          </div>
          <p className="text-sm text-gray-400">
            Average from {contentReviews.length} {contentReviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>
      
      {/* Write review section */}
      {!isWritingReview && !userReview && (
        <button
          onClick={() => setIsWritingReview(true)}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors mb-6"
        >
          <FiEdit size={18} />
          Write a Review
        </button>
      )}
      
      <AnimatePresence>
        {isWritingReview && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
            onSubmit={handleReviewSubmit}
          >
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold">
                  {isEditingReview ? 'Edit your review' : 'Write a review'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsWritingReview(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
              
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder={`Share your thoughts about ${contentTitle}...`}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  className="flex items-center bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg"
                >
                  <FiSend className="mr-2" />
                  {isEditingReview ? 'Update Review' : 'Post Review'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      
      {/* User's review */}
      {userReview && !isWritingReview && (
        <div className="mb-6 border-l-4 border-primary pl-4 py-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold">Your Review</h3>
              <p className="text-sm text-gray-400">{formatDate(userReview.timestamp)}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleEditReview}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Edit review"
              >
                <FiEdit size={16} className="text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={handleDeleteReview}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Delete review"
              >
                <FiTrash2 size={16} className="text-gray-400 hover:text-white" />
              </button>
            </div>
          </div>
          <p className="text-gray-200">{userReview.text}</p>
        </div>
      )}
      
      {/* Other reviews */}
      {contentReviews.length > 0 && (
        <div>
          <h3 className="font-semibold border-b border-gray-800 pb-2 mb-4">
            {contentReviews.length === 1 ? '1 Review' : `${contentReviews.length} Reviews`}
          </h3>
          
          <div className="space-y-6">
            {contentReviews
              .filter(review => !userReview || review.id !== userReview.id) // Filter out user's review
              .map(review => (
                <div key={review.id} className="border-b border-gray-800 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Anonymous User</h4>
                      <p className="text-sm text-gray-400">{formatDate(review.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => likeReview(review.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-green-400 transition-colors"
                      >
                        <FiThumbsUp size={14} />
                        <span className="text-sm">{review.likes}</span>
                      </button>
                      <button
                        onClick={() => dislikeReview(review.id)}
                        className="flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <FiThumbsDown size={14} />
                        <span className="text-sm">{review.dislikes}</span>
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-300">{review.text}</p>
                </div>
              ))}
          </div>
        </div>
      )}
      
      {contentReviews.length === 0 && !isWritingReview && (
        <div className="text-center py-6 text-gray-500">
          <p>No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  )
} 
