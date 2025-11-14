import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Validate level is within valid range (1-50)
    if (level < 1 || level > 50) {
      return NextResponse.json({ error: 'Level must be between 1 and 50' }, { status: 400 })
    }

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      // New user - create with the specified level
      user = await prisma.user.create({
        data: {
          id: userId,
          currentLevel: level,
          totalXP: 0,
        }
      })
    } else {
      // Existing user - only allow level setting if they're at level 1 (placement test scenario)
      // This prevents users from skipping ahead after they've started playing
      if (user.currentLevel !== 1) {
        return NextResponse.json({
          error: 'Cannot change level',
          message: 'Level can only be set during initial placement test. Complete levels to progress.'
        }, { status: 403 })
      }

      // Update user's current level (only allowed once, when at level 1)
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
