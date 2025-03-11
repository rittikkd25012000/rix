// Define all available genres with their icons and colors
export const genreData = [
  { id: 'action', name: 'Action', icon: '💥', color: 'from-red-600 to-orange-600', count: 42 },
  { id: 'comedy', name: 'Comedy', icon: '😂', color: 'from-yellow-400 to-yellow-600', count: 38 },
  { id: 'drama', name: 'Drama', icon: '🎭', color: 'from-blue-600 to-indigo-600', count: 65 },
  { id: 'horror', name: 'Horror', icon: '👻', color: 'from-purple-800 to-purple-900', count: 27 },
  { id: 'thriller', name: 'Thriller', icon: '🔪', color: 'from-gray-700 to-gray-900', count: 31 },
  { id: 'sci-fi', name: 'Science Fiction', icon: '🚀', color: 'from-blue-400 to-indigo-500', count: 24 },
  { id: 'fantasy', name: 'Fantasy', icon: '🧙', color: 'from-purple-500 to-pink-500', count: 19 },
  { id: 'romance', name: 'Romance', icon: '❤️', color: 'from-pink-500 to-red-500', count: 33 },
  { id: 'animation', name: 'Animation', icon: '🎬', color: 'from-green-400 to-teal-500', count: 22 },
  { id: 'documentary', name: 'Documentary', icon: '📹', color: 'from-gray-500 to-gray-700', count: 18 },
  { id: 'crime', name: 'Crime', icon: '🕵️', color: 'from-gray-800 to-gray-900', count: 29 },
  { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'from-green-600 to-green-800', count: 26 },
  { id: 'mystery', name: 'Mystery', icon: '🔍', color: 'from-indigo-800 to-purple-800', count: 21 },
  { id: 'family', name: 'Family', icon: '👨‍👩‍👧‍👦', color: 'from-blue-300 to-blue-500', count: 17 },
  { id: 'war', name: 'War', icon: '⚔️', color: 'from-red-700 to-red-900', count: 12 },
  { id: 'history', name: 'History', icon: '📜', color: 'from-amber-700 to-amber-900', count: 15 },
  { id: 'music', name: 'Music', icon: '🎵', color: 'from-purple-400 to-purple-600', count: 14 },
  { id: 'western', name: 'Western', icon: '🤠', color: 'from-amber-600 to-amber-800', count: 8 },
];

// Define popular genre combinations with their gradients and estimated counts
export const genreCombinations = [
  { 
    id: 'action+thriller', 
    name: 'Action & Thriller', 
    genres: ['action', 'thriller'],
    gradient: 'from-red-600 to-gray-800',
    count: 18,
    description: 'High-octane thrills and suspense'
  },
  { 
    id: 'sci-fi+adventure', 
    name: 'Sci-Fi & Adventure', 
    genres: ['sci-fi', 'adventure'],
    gradient: 'from-blue-500 to-green-600',
    count: 15,
    description: 'Explore new worlds and epic journeys'
  },
  { 
    id: 'comedy+romance', 
    name: 'Comedy & Romance', 
    genres: ['comedy', 'romance'],
    gradient: 'from-yellow-500 to-pink-500',
    count: 22,
    description: 'Laugh and fall in love'
  },
  { 
    id: 'crime+mystery', 
    name: 'Crime & Mystery', 
    genres: ['crime', 'mystery'],
    gradient: 'from-gray-800 to-indigo-800',
    count: 17,
    description: 'Solve the case and uncover secrets'
  },
  { 
    id: 'horror+thriller', 
    name: 'Horror & Thriller', 
    genres: ['horror', 'thriller'],
    gradient: 'from-purple-900 to-gray-800',
    count: 14,
    description: 'Terrifying suspense that keeps you on edge'
  },
  { 
    id: 'drama+history', 
    name: 'Drama & History', 
    genres: ['drama', 'history'],
    gradient: 'from-blue-700 to-amber-800',
    count: 12,
    description: 'Compelling stories from the past'
  },
  { 
    id: 'animation+family', 
    name: 'Animation & Family', 
    genres: ['animation', 'family'],
    gradient: 'from-green-400 to-blue-400',
    count: 16,
    description: 'Fun for viewers of all ages'
  }
];

// Sample movie data for demonstration
export const sampleMovies = [
  {
    id: 1,
    title: "The Action Thriller",
    description: "A high-stakes thriller with non-stop action.",
    thumbnail_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1025&q=80",
    release_year: 2022,
    genres: ["action", "thriller"],
    rating: 8.5
  },
  {
    id: 2,
    title: "Cosmic Journey",
    description: "An adventure across the stars and unknown planets.",
    thumbnail_url: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2021,
    genres: ["sci-fi", "adventure"],
    rating: 7.9
  },
  {
    id: 3,
    title: "Love & Laughter",
    description: "A romantic comedy about finding love in unexpected places.",
    thumbnail_url: "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2023,
    genres: ["comedy", "romance"],
    rating: 8.2
  },
  {
    id: 4,
    title: "The Mystery Case",
    description: "A detective solves a complex crime with unexpected twists.",
    thumbnail_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2020,
    genres: ["crime", "mystery"],
    rating: 8.7
  },
  {
    id: 5,
    title: "Haunted House",
    description: "A terrifying thriller set in a haunted mansion.",
    thumbnail_url: "https://images.unsplash.com/photo-1588421357574-87938a86fa28?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2021,
    genres: ["horror", "thriller"],
    rating: 7.6
  },
  {
    id: 6,
    title: "The Crown's War",
    description: "A historical drama about a royal family during wartime.",
    thumbnail_url: "https://images.unsplash.com/photo-1581894158358-5ecd2c518883?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    release_year: 2019,
    genres: ["drama", "history"],
    rating: 8.4
  },
  {
    id: 7,
    title: "Animated Adventures",
    description: "A family-friendly animated adventure for all ages.",
    thumbnail_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
    release_year: 2022,
    genres: ["animation", "family", "adventure"],
    rating: 8.1
  }
]; 
