'use client'

import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, ArrowRight, Unlock, Target, Zap, Flame } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { levelConfigs } from '@/data/questionGenerator'

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
  const nextLevel = levelConfigs[levelId + 1]
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
    <div className="min-h-screen bg-white flex items-center justify-center p-3 overflow-y-auto">
      {/* Loading Spinner Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-700 font-medium text-sm">Saving progress...</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full py-4">
        {/* Success Card */}
        <div className="bg-white border-2 border-black rounded-2xl p-5 text-center">
          {/* Trophy Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-green-500 border-2 border-black rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Level Complete!
          </h1>
          <p className="text-base text-gray-600 mb-6">
            Great job! Keep it up!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* Accuracy */}
            <div className="bg-blue-500 border-2 border-black rounded-xl p-4 col-span-2">
              <div className="text-5xl font-bold text-white mb-1">{accuracy}%</div>
              <div className="text-sm text-white font-semibold">Accuracy</div>
              <div className="text-xs text-white/80 mt-1">{correct} of {total} correct</div>
            </div>

            {/* XP Earned */}
            <div className="bg-purple-500 border-2 border-black rounded-xl p-4">
              <Zap className="w-5 h-5 text-white mx-auto mb-1" strokeWidth={2.5} />
              <div className="text-2xl font-bold text-white">{xp}</div>
              <div className="text-xs text-white/90 font-medium">XP Earned</div>
            </div>

            {/* Questions */}
            <div className="bg-orange-500 border-2 border-black rounded-xl p-4">
              <Target className="w-5 h-5 text-white mx-auto mb-1" strokeWidth={2.5} />
              <div className="text-2xl font-bold text-white">{total}</div>
              <div className="text-xs text-white/90 font-medium">Questions</div>
            </div>
          </div>

          {/* Next Level Preview */}
          {hasNextLevel && nextLevel && (
            <div className="bg-green-100 border-2 border-black rounded-xl p-4 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-green-500 border-2 border-black rounded-full flex items-center justify-center flex-shrink-0">
                  <Unlock className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-green-700 mb-1">UP NEXT</div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    Level {nextLevel.levelId}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-1 bg-white border border-black rounded-lg text-gray-700 font-medium">
                      {nextLevel.totalQuestions} Questions
                    </span>
                    <span className="text-xs px-2 py-1 bg-white border border-black rounded-lg text-gray-700 font-medium">
                      {nextLevel.difficulty === 'easy' ? (
                        <>Easy</>
                      ) : nextLevel.difficulty === 'medium' ? (
                        <>Medium</>
                      ) : (
                        <>Hard</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5">
            {hasNextLevel ? (
              <Link
                href={`/learn/level/${levelId + 1}`}
                className="block w-full bg-green-500 border-2 border-black hover:bg-green-600 text-white font-bold py-3.5 px-5 rounded-xl transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  Continue
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="block w-full bg-green-500 border-2 border-black hover:bg-green-600 text-white font-bold py-3.5 px-5 rounded-xl transition-colors"
              >
                <span className="flex items-center justify-center gap-2">
                  Back to Learn
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              </Link>
            )}

            <Link
              href="/learn"
              className="block w-full bg-white border-2 border-black hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-5 rounded-xl transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
