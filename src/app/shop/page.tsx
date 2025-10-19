import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, ShoppingBag, User, MoreHorizontal, Sparkles, Home, Heart, Zap, Shield, Flame, Gem, Lightbulb, Snowflake, Palette } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'

export default async function ShopPage() {
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

  const shopItems = [
    { id: 1, name: 'Extra Hearts', description: 'Refill your hearts to keep learning', price: 50, icon: Heart, category: 'power-ups', color: 'text-red-500' },
    { id: 2, name: 'Streak Freeze', description: 'Protect your streak for 1 day', price: 100, icon: Snowflake, category: 'power-ups', color: 'text-cyan-500' },
    { id: 3, name: 'XP Boost', description: 'Double XP for 1 hour', price: 150, icon: Zap, category: 'power-ups', color: 'text-yellow-500' },
    { id: 4, name: 'Hint Pack', description: 'Get 5 hints for tough questions', price: 75, icon: Lightbulb, category: 'power-ups', color: 'text-amber-500' },
    { id: 5, name: 'Golden Trophy', description: 'Show off your achievements', price: 500, icon: Trophy, category: 'cosmetics', color: 'text-yellow-600' },
    { id: 6, name: 'Rainbow Theme', description: 'Colorful interface theme', price: 300, icon: Palette, category: 'cosmetics', color: 'text-purple-500' },
  ]

  return (
    <div className="min-h-screen bg-white flex overflow-x-hidden">
      {/* Bottom Navigation - Mobile Only */}
      <BottomNav currentPage="shop" />
      
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
          <Link href="/learn" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Home className="w-6 h-6" />
            <span>LEARN</span>
          </Link>

          <Link href="/leaderboards" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Trophy className="w-6 h-6" />
            <span>LEADERBOARDS</span>
          </Link>

          <Link href="/quests" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Target className="w-6 h-6" />
            <span>QUESTS</span>
          </Link>

          <Link href="/shop" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all">
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
      <div className="flex-1 md:ml-40 lg:ml-64 ml-0 w-full overflow-x-hidden">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gray-900">Shop</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-100 to-blue-50 px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
                  <Gem className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-600">{dbUser.totalXP || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-semibold mb-1">Your Balance</p>
                <div className="flex items-center gap-3">
                  <p className="text-4xl font-black text-blue-600">{dbUser.totalXP}</p>
                  <Gem className="w-10 h-10 text-blue-600" />
                </div>
                <p className="text-sm text-gray-600 mt-1">Earn more by completing lessons!</p>
              </div>
              <ShoppingBag className="w-16 h-16 text-blue-400" />
            </div>
          </div>

          {/* Power-ups Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-black text-gray-900">Power-ups</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.filter(item => item.category === 'power-ups').map((item) => {
                const canAfford = dbUser.totalXP >= item.price
                const ItemIcon = item.icon

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="text-center mb-4">
                      <div className="mb-4 flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 transition-all duration-300 hover:rotate-6 hover:scale-110">
                          <ItemIcon className={`w-10 h-10 ${item.color} transition-transform duration-300`} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Gem className="w-4 h-4 text-yellow-800 animate-pulse" />
                        <p className="text-lg font-black text-yellow-800">{item.price}</p>
                      </div>
                      {canAfford ? (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                          ✓ Can afford
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                          Not enough gems
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!canAfford}
                      className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                        canAfford
                          ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy Now' : 'Not Enough Gems'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cosmetics Section */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-black text-gray-900">Cosmetics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.filter(item => item.category === 'cosmetics').map((item) => {
                const canAfford = dbUser.totalXP >= item.price
                const ItemIcon = item.icon

                return (
                  <div
                    key={item.id}
                    className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                  >
                    <div className="text-center mb-4">
                      <div className="mb-4 flex justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 transition-all duration-300 hover:rotate-6 hover:scale-110">
                          <ItemIcon className={`w-10 h-10 ${item.color} transition-transform duration-300`} />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Gem className="w-4 h-4 text-yellow-800 animate-pulse" />
                        <p className="text-lg font-black text-yellow-800">{item.price}</p>
                      </div>
                      {canAfford ? (
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                          ✓ Can afford
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                          Not enough gems
                        </span>
                      )}
                    </div>

                    <button
                      disabled={!canAfford}
                      className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                        canAfford
                          ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy Now' : 'Not Enough Gems'}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How to earn more gems?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Complete lessons and earn XP</li>
                  <li>• Finish daily quests for bonus rewards</li>
                  <li>• Maintain your learning streak</li>
                  <li>• Get perfect scores on lessons</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
