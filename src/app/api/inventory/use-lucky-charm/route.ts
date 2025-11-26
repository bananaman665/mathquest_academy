import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Lucky Charm item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'lucky-charm'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Lucky Charm available',
        message: 'You do not have any Lucky Charms in your inventory.'
      }, { status: 400 })
    }

    // Parse the effect to get duration and multiplier
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { multiplier: 1.5, duration: 3600 }
    const multiplier = effect.multiplier || 1.5
    const durationSeconds = effect.duration || 3600

    // Set expiration time
    const expirationDate = new Date()
    expirationDate.setSeconds(expirationDate.getSeconds() + durationSeconds)

    // Activate the Lucky Charm
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
      message: `Lucky Charm activated! ${multiplier}x gem drops for ${Math.floor(durationSeconds / 60)} minutes.`,
      multiplier,
      expiresAt: expirationDate,
      remainingCharms: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating Lucky Charm:', error)
    return NextResponse.json({
      error: 'Failed to activate Lucky Charm',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
