import { withErrorHandling, apiSuccess, AuthenticationError } from '@/lib/errors'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// Types for achievement requirements
interface AchievementRequirement {
  type: 'xp' | 'level' | 'streak' | 'questions' | 'correct_answers' | 'longest_streak'
  value: number
  operator: '>=' | '==' | '<='
}

// Types for user data used in achievement checking
interface UserStats {
  id: string
  totalXP: number
  currentLevel: number
  streak: number
  longestStreak: number
  questionsAnswered: number
  correctAnswers: number
}

// Parse achievement requirements from JSON string
function parseRequirement(requirement: string): AchievementRequirement {
  try {
    return JSON.parse(requirement)
  } catch {
    // Fallback for simple requirements
    const match = requirement.match(/(xp|level|streak|questions|correct_answers|longest_streak)\s*(>=|==|<=)\s*(\d+)/)
    if (match) {
      return {
        type: match[1] as AchievementRequirement['type'],
        operator: match[2] as AchievementRequirement['operator'],
        value: parseInt(match[3])
      }
    }
    return { type: 'xp', operator: '>=', value: 0 }
  }
}

// Check if user meets achievement requirement
function checkRequirement(user: UserStats, requirement: AchievementRequirement): boolean {
  // Map requirement types to user property names
  const propertyMap: Record<AchievementRequirement['type'], keyof UserStats> = {
    'xp': 'totalXP',
    'level': 'currentLevel',
    'streak': 'streak',
    'questions': 'questionsAnswered',
    'correct_answers': 'correctAnswers',
    'longest_streak': 'longestStreak'
  }

  const propertyName = propertyMap[requirement.type]
  const userValue = Number(user[propertyName]) || 0

  switch (requirement.operator) {
    case '>=':
      return userValue >= requirement.value
    case '==':
      return userValue === requirement.value
    case '<=':
      return userValue <= requirement.value
    default:
      return false
  }
}

// GET /api/achievements - Get user's achievements and check for new ones
export const GET = withErrorHandling(async (req: Request) => {
  const { userId } = await auth()

  if (!userId) {
    throw new AuthenticationError()
  }

  // Get user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      totalXP: true,
      currentLevel: true,
      streak: true,
      longestStreak: true,
      questionsAnswered: true,
      correctAnswers: true,
    }
  })

  if (!user) {
    throw new AuthenticationError('User not found')
  }

  // Get user's existing achievements
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    include: {
      achievement: true
    }
  })

  // Get all available achievements
  const allAchievements = await prisma.achievement.findMany({
    orderBy: { xpReward: 'asc' }
  })

  // Check for newly earned achievements
  const earnedAchievementIds = new Set(userAchievements.map(ua => ua.achievementId))
  const newAchievements = []

  for (const achievement of allAchievements) {
    if (earnedAchievementIds.has(achievement.id)) continue

    const requirement = parseRequirement(achievement.requirement)
    if (checkRequirement(user, requirement)) {
      // Award the achievement
      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          xpEarned: achievement.xpReward
        },
        include: {
          achievement: true
        }
      })

      // Award XP if reward exists
      if (achievement.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalXP: { increment: achievement.xpReward }
          }
        })
      }

      newAchievements.push(userAchievement)
    }
  }

  return apiSuccess({
    achievements: userAchievements,
    allAchievements,
    newAchievements,
    totalEarned: userAchievements.length,
    availableCount: allAchievements.length
  })
})

// POST /api/achievements/check - Manually check for new achievements
export const POST = withErrorHandling(async (req: Request) => {
  const { userId } = await auth()

  if (!userId) {
    throw new AuthenticationError()
  }

  // Get fresh user data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      totalXP: true,
      currentLevel: true,
      streak: true,
      longestStreak: true,
      questionsAnswered: true,
      correctAnswers: true,
    }
  })

  if (!user) {
    throw new AuthenticationError('User not found')
  }

  // Get user's existing achievements
  const existingAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true }
  })

  const earnedIds = new Set(existingAchievements.map(ua => ua.achievementId))

  // Get all achievements and check for new ones
  const allAchievements = await prisma.achievement.findMany()
  const newAchievements = []

  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue

    const requirement = parseRequirement(achievement.requirement)
    if (checkRequirement(user, requirement)) {
      const userAchievement = await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          xpEarned: achievement.xpReward
        },
        include: {
          achievement: true
        }
      })

      if (achievement.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalXP: { increment: achievement.xpReward }
          }
        })
      }

      newAchievements.push(userAchievement)
    }
  }

  return apiSuccess({
    newAchievements,
    earnedCount: newAchievements.length,
    message: newAchievements.length > 0
      ? `Congratulations! You earned ${newAchievements.length} new achievement${newAchievements.length > 1 ? 's' : ''}!`
      : 'No new achievements earned.'
  })
})