import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Freebie item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'freebie'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Freebie available',
        message: 'You do not have any Freebie items in your inventory.'
      }, { status: 400 })
    }

    // Decrement the quantity
    const updatedInventory = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        quantity: { decrement: 1 }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Freebie used! This question is automatically solved.',
      remainingFreebies: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error using freebie:', error)
    return NextResponse.json({
      error: 'Failed to use freebie',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
