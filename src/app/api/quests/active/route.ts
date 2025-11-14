import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { getDailyQuestInstances } from '@/lib/quests'

export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create daily quest instances for the user
    const userQuests = await getDailyQuestInstances(userId)

    // Format response
    const quests = userQuests.map(uq => ({
      id: uq.id,
      questId: uq.quest.id,
      title: uq.quest.name,
      description: uq.quest.description,
      reward: `${uq.quest.reward} 💎`,
      progress: uq.progress,
      max: uq.maxProgress,
      icon: uq.quest.icon,
      isCompleted: uq.isCompleted,
      rewardClaimed: uq.rewardClaimed,
      completedAt: uq.completedAt,
      expiresAt: uq.expiresAt
    }))

    return NextResponse.json({ quests })
  } catch (error) {
    console.error('Error fetching quests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quests' },
      { status: 500 }
    )
  }
}
