'use client'

import { useSearchParams, useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, Target, ArrowRight, Flame, Lock, Unlock, Sparkles, ThumbsUp, Zap, PartyPopper } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center p-3 sm:p-4 md:p-6 pt-safe pb-safe relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full blur-3xl opacity-40 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-2xl w-full my-auto relative z-10">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 text-center relative overflow-hidden border-4 border-purple-200">
          {/* Decorative corner elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-br-full opacity-50"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-300 to-pink-300 rounded-bl-full opacity-50"></div>

          {/* Trophy Icon with celebration */}
          <div className="mb-4 sm:mb-6 relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce border-4 border-yellow-300">
              <Trophy className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
            {/* Sparkles around trophy */}
            <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute bottom-0 left-1/4 w-6 h-6 text-pink-400 animate-pulse delay-300" />
            <Star className="absolute top-1/4 right-1/3 w-6 h-6 text-purple-400 fill-purple-400 animate-pulse delay-500" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-2 sm:mb-3 flex items-center justify-center gap-3 flex-wrap">
            <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Level Complete!
            </span>
            <PartyPopper className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-purple-600 animate-bounce" />
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-gray-700 mb-6 sm:mb-8 px-2 font-semibold">
            Amazing work! You&apos;re getting better at math!
          </p>

          {/* Stats Grid - Vibrant redesign */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {/* XP Earned */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 shadow-xl hover:scale-105 transition-transform touch-manipulation border-4 border-yellow-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white fill-white drop-shadow" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">{xp}</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white font-bold uppercase tracking-wide">XP Earned</div>
              </div>
            </div>

            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 shadow-xl hover:scale-105 transition-transform touch-manipulation border-4 border-green-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white drop-shadow" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">{correct}/{total}</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white font-bold uppercase tracking-wide">Correct</div>
              </div>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-8 shadow-xl hover:scale-105 transition-transform touch-manipulation border-4 border-blue-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              <div className="relative z-10">
                <div className="bg-white/30 backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-2 shadow-lg">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white fill-white drop-shadow" />
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">{accuracy}%</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white font-bold uppercase tracking-wide">Accuracy</div>
              </div>
            </div>
          </div>

          {/* Performance Message - Vibrant cards */}
          <div className="mb-6 sm:mb-8">
            {accuracy === 100 ? (
              <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-yellow-300 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 shadow-xl">
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">Perfect Score!</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/95 font-semibold">You got every question right! You&apos;re a math star!</p>
                </div>
              </div>
            ) : accuracy >= 80 ? (
              <div className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-blue-300 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 shadow-xl">
                    <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">Great Job!</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/95 font-semibold">You did really well! Keep up the awesome work!</p>
                </div>
              </div>
            ) : accuracy >= 60 ? (
              <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-green-300 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 shadow-xl">
                    <ThumbsUp className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">Good Work!</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/95 font-semibold">You&apos;re learning! Practice makes perfect!</p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-4 border-orange-300 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="bg-white/30 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-3 shadow-xl">
                    <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white drop-shadow-lg" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg">Keep Trying!</h3>
                  <p className="text-sm sm:text-base md:text-lg text-white/95 font-semibold">Don&apos;t give up! You&apos;ll get better with practice!</p>
                </div>
              </div>
            )}
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

          {/* Action Buttons - Vibrant redesign */}
          <div className="space-y-3 sm:space-y-4">
            {hasNextLevel ? (
              <Link
                href={`/learn/level/${levelId + 1}`}
                className="block w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 active:scale-95 text-white font-black py-4 sm:py-5 px-6 sm:px-8 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 touch-manipulation border-4 border-purple-300 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl drop-shadow-lg">
                  Continue to Next Level
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ) : (
              <Link
                href="/learn"
                className="block w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 active:scale-95 text-white font-black py-4 sm:py-5 px-6 sm:px-8 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 touch-manipulation border-4 border-purple-300 relative overflow-hidden group"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <span className="relative z-10 flex items-center justify-center gap-3 text-base sm:text-lg md:text-xl drop-shadow-lg">
                  Back to Learn
                  <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}

            <Link
              href="/learn"
              className="block w-full bg-white border-4 border-gray-300 hover:border-purple-400 hover:bg-purple-50 active:scale-95 text-gray-800 font-black py-4 sm:py-5 px-6 sm:px-8 rounded-2xl transition-all duration-200 hover:scale-105 touch-manipulation text-base sm:text-lg shadow-lg"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
