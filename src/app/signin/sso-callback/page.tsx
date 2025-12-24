'use client'

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'
import { BookOpen } from 'lucide-react'

export default function SSOCallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <BookOpen className="w-9 h-9 text-white" />
        </div>
        <p className="text-gray-600 text-lg font-medium">Signing you in...</p>
        <p className="text-gray-500 text-sm mt-2">Please wait</p>
      </div>
      <AuthenticateWithRedirectCallback 
        signInFallbackRedirectUrl="/learn"
        signUpFallbackRedirectUrl="/learn"
      />
    </div>
  )
}
