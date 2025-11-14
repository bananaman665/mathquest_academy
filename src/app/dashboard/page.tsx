import { currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation"
import Link from "next/link"
import { Trophy, Zap, Target, Sparkles, Rocket, Star, Flame } from "lucide-react"
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import { checkStreakExpiration } from '@/lib/streak'
import { Suspense } from 'react'
import { DashboardSkeleton } from '@/components/ui/Skeleton'

async function DashboardContent() {
  const user = await currentUser()

  if (!user) {
    redirect("/signin")
  }

  // Fetch or create user progress from database
  let dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        currentLevel: 1,
        totalXP: 0,
        streak: 0,
      }
    })
  }

  // Check and update streak expiration
  const updatedUser = await checkStreakExpiration(user.id)
  if (updatedUser) {
    dbUser = updatedUser
  }

  // Calculate XP needed for next level (100 XP per level for now)
  const xpForNextLevel = dbUser.currentLevel * 100
  const xpProgress = dbUser.totalXP % 100
  const progressPercentage = (xpProgress / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-200 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 pt-14 sm:pt-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Mathly
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">
                Welcome, <span className="text-purple-600">{user.firstName || 'Student'}</span>!
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-24">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-6 py-3 rounded-full mb-6">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-semibold">Your Dashboard</span>
          </div>
          <h2 className="text-5xl font-black text-gray-900 mb-4">
            Welcome to Your Math Adventure!
          </h2>
          <p className="mt-2 text-xl text-gray-600">
            Let's learn and grow your math skills together!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white border-2 border-blue-200 hover:border-blue-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Current Level</p>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{dbUser.currentLevel}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 font-semibold">{xpProgress} / {xpForNextLevel} XP to Level {dbUser.currentLevel + 1}</p>
            </div>
          </div>

          <div className="group bg-white border-2 border-purple-200 hover:border-purple-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Total XP</p>
                <p className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{dbUser.totalXP}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group bg-white border-2 border-orange-200 hover:border-orange-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Current Streak</p>
                <p className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{dbUser.streak}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Flame className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
          </div>

          <div className="group bg-white border-2 border-green-200 hover:border-green-400 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold">Achievements</p>
                <p className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">0</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-8 h-8 text-white" />
                <h3 className="text-3xl font-black">Start Your Math Adventure!</h3>
              </div>
              <p className="text-white/90 text-lg">
                Have fun while learning! Level up and unlock your learning path.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/placement-test"
                className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/50 hover:border-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 text-center"
              >
                <span className="flex items-center gap-2 justify-center">
                  🎯 Take Placement Test
                </span>
              </Link>
              <Link
                href="/learn"
                className="group bg-white hover:bg-gray-50 text-purple-600 px-10 py-4 rounded-xl font-bold shadow-xl transition-all duration-300 hover:scale-105 text-center"
              >
                <span className="flex items-center gap-2 justify-center">
                  View Learning Path
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-10 shadow-xl">
          <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Coming Soon Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-blue-400 hover:shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">📚 Learning Path</h4>
              <p className="text-sm text-gray-600">
                Interactive math lessons with instant feedback
              </p>
            </div>
            <div className="bg-purple-50 border-2 border-purple-300 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-purple-400 hover:shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">🎁 Bonus Rounds</h4>
              <p className="text-sm text-gray-600">
                Special challenges for extra XP and rewards
              </p>
            </div>
            <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-pink-400 hover:shadow-lg">
              <h4 className="font-bold text-gray-900 mb-3 text-lg">🏆 Achievements</h4>
              <p className="text-sm text-gray-600">
                Earn badges and unlock special rewards
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
