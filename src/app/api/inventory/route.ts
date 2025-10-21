import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const inventory = await prisma.userInventory.findMany({
      where: { userId },
      include: {
        item: {
          select: {
            id: true,
            name: true,
            icon: true,
            effect: true,
          }
        }
      },
      orderBy: { purchasedAt: 'desc' }
    })

    return NextResponse.json({ inventory })

  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch inventory'
    }, { status: 500 })
  }
}
