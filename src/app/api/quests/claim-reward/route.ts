import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { claimQuestReward } from '@/lib/quests'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userQuestId } = await request.json()

    if (!userQuestId) {
      return NextResponse.json(
        { error: 'Missing userQuestId' },
        { status: 400 }
      )
    }

    const result = await claimQuestReward(userId, userQuestId)

    return NextResponse.json({
      success: true,
      message: `You earned ${result.reward} diamonds!`,
      reward: result.reward,
      newBalance: result.newBalance
    })
  } catch (error) {
    console.error('Error claiming reward:', error)

    if (error instanceof Error) {
      if (error.message === 'Quest not found') {
        return NextResponse.json({ error: 'Quest not found' }, { status: 404 })
      }
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
      }
      if (error.message === 'Quest not completed') {
        return NextResponse.json({ error: 'Quest not completed yet' }, { status: 400 })
      }
      if (error.message === 'Reward already claimed') {
        return NextResponse.json({ error: 'Reward already claimed' }, { status: 400 })
      }
    }

    return NextResponse.json(
      { error: 'Failed to claim reward' },
      { status: 500 }
    )
  }
}
