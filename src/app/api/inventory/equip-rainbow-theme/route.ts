import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Rainbow Theme item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'rainbow-theme'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'Rainbow Theme not found',
        message: 'You do not own the Rainbow Theme.'
      }, { status: 400 })
    }

    // Check if already equipped
    if (inventoryItem.isActive) {
      return NextResponse.json({ 
        error: 'Already Equipped',
        message: 'You already have the Rainbow Theme activated.'
      }, { status: 400 })
    }

    // Activate the Rainbow Theme
    // First, deactivate other themes
    await prisma.userInventory.updateMany({
      where: {
        userId,
        item: {
          id: 'rainbow-theme'
        }
      },
      data: {
        isActive: false
      }
    })

    // Activate this theme
    const updated = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        isActive: true
      },
      include: {
        item: true
      }
    })

    return NextResponse.json({
      success: true,
      message: '🌈 Rainbow Theme activated! Enjoy the colorful interface!',
      equipped: true,
      theme: 'rainbow'
    })

  } catch (error) {
    console.error('Error activating rainbow theme:', error)
    return NextResponse.json({ 
      error: 'Failed to activate rainbow theme',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
