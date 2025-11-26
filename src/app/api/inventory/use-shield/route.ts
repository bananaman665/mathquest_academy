import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Shield item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'shield'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Shield available',
        message: 'You do not have any Shields in your inventory.'
      }, { status: 400 })
    }

    // Activate the Shield by setting isActive
    const updatedInventory = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        quantity: { decrement: 1 },
        isActive: true,
        expiresAt: null // Shield doesn't expire, it's consumed on first use
      },
      include: {
        item: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Shield activated! Your next wrong answer won\'t cost a heart.',
      remainingShields: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating shield:', error)
    return NextResponse.json({
      error: 'Failed to activate shield',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
