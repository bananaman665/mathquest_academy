import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId } = await request.json()

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 })
    }

    // Find the inventory item
    const inventoryItem = await prisma.userInventory.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId
        }
      },
      include: {
        item: true
      }
    })

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return NextResponse.json({ 
        error: 'Item not found in inventory'
      }, { status: 404 })
    }

    // Parse the item effect
    const effect: { type?: string } | null = inventoryItem.item.effect ? JSON.parse(inventoryItem.item.effect) : null

    // Apply the effect based on item type
    let result: {
      message: string
      effect: string
      expiresAt?: Date
      equipped?: boolean
    } = {
      message: '',
      effect: ''
    }

    switch (effect?.type) {
      case 'hearts':
        // Extra Hearts - will be consumed when used in a lesson
        result = { message: 'Hearts will be refilled in your next lesson!', effect: 'hearts' }
        break

      case 'streak-freeze':
        // Streak Freeze - activate for 1 day
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 1)
        
        await prisma.userInventory.update({
          where: {
            userId_itemId: {
              userId,
              itemId
            }
          },
          data: {
            isActive: true,
            expiresAt,
            quantity: { decrement: 1 }
          }
        })
        
        result = { message: 'Streak Freeze activated for 24 hours!', effect: 'streak-freeze', expiresAt }
        break

      case 'xp-boost':
        // XP Boost - activate for 1 hour
        const boostExpires = new Date()
        boostExpires.setHours(boostExpires.getHours() + 1)
        
        await prisma.userInventory.update({
          where: {
            userId_itemId: {
              userId,
              itemId
            }
          },
          data: {
            isActive: true,
            expiresAt: boostExpires,
            quantity: { decrement: 1 }
          }
        })
        
        result = { message: '2x XP Boost activated for 1 hour!', effect: 'xp-boost', expiresAt: boostExpires }
        break

      case 'hints':
        // Hint Pack - just decrement quantity (hints available in lessons)
        await prisma.userInventory.update({
          where: {
            userId_itemId: {
              userId,
              itemId
            }
          },
          data: {
            quantity: { decrement: 1 }
          }
        })
        
        result = { message: 'Hint pack ready! Use hints in your lessons.', effect: 'hints' }
        break

      case 'cosmetic':
        // Cosmetics - toggle active state (equip/unequip)
        await prisma.userInventory.update({
          where: {
            userId_itemId: {
              userId,
              itemId
            }
          },
          data: {
            isActive: !inventoryItem.isActive
          }
        })
        
        result = { 
          message: inventoryItem.isActive ? 'Item unequipped' : 'Item equipped!',
          effect: 'cosmetic',
          equipped: !inventoryItem.isActive
        }
        break

      default:
        return NextResponse.json({ 
          error: 'Unknown item type'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Use item error:', error)
    return NextResponse.json({ 
      error: 'Failed to use item'
    }, { status: 500 })
  }
}
