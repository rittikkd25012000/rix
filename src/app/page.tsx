'use client'

import { useAuth } from '@/context/AuthContext'
import SignInForm from '@/components/auth/SignInForm'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    console.log('Home page: Auth state', { user, loading })
    if (user) {
      console.log('User is authenticated, redirecting to dashboard')
      router.push('/dashboard')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  // If user is already logged in, we'll redirect in the useEffect
  if (user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Redirecting to dashboard...</div>
      </div>
    )
  }

  return <SignInForm />
}
