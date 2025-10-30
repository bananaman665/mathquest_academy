import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, ShoppingBag, User, MoreHorizontal, Sparkles, Home, Zap, CheckCircle } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'

export default async function QuestsPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/signin')
  }

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

  // Daily quests data
  const dailyQuests = [
    { id: 1, title: 'Earn 10 XP', description: 'Complete lessons to earn experience', reward: '10 💎', progress: dbUser.totalXP % 100, max: 10, icon: '⚡' },
    { id: 2, title: 'Complete 1 Lesson', description: 'Finish any lesson today', reward: '5 💎', progress: 0, max: 1, icon: '📚' },
    { id: 3, title: 'Perfect Score', description: 'Get all answers correct in one lesson', reward: '15 💎', progress: 0, max: 1, icon: '⭐' },
  ]

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-200 fixed h-full flex-col">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black text-green-600">MathQuest</span>
          </Link>
        </div>

        <nav className="flex-1 px-4">
          <Link href="/learn" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Home className="w-6 h-6" />
            <span>LEARN</span>
          </Link>

          <Link href="/leaderboards" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Trophy className="w-6 h-6" />
            <span>LEADERBOARDS</span>
          </Link>

          <Link href="/quests" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all">
            <Target className="w-6 h-6" />
            <span>QUESTS</span>
          </Link>

          <Link href="/shop" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <ShoppingBag className="w-6 h-6" />
            <span>SHOP</span>
          </Link>

          <Link href="/profile" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <User className="w-6 h-6" />
            <span>PROFILE</span>
          </Link>

          <Link href="/dashboard" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
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
      <div className="flex-1 md:ml-64 w-full">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 md:px-6 py-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <h1 className="text-2xl font-black text-gray-900">Daily Quests</h1>
              <div className="flex items-center gap-3 md:gap-6">
                <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-xl">
                  <img src="/fire.svg" alt="streak" className="w-6 h-6" />
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

        <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 pb-24 md:pb-8">
          {/* Info Banner */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 mb-2">Complete Daily Quests!</h2>
                <p className="text-gray-700">
                  Finish these challenges today to earn bonus rewards and XP. Quests reset daily at midnight!
                </p>
              </div>
            </div>
          </div>

          {/* Quest Cards */}
          <div className="space-y-4">
            {dailyQuests.map((quest) => {
              const progressPercent = Math.min((quest.progress / quest.max) * 100, 100)
              const isComplete = quest.progress >= quest.max

              return (
                <div
                  key={quest.id}
                  className={`bg-white border-2 rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:-translate-y-1 ${
                    isComplete ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="text-4xl transition-transform duration-300 hover:scale-125 hover:rotate-12">{quest.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">{quest.title}</h3>
                          {isComplete && (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{quest.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ease-out ${
                                isComplete ? 'bg-green-500 animate-pulse' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-gray-600 min-w-[60px]">
                            {quest.progress}/{quest.max}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <div className="bg-yellow-100 border-2 border-yellow-300 rounded-xl px-4 py-2 transition-all duration-300 hover:scale-110 hover:rotate-3">
                        <p className="text-sm font-bold text-yellow-800">{quest.reward}</p>
                      </div>
                    </div>
                  </div>

                  {isComplete ? (
                    <button
                      disabled
                      className="w-full bg-green-600 text-white font-bold py-3 rounded-xl opacity-50 cursor-not-allowed"
                    >
                      ✓ Completed!
                    </button>
                  ) : (
                    <Link
                      href="/learn"
                      className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Start Learning →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>

          {/* Coming Soon Section */}
          <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">🎁</div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Weekly Challenges Coming Soon!</h3>
            <p className="text-gray-600">
              Complete special weekly challenges for even bigger rewards
            </p>
          </div>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <BottomNav currentPage="achievements" />
    </div>
  )
}
