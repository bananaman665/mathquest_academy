import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete all user data from our database
    // Delete in order to respect foreign key constraints
    
    // Delete user achievements
    await prisma.userAchievement.deleteMany({
      where: { userId: userId }
    }).catch(() => {})

    // Delete user inventory
    await prisma.userInventory.deleteMany({
      where: { userId: userId }
    }).catch(() => {})

    // Delete user quests
    await prisma.userQuest.deleteMany({
      where: { userId: userId }
    }).catch(() => {})

    // Delete user progress records
    await prisma.userProgress.deleteMany({
      where: { userId: userId }
    }).catch(() => {})

    // Delete learning sessions
    await prisma.learningSession.deleteMany({
      where: { userId: userId }
    }).catch(() => {})

    // Delete the user record
    await prisma.user.delete({
      where: { id: userId }
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting user data:', error)
    return NextResponse.json({ error: 'Failed to delete user data' }, { status: 500 })
  }
}
