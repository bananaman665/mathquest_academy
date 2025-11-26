import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the active Shield
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'shield'
        },
        isActive: true
      }
    })

    if (!inventoryItem) {
      return NextResponse.json({
        error: 'No active shield',
        message: 'You do not have an active shield.'
      }, { status: 400 })
    }

    // Deactivate the shield
    await prisma.userInventory.update({
      where: {
        id: inventoryItem.id
      },
      data: {
        isActive: false
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Shield consumed! You were protected from losing a heart.'
    })

  } catch (error) {
    console.error('Error deactivating shield:', error)
    return NextResponse.json({
      error: 'Failed to deactivate shield',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
