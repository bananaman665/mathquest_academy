'use client'

import Link from 'next/link'
import { Home, Trophy, Award, ShoppingBag, User } from 'lucide-react'

interface BottomNavProps {
  currentPage: 'learn' | 'leaderboards' | 'achievements' | 'shop' | 'profile' | 'dashboard'
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn', id: 'learn' },
    { href: '/leaderboards', icon: Trophy, label: 'Ranks', id: 'leaderboards' },
    { href: '/achievements', icon: Award, label: 'Badges', id: 'achievements' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop', id: 'shop' },
    { href: '/profile', icon: User, label: 'Profile', id: 'profile' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 z-50 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px] ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-500 active:text-green-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
