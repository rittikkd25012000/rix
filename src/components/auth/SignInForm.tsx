'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function SignInForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage('SIGNING IN...')

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      setMessage('SUCCESS! REDIRECTING...')
      
      // Wait a moment before redirecting to ensure auth state is updated
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'SIGN IN FAILED')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card">
          <h2 className="text-5xl mb-8 text-center text-gradient">WELCOME BACK</h2>
          <form onSubmit={handleSignIn} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg tracking-wider mb-2 text-gray-300">
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg tracking-wider mb-2 text-gray-300">
                PASSWORD
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-lg bg-red-500/10 p-4 rounded-lg border border-red-500/20 text-center tracking-wider">
                {error}
              </div>
            )}
            {message && (
              <div className="text-primary text-lg bg-primary/10 p-4 rounded-lg border border-primary/20 text-center tracking-wider">
                {message}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg py-3"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-400 tracking-wider">
                DON'T HAVE AN ACCOUNT?
              </p>
              <Link 
                href="/signup" 
                className="text-lg text-primary hover:text-primary/90 tracking-wider inline-block"
              >
                CREATE ACCOUNT
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 
