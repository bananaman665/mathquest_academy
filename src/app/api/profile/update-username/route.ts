import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { username } = await req.json()

    if (!username || username.trim().length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters' },
        { status: 400 }
      )
    }

    // Check if username is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: username.trim(),
        NOT: { id: userId }
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 400 }
      )
    }

    // Update in database
    await prisma.user.update({
      where: { id: userId },
      data: { username: username.trim() }
    })

    // Update in Clerk
    const client = await clerkClient()
    await client.users.updateUser(userId, {
      username: username.trim()
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating username:', error)
    return NextResponse.json(
      { error: 'Failed to update username' },
      { status: 500 }
    )
  }
}
