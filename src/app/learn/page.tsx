import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle, Star, Trophy, Sparkles, Target, ShoppingBag, User, MoreHorizontal, Home, Flame, Gem, Heart } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { PrismaClient } from '@prisma/client'
import BottomNav from '@/components/BottomNav'
import { checkStreakExpiration } from '@/lib/streak'

const prisma = new PrismaClient()

// Type definitions
type Level = {
  id: number;
  title: string;
  xp: number;
  status?: 'locked' | 'current' | 'completed';
}

// Level definitions
const units = [
  {
    id: 1,
    title: "Number Basics",
    description: "Learn to recognize and count numbers 1-10",
    theme: "mountain", // 🏔️
    color: "from-blue-400 to-blue-600",
    levels: [
      { id: 1, title: "Numbers 1-5", xp: 100 },
      { id: 2, title: "Numbers 6-10", xp: 100 },
      { id: 3, title: "Counting Practice", xp: 100 },
      { id: 4, title: "Number Matching", xp: 100 },
      { id: 5, title: "Review & Master", xp: 150 },
    ]
  },
  {
    id: 2,
    title: "Addition Adventures",
    description: "Master adding numbers together",
    theme: "ocean", // 🌊
    color: "from-cyan-400 to-blue-600",
    levels: [
      { id: 6, title: "Adding to 5", xp: 100 },
      { id: 7, title: "Adding to 10", xp: 100 },
      { id: 8, title: "Addition Facts", xp: 100 },
      { id: 9, title: "Word Problems", xp: 150 },
      { id: 10, title: "Addition Master", xp: 200 },
    ]
  },
  {
    id: 3,
    title: "Subtraction Station",
    description: "Learn to subtract and find differences",
    theme: "forest", // 🌲
    color: "from-green-400 to-emerald-600",
    levels: [
      { id: 11, title: "Taking Away", xp: 100 },
      { id: 12, title: "Subtract to 10", xp: 100 },
      { id: 13, title: "Subtraction Facts", xp: 100 },
      { id: 14, title: "Missing Numbers", xp: 150 },
      { id: 15, title: "Subtraction Master", xp: 200 },
    ]
  },
  {
    id: 4,
    title: "Multiplication Magic",
    description: "Discover the power of multiplication",
    theme: "stars", // ⭐
    color: "from-purple-400 to-pink-600",
    levels: [
      { id: 16, title: "Groups of 2", xp: 150 },
      { id: 17, title: "Times Tables 1-5", xp: 150 },
      { id: 18, title: "Times Tables 6-10", xp: 150 },
      { id: 19, title: "Multiply in Action", xp: 200 },
      { id: 20, title: "Multiplication Pro", xp: 250 },
    ]
  },
  {
    id: 5,
    title: "Division Discovery",
    description: "Learn to divide and share equally",
    theme: "desert", // 🏜️
    color: "from-orange-400 to-red-600",
    levels: [
      { id: 21, title: "Sharing Equally", xp: 150 },
      { id: 22, title: "Divide by 2", xp: 150 },
      { id: 23, title: "Division Facts", xp: 150 },
      { id: 24, title: "Remainders", xp: 200 },
      { id: 25, title: "Division Champion", xp: 250 },
    ]
  },
  {
    id: 6,
    title: "Fraction Fun",
    description: "Explore parts of a whole",
    theme: "candy", // 🍬
    color: "from-pink-400 to-rose-600",
    levels: [
      { id: 26, title: "Half & Quarter", xp: 150 },
      { id: 27, title: "Common Fractions", xp: 150 },
      { id: 28, title: "Comparing Fractions", xp: 200 },
      { id: 29, title: "Adding Fractions", xp: 200 },
      { id: 30, title: "Fraction Master", xp: 300 },
    ]
  },
  {
    id: 7,
    title: "Decimal Dimension",
    description: "Master numbers with decimal points",
    theme: "space", // 🚀
    color: "from-indigo-400 to-blue-700",
    levels: [
      { id: 31, title: "Tenths", xp: 150 },
      { id: 32, title: "Hundredths", xp: 150 },
      { id: 33, title: "Decimal Operations", xp: 200 },
      { id: 34, title: "Money Math", xp: 200 },
      { id: 35, title: "Decimal Expert", xp: 300 },
    ]
  },
  {
    id: 8,
    title: "Geometry Garden",
    description: "Explore shapes and patterns",
    theme: "garden", // 🌺
    color: "from-emerald-400 to-teal-600",
    levels: [
      { id: 36, title: "2D Shapes", xp: 150 },
      { id: 37, title: "3D Shapes", xp: 150 },
      { id: 38, title: "Perimeter", xp: 200 },
      { id: 39, title: "Area", xp: 200 },
      { id: 40, title: "Geometry Genius", xp: 300 },
    ]
  },
  {
    id: 9,
    title: "Measurement Mission",
    description: "Learn to measure length, weight, and time",
    theme: "tools", // 🔧
    color: "from-yellow-400 to-amber-600",
    levels: [
      { id: 41, title: "Length & Distance", xp: 150 },
      { id: 42, title: "Weight & Mass", xp: 150 },
      { id: 43, title: "Time Telling", xp: 200 },
      { id: 44, title: "Temperature", xp: 200 },
      { id: 45, title: "Measurement Master", xp: 300 },
    ]
  },
  {
    id: 10,
    title: "Problem Solving Palace",
    description: "Apply math skills to real-world challenges",
    theme: "castle", // 🏰
    color: "from-violet-400 to-purple-700",
    levels: [
      { id: 46, title: "Word Problems", xp: 200 },
      { id: 47, title: "Logic Puzzles", xp: 200 },
      { id: 48, title: "Patterns", xp: 200 },
      { id: 49, title: "Data & Graphs", xp: 250 },
      { id: 50, title: "Math Champion", xp: 500 },
    ]
  }
]

// Helper function to determine level status based on user's current level
function getLevelStatus(levelId: number, userCurrentLevel: number, completedLevels: number[]) {
  if (completedLevels.includes(levelId)) {
    return 'completed'
  } else if (levelId === userCurrentLevel) {
    return 'current'
  } else if (levelId < userCurrentLevel) {
    return 'completed' // Past levels should be marked as completed
  } else {
    return 'locked'
  }
}

// Helper function to determine if level is a special challenge (Duolingo-style)
// Pattern: Every 4th level is special (3 normal + 1 special, repeating)
function getSpecialLevelType(levelId: number): { isSpecial: boolean; type: string; emoji: string; color: string } | null {
  // Only every 4th level is special
  if (levelId % 4 === 0) {
    // Cycle through different special modes for variety
    const cyclePosition = Math.floor(levelId / 4) % 4
    
    switch (cyclePosition) {
      case 0:
        return { isSpecial: true, type: 'Speed Round', emoji: '⚡', color: 'from-yellow-400 to-orange-500' }
      case 1:
        return { isSpecial: true, type: 'Lightning', emoji: '⚡', color: 'from-blue-400 to-purple-500' }
      case 2:
        return { isSpecial: true, type: 'Perfect Streak', emoji: '🔥', color: 'from-orange-400 to-red-500' }
      case 3:
        return { isSpecial: true, type: 'Boss Battle', emoji: '👹', color: 'from-red-500 to-purple-600' }
      default:
        return { isSpecial: true, type: 'Speed Round', emoji: '⚡', color: 'from-yellow-400 to-orange-500' }
    }
  }
  
  // Levels 1, 2, 3, 5, 6, 7, 9, 10, 11, etc. are normal
  return null
}

function LevelTile({ level, position }: { level: Level, position: 'left' | 'center' | 'right' }) {
  const positionClasses = {
    left: 'md:ml-4',
    center: 'mx-auto',
    right: 'md:mr-4 md:ml-auto mx-auto'
  }

  const statusConfig = {
    completed: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      borderColor: 'border-green-600',
      clickable: true,
      opacity: 'opacity-100',
      animate: false
    },
    current: {
      icon: Star,
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      textColor: 'text-white',
      borderColor: 'border-yellow-500',
      clickable: true,
      opacity: 'opacity-100',
      animate: true
    },
    locked: {
      icon: Lock,
      bgColor: 'bg-gray-300',
      textColor: 'text-gray-500',
      borderColor: 'border-gray-400',
      clickable: false,
      opacity: 'opacity-60',
      animate: false
    }
  }

  const config = statusConfig[level.status as keyof typeof statusConfig] || statusConfig.locked
  const Icon = config?.icon || Lock
  
  // Check if this is a special challenge level
  const specialLevel = getSpecialLevelType(level.id)

  return (
    <div className={`w-full max-w-xs ${positionClasses[position]} mb-6 sm:mb-8`}>
      {config.clickable ? (
        <Link
          href={`/learn/level/${level.id}`}
          className={`
            block relative
            ${specialLevel ? `bg-gradient-to-br ${specialLevel.color}` : config.bgColor}
            ${config.opacity}
            rounded-xl sm:rounded-2xl p-4 sm:p-6
            border-3 sm:border-4 ${specialLevel ? 'border-yellow-400' : config.borderColor}
            shadow-lg sm:shadow-xl
            transform transition-all duration-300 ease-in-out
            hover:scale-105 sm:hover:scale-110 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1
            active:scale-95
            ${config.animate || specialLevel ? 'animate-pulse' : ''}
          `}
        >
          {/* Special Challenge Badge */}
          {specialLevel && (
            <div className="absolute -top-3 -right-3 bg-white text-purple-600 text-xs font-black px-3 py-1.5 rounded-full shadow-lg border-2 border-yellow-400 animate-bounce flex items-center gap-1">
              <span>{specialLevel.emoji}</span>
              <span>{specialLevel.type}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-2">
            <span className={`text-base sm:text-lg font-bold ${config.textColor}`}>
              Level {level.id}
            </span>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.textColor} transition-transform duration-300 group-hover:rotate-12`} />
          </div>
          <h3 className={`text-lg sm:text-xl font-bold ${config.textColor} mb-1`}>
            {level.title}
          </h3>
          <p className={`text-xs sm:text-sm ${config.textColor} opacity-90`}>
            {level.xp} XP
          </p>
          {config.animate && !specialLevel && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
              START HERE
            </div>
          )}
        </Link>
      ) : (
        <div className={`
          block relative
          ${config.bgColor}
          ${config.opacity}
          rounded-xl sm:rounded-2xl p-4 sm:p-6
          border-3 sm:border-4 ${config.borderColor}
          shadow-lg
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-base sm:text-lg font-bold ${config.textColor}`}>
              Level {level.id}
            </span>
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.textColor}`} />
          </div>
          <h3 className={`text-lg sm:text-xl font-bold ${config.textColor} mb-1`}>
            {level.title}
          </h3>
          <p className={`text-xs sm:text-sm ${config.textColor}`}>
            {level.xp} XP
          </p>
        </div>
      )}
      
      {/* Connection Line to Next Level - Hidden on mobile, visible md+ */}
      <div className="hidden md:flex justify-center mt-4">
        <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  )
}

export default async function LearnPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

  // Get or create user progress
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        currentLevel: 1,
        totalXP: 0,
      }
    })
  }

  // Check and update streak expiration
  const updatedUser = await checkStreakExpiration(user.id)
  if (updatedUser) {
    dbUser = updatedUser
  }

  // For now, we'll consider levels < currentLevel as completed
  // Later we can add a CompletedLevels model for more granular tracking
  const completedLevels = Array.from({ length: dbUser.currentLevel - 1 }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* Bottom Navigation - Mobile Only */}
      <BottomNav currentPage="learn" />
      
      {/* Left Sidebar - Always visible, scales down on mobile */}
      <aside className="hidden md:flex w-40 lg:w-64 bg-white border-r border-gray-200 fixed h-full flex-col text-xs lg:text-base">
        {/* Logo */}
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-green-600">MathQuest</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <Link
            href="/learn"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all duration-200 hover:scale-105"
          >
            <Home className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>LEARN</span>
          </Link>

          <Link
            href="/leaderboards"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all duration-200 hover:scale-105 hover:translate-x-1"
          >
            <Trophy className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>LEADERBOARDS</span>
          </Link>

          <Link
            href="/quests"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all duration-200 hover:scale-105 hover:translate-x-1"
          >
            <Target className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>QUESTS</span>
          </Link>

          <Link
            href="/shop"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all duration-200 hover:scale-105 hover:translate-x-1"
          >
            <ShoppingBag className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>SHOP</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all duration-200 hover:scale-105 hover:translate-x-1"
          >
            <User className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>PROFILE</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all duration-200 hover:scale-105 hover:translate-x-1"
          >
            <MoreHorizontal className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
            <span>MORE</span>
          </Link>
        </nav>

        {/* Bottom Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user.firstName || 'Student'}</p>
              <p className="text-xs text-gray-500">Level {dbUser.currentLevel}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content - Responsive margin */}
      <div className="flex-1 md:ml-40 lg:ml-64 ml-0 w-full overflow-x-hidden">
        {/* Top Header - Responsive padding for mobile menu button */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 px-3 sm:px-4 py-2 rounded-xl border border-orange-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600 animate-pulse" />
                  <span className="font-bold text-orange-600 text-sm sm:text-base">{dbUser.streak || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 px-3 sm:px-4 py-2 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Gem className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 animate-bounce" />
                  <span className="font-bold text-blue-600 text-sm sm:text-base">{dbUser.totalXP || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-red-50 px-3 sm:px-4 py-2 rounded-xl border border-red-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 fill-red-600 animate-pulse" />
                  <span className="font-bold text-red-600 text-sm sm:text-base">5</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Learning Path Content - Responsive padding with bottom space for mobile nav */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
          {/* Welcome Banner - Responsive */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">Welcome, {user.firstName}!</h2>
            </div>
            <p className="text-gray-700 text-base sm:text-lg mb-4 sm:mb-6">
              Start your math adventure by completing Level 1!
            </p>
            
            {/* Placement Test Button - Only show if user is at level 1 */}
            {dbUser.currentLevel === 1 && (
              <Link
                href="/placement-test"
                className="inline-flex items-center gap-2 sm:gap-3 bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400 text-gray-900 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-sm text-sm sm:text-base"
              >
                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                <div>
                  <div>Take Placement Test</div>
                  <div className="text-xs sm:text-sm text-gray-600">(Find your perfect level)</div>
                </div>
              </Link>
            )}
          </div>

        {/* Units and Levels */}
        {units.map((unit) => (
          <div key={unit.id} className="mb-12 sm:mb-16">
            {/* Unit Header */}
            <div className={`bg-gradient-to-r ${unit.color} rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white mb-6 sm:mb-8 shadow-xl`}>
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 truncate">Unit {unit.id}: {unit.title}</h2>
                  <p className="text-white/90 text-sm sm:text-base line-clamp-2">{unit.description}</p>
                </div>
                <div className="text-3xl sm:text-4xl md:text-5xl opacity-50 flex-shrink-0">
                  {unit.theme === 'mountain' && '🏔️'}
                  {unit.theme === 'ocean' && '🌊'}
                  {unit.theme === 'forest' && '🌲'}
                </div>
              </div>
            </div>

            {/* Levels Path */}
            <div className="relative">
              {/* Vertical connecting line - hidden on mobile, shown on larger screens */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 -z-10"></div>
              
              {unit.levels.map((level, index) => {
                // Zigzag pattern: left, center, right, center, left...
                const positions: ('left' | 'center' | 'right')[] = ['center', 'left', 'right', 'center', 'left']
                const position = positions[index % positions.length]
                
                // Determine level status based on user progress
                const status = getLevelStatus(level.id, dbUser.currentLevel, completedLevels)
                
                return (
                  <LevelTile
                    key={level.id}
                    level={{ ...level, status }}
                    position={position}
                  />
                )
              })}
            </div>
          </div>
        ))}

        {/* Coming Soon */}
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
          <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">🚀</div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 px-4">More Units Coming Soon!</h3>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Complete the units above to unlock new adventures
          </p>
        </div>
        </main>
      </div>
    </div>
  )
}
