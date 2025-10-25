import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Hint Pack item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'hint-pack'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'No Hint Pack available',
        message: 'You do not have any Hint Packs in your inventory.'
      }, { status: 400 })
    }

    // Parse the effect to get hint value
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { value: 5 }
    const hintsToAdd = effect.value || 5

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

    // Add hints to user's inventory (as a consumable resource)
    await prisma.userInventory.upsert({
      where: {
        userId_itemId: {
          userId,
          itemId: 'hints-available'
        }
      },
      create: {
        userId,
        itemId: 'hints-available',
        quantity: hintsToAdd
      },
      update: {
        quantity: { increment: hintsToAdd }
      }
    })

    return NextResponse.json({
      success: true,
      message: `Activated Hint Pack! ${hintsToAdd} hints added to your inventory.`,
      hintsAdded: hintsToAdd,
      remainingPacks: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating hint pack:', error)
    return NextResponse.json({ 
      error: 'Failed to activate hint pack',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
