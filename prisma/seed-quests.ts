import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎯 Starting quest seeding...')

  // Define daily quests
  const quests = [
    {
      id: 'daily-earn-10-xp',
      name: 'Earn 10 XP',
      description: 'Complete lessons to earn experience',
      questType: 'DAILY' as const,
      requirement: JSON.stringify({ type: 'xp', value: 10 }),
      reward: 10,
      icon: '⚡',
      orderIndex: 1,
      isActive: true,
    },
    {
      id: 'daily-complete-1-lesson',
      name: 'Complete 1 Lesson',
      description: 'Finish any lesson today',
      questType: 'DAILY' as const,
      requirement: JSON.stringify({ type: 'lessons', value: 1 }),
      reward: 5,
      icon: '📚',
      orderIndex: 2,
      isActive: true,
    },
    {
      id: 'daily-perfect-score',
      name: 'Perfect Score',
      description: 'Get all answers correct in one lesson',
      questType: 'DAILY' as const,
      requirement: JSON.stringify({ type: 'perfect', value: 1 }),
      reward: 15,
      icon: '⭐',
      orderIndex: 3,
      isActive: true,
    },
  ]

  // Upsert quests
  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { id: quest.id },
      update: quest,
      create: quest,
    })
    console.log(`✅ Created/Updated quest: ${quest.name}`)
  }

  console.log('🎉 Quest seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding quests:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
