import { currentUser } from '@clerk/nextjs/server'
import { redirect } from "next/navigation"
import Link from "next/link"
import { BookOpen, Trophy, Zap, Target, Sparkles, Rocket, Star } from "lucide-react"
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
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

  // Calculate XP needed for next level (100 XP per level for now)
  const xpForNextLevel = dbUser.currentLevel * 100
  const xpProgress = dbUser.totalXP % 100
  const progressPercentage = (xpProgress / 100) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 animate-pulse">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                MathQuest Academy
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-300">
                Welcome, <span className="text-purple-400">{user.firstName || 'Student'}</span>!
              </span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-6 py-3 rounded-full mb-6">
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-purple-300 font-semibold">Your Dashboard</span>
          </div>
          <h2 className="text-5xl font-black text-white mb-4">
            Welcome to Your Math Adventure!
          </h2>
          <p className="mt-2 text-xl text-gray-300">
            Ready to start earning XP and leveling up your math skills?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/40">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 font-semibold">Current Level</p>
                <p className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{dbUser.currentLevel}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:rotate-12 transition-transform">
                <Target className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <div className="bg-gray-800 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2 font-semibold">{xpProgress} / {xpForNextLevel} XP to Level {dbUser.currentLevel + 1}</p>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-semibold">Total XP</p>
                <p className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{dbUser.totalXP}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:rotate-12 transition-transform">
                <Zap className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 shadow-2xl hover:shadow-orange-500/20 transition-all duration-300 hover:scale-105 hover:border-orange-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-semibold">Current Streak</p>
                <p className="text-4xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">{dbUser.streak}</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/50 group-hover:rotate-12 transition-transform">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="group backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 shadow-2xl hover:shadow-green-500/20 transition-all duration-300 hover:scale-105 hover:border-green-500/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-semibold">Achievements</p>
                <p className="text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">0</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:rotate-12 transition-transform">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-3xl p-10 text-white shadow-2xl mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Rocket className="w-8 h-8 text-purple-400" />
                <h3 className="text-3xl font-black">Start Your Math Adventure!</h3>
              </div>
              <p className="text-gray-300 text-lg">
                Begin with Level 1 and unlock your learning path
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/placement-test"
                className="group backdrop-blur-xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-bold shadow-lg transition-all duration-300 hover:scale-105 text-center"
              >
                <span className="flex items-center gap-2 justify-center">
                  🎯 Take Placement Test
                </span>
              </Link>
              <Link
                href="/learn"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/50 transition-all duration-300 hover:scale-105 text-center"
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
        <div className="backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-3xl p-10 shadow-2xl">
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            Coming Soon Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-blue-500/40">
              <h4 className="font-bold text-white mb-3 text-lg">📚 Learning Path</h4>
              <p className="text-sm text-gray-300">
                Interactive math lessons with instant feedback
              </p>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-purple-500/40">
              <h4 className="font-bold text-white mb-3 text-lg">🎁 Bonus Rounds</h4>
              <p className="text-sm text-gray-300">
                Special challenges for extra XP and rewards
              </p>
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-pink-500/10 to-blue-500/10 border border-pink-500/20 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:border-pink-500/40">
              <h4 className="font-bold text-white mb-3 text-lg">🏆 Achievements</h4>
              <p className="text-sm text-gray-300">
                Earn badges and unlock special rewards
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
