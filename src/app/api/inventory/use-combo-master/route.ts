import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Combo Master item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'combo-master'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Combo Master available',
        message: 'You do not have any Combo Master items in your inventory.'
      }, { status: 400 })
    }

    // Parse the effect to get multiplier
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { multiplier: 3 }
    const multiplier = effect.multiplier || 3

    // Activate Combo Master (lesson-specific, no expiration date)
    const updatedInventory = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        quantity: { decrement: 1 },
        isActive: true,
        expiresAt: null
      },
      include: {
        item: true
      }
    })

    return NextResponse.json({
      success: true,
      message: `Combo Master activated! Starting with ${multiplier}x combo multiplier.`,
      multiplier,
      remainingComboMasters: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating Combo Master:', error)
    return NextResponse.json({
      error: 'Failed to activate Combo Master',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
