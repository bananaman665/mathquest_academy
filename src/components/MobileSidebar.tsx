'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Home, Trophy, Target, ShoppingBag, User, MoreHorizontal } from 'lucide-react'
import Logo from '@/components/Logo'

interface MobileSidebarProps {
  currentPage: 'learn' | 'leaderboards' | 'quests' | 'shop' | 'profile' | 'dashboard'
}

export default function MobileSidebar({ currentPage }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/learn', icon: Home, label: 'LEARN', id: 'learn' },
    { href: '/leaderboards', icon: Trophy, label: 'LEADERBOARDS', id: 'leaderboards' },
    { href: '/quests', icon: Target, label: 'QUESTS', id: 'quests' },
    { href: '/shop', icon: ShoppingBag, label: 'SHOP', id: 'shop' },
    { href: '/profile', icon: User, label: 'PROFILE', id: 'profile' },
    { href: '/dashboard', icon: MoreHorizontal, label: 'MORE', id: 'dashboard' },
  ]

  return (
    <>
      {/* Mobile Menu Button - Only visible on mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] w-12 h-12 bg-white border-2 border-gray-200 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-700" />
        ) : (
          <Menu className="w-6 h-6 text-gray-700" />
        )}
      </button>

      {/* Overlay - Only visible when menu is open on mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar - Slides in from left */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6">
            <div onClick={() => setIsOpen(false)}>
              <Logo size="md" showText={true} href="/dashboard" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-4 px-4 py-3 mb-2 rounded-xl font-bold 
                    transition-all duration-200 hover:scale-105
                    ${
                      isActive
                        ? 'bg-blue-100 border-2 border-blue-300 text-blue-600'
                        : 'hover:bg-gray-100 text-gray-700 hover:translate-x-1'
                    }
                  `}
                >
                  <Icon className="w-6 h-6 transition-transform duration-200 hover:rotate-12" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
