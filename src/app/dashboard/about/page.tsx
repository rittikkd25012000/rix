'use client'

import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { FiInfo, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function AboutPage() {
  const { user } = useAuth()

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
            <FiInfo size={24} className="text-primary" />
            <h1 className="text-3xl font-bold">About RIX</h1>
          </div>

          <div className="space-y-6 text-gray-300">
            <p>
              RIX is a still-born streaming platform designed to provide users with a seamless and enjoyable entertainment experience. Our mission is to bring the movies, TV shows directly to your screen, anytime and anywhere based on the recomendations you give !
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Our Story</h2>
            <p>
              Founded in 2025, RIX began as a passion project by an individual into entertainment and technology. We recognized the need for a streaming service that not only offers a vast library of content but also understands and adapts to user preferences.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Our Vision</h2>
            <p>
              At RIX, we envision a world where quality entertainment is accessible to everyone. We strive to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Curate a diverse collection of content that caters to all tastes and preferences</li>
              <li>Leverage technology to enhance the viewing experience</li>
              <li>Support creators and storytellers from around the globe</li>
              <li>Build a community of entertainment lovers who share and discover content together</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Our Team</h2>
            <p>
              The RIX team consists of passionate individuals from diverse backgrounds, including film enthusiasts, software engineers, UI/UX designers, and content curators. Together, we work tirelessly to bring you the best streaming experience possible.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p>
              We value your feedback and are always looking to improve. If you have any questions, suggestions, or concerns, please don't hesitate to reach out to us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> rittik.kd25012000@gmail.com<br />
              <strong>Address:</strong> Kolkata, WB, India 3
            </p>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                © 2023-2024 RIX. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
