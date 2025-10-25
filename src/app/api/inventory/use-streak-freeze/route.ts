import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Find the Streak Freeze item in user's inventory
    const inventoryItem = await prisma.userInventory.findFirst({
      where: {
        userId,
        item: {
          id: 'streak-freeze'
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'No Streak Freeze available',
        message: 'You do not have any Streak Freeze items in your inventory.'
      }, { status: 400 })
    }

    // Parse the effect to get duration
    const effect = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : { duration: 1 }
    const durationDays = effect.duration || 1

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

    // Update user's streak protection - set an expiration date
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + durationDays)

    // Store streak freeze in a way that we can check it (we'll add a field to User model if needed)
    // For now, we'll use metadata or store it in the inventory item's expiresAt field
    await prisma.userInventory.create({
      data: {
        userId,
        itemId: 'streak-freeze-active', // Virtual item to track active freeze
        quantity: 1,
        isActive: true,
        expiresAt: expirationDate
      }
    })

    return NextResponse.json({
      success: true,
      message: `Streak Freeze activated for ${durationDays} day(s)!`,
      expiresAt: expirationDate,
      remainingFreezes: updatedInventory.quantity
    })

  } catch (error) {
    console.error('Error activating streak freeze:', error)
    return NextResponse.json({ 
      error: 'Failed to activate streak freeze',
      message: 'An error occurred. Please try again.'
    }, { status: 500 })
  }
}
