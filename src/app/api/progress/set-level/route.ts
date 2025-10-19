import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { level } = body

    if (!level || typeof level !== 'number') {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 })
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          currentLevel: level,
          totalXP: 0,
        }
      })
    } else {
      // Update user's current level
      await prisma.user.update({
        where: { id: userId },
        data: {
          currentLevel: level,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      currentLevel: level 
    })
  } catch (error) {
    console.error('Error setting level:', error)
    return NextResponse.json({ error: 'Failed to set level' }, { status: 500 })
  }
}
