'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCoffee, FiHeart, FiCheck, FiArrowRight } from 'react-icons/fi'

export default function SupportPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const tiers = [
    {
      id: 'cutting-chai',
      name: 'Cutting Chai',
      price: '₹5',
      description: 'A small token of appreciation, like a refreshing cup of chai.',
      features: [
        'Basic supporter badge',
        'Name in credits',
        'Our eternal gratitude'
      ],
      color: 'from-amber-500 to-yellow-600',
      icon: '🍵'
    },
    {
      id: 'gold-flake',
      name: 'Gold Flake',
      price: '₹10',
      description: 'Support us like a reliable companion, always there when needed.',
      features: [
        'Silver supporter badge',
        'Name in credits',
        'Early access to new features',
        'Monthly newsletter'
      ],
      color: 'from-gray-300 to-yellow-300',
      icon: '🚬'
    },
    {
      id: 'coffee',
      name: 'Coffee',
      price: '₹20',
      description: 'The premium support option, keeping us energized and motivated.',
      features: [
        'Gold supporter badge',
        'Name in credits',
        'Early access to new features',
        'Monthly newsletter',
        'Exclusive content access',
        'Direct chat with developers'
      ],
      color: 'from-amber-700 to-yellow-800',
      icon: '☕'
    }
  ]

  const handleSelectTier = (tierId: string) => {
    setSelectedTier(tierId)
  }

  const handleSupport = () => {
    if (!selectedTier) return
    
    // In a real app, this would integrate with a payment gateway
    alert(`Thank you for selecting the ${tiers.find(t => t.id === selectedTier)?.name} tier! This would connect to a payment gateway in a production app.`)
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto pt-6"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Support RIX</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Your support helps us continue to bring you the best streaming experience. 
            Choose a tier that works for you and join our community of supporters.
          </p>
          <p className="text-primary mt-4 font-medium">
            We've made our support tiers affordable for everyone!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier) => (
            <motion.div
              key={tier.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative rounded-xl overflow-hidden border 
                ${selectedTier === tier.id 
                  ? 'border-primary' 
                  : 'border-white/10'
                }
                cursor-pointer
              `}
              onClick={() => handleSelectTier(tier.id)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${tier.color} opacity-10`} />
              
              <div className="relative p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                    <p className="text-2xl font-bold text-primary">{tier.price}</p>
                  </div>
                  <span className="text-3xl">{tier.icon}</span>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <FiCheck className="text-primary mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {selectedTier === tier.id && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                  >
                    <FiCheck className="text-white" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!selectedTier}
          onClick={handleSupport}
          className={`
            flex items-center justify-center gap-2 w-full max-w-md mx-auto py-4 rounded-lg font-semibold
            ${selectedTier 
              ? 'bg-primary text-white hover:bg-primary/90' 
              : 'bg-gray-800 text-gray-400 cursor-not-allowed'
            }
            transition-all
          `}
        >
          <FiHeart />
          Support Now
          <FiArrowRight />
        </motion.button>
        
        <p className="text-center text-gray-500 text-sm mt-6">
          All contributions are voluntary and help us improve RIX.
          <br />Thank you for your support!
        </p>
      </motion.div>
    </div>
  )
} 
