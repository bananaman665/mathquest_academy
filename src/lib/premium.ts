/**
 * Premium/Paywall utilities
 */

// Free levels: 1-25
export const FREE_LEVELS = 25

/**
 * Check if a level requires premium access
 */
export function isPremiumLevel(levelId: number): boolean {
  return levelId > FREE_LEVELS
}

/**
 * Check if user has premium access
 * For now, we'll check if they have a flag in the database
 */
export function hasUserPurchasedPremium(user: { isPremium?: boolean }): boolean {
  return user.isPremium === true
}

/**
 * Get the premium price
 */
export const PREMIUM_PRICE = 2.99
export const PREMIUM_PRICE_DISPLAY = '$2.99'

/**
 * Premium benefits
 */
export const PREMIUM_BENEFITS = [
  'Unlock all 50 levels',
  'Access to advanced math topics',
  'Exclusive achievements',
  'Priority support',
  'Ad-free experience',
]
