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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pt-safe pb-safe">
      {/* Loading Spinner Overlay */}
      {saving && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Saving progress...</p>
          </div>
        </div>
      )}

      <div className="max-w-2xl w-full my-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 text-center border-2 border-green-200">
          {/* Trophy Icon */}
          <div className="mb-4 sm:mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg border-4 border-green-400">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-2 sm:mb-3">
            Level Complete!
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-2">
            Amazing work! You&apos;re getting better at math!
          </p>

          {/* Stats Grid */}
          <div className="mb-6 sm:mb-8">
            {/* Accuracy - Full Width */}
            <div className="bg-blue-100 rounded-xl p-6 sm:p-8 border-2 border-blue-300 shadow-md">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-3" />
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 mb-2">{accuracy}%</div>
              <div className="text-base sm:text-lg text-blue-600 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Next Level Preview - New Feature */}
          {hasNextLevel && nextLevel && (
            <div className="bg-indigo-50 border-2 border-indigo-300 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Unlock className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs sm:text-sm font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
                      UP NEXT
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1">
                    Level {nextLevel.levelId}: {nextLevel.unit}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                    Ready to continue your math journey?
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] sm:text-xs px-2 py-1 bg-white rounded-full text-indigo-600 font-medium border border-indigo-200">
                      {nextLevel.totalQuestions} Questions
                    </span>
                    <span className="text-[10px] sm:text-xs px-2 py-1 bg-white rounded-full text-indigo-600 font-medium border border-indigo-200 flex items-center gap-1">
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
          <div className="space-y-3 sm:space-y-4">
            {hasNextLevel ? (
              <Link
                href={`/learn/level/${levelId + 1}`}
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 border-2 border-green-400"
              >
                <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                  Continue to Next Level
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 border-2 border-green-400"
              >
                <span className="flex items-center justify-center gap-2 text-base sm:text-lg">
                  Back to Learn
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                </span>
              </Link>
            )}

            <Link
              href="/learn"
              className="block w-full bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl transition-all duration-200 text-base sm:text-lg shadow-md"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
