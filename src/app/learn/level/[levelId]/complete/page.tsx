'use client'

import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, Target, ArrowRight, Unlock, Zap } from 'lucide-react'
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
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4 sm:p-6 pt-safe pb-safe">
      {/* Loading Spinner Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-medium">Saving progress...</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full my-auto">
        {/* Success Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3">
            Level Complete!
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 mb-8 sm:mb-10">
            Amazing work! You&apos;re getting better at math!
          </p>

          {/* Stats Grid */}
          <div className="mb-8 sm:mb-10">
            {/* Accuracy - Full Width */}
            <div className="bg-blue-100 rounded-2xl p-8 sm:p-10">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" strokeWidth={2} />
              <div className="text-5xl sm:text-6xl font-bold text-blue-600 mb-2">{accuracy}%</div>
              <div className="text-lg text-blue-600/80 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Next Level Preview - New Feature */}
          {hasNextLevel && nextLevel && (
            <div className="bg-blue-50 rounded-2xl p-6 mb-8 sm:mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Unlock className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                      UP NEXT
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    Level {nextLevel.levelId}: {nextLevel.unit}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Ready to continue your math journey?
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-3 py-1.5 bg-white rounded-full text-blue-600 font-medium">
                      {nextLevel.totalQuestions} Questions
                    </span>
                    <span className="text-xs px-3 py-1.5 bg-white rounded-full text-blue-600 font-medium flex items-center gap-1">
                      {nextLevel.difficulty === 'easy' ? (
                        <><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Easy</>
                      ) : nextLevel.difficulty === 'medium' ? (
                        <><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Medium</>
                      ) : (
                        <><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Hard</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {hasNextLevel ? (
              <Link
                href={`/learn/level/${levelId + 1}`}
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  Continue to Next Level
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2 text-lg">
                  Back to Learn
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            )}

            <Link
              href="/learn"
              className="block w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-all duration-200 text-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
