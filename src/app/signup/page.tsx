'use client'

import SignUpForm from '@/components/auth/SignUpForm'
import { useAuth } from '@/context/AuthContext'
import { redirect } from 'next/navigation'

export default function SignUpPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (user) {
    redirect('/')
  }

  return <SignUpForm />
} 
