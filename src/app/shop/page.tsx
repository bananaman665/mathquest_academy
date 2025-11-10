import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, ShoppingBag, User, MoreHorizontal, Sparkles, Home, Gem, Package } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'
import ShopClient from '@/components/ShopClient'

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

  // Fetch shop items from database
  const shopItems = await prisma.shopItem.findMany({
    where: { isActive: true },
    orderBy: { price: 'asc' }
  })

  // Map items with color classes
  const itemsWithColors = shopItems.map((item: { 
    id: string
    name: string
    description: string
    price: number
    icon: string
    category: string
    effect: string | null
  }) => ({
    ...item,
    color: item.category === 'power-ups' 
      ? item.icon === 'Heart' ? 'text-red-500'
      : item.icon === 'Snowflake' ? 'text-cyan-500'
      : item.icon === 'Zap' ? 'text-yellow-500'
      : 'text-amber-500'
      : item.icon === 'Trophy' ? 'text-yellow-600'
      : 'text-purple-500'
  }))

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
            <span className="text-2xl font-black text-green-600">Mathly</span>
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

          <Link href="/inventory" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <Package className="w-6 h-6" />
            <span>INVENTORY</span>
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
        <header className="fixed top-0 left-0 right-0 md:left-40 lg:left-64 z-50 bg-white border-b border-gray-200 px-6 py-4 pt-12">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-green-600">Shop</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8 pt-32 sm:pt-28">
          <ShopClient items={itemsWithColors} userBalance={dbUser.totalXP} />

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
