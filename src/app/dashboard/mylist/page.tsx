'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useMyList, ListItem } from '@/context/MyListContext'
import { motion } from 'framer-motion'
import { FiPlay, FiInfo, FiTrash2, FiFilter, FiBookmark } from 'react-icons/fi'
import Link from 'next/link'

export default function MyListPage() {
  const { user } = useAuth()
  const { myList, removeFromList } = useMyList()
  const [activeFilter, setActiveFilter] = useState<string>('all')

  if (!user) return null

  // Get unique content types from the list
  const contentTypes = Array.from(new Set(myList.map(item => item.type)))

  // Filter the list based on the active filter
  const filteredList = activeFilter === 'all' 
    ? myList 
    : myList.filter(item => item.type === activeFilter)

  // Handle removing an item from the list
  const handleRemove = (id: string | number) => {
    removeFromList(id)
  }

  // Handle playing an item
  const handlePlay = (item: ListItem) => {
    // In a real app, this would navigate to a player or start streaming
    window.alert(`Now playing: ${item.title}`)
  }

  // Handle viewing more info about an item
  const handleMoreInfo = (item: ListItem) => {
    // In a real app, this would navigate to a details page
    const path = item.type === 'movie' 
      ? `/dashboard/movies/${item.id}`
      : `/dashboard/tv/${item.id}`
    
    window.location.href = path
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto pt-24"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FiBookmark className="text-primary" />
              My List
            </h1>
            <p className="text-gray-400 mt-1">
              {myList.length} {myList.length === 1 ? 'item' : 'items'} saved to your list
            </p>
          </div>
          
          {myList.length > 0 && contentTypes.length > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm ${
                  activeFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              
              {contentTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setActiveFilter(type)}
                  className={`px-4 py-2 rounded-full text-sm capitalize ${
                    activeFilter === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {type}s
                </button>
              ))}
            </div>
          )}
        </div>

        {myList.length === 0 ? (
          <div className="bg-gray-900/50 rounded-lg p-12 text-center">
            <FiBookmark size={48} className="mx-auto mb-4 text-gray-600" />
            <h2 className="text-xl font-semibold mb-2">Your list is empty</h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Add movies and TV shows to your list to keep track of what you want to watch.
            </p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md font-medium"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.03 }}
                className="bg-gray-900/50 rounded-lg overflow-hidden border border-gray-800"
              >
                <div className="aspect-[2/3] relative">
                  <img 
                    src={item.thumbnail_url} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-primary/80 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
                    {item.type}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 p-4 w-full">
                      <div className="flex gap-2 mb-2">
                        <button 
                          onClick={() => handlePlay(item)}
                          className="flex-1 flex items-center justify-center gap-1 bg-primary text-white text-sm py-2 rounded-md"
                        >
                          <FiPlay size={14} /> Play
                        </button>
                        <button 
                          onClick={() => handleMoreInfo(item)}
                          className="p-2 bg-gray-800/80 rounded-full text-white/80 hover:text-white"
                        >
                          <FiInfo size={16} />
                        </button>
                        <button 
                          onClick={() => handleRemove(item.id)}
                          className="p-2 bg-gray-800/80 rounded-full text-white/80 hover:text-red-500"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                    <span>{item.release_year}</span>
                    {item.genres && item.genres.length > 0 && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{item.genres[0]}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
} 
