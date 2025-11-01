'use client'

import { useState, useEffect } from 'react'
import { Trophy, Star, Flame, Award, CheckCircle, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: string
  requirement: string
  xpReward: number
  earnedAt?: string
  xpEarned?: number
}

interface AchievementData {
  achievements: Array<{
    achievement: Achievement
    earnedAt: string
    xpEarned: number
  }>
  allAchievements: Achievement[]
  newAchievements: Array<{
    achievement: Achievement
    earnedAt: string
    xpEarned: number
  }>
  totalEarned: number
  availableCount: number
}

export default function AchievementsPage() {
  const [achievementData, setAchievementData] = useState<AchievementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      const response = await fetch('/api/achievements')
      const data = await response.json()
      setAchievementData(data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const checkForNewAchievements = async () => {
    setChecking(true)
    try {
      const response = await fetch('/api/achievements', { method: 'POST' })
      const data = await response.json()

      if (data.newAchievements?.length > 0) {
        // Refresh the achievements list
        await fetchAchievements()
        // Show success message
        alert(data.message)
      } else {
        alert('No new achievements earned yet. Keep learning!')
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
      alert('Failed to check for new achievements.')
    } finally {
      setChecking(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PROGRESS':
        return <Star className="w-5 h-5 text-blue-500" />
      case 'SKILL':
        return <Award className="w-5 h-5 text-green-500" />
      case 'STREAK':
        return <Flame className="w-5 h-5 text-orange-500" />
      case 'SPECIAL':
        return <Trophy className="w-5 h-5 text-purple-500" />
      default:
        return <Trophy className="w-5 h-5 text-gray-500" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'PROGRESS':
        return 'border-blue-200 bg-blue-50'
      case 'SKILL':
        return 'border-green-200 bg-green-50'
      case 'STREAK':
        return 'border-orange-200 bg-orange-50'
      case 'SPECIAL':
        return 'border-purple-200 bg-purple-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your achievements...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!achievementData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Failed to load achievements.</p>
        </div>
      </div>
    )
  }

  const earnedAchievements = achievementData.achievements || []
  const allAchievements = achievementData.allAchievements || []
  const totalAchievements = achievementData.availableCount || 0
  
  // Get earned achievement IDs for quick lookup
  const earnedIds = new Set(earnedAchievements.map(ua => ua.achievement.id))
  
  // Separate locked achievements
  const lockedAchievements = allAchievements.filter(achievement => !earnedIds.has(achievement.id))

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-gray-900 mb-2">🏆 Achievements</h1>
          <p className="text-gray-600 text-lg">
            {earnedAchievements.length} of {totalAchievements} unlocked
          </p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${totalAchievements > 0 ? (earnedAchievements.length / totalAchievements) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Check for new achievements button */}
        <div className="text-center mb-8">
          <button
            onClick={checkForNewAchievements}
            disabled={checking}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? 'Checking...' : '🎯 Check for New Achievements'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            See if you&apos;ve earned any new badges based on your progress!
          </p>
        </div>

        {/* Achievement Categories */}
        <div className="grid gap-8">
          {/* Earned Achievements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Earned Achievements ({earnedAchievements.length})
            </h2>
            {earnedAchievements.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-gray-200">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No achievements yet!</h3>
                <p className="text-gray-600">
                  Start learning and completing levels to earn your first achievement!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.map((userAchievement) => (
                  <div
                    key={userAchievement.achievement.id}
                    className={`border-2 rounded-xl p-6 ${getCategoryColor(userAchievement.achievement.category)} relative overflow-hidden`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(userAchievement.achievement.category)}
                        <div>
                          <h3 className="font-bold text-gray-900">{userAchievement.achievement.name}</h3>
                          <p className="text-sm text-gray-600">{userAchievement.achievement.description}</p>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-600 font-semibold">+{userAchievement.xpEarned} XP</span>
                      <span className="text-gray-500">
                        {new Date(userAchievement.earnedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Locked Achievements */}
          {lockedAchievements.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-gray-400" />
                Locked Achievements ({lockedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="border-2 border-gray-300 bg-gray-50 rounded-xl p-6 relative overflow-hidden opacity-75"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getCategoryIcon(achievement.category)}
                        <div>
                          <h3 className="font-bold text-gray-900">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-semibold">Reward: +{achievement.xpReward} XP</span>
                      <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievement Categories Info */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Achievement Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Progress</h3>
                  <p className="text-sm text-gray-600">Level up and advance through the curriculum</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Skill</h3>
                  <p className="text-sm text-gray-600">Master math concepts and accuracy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Streak</h3>
                  <p className="text-sm text-gray-600">Maintain consistent learning habits</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-purple-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Special</h3>
                  <p className="text-sm text-gray-600">Unique challenges and milestones</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav currentPage="achievements" />
    </div>
  )
}