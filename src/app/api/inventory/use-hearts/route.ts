import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Extra Hearts item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'extra-hearts'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'No Extra Hearts available',
        message: 'You do not have any Extra Hearts in your inventory.'
      }, { status: 400 })
    }

    // Decrement the quantity
    const updatedInventory = await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        quantity: { decrement: 1 }
      },
      include: {
        item: true
      }
    })

    // Parse the effect to get hearts value
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { value: 5 }
    const heartsToAdd = effect.value || 5

    return NextResponse.json({
      success: true,
      message: `Used Extra Hearts! Restoring ${heartsToAdd} hearts.`,
      heartsAdded: heartsToAdd,
      remainingHearts: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error using hearts:', error)
    return NextResponse.json({ 
      error: 'Failed to use hearts',
      message: 'An error occurred while using your Extra Hearts. Please try again.'
    }, { status: 500 })
  }
}
