'use client'

import Link from 'next/link'
import { Home, Trophy, Award, ShoppingBag } from 'lucide-react'

interface BottomNavProps {
  currentPage: 'learn' | 'leaderboards' | 'achievements' | 'shop' | 'dashboard'
}

export default function BottomNav({ currentPage }: BottomNavProps) {
  const navItems = [
    { href: '/learn', icon: Home, label: 'Learn', id: 'learn' },
    { href: '/leaderboards', icon: Trophy, label: 'Ranks', id: 'leaderboards' },
    { href: '/achievements', icon: Award, label: 'Badges', id: 'achievements' },
    { href: '/shop', icon: ShoppingBag, label: 'Shop', id: 'shop' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-1.5 pb-safe">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[56px] ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-500 active:text-green-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[9px] font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
