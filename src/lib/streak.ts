import { prisma } from './prisma'

/**
 * Updates user streak based on their last active date
 * Returns the updated user with new streak information
 */
export async function updateUserStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    throw new Error('User not found')
  }

  const now = new Date()
  const lastActive = new Date(user.lastActiveAt)
  
  // Reset time to midnight for accurate day comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate())
  
  // Calculate days difference
  const daysDiff = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24))
  
  let newStreak = user.streak
  let newLongestStreak = user.longestStreak

  if (daysDiff === 0) {
    // Same day - no change to streak
    return user
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    newStreak = user.streak + 1
    newLongestStreak = Math.max(newLongestStreak, newStreak)
  } else {
    // Missed a day - reset streak to 1
    newStreak = 1
  }

  // Update user with new streak and last active date
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      streak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveAt: now,
      updatedAt: now
    }
  })

  return updatedUser
}

/**
 * Check if user's streak is still valid (hasn't expired)
 * If more than 1 day has passed, streak should be reset
 */
export async function checkStreakExpiration(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    return null
  }

  const now = new Date()
  const lastActive = new Date(user.lastActiveAt)
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const lastActiveDay = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate())
  
  const daysDiff = Math.floor((today.getTime() - lastActiveDay.getTime()) / (1000 * 60 * 60 * 24))

  // If more than 1 day has passed, reset streak to 0
  if (daysDiff > 1 && user.streak > 0) {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streak: 0,
        updatedAt: now
      }
    })
    return updatedUser
  }

  return user
}
