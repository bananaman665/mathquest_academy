'use client'

import { useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SignOutButton() {
  const { signOut } = useClerk()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    setIsSigningOut(true)
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
      setIsSigningOut(false)
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={isSigningOut}
      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogOut className="w-5 h-5" />
      <span>{isSigningOut ? 'Signing out...' : 'Sign Out'}</span>
    </button>
  )
}
