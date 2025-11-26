import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Mega Brain item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'mega-brain'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({
        error: 'No Mega Brain available',
        message: 'You do not have any Mega Brain items in your inventory.'
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

    // Parse the effect to get count
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { count: 2 }
    const eliminateCount = effect.count || 2

    return NextResponse.json({
      success: true,
      message: `Mega Brain used! ${eliminateCount} wrong answers eliminated.`,
      eliminateCount,
      remainingMegaBrains: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error using Mega Brain:', error)
    return NextResponse.json({
      error: 'Failed to use Mega Brain',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
