import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Golden Trophy item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'golden-trophy'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'Golden Trophy not found',
        message: 'You do not own the Golden Trophy.'
      }, { status: 400 })
    }

    // Check if already equipped
    if (inventoryItem.isActive) {
      return NextResponse.json({ 
        error: 'Already Equipped',
        message: 'You already have the Golden Trophy equipped.'
      }, { status: 400 })
    }

    // Equip the Golden Trophy (deactivate other cosmetics of same type and activate this)
    // First, deactivate all other trophy/cosmetics
    await prisma.userInventory.updateMany({
      where: {
        userId,
        item: {
          category: 'cosmetics'
        }
      },
      data: {
        isActive: false
      }
    })

    // Activate this cosmetic
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
      message: '✨ Golden Trophy equipped! Show off your achievements!',
      equipped: true,
      cosmetic: 'golden-trophy'
    })

  } catch (error) {
    console.error('Error equipping golden trophy:', error)
    return NextResponse.json({ 
      error: 'Failed to equip golden trophy',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
