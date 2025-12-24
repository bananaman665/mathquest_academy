'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BookOpen } from 'lucide-react'

export default function SignInFactorTwo() {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push('/learn')
    }
  }, [isLoaded, isSignedIn, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-9 h-9 text-white" />
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <SignIn 
        routing="path"
        path="/signin"
        signUpUrl="/signup"
        fallbackRedirectUrl="/learn"
      />
    </div>
  )
}
