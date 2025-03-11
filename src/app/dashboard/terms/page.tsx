'use client'

import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { FiFileText, FiArrowLeft } from 'react-icons/fi'
import Link from 'next/link'

export default function TermsPage() {
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
            <FiFileText size={24} className="text-primary" />
            <h1 className="text-3xl font-bold">Terms of Service</h1>
          </div>

          <div className="space-y-6 text-gray-300">
            <p className="text-sm text-gray-400">Last updated: March 01, 2025</p>

            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using RIX, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Subscription and Billing</h2>
              <p>
                RIX offers various subscription plans. By subscribing to our service, you agree to the following:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Subscription fees are one time only and there is no compulsory subscirption model for our App !</li>
                <li>Changes to subscription plans may take effect at the next month, for example - buying me a Coffee from Cutting Chai will give you a gold badge that will appear in the next month !</li>
                <li>Refunds are subject to our refund policy !</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <p>
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Maintaining the confidentiality of your account credentials !</li>
                <li>All activities that occur under your account !</li>
                <li>Notifying us immediately of any unauthorized use !</li>
                <li>Ensuring your account information is accurate and up-to-date !</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Content Usage</h2>
              <p>
                All content provided through RIX is protected by copyright and other intellectual property laws. Users agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use content for personal, non-commercial purposes only !</li>
                <li>Not download, copy, or distribute content unless explicitly permitted !</li>
                <li>Not circumvent any technology used to protect the content !</li>
                <li>Not share account credentials with others !</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Service Availability</h2>
              <p>
                RIX strives to provide uninterrupted service but does not guarantee continuous, error-free access. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Modify or discontinue features without notice !</li>
                <li>Perform maintenance that may temporarily interrupt service !</li>
                <li>Restrict access from certain geographic locations !</li>
                <li>Terminate accounts that violate these terms !</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Prohibited Activities</h2>
              <p>
                Users must not:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Use VPNs or other tools to circumvent geographic restrictions !</li>
                <li>Attempt to hack or breach the service's security !</li>
                <li>Upload or transmit malicious code !</li>
                <li>Engage in any activity that disrupts the service !</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Changes to Terms</h2>
              <p>
                RIX reserves the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the service constitutes acceptance of the modified terms !
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <p className="mt-2">
                <strong>Email:</strong> rittik.kd25012000@gmail.com<br />
                <strong>Address:</strong> Kolkata, WB, India 3
              </p>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                © 2024-2025 RIX. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 
