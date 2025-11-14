import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Trophy, Star, Flame, Award, CheckCircle, Lock, Target, BookOpen, Zap } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'

export default async function AchievementsPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        currentLevel: 1,
        totalXP: 0,
      }
    })
  }

  // Calculate stats
  const levelsCompleted = dbUser.currentLevel - 1

  // Define achievements (same as profile page)
  const achievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first lesson', icon: Target, iconColor: 'text-purple-500', category: 'PROGRESS', unlocked: levelsCompleted >= 1 },
    { id: 2, name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, iconColor: 'text-orange-500', category: 'STREAK', unlocked: (dbUser.streak || 0) >= 7 },
    { id: 3, name: 'Math Master', description: 'Complete 10 lessons', icon: BookOpen, iconColor: 'text-blue-500', category: 'PROGRESS', unlocked: levelsCompleted >= 10 },
    { id: 4, name: 'XP Hunter', description: 'Earn 1000 XP', icon: Zap, iconColor: 'text-yellow-500', category: 'SKILL', unlocked: dbUser.totalXP >= 1000 },
    { id: 5, name: 'Perfect Score', description: 'Get 100% on a lesson', icon: Star, iconColor: 'text-amber-500', category: 'SKILL', unlocked: levelsCompleted >= 5 },
    { id: 6, name: 'Dedicated Learner', description: 'Complete 25 lessons', icon: Trophy, iconColor: 'text-yellow-600', category: 'SPECIAL', unlocked: levelsCompleted >= 25 },
  ]

  const earnedAchievements = achievements.filter(a => a.unlocked)
  const lockedAchievements = achievements.filter(a => !a.unlocked)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-purple-50 to-blue-50 pt-safe-header pb-4 px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h1 className="text-4xl font-black text-gray-900">Badges</h1>
            </div>
            <p className="text-gray-600 text-lg">
              {earnedAchievements.length} of {achievements.length} unlocked
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${achievements.length > 0 ? (earnedAchievements.length / achievements.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="pt-48 px-4 pb-4">
        {/* Badge Categories */}
        <div className="grid gap-8">
          {/* Earned Badges */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Earned Badges ({earnedAchievements.length})
            </h2>
            {earnedAchievements.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border-2 border-gray-200">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No badges yet!</h3>
                <p className="text-gray-600 mb-4">
                  Start learning and completing levels to earn your first badge!
                </p>
                <Link
                  href="/learn"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
                >
                  Start Learning
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {earnedAchievements.map((achievement) => {
                  const BadgeIcon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className={`border-2 rounded-xl p-6 ${getCategoryColor(achievement.category)} relative overflow-hidden shadow-md`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
                          <BadgeIcon className={`w-8 h-8 ${achievement.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                          ✓ Unlocked
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Locked Badges */}
          {lockedAchievements.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-6 h-6 text-gray-400" />
                Locked Badges ({lockedAchievements.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedAchievements.map((achievement) => {
                  const BadgeIcon = achievement.icon
                  return (
                    <div
                      key={achievement.id}
                      className="border-2 border-gray-300 bg-gray-50 rounded-xl p-6 relative overflow-hidden opacity-75"
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gray-200 border-2 border-gray-300">
                          <BadgeIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs font-bold text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                          🔒 Locked
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                          {achievement.category}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Badge Categories Info */}
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Badge Categories</h2>
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
        <div className="text-center mt-8 pb-24 md:pb-8">
          <Link
            href="/dashboard"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav currentPage="achievements" />
    </div>
  )
}