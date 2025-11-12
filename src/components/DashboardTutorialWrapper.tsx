'use client'

import { useState, useEffect } from 'react'
import Tutorial from '@/components/Tutorial'

interface DashboardTutorialWrapperProps {
  children: React.ReactNode
  isNewUser: boolean
}

export default function DashboardTutorialWrapper({ children, isNewUser }: DashboardTutorialWrapperProps) {
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    
    // Show tutorial if it's a new user and they haven't seen it
    if (isNewUser && !hasSeenTutorial) {
      // Small delay to let the page render first
      setTimeout(() => {
        setShowTutorial(true)
      }, 500)
    }
  }, [isNewUser])

  const handleCompleteTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setShowTutorial(false)
  }

  const handleSkipTutorial = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setShowTutorial(false)
  }

  return (
    <>
      {children}
      {showTutorial && (
        <Tutorial onComplete={handleCompleteTutorial} onSkip={handleSkipTutorial} />
      )}
    </>
  )
}
