'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

const SignInPage = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
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
                href="/auth/signup" 
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

export default SignInPage
