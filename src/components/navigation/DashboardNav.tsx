'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiBell, 
  FiFilm, 
  FiTv, 
  FiTag, 
  FiMenu, 
  FiSearch, 
  FiTrendingUp, 
  FiDownload, 
  FiBookmark,
  FiZap,
  FiUser,
  FiX
} from 'react-icons/fi'
import { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { slideIn, slideUp } from '@/utils/animation'
import Logo from '@/components/Logo'
import dynamic from 'next/dynamic'

// Dynamically import AnimatedLogo with SSR disabled
const AnimatedLogo = dynamic(() => import('@/components/AnimatedLogo'), {
  ssr: false,
  loading: () => <Logo className="h-10 w-auto" linkWrapper={false} />
})

export default function DashboardNav() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(true)
  const [headerHeight, setHeaderHeight] = useState(80) // Initial height
  const [scrollProgress, setScrollProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchActive, setSearchActive] = useState(false)
  const [activeCategory, setActiveCategory] = useState('')
  const [useAnimatedLogo, setUseAnimatedLogo] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  // Only use animated logo after hydration is complete
  useEffect(() => {
    setUseAnimatedLogo(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const maxScrollY = document.body.scrollHeight - window.innerHeight;
      
      // Calculate scroll progress (0 to 1)
      const progress = Math.min(currentScrollY / 300, 1);
      setScrollProgress(progress);
      
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Determine direction
          const scrollingDown = currentScrollY > lastScrollY.current;
          
          // Full size at top, compact when scrolled
          const newHeight = currentScrollY < 50 ? 80 : 60;
          setHeaderHeight(newHeight);
          
          // Hide on scroll down, show on scroll up
          if (scrollingDown && currentScrollY > 150) {
            setHeaderVisible(false);
          } else {
            setHeaderVisible(true);
          }
          
          // Update opacity based on scroll position
          setIsScrolled(currentScrollY > 20);
          lastScrollY.current = currentScrollY;
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Update active category when path changes
    if (!pathname) return
    
    const currentPath = pathname.split('/')[2] || 'dashboard'
    setActiveCategory(currentPath)
    setMenuOpen(false)
  }, [pathname])

  const categories = [
    { id: 'tv', label: 'TV Shows', path: '/dashboard/tv', icon: FiTv },
    { id: 'movies', label: 'Movies', path: '/dashboard/movies', icon: FiFilm },
    { id: 'new-popular', label: 'New & Popular', path: '/dashboard/new-popular', icon: FiTrendingUp },
    { id: 'free-movies', label: 'Free Movies', path: '/dashboard/free-movies', icon: FiDownload },
    { id: 'mylist', label: 'My List', path: '/dashboard/mylist', icon: FiBookmark },
    { id: 'genres', label: 'Genres', path: '/dashboard/genre', icon: FiTag },
    { id: 'games', label: 'Games', path: '/dashboard/games', icon: FiZap, badge: true },
    { id: 'notifications', label: 'Notifications', path: '/dashboard/notifications', icon: FiBell, badge: true },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchActive(false)
      setSearchQuery('')
    }
  }

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ 
        y: headerVisible ? 0 : -100,
        height: headerHeight,
        backgroundColor: isScrolled ? 'rgba(0, 0, 0, 0.9)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
        boxShadow: isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.3)' : 'none'
      }}
      transition={{ 
        duration: 0.3,
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }}
      className="fixed top-0 left-0 right-0 z-50 transition-all px-4 py-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="mr-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: 0.2, 
                duration: 0.5,
                type: "spring", 
                stiffness: 300, 
                damping: 20
              }}
              whileHover={{ 
                scale: 1.05
              }}
            >
              {useAnimatedLogo ? (
                <AnimatedLogo className="h-10 w-auto" linkWrapper={false} scrollProgress={scrollProgress} />
              ) : (
                <Logo className="h-10 w-auto" linkWrapper={false} scrollProgress={scrollProgress} />
              )}
            </motion.div>
          </Link>
          
          <motion.div 
            className="hidden md:flex space-x-8"
            variants={slideIn}
            initial="hidden"
            animate="visible"
          >
            {categories.map((category) => {
              const isActive = pathname === category.path || pathname?.startsWith(`${category.path}/`)
              
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href={category.path}
                    className={`relative text-base font-medium transition-colors flex items-center gap-2 ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    onMouseEnter={() => setActiveCategory(category.id)}
                    onMouseLeave={() => setActiveCategory(pathname?.split('/')[2] || 'dashboard')}
                  >
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {category.icon && <category.icon size={18} />}
                    </motion.div>
                    <span>{category.label}</span>
                    {category.badge && (
                      <motion.span 
                        className="w-2 h-2 bg-primary rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      ></motion.span>
                    )}
                    {isActive && (
                      <motion.div 
                        layoutId="nav-indicator-main"
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* User profile icon */}
          <Link href="/dashboard/profile">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center"
            >
              <FiUser size={18} className="text-white" />
            </motion.div>
          </Link>
          
          {/* Search Button/Input */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {searchActive ? (
                <motion.form
                  key="search-form"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 240, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="relative"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full bg-gray-900/70 border border-gray-700 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) {
                        setSearchActive(false)
                      }
                    }}
                  />
                  <motion.button
                    type="submit"
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiSearch size={16} />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.button
                  key="search-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchActive(true)}
                  className="text-white/70 hover:text-white p-1"
                  aria-label="Search"
                >
                  <FiSearch size={20} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <div className="md:hidden">
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-white/70 hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={24} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
            className="md:hidden mt-4 pb-2 overflow-hidden"
          >
            <motion.div 
              className="flex flex-col space-y-2"
              variants={slideUp}
              initial="hidden"
              animate="visible"
            >
              {/* Search in mobile menu */}
              <motion.form 
                onSubmit={handleSearch} 
                className="relative mb-2"
                variants={slideUp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-900/70 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  <FiSearch size={16} />
                </button>
              </motion.form>

              {categories.map((category, index) => {
                const isActive = pathname === category.path || pathname?.startsWith(`${category.path}/`)
                
                return (
                  <motion.div
                    key={category.id}
                    variants={slideUp}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 0.05 * (index + 1) }}
                  >
                    <Link 
                      href={category.path}
                      className={`flex items-center space-x-2 p-2 rounded-md ${
                        isActive ? 'bg-primary/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <motion.div
                        whileHover={{ rotate: 15 }}
                        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {category.icon && <category.icon size={18} />}
                      </motion.div>
                      <span>{category.label}</span>
                      {category.badge && (
                        <motion.span 
                          className="w-2 h-2 bg-primary rounded-full ml-1"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        ></motion.span>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
} 
