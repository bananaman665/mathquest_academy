import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { updateUserStreak } from '@/lib/streak'
import { prisma } from '@/lib/prisma'
import { updateQuestProgress } from '@/lib/quests'

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

    return NextResponse.json({
      success: true,
      newXP: newTotalXP,
      unlockedLevel: newCurrentLevel,
      streak: updatedUser.streak,
      longestStreak: updatedUser.longestStreak,
      completedQuests // Return newly completed quests for notifications
    })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
