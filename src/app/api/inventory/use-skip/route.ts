import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Skip Token item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'skip-token'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Skip Token available',
        message: 'You do not have any Skip Tokens in your inventory.'
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
      message: 'Skip Token used! Moving to the next question.',
      remainingSkips: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error using skip token:', error)
    return NextResponse.json({
      error: 'Failed to use skip token',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
