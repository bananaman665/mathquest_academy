import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { updateUserStreak } from '@/lib/streak'
import { prisma } from '@/lib/prisma'
import { updateQuestProgress } from '@/lib/quests'

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
  const propertyMap: Record<string, string> = {
    'xp': 'totalXP',
    'level': 'currentLevel',
    'streak': 'streak',
    'questions': 'questionsAnswered',
    'correct_answers': 'correctAnswers',
    'longest_streak': 'longestStreak'
  }

  const propertyName = propertyMap[requirement.type] as keyof typeof user
  if (!propertyName) return false
  const userValue = Number(user[propertyName]) || 0

  switch (requirement.operator) {
    case '>=': return userValue >= requirement.value
    case '==': return userValue === requirement.value
    case '<=': return userValue <= requirement.value
    default: return false
  }
}

// Check and award new achievements
async function checkAndAwardAchievements(userId: string, userData: { totalXP: number; currentLevel: number; streak: number; longestStreak: number; questionsAnswered: number; correctAnswers: number }) {
  const allAchievements = await prisma.achievement.findMany()
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true }
  })
  const earnedIds = new Set(userAchievements.map(ua => ua.achievementId))
  
  const newAchievements = []
  
  for (const achievement of allAchievements) {
    if (earnedIds.has(achievement.id)) continue
    
    const requirement = parseRequirement(achievement.requirement)
    if (checkRequirement(userData, requirement)) {
      await prisma.userAchievement.create({
        data: {
          userId,
          achievementId: achievement.id,
          xpEarned: achievement.xpReward
        }
      })
      
      if (achievement.xpReward > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: { totalXP: { increment: achievement.xpReward } }
        })
      }
      
      newAchievements.push({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        xpReward: achievement.xpReward
      })
    }
  }
  
  return newAchievements
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { levelId, xp, correct, total } = body

    if (!levelId || xp === undefined || correct === undefined || total === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          id: userId,
          currentLevel: 1,
          totalXP: 0,
        }
      })
    }

    // Update user's XP and current level
    const newTotalXP = user.totalXP + xp
    const newCurrentLevel = Math.max(user.currentLevel, levelId + 1) // Unlock next level

    // Update user progress
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalXP: newTotalXP,
        currentLevel: newCurrentLevel,
        questionsAnswered: { increment: total },
        correctAnswers: { increment: correct },
      }
    })

    // Update streak (this also updates lastActiveAt)
    const updatedUser = await updateUserStreak(userId)

    // Update quest progress
    const isPerfectScore = correct === total && total > 0
    const completedQuests = await updateQuestProgress(userId, {
      xpEarned: xp,
      lessonsCompleted: 1,
      isPerfectScore
    })

    // Check for new achievements with updated stats
    const newAchievements = await checkAndAwardAchievements(userId, {
      totalXP: newTotalXP,
      currentLevel: newCurrentLevel,
      streak: updatedUser.streak,
      longestStreak: updatedUser.longestStreak,
      questionsAnswered: (user.questionsAnswered || 0) + total,
      correctAnswers: (user.correctAnswers || 0) + correct
    })

    return NextResponse.json({
      success: true,
      newXP: newTotalXP,
      unlockedLevel: newCurrentLevel,
      streak: updatedUser.streak,
      longestStreak: updatedUser.longestStreak,
      completedQuests, // Return newly completed quests for notifications
      newAchievements  // Return newly earned achievements
    })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
