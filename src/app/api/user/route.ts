import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { withErrorHandling, apiSuccess, AuthenticationError, NotFoundError } from '@/lib/errors'

export const GET = withErrorHandling(async () => {
  const { userId } = await auth()

  if (!userId) {
    throw new AuthenticationError()
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      totalXP: true,
      currentLevel: true,
      streak: true,
      longestStreak: true,
      isPremium: true,
      createdAt: true,
    }
  })

  if (!user) {
    throw new NotFoundError('User not found')
  }

  return apiSuccess(user)
})
