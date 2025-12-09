import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Trophy, Star, Flame, Award, CheckCircle, Lock, Target, BookOpen, Zap, TrendingUp, Crown, Timer, Sun, Moon, Rocket } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'
import Link from 'next/link'

// Map icon names from database to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Star,
  Target,
  TrendingUp,
  Crown,
  CheckCircle,
  Award,
  Trophy,
  Flame,
  Zap,
  Rocket,
  Sun,
  Moon,
  Timer,
  BookOpen,
}

// Parse achievement requirement
function parseRequirement(requirement: string): { type: string; value: number; operator: string } {
  try {
    return JSON.parse(requirement)
  } catch {
    return { type: 'xp', operator: '>=', value: 0 }
  }
}

// Check if user meets a requirement
function checkRequirement(user: { totalXP: number; currentLevel: number; streak: number; longestStreak: number; questionsAnswered: number; correctAnswers: number }, requirement: { type: string; value: number; operator: string }): boolean {
  const propertyMap: Record<string, keyof typeof user> = {
    'xp': 'totalXP',
    'level': 'currentLevel',
    'streak': 'streak',
    'questions': 'questionsAnswered',
    'correct_answers': 'correctAnswers',
    'longest_streak': 'longestStreak'
  }

  const propertyName = propertyMap[requirement.type]
  if (!propertyName) return false
  const userValue = Number(user[propertyName]) || 0

  switch (requirement.operator) {
    case '>=': return userValue >= requirement.value
    case '==': return userValue === requirement.value
    case '<=': return userValue <= requirement.value
    default: return false
  }
}

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

  // Fetch all achievements from database
  const allAchievements = await prisma.achievement.findMany({
    orderBy: [
      { category: 'asc' },
      { xpReward: 'asc' }
    ]
  })

  // Get user's earned achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: user.id },
    select: { achievementId: true, earnedAt: true }
  })
  const earnedIds = new Set(userAchievements.map(ua => ua.achievementId))

  // Check for new achievements and award them
  const newlyEarned: string[] = []
  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue
    
    const requirement = parseRequirement(achievement.requirement)
    if (checkRequirement(dbUser, requirement)) {
      // Award the achievement
      await prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId: achievement.id,
          xpEarned: achievement.xpReward
        }
      })
      
      // Award XP
      if (achievement.xpReward > 0) {
        await prisma.user.update({
          where: { id: user.id },
          data: { totalXP: { increment: achievement.xpReward } }
        })
      }
      
      earnedIds.add(achievement.id)
      newlyEarned.push(achievement.id)
    }
  }

  // Separate earned and locked achievements
  const earnedAchievements = allAchievements.filter(a => earnedIds.has(a.id))
  const lockedAchievements = allAchievements.filter(a => !earnedIds.has(a.id))

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
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-purple-50 to-blue-50 pt-safe-header pb-3 px-4 z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <Trophy className="w-7 h-7 text-yellow-600" />
              <h1 className="text-3xl font-black text-gray-900">Badges</h1>
            </div>
            <p className="text-gray-600 text-base">
              {earnedAchievements.length} of {allAchievements.length} unlocked
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${allAchievements.length > 0 ? (earnedAchievements.length / allAchievements.length) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="pt-28 px-4 pb-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {earnedAchievements.map((achievement) => {
                  const BadgeIcon = iconMap[achievement.icon] || Star
                  const iconColor = achievement.category === 'PROGRESS' ? 'text-blue-500' :
                                   achievement.category === 'SKILL' ? 'text-green-500' :
                                   achievement.category === 'STREAK' ? 'text-orange-500' :
                                   'text-purple-500'
                  return (
                    <div
                      key={achievement.id}
                      className={`border-2 rounded-xl p-5 ${getCategoryColor(achievement.category)} relative overflow-hidden`}
                    >
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
                          <BadgeIcon className={`w-8 h-8 ${iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1">{achievement.name}</h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          +{achievement.xpReward} XP
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {lockedAchievements.map((achievement) => {
                  const BadgeIcon = iconMap[achievement.icon] || Star
                  return (
                    <div
                      key={achievement.id}
                      className="border-2 border-gray-300 bg-gray-50 rounded-xl p-5 relative overflow-hidden opacity-75"
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
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          +{achievement.xpReward} XP
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
          <div className="bg-white rounded-xl p-6">
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
        <div className="text-center mt-8 pb-20 md:pb-8">
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