import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Update password in Clerk
    const client = await clerkClient()
    
    try {
      await client.users.updateUser(userId, {
        password: newPassword
      })

      return NextResponse.json({ success: true })
    } catch (clerkError: any) {
      console.error('Clerk error:', clerkError)
      return NextResponse.json(
        { error: 'Failed to update password. Please check your current password.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error updating password:', error)
    return NextResponse.json(
      { error: 'Failed to update password' },
      { status: 500 }
    )
  }
}
