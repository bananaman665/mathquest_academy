'use client'

import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, ArrowRight, Target, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

export default function LevelCompletePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const router = useRouter()
  const levelId = parseInt(params.levelId as string)
  const xp = parseInt(searchParams.get('xp') || '0')
  const correct = parseInt(searchParams.get('correct') || '0')
  const total = parseInt(searchParams.get('total') || '10')
  const accuracy = Math.round((correct / total) * 100)

  const { playLevelComplete, stopLevelComplete } = useSoundEffects()
  const [showConfetti, setShowConfetti] = useState(true)
  const [saving, setSaving] = useState(false)
  const [streak, setStreak] = useState<number | null>(null)
  // Removed showStreakAnimation to declutter the completion screen

  // Get next level info
  const hasNextLevel = levelId < 50

  // Play completion music when page loads
  useEffect(() => {
    playLevelComplete()
    
    // Stop music when component unmounts (user navigates away)
    return () => {
      stopLevelComplete()
    }
  }, [playLevelComplete, stopLevelComplete])

  useEffect(() => {
    // Hide confetti after animation
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Save progress to database
    const saveProgress = async () => {
      setSaving(true)
      try {
        const response = await fetch('/api/progress/complete-level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            levelId,
            xp,
            correct,
            total,
          }),
        })

        if (!response.ok) {
          console.error('Failed to save progress')
        } else {
          const data = await response.json()

          // Update streak display (but don't show animation)
          if (data.streak !== undefined) {
            setStreak(data.streak)
          }
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      } finally {
        setSaving(false)
      }
    }

    saveProgress()
  }, [levelId, xp, correct, total])

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-emerald-500 via-emerald-600 to-teal-700 flex flex-col">
      {/* Loading Spinner Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Saving progress...</p>
          </div>
        </div>
      )}

      {/* Main Content - Centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Trophy Icon with Glow */}
        <div className="mb-6">
          <div className="w-28 h-28 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
              <Trophy className="w-11 h-11 text-emerald-500" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Level Complete!
        </h1>
        <p className="text-lg text-white/90 mb-8 text-center">
          Great job! Keep it up!
        </p>

        {/* Stats Card */}
        <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
          {/* Accuracy - Main Stat */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold text-gray-900 mb-1">{accuracy}%</div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide">Accuracy</div>
            <div className="text-sm text-gray-400 mt-1">{correct} of {total} correct</div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200 mb-6"></div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-2 gap-4">
            {/* XP Earned */}
            <div className="bg-purple-50 rounded-2xl p-4 text-center">
              <Zap className="w-7 h-7 text-purple-500 mx-auto mb-2" strokeWidth={2.5} />
              <div className="text-2xl font-bold text-gray-900">{xp}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">XP Earned</div>
            </div>

            {/* Questions */}
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <Target className="w-7 h-7 text-orange-500 mx-auto mb-2" strokeWidth={2.5} />
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Questions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at Bottom */}
      <div className="px-6 pb-8 pt-4 space-y-3 bg-gradient-to-t from-teal-700/50 to-transparent">
        <div className="max-w-sm mx-auto space-y-3">
          {hasNextLevel ? (
            <Link
              href={`/learn/level/${levelId + 1}`}
              className="block w-full bg-white hover:bg-gray-50 text-emerald-600 font-bold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2 text-lg">
                Continue
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </span>
            </Link>
          ) : (
            <Link
              href="/learn"
              className="block w-full bg-white hover:bg-gray-50 text-emerald-600 font-bold py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-[0.98]"
            >
              <span className="flex items-center justify-center gap-2 text-lg">
                Back to Learn
                <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
              </span>
            </Link>
          )}

          <Link
            href="/learn"
            className="block w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-4 px-6 rounded-2xl transition-all text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
