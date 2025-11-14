import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle, Star, Trophy, Sparkles, Target, ShoppingBag, User, MoreHorizontal, Home, Flame, Gem, Heart, Zap, Rocket } from 'lucide-react'
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
    title: "Bigger Numbers",
    description: "Work with two-digit numbers",
    theme: "stars", // ⭐
    color: "from-purple-400 to-pink-600",
    levels: [
      { id: 16, title: "Addition 2-Digit", xp: 150 },
      { id: 17, title: "Subtraction 2-Digit", xp: 150 },
      { id: 18, title: "Regrouping Addition", xp: 150 },
      { id: 19, title: "Regrouping Subtraction", xp: 200 },
      { id: 20, title: "Mixed 2-Digit Operations", xp: 250 },
    ]
  },
  {
    id: 5,
    title: "Multiplication Magic",
    description: "Discover the power of multiplication",
    theme: "desert", // 🏜️
    color: "from-orange-400 to-red-600",
    levels: [
      { id: 21, title: "Introduction to Multiplication", xp: 150 },
      { id: 22, title: "Times Tables 2, 5, 10", xp: 150 },
      { id: 23, title: "Times Tables 3, 4, 6", xp: 150 },
      { id: 24, title: "Times Tables 7, 8, 9", xp: 200 },
      { id: 25, title: "All Times Tables", xp: 250 },
    ]
  },
  {
    id: 6,
    title: "Division Discovery",
    description: "Learn to divide and share equally",
    theme: "candy", // 🍬
    color: "from-pink-400 to-rose-600",
    levels: [
      { id: 26, title: "Introduction to Division", xp: 150 },
      { id: 27, title: "Division by 2, 5, 10", xp: 150 },
      { id: 28, title: "Division Facts", xp: 200 },
      { id: 29, title: "Division with Remainders", xp: 200 },
      { id: 30, title: "Multiplication & Division Practice", xp: 300 },
    ]
  },
  {
    id: 7,
    title: "Review & Practice",
    description: "Master operations within 20",
    theme: "space", // 🚀
    color: "from-indigo-400 to-blue-700",
    levels: [
      { id: 31, title: "Addition 11-20", xp: 150 },
      { id: 32, title: "Subtraction 11-20", xp: 150 },
      { id: 33, title: "Mixed Operations 1-20", xp: 200 },
      { id: 34, title: "Word Problems 1-20", xp: 200 },
      { id: 35, title: "Practice 1-20", xp: 300 },
    ]
  },
  {
    id: 8,
    title: "Place Values",
    description: "Understand tens, ones, and hundreds",
    theme: "garden", // 🌺
    color: "from-emerald-400 to-teal-600",
    levels: [
      { id: 36, title: "Tens and Ones", xp: 150 },
      { id: 37, title: "Counting by 10s", xp: 150 },
      { id: 38, title: "Compare 2-Digit Numbers", xp: 200 },
      { id: 39, title: "Hundreds Place", xp: 200 },
      { id: 40, title: "Place Value Practice", xp: 300 },
    ]
  },
  {
    id: 9,
    title: "Fraction Fun",
    description: "Explore parts of a whole",
    theme: "tools", // 🔧
    color: "from-yellow-400 to-amber-600",
    levels: [
      { id: 41, title: "Introduction to Fractions", xp: 150 },
      { id: 42, title: "Comparing Fractions", xp: 150 },
      { id: 43, title: "Adding Fractions", xp: 200 },
      { id: 44, title: "Subtracting Fractions", xp: 200 },
      { id: 45, title: "Fraction Practice", xp: 300 },
    ]
  },
  {
    id: 10,
    title: "Decimals",
    description: "Master decimal numbers and operations",
    theme: "castle", // 🏰
    color: "from-violet-400 to-purple-700",
    levels: [
      { id: 46, title: "Introduction to Decimals", xp: 200 },
      { id: 47, title: "Tenths and Hundredths", xp: 200 },
      { id: 48, title: "Adding Decimals", xp: 200 },
      { id: 49, title: "Subtracting Decimals", xp: 250 },
      { id: 50, title: "Decimal Master", xp: 500 },
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
        return { isSpecial: true, type: 'Boss Battle', emoji: '', color: 'from-red-500 to-purple-600' }
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
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
      textColor: 'text-white',
      borderColor: 'border-green-600',
      clickable: true,
      opacity: 'opacity-100',
      animate: false,
      shadowColor: 'shadow-green-500/50'
    },
    current: {
      icon: Star,
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500',
      textColor: 'text-white',
      borderColor: 'border-yellow-500',
      clickable: true,
      opacity: 'opacity-100',
      animate: true,
      shadowColor: 'shadow-orange-500/50'
    },
    locked: {
      icon: Lock,
      bgColor: 'bg-gradient-to-br from-gray-200 to-gray-400',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-400',
      clickable: false,
      opacity: 'opacity-60',
      animate: false,
      shadowColor: 'shadow-gray-400/30'
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
            shadow-lg sm:shadow-xl ${config.shadowColor}
            transform transition-all duration-300 ease-in-out
            hover:scale-105 sm:hover:scale-110 hover:shadow-2xl hover:-translate-y-1
            active:scale-95
            ${config.animate || specialLevel ? 'animate-pulse' : ''}
            overflow-hidden
          `}
        >
          {/* Decorative shine effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <span className={`text-base sm:text-lg font-bold ${config.textColor}`}>
              Level {level.id}
            </span>
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${config.textColor} ${level.status === 'completed' ? 'drop-shadow-lg' : ''}`} />
          </div>
          <h3 className={`text-lg sm:text-xl font-bold ${config.textColor} mb-1 relative z-10`}>
            {level.title}
          </h3>
          <p className={`text-xs sm:text-sm ${config.textColor} opacity-90 relative z-10 flex items-center gap-1`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            {level.xp} XP
          </p>
          {level.status === 'completed' && (
            <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full z-10">
              ✓ Completed
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
            <span className="text-2xl font-black text-green-600">Mathly</span>
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
        {/* Top Header - FIXED position for always visible with safe area padding */}
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 md:left-40 lg:left-64 z-50 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-safe pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-wrap">
                <div className="flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 px-3 sm:px-4 py-2 rounded-xl border border-orange-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Flame className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600 animate-pulse" />
                  <span className="font-bold text-orange-600 text-sm sm:text-base">{dbUser.streak || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 px-3 sm:px-4 py-2 rounded-xl border border-blue-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Gem className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                  <span className="font-bold text-blue-600 text-sm sm:text-base">{dbUser.totalXP || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-red-100 to-red-50 px-3 sm:px-4 py-2 rounded-xl border border-red-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md cursor-pointer">
                  <Heart className="w-4 sm:w-5 h-4 sm:h-5 text-red-600 fill-red-600 animate-pulse" />
                  <span className="font-bold text-red-600 text-sm sm:text-base">5</span>
                </div>
              </div>
              
              {/* Profile Button */}
              <Link href="/profile" className="flex items-center gap-2 bg-gradient-to-r from-purple-100 to-purple-50 px-3 sm:px-4 py-2 rounded-xl border border-purple-200 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md">
                <User className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                <span className="hidden sm:inline font-bold text-purple-600 text-sm">Profile</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Learning Path Content - Responsive padding with bottom space for mobile nav and TOP space for fixed header + safe area */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-40 sm:pt-32 py-6 sm:py-8 pb-24 md:pb-8">
          {/* Welcome Banner - Responsive */}
          <div className="relative overflow-hidden bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-2 border-green-200 rounded-2xl p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 shadow-lg">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-500 p-2 rounded-xl shadow-md">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">Welcome, {user.firstName || 'Student'}!</h2>
              </div>
              <p className="text-gray-700 text-base sm:text-lg mb-2">
                Start your math adventure by completing Level 1!
              </p>
              {/* Level progress indicator */}
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                  <Trophy className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-bold text-gray-900">Level {dbUser.currentLevel}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-bold text-gray-900">{dbUser.totalXP} XP</span>
                </div>
              </div>
              
              {/* Placement Test Button - Only show if user is at level 1 */}
              {dbUser.currentLevel === 1 && (
                <Link
                  href="/placement-test"
                  className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 text-sm sm:text-base"
                >
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  <div>
                    <div>Take Placement Test</div>
                    <div className="text-xs sm:text-sm opacity-90">(Find your perfect level)</div>
                  </div>
                </Link>
              )}
            </div>
          </div>

        {/* Units and Levels */}
        {units.map((unit) => (
          <div key={unit.id} className="mb-12 sm:mb-16">
            {/* Unit Header */}
            <div className={`relative overflow-hidden bg-gradient-to-r ${unit.color} rounded-2xl p-6 sm:p-8 text-white mb-6 sm:mb-8 shadow-2xl border-3 border-white/30 text-center`}>
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>
              
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2 drop-shadow-lg">Unit {unit.id}: {unit.title}</h2>
                <p className="text-white/95 text-sm sm:text-base md:text-lg font-medium drop-shadow">{unit.description}</p>
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
          <div className="flex justify-center mb-3 sm:mb-4">
            <Rocket className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-purple-600" />
          </div>
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
