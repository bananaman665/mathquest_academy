import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Time Warp item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'time-warp'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Time Warp available',
        message: 'You do not have any Time Warp items in your inventory.'
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

    // Parse the effect to get seconds
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { seconds: 30 }
    const secondsToAdd = effect.seconds || 30

    return NextResponse.json({
      success: true,
      message: `Time Warp used! +${secondsToAdd} seconds added.`,
      secondsAdded: secondsToAdd,
      remainingTimeWarps: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error using Time Warp:', error)
    return NextResponse.json({
      error: 'Failed to use Time Warp',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
