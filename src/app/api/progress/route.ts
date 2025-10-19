import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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

    return NextResponse.json({ 
      currentLevel: user.currentLevel,
      totalXP: user.totalXP,
      streak: user.streak,
      questionsAnswered: user.questionsAnswered,
      correctAnswers: user.correctAnswers,
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}
