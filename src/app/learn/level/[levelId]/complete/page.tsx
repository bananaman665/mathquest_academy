'use client'

import { useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Star, Target, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function LevelCompletePage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const levelId = parseInt(params.levelId as string)
  const xp = parseInt(searchParams.get('xp') || '0')
  const correct = parseInt(searchParams.get('correct') || '0')
  const total = parseInt(searchParams.get('total') || '10')
  const accuracy = Math.round((correct / total) * 100)

  const [showConfetti, setShowConfetti] = useState(true)
  const [saving, setSaving] = useState(false)

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
          console.log('Progress saved:', data)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          {/* Trophy Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Level Complete! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Amazing work! You&apos;re getting better at math!
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {/* XP Earned */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border-2 border-yellow-200">
              <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-yellow-700">{xp}</div>
              <div className="text-sm text-yellow-600 font-medium">XP Earned</div>
            </div>

            {/* Correct Answers */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
              <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">{correct}/{total}</div>
              <div className="text-sm text-green-600 font-medium">Correct</div>
            </div>

            {/* Accuracy */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
              <Trophy className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-700">{accuracy}%</div>
              <div className="text-sm text-blue-600 font-medium">Accuracy</div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            {accuracy === 100 ? (
              <>
                <div className="text-4xl mb-2">🌟</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perfect Score!</h3>
                <p className="text-gray-700">You got every question right! You&apos;re a math star!</p>
              </>
            ) : accuracy >= 80 ? (
              <>
                <div className="text-4xl mb-2">⭐</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Great Job!</h3>
                <p className="text-gray-700">You did really well! Keep up the awesome work!</p>
              </>
            ) : accuracy >= 60 ? (
              <>
                <div className="text-4xl mb-2">👍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Good Work!</h3>
                <p className="text-gray-700">You&apos;re learning! Practice makes perfect!</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">💪</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Trying!</h3>
                <p className="text-gray-700">Don&apos;t give up! You&apos;ll get better with practice!</p>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/learn"
              className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <span className="flex items-center justify-center gap-2">
                Continue Learning
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
            
            <Link
              href="/dashboard"
              className="block w-full bg-white border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-bold py-4 px-8 rounded-xl transition-all duration-200"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
