import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the XP Boost item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'xp-boost'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'No XP Boost available',
        message: 'You do not have any XP Boost items in your inventory.'
      }, { status: 400 })
    }

    // Parse the effect to get duration and multiplier
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { multiplier: 2, duration: 3600 }
    const multiplier = effect.multiplier || 2
    const durationSeconds = effect.duration || 3600

    // Set expiration time
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + durationSeconds)

    // Activate the XP Boost by setting isActive and expiresAt on the existing item
    const updatedInventory = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        quantity: { decrement: 1 },
        isActive: true,
        expiresAt: expirationDate
      },
      include: {
        item: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `XP Boost activated! ${multiplier}x XP for ${Math.floor(durationSeconds / 60)} minutes.`,
      multiplier,
      expiresAt: expirationDate,
      remainingBoosts: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating XP boost:', error)
    return NextResponse.json({ 
      error: 'Failed to activate XP boost',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
