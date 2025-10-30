import { PrismaClient, AchievementCategory } from '@prisma/client'

const prisma = new PrismaClient()

async function seedAchievements() {
  const achievements = [
    // Progress Achievements
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Answer your first question',
      icon: 'Star',
      category: AchievementCategory.PROGRESS,
      requirement: JSON.stringify({ type: 'questions', operator: '>=', value: 1 }),
      xpReward: 10
    },
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Answer 10 questions correctly',
      icon: 'Target',
      category: AchievementCategory.PROGRESS,
      requirement: JSON.stringify({ type: 'correct_answers', operator: '>=', value: 10 }),
      xpReward: 25
    },
    {
      id: 'level-up',
      name: 'Level Up!',
      description: 'Reach level 5',
      icon: 'TrendingUp',
      category: AchievementCategory.PROGRESS,
      requirement: JSON.stringify({ type: 'level', operator: '>=', value: 5 }),
      xpReward: 50
    },
    {
      id: 'math-master',
      name: 'Math Master',
      description: 'Reach level 10',
      icon: 'Crown',
      category: AchievementCategory.PROGRESS,
      requirement: JSON.stringify({ type: 'level', operator: '>=', value: 10 }),
      xpReward: 100
    },

    // Skill Achievements
    {
      id: 'accuracy-expert',
      name: 'Accuracy Expert',
      description: 'Get 50 correct answers',
      icon: 'CheckCircle',
      category: AchievementCategory.SKILL,
      requirement: JSON.stringify({ type: 'correct_answers', operator: '>=', value: 50 }),
      xpReward: 75
    },
    {
      id: 'century-club',
      name: 'Century Club',
      description: 'Answer 100 questions',
      icon: 'Award',
      category: AchievementCategory.SKILL,
      requirement: JSON.stringify({ type: 'questions', operator: '>=', value: 100 }),
      xpReward: 150
    },
    {
      id: 'perfect-score',
      name: 'Perfect Score',
      description: 'Get 90% accuracy on 20 questions',
      icon: 'Trophy',
      category: AchievementCategory.SKILL,
      requirement: JSON.stringify({ type: 'correct_answers', operator: '>=', value: 18 }), // Assuming they answered 20
      xpReward: 200
    },

    // Streak Achievements
    {
      id: 'on-fire',
      name: 'On Fire!',
      description: 'Maintain a 5-day streak',
      icon: 'Flame',
      category: AchievementCategory.STREAK,
      requirement: JSON.stringify({ type: 'streak', operator: '>=', value: 5 }),
      xpReward: 30
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      description: 'Maintain a 10-day streak',
      icon: 'Zap',
      category: AchievementCategory.STREAK,
      requirement: JSON.stringify({ type: 'streak', operator: '>=', value: 10 }),
      xpReward: 75
    },
    {
      id: 'unstoppable',
      name: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: 'Rocket',
      category: AchievementCategory.STREAK,
      requirement: JSON.stringify({ type: 'streak', operator: '>=', value: 30 }),
      xpReward: 300
    },
    {
      id: 'legendary-streak',
      name: 'Legendary Streak',
      description: 'Set a personal best streak of 50 days',
      icon: 'Crown',
      category: AchievementCategory.STREAK,
      requirement: JSON.stringify({ type: 'longest_streak', operator: '>=', value: 50 }),
      xpReward: 500
    },

    // Special Achievements
    {
      id: 'early-bird',
      name: 'Early Bird',
      description: 'Complete 3 lessons before 8 AM',
      icon: 'Sun',
      category: AchievementCategory.SPECIAL,
      requirement: JSON.stringify({ type: 'xp', operator: '>=', value: 1000 }), // Placeholder - would need time-based logic
      xpReward: 50
    },
    {
      id: 'night-owl',
      name: 'Night Owl',
      description: 'Complete lessons after midnight',
      icon: 'Moon',
      category: AchievementCategory.SPECIAL,
      requirement: JSON.stringify({ type: 'xp', operator: '>=', value: 1000 }), // Placeholder
      xpReward: 50
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete a level in under 2 minutes',
      icon: 'Timer',
      category: AchievementCategory.SPECIAL,
      requirement: JSON.stringify({ type: 'xp', operator: '>=', value: 1000 }), // Placeholder
      xpReward: 75
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Complete 5 levels with 100% accuracy',
      icon: 'Star',
      category: AchievementCategory.SPECIAL,
      requirement: JSON.stringify({ type: 'correct_answers', operator: '>=', value: 100 }),
      xpReward: 250
    }
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: achievement,
      create: achievement,
    })
  }

  console.log('✅ Achievements seeded successfully!')
}

seedAchievements()
  .catch((e) => {
    console.error('Error seeding achievements:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })