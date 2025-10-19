import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Medal, Crown, Home, Target, ShoppingBag, User, MoreHorizontal, Sparkles } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'

export default async function LeaderboardsPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

  // Get current user data
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

  // Get top 10 users by XP
  const topUsers = await prisma.user.findMany({
    orderBy: { totalXP: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      username: true,
      totalXP: true,
      currentLevel: true,
    }
  })

  // Find current user's rank
  const allUsers = await prisma.user.findMany({
    orderBy: { totalXP: 'desc' },
    select: { id: true }
  })
  const currentUserRank = allUsers.findIndex(u => u.id === user.id) + 1

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* Bottom Navigation - Mobile Only */}
      <BottomNav currentPage="leaderboards" />
      
      {/* Left Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden md:flex w-40 lg:w-64 bg-white border-r border-gray-200 fixed h-full flex-col text-xs lg:text-base">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-green-600">MathQuest</span>
          </Link>
        </div>

        <nav className="flex-1 px-4">
          <Link
            href="/learn"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all"
          >
            <Home className="w-6 h-6" />
            <span>LEARN</span>
          </Link>

          <Link
            href="/leaderboards"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all"
          >
            <Trophy className="w-6 h-6" />
            <span>LEADERBOARDS</span>
          </Link>

          <Link
            href="/quests"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all"
          >
            <Target className="w-6 h-6" />
            <span>QUESTS</span>
          </Link>

          <Link
            href="/shop"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>SHOP</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all"
          >
            <User className="w-6 h-6" />
            <span>PROFILE</span>
          </Link>

          <Link
            href="/dashboard"
            className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all"
          >
            <MoreHorizontal className="w-6 h-6" />
            <span>MORE</span>
          </Link>
        </nav>

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

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gray-900">Leaderboards</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl">
                  <span className="text-2xl">🔥</span>
                  <span className="font-bold text-orange-600">{dbUser.streak || 0}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-xl">
                  <span className="text-2xl">💎</span>
                  <span className="font-bold text-blue-600">{dbUser.totalXP || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          {/* Your Rank Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-2xl font-black text-white">#{currentUserRank}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Your Rank</p>
                  <p className="text-2xl font-black text-gray-900">{user.firstName || 'You'}</p>
                  <p className="text-sm text-gray-600">Level {dbUser.currentLevel} • {dbUser.totalXP} XP</p>
                </div>
              </div>
              <Trophy className="w-12 h-12 text-yellow-500 transition-transform duration-300 hover:rotate-12 hover:scale-110" />
            </div>
          </div>

          {/* Leaderboard List */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-black text-gray-900">Top Learners</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {topUsers.map((topUser, index) => {
                const isCurrentUser = topUser.id === user.id
                const rankIcons = [
                  <Crown key="crown" className="w-8 h-8 text-yellow-500" />,
                  <Medal key="medal-silver" className="w-8 h-8 text-gray-400" />,
                  <Medal key="medal-bronze" className="w-8 h-8 text-orange-600" />
                ]

                return (
                  <div
                    key={topUser.id}
                    className={`px-6 py-4 flex items-center justify-between transition-all duration-300 ${
                      isCurrentUser ? 'bg-blue-50 scale-105' : 'hover:bg-gray-50 hover:translate-x-2'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 flex items-center justify-center">
                        {index < 3 ? (
                          <div className="animate-bounce">
                            {rankIcons[index]}
                          </div>
                        ) : (
                          <span className="text-xl font-black text-gray-400">#{index + 1}</span>
                        )}
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:rotate-12">
                        <span className="text-xl font-black text-white">
                          {(topUser.name || topUser.username || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                          {topUser.name || topUser.username || `User ${index + 1}`}
                          {isCurrentUser && ' (You)'}
                        </p>
                        <p className="text-sm text-gray-600">Level {topUser.currentLevel}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-yellow-600">{topUser.totalXP}</p>
                      <p className="text-xs text-gray-600">XP</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How to climb the leaderboard?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Complete lessons to earn XP</li>
                  <li>• Maintain your streak by learning daily</li>
                  <li>• Complete quests for bonus XP</li>
                  <li>• Perfect scores give you extra points!</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
