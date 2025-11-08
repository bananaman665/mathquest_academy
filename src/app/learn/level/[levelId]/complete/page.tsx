'use client'

import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, Target, ArrowRight, Flame, Lock, Unlock } from 'lucide-react'
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
  const [showStreakAnimation, setShowStreakAnimation] = useState(false)

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

  console.log('Saving status:', saving)
  console.log('Show confetti:', showConfetti)

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
          console.log('Progress saved:', data)
          
          // Update streak display
          if (data.streak !== undefined) {
            setStreak(data.streak)
            setShowStreakAnimation(true)
            setTimeout(() => setShowStreakAnimation(false), 3000)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-12 text-center">
          {/* Trophy Icon */}
          <div className="mb-3 sm:mb-4 md:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-1 sm:mb-2 md:mb-4">
            Level Complete! 🎉
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 md:mb-8 px-2">
            Amazing work! You&apos;re getting better at math!
          </p>

          {/* Stats Grid - Improved mobile spacing */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8">
            {/* XP Earned */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border-2 border-yellow-200 touch-manipulation">
              <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-500 mx-auto mb-1 sm:mb-2" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-700">{xp}</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-yellow-600 font-medium">XP Earned</div>
            </div>

            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border-2 border-green-200 touch-manipulation">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-500 mx-auto mb-1 sm:mb-2" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{correct}/{total}</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-green-600 font-medium">Correct</div>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border-2 border-blue-200 touch-manipulation">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-500 mx-auto mb-1 sm:mb-2" />
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-700">{accuracy}%</div>
              <div className="text-[10px] sm:text-xs md:text-sm text-blue-600 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
            {accuracy === 100 ? (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">🌟</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Perfect Score!</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700">You got every question right! You&apos;re a math star!</p>
              </>
            ) : accuracy >= 80 ? (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">⭐</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Great Job!</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700">You did really well! Keep up the awesome work!</p>
              </>
            ) : accuracy >= 60 ? (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">👍</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Good Work!</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700">You&apos;re learning! Practice makes perfect!</p>
              </>
            ) : (
              <>
                <div className="text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">💪</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">Keep Trying!</h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700">Don&apos;t give up! You&apos;ll get better with practice!</p>
              </>
            )}
          </div>

          {/* Streak Notification */}
          {showStreakAnimation && streak !== null && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-600 animate-pulse" />
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-orange-700">
                    {streak === 1 ? 'Streak Started!' : `${streak} Day Streak!`}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-orange-600">
                    {streak === 1 ? 'Come back tomorrow to keep it going!' : 'Keep learning every day!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Next Level Preview - New Feature */}
          {hasNextLevel && nextLevel && (
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 md:mb-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
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
                    <span className="text-[10px] sm:text-xs px-2 py-1 bg-white rounded-full text-indigo-600 font-medium border border-indigo-200">
                      {nextLevel.difficulty === 'easy' ? '⭐ Easy' : nextLevel.difficulty === 'medium' ? '⭐⭐ Medium' : '⭐⭐⭐ Hard'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Improved mobile touch targets */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            {hasNextLevel ? (
              <Link
                href={`/learn/level/${levelId + 1}`}
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 touch-manipulation"
              >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  Continue to Next Level
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-95 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 touch-manipulation"
              >
                <span className="flex items-center justify-center gap-2 text-sm sm:text-base">
                  Back to Learn
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </span>
              </Link>
            )}
            
            <Link
              href="/dashboard"
              className="block w-full bg-white border-2 border-gray-300 hover:border-blue-500 active:scale-95 text-gray-700 hover:text-blue-600 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 touch-manipulation text-sm sm:text-base"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
