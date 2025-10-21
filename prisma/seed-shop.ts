import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedShopItems() {
  const shopItems = [
    {
      id: 'extra-hearts',
      name: 'Extra Hearts',
      description: 'Refill your hearts to keep learning',
      price: 50,
      icon: 'Heart',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'hearts', value: 5 })
    },
    {
      id: 'streak-freeze',
      name: 'Streak Freeze',
      description: 'Protect your streak for 1 day',
      price: 100,
      icon: 'Snowflake',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'streak-freeze', duration: 1 })
    },
    {
      id: 'xp-boost',
      name: 'XP Boost',
      description: 'Double XP for 1 hour',
      price: 150,
      icon: 'Zap',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'xp-boost', multiplier: 2, duration: 3600 })
    },
    {
      id: 'hint-pack',
      name: 'Hint Pack',
      description: 'Get 5 hints for tough questions',
      price: 75,
      icon: 'Lightbulb',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'hints', value: 5 })
    },
    {
      id: 'golden-trophy',
      name: 'Golden Trophy',
      description: 'Show off your achievements',
      price: 500,
      icon: 'Trophy',
      category: 'cosmetics',
      effect: JSON.stringify({ type: 'cosmetic', item: 'golden-trophy' })
    },
    {
      id: 'rainbow-theme',
      name: 'Rainbow Theme',
      description: 'Colorful interface theme',
      price: 300,
      icon: 'Palette',
      category: 'cosmetics',
      effect: JSON.stringify({ type: 'theme', name: 'rainbow' })
    },
  ]

  for (const item of shopItems) {
    await prisma.shopItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    })
  }

  console.log('✅ Shop items seeded successfully!')
}

seedShopItems()
  .catch((e) => {
    console.error('Error seeding shop items:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
