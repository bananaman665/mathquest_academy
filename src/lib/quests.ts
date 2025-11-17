import { prisma } from '@/lib/prisma'
import { QuestType } from '@prisma/client'

/**
 * Check if daily quests need to be reset and reset them if necessary
 */
export async function checkAndResetDailyQuests(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastDailyReset: true }
  })

  if (!user) return

  const now = new Date()
  const lastReset = new Date(user.lastDailyReset)

  // Check if it's a new day (compare dates, not times)
  const isNewDay =
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()

  if (isNewDay) {
    // Reset daily tracking fields
    await prisma.user.update({
      where: { id: userId },
      data: {
        dailyXPEarned: 0,
        dailyLessonsCompleted: 0,
        lastDailyReset: now
      }
    })
  }
}

/**
 * Get or create daily quest instances for a user
 */
export async function getDailyQuestInstances(userId: string) {
  // First, check and reset if it's a new day
  await checkAndResetDailyQuests(userId)

  // Get all active daily quests
  const dailyQuests = await prisma.quest.findMany({
    where: {
      questType: QuestType.DAILY,
      isActive: true
    },
    orderBy: { orderIndex: 'asc' }
  })

  // Set expiration to end of today
  const today = new Date()
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999)

  // Get user's current quest progress
  const userQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      expiresAt: {
        gte: new Date() // Not expired
      }
    },
    include: {
      quest: true
    }
  })

  // Create missing quest instances for today
  const existingQuestIds = new Set(userQuests.map(uq => uq.questId))
  const missingQuests = dailyQuests.filter(q => !existingQuestIds.has(q.id))

  for (const quest of missingQuests) {
    const requirement = JSON.parse(quest.requirement)
    await prisma.userQuest.create({
      data: {
        userId,
        questId: quest.id,
        progress: 0,
        maxProgress: requirement.value,
        expiresAt: endOfDay
      }
    })
  }

  // Return all active user quests with quest data
  return await prisma.userQuest.findMany({
    where: {
      userId,
      expiresAt: {
        gte: new Date()
      }
    },
    include: {
      quest: true
    },
    orderBy: {
      quest: {
        orderIndex: 'asc'
      }
    }
  })
}

/**
 * Update quest progress based on lesson completion
 */
export async function updateQuestProgress(
  userId: string,
  updates: {
    xpEarned?: number
    lessonsCompleted?: number
    isPerfectScore?: boolean
  }
) {
  const { xpEarned = 0, lessonsCompleted = 0, isPerfectScore = false } = updates

  // Update user's daily tracking
  await prisma.user.update({
    where: { id: userId },
    data: {
      dailyXPEarned: { increment: xpEarned },
      dailyLessonsCompleted: { increment: lessonsCompleted }
    }
  })

  // Get user's daily stats
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      dailyXPEarned: true,
      dailyLessonsCompleted: true
    }
  })

  if (!user) return []

  // Get active quests
  const userQuests = await prisma.userQuest.findMany({
    where: {
      userId,
      isCompleted: false,
      expiresAt: {
        gte: new Date()
      }
    },
    include: {
      quest: true
    }
  })

  const completedQuests = []

  // Update each quest based on its type
  for (const userQuest of userQuests) {
    const requirement = JSON.parse(userQuest.quest.requirement)
    let newProgress = userQuest.progress

    if (requirement.type === 'xp') {
      newProgress = user.dailyXPEarned
    } else if (requirement.type === 'lessons') {
      newProgress = user.dailyLessonsCompleted
    } else if (requirement.type === 'perfect' && isPerfectScore) {
      newProgress = 1
    }

    // Check if quest is completed
    const isCompleted = newProgress >= userQuest.maxProgress

    await prisma.userQuest.update({
      where: { id: userQuest.id },
      data: {
        progress: newProgress,
        isCompleted,
        completedAt: isCompleted ? new Date() : userQuest.completedAt
      }
    })

    if (isCompleted && !userQuest.isCompleted) {
      completedQuests.push({
        questId: userQuest.questId,
        questName: userQuest.quest.name,
        reward: userQuest.quest.reward
      })
    }
  }

  return completedQuests
}

/**
 * Claim reward for a completed quest
 */
export async function claimQuestReward(userId: string, userQuestId: string) {
  const userQuest = await prisma.userQuest.findUnique({
    where: { id: userQuestId },
    include: { quest: true }
  })

  if (!userQuest) {
    throw new Error('Quest not found')
  }

  if (userQuest.userId !== userId) {
    throw new Error('Unauthorized')
  }

  if (!userQuest.isCompleted) {
    throw new Error('Quest not completed')
  }

  if (userQuest.rewardClaimed) {
    throw new Error('Reward already claimed')
  }

  // Award the reward (add to totalXP)
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      totalXP: { increment: userQuest.quest.reward }
    },
    select: {
      totalXP: true
    }
  })

  // Mark reward as claimed
  await prisma.userQuest.update({
    where: { id: userQuestId },
    data: {
      rewardClaimed: true
    }
  })

  return {
    reward: userQuest.quest.reward,
    newBalance: updatedUser.totalXP
  }
}
