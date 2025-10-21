import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, itemPrice, itemName } = await request.json()

    if (!itemId || !itemPrice || !itemName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get user's current XP
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalXP: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has enough XP
    if (user.totalXP < itemPrice) {
      return NextResponse.json({ 
        error: 'Insufficient XP',
        message: `You need ${itemPrice - user.totalXP} more XP to purchase this item.`
      }, { status: 400 })
    }

    // Check if item already exists in inventory (for stackable items)
    const existingInventoryItem = await prisma.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId
        }
      }
    })

    // Perform the purchase in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct XP from user
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { totalXP: { decrement: itemPrice } },
        select: { totalXP: true }
      })

      // Add or update inventory item
      let inventoryItem
      if (existingInventoryItem) {
        // Update quantity for stackable items (power-ups)
        inventoryItem = await tx.userInventory.update({
          where: {
            userId_itemId: {
              userId,
              itemId
            }
          },
          data: { quantity: { increment: 1 } }
        })
      } else {
        // Create new inventory item
        inventoryItem = await tx.userInventory.create({
          data: {
            userId,
            itemId,
            quantity: 1
          }
        })
      }

      return { updatedUser, inventoryItem }
    })

    return NextResponse.json({
      success: true,
      message: `Successfully purchased ${itemName}!`,
      newBalance: result.updatedUser.totalXP,
      inventoryItem: result.inventoryItem
    })

  } catch (error) {
    console.error('Purchase error:', error)
    return NextResponse.json({ 
      error: 'Purchase failed',
      message: 'An error occurred while processing your purchase. Please try again.'
    }, { status: 500 })
  }
}
