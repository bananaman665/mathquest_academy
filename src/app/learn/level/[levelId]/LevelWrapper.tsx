'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowRight } from 'lucide-react'
import { Question, GameMode } from '@/data/questions'
import LessonClient from './LessonClient'

interface LevelWrapperProps {
  levelId: number
  introduction: {
    title: string
    content: string[]
    examples: Array<{ number: string; visual: string; word: string }>
  }
  questions: Question[]
  gameMode?: GameMode
}

export default function LevelWrapper({ levelId, introduction, questions, gameMode }: LevelWrapperProps) {
  const router = useRouter()
  const [insufficientHearts, setInsufficientHearts] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user has enough hearts to start the level
    // For now, we require at least 5 hearts (full bar)
    const REQUIRED_HEARTS = 5

    // Get hearts from localStorage or check with API
    const checkHearts = async () => {
      try {
        // You can check hearts from user data or localStorage
        // For now, we'll assume they have 5 hearts on start
        // In a full implementation, this would check against the user's actual heart count
        
        // Simple check - always allow for now since hearts are managed per level session
        // The game over modal in LessonClient handles running out of hearts during gameplay
        setLoading(false)
      } catch (error) {
        console.error('Error checking hearts:', error)
        setLoading(false)
      }
    }

    checkHearts()
  }, [levelId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading level...</p>
        </div>
      </div>
    )
  }

  if (insufficientHearts) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm w-full">
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-3xl p-8 shadow-2xl border-2 border-red-500 text-center">
            <div className="mb-6 text-6xl">💔</div>
            
            <h2 className="text-3xl font-black text-white mb-2">Not Enough Hearts</h2>
            <p className="text-red-100 text-lg mb-8">
              You need at least 5 hearts to start a level.
            </p>

            {/* Tip */}
            <div className="bg-white/10 rounded-xl p-4 mb-8 border border-white/20">
              <p className="text-red-100 text-sm">
                💡 Earn hearts by completing other levels or visit the shop!
              </p>
            </div>

            {/* Back Button */}
            <Link
              href="/learn"
              className="inline-block w-full px-6 py-4 bg-white text-red-600 font-bold text-lg rounded-xl hover:bg-red-50 transition-all duration-200 shadow-lg uppercase tracking-wide"
            >
              <ArrowRight className="w-5 h-5 inline mr-2" />
              Back to Learning Path
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LessonClient 
      levelId={levelId} 
      introduction={introduction} 
      questions={questions}
      gameMode={gameMode}
    />
  )
}
