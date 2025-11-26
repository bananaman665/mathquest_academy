import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedShopItems() {
  const shopItems = [
    // Original Power-ups
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
      description: 'Protect your streak for 1 day if you miss',
      price: 100,
      icon: 'Snowflake',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'streak-freeze', duration: 1 })
    },
    {
      id: 'xp-boost',
      name: 'XP Boost',
      description: 'Double XP for 1 hour!',
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
    // New Power-ups
    {
      id: 'freebie',
      name: 'Freebie',
      description: 'Auto-solve one difficult question',
      price: 200,
      icon: 'Gift',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'freebie', value: 1 })
    },
    {
      id: 'time-warp',
      name: 'Time Warp',
      description: 'Add 30 seconds to timed challenges',
      price: 125,
      icon: 'Clock',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'time-warp', seconds: 30 })
    },
    {
      id: 'lucky-charm',
      name: 'Lucky Charm',
      description: 'Increase gem drops by 50% for 1 hour',
      price: 175,
      icon: 'Sparkles',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'gem-boost', multiplier: 1.5, duration: 3600 })
    },
    {
      id: 'shield',
      name: 'Shield',
      description: 'One wrong answer won\'t cost a heart',
      price: 90,
      icon: 'Shield',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'shield', uses: 1 })
    },
    {
      id: 'combo-master',
      name: 'Combo Master',
      description: 'Start with a 3x combo multiplier',
      price: 250,
      icon: 'Flame',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'combo-boost', multiplier: 3 })
    },
    {
      id: 'skip-token',
      name: 'Skip Token',
      description: 'Skip one question without penalty',
      price: 80,
      icon: 'FastForward',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'skip', uses: 1 })
    },
    {
      id: 'mega-brain',
      name: 'Mega Brain',
      description: 'See 2 wrong answers eliminated',
      price: 110,
      icon: 'Brain',
      category: 'power-ups',
      effect: JSON.stringify({ type: 'eliminate-answers', count: 2 })
    },
    // Cosmetics
    {
      id: 'golden-trophy',
      name: 'Golden Trophy',
      description: 'Show off your achievements!',
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
