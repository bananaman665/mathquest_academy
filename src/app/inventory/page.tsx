import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Target, ShoppingBag, User, MoreHorizontal, Sparkles, Home, Package } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { prisma } from '@/lib/prisma'
import BottomNav from '@/components/BottomNav'
import InventoryClient from '@/components/InventoryClient'

export default async function InventoryPage() {
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

          <Link href="/shop" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl hover:bg-gray-100 text-gray-700 font-bold transition-all">
            <ShoppingBag className="w-6 h-6" />
            <span>SHOP</span>
          </Link>

          <Link href="/inventory" className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-blue-100 border-2 border-blue-300 text-blue-600 font-bold transition-all">
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
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-green-600">Mathly</span>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-8">
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Your Purchased Items</h3>
                <p className="text-sm text-gray-700">
                  Use your power-ups to enhance your learning experience! Cosmetics can be equipped to customize your profile.
                </p>
              </div>
            </div>
          </div>

          <InventoryClient />
        </main>
      </div>
    </div>
  )
}
