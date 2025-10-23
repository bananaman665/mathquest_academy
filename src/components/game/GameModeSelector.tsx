'use client'

import { Clock, Zap, Target, Flame, Swords } from 'lucide-react'
import { GameMode } from '@/data/questions'

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void
  onCancel: () => void
}

const gameModes = [
  {
    mode: 'normal' as GameMode,
    icon: Target,
    name: 'Classic Mode',
    description: 'Standard lesson with hearts',
    color: 'from-blue-500 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
  {
    mode: 'speed-round' as GameMode,
    icon: Clock,
    name: 'Speed Round',
    description: '60 seconds - solve as many as you can!',
    color: 'from-green-500 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    badge: '+50% XP'
  },
  {
    mode: 'lightning' as GameMode,
    icon: Zap,
    name: 'Lightning Mode',
    description: '10 seconds per question - think fast!',
    color: 'from-yellow-500 to-orange-500',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    badge: '+75% XP'
  },
  {
    mode: 'perfect-streak' as GameMode,
    icon: Flame,
    name: 'Perfect Streak',
    description: 'Get 10 correct in a row - no mistakes!',
    color: 'from-red-500 to-pink-500',
    textColor: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badge: '+100% XP'
  },
  {
    mode: 'boss-battle' as GameMode,
    icon: Swords,
    name: 'Boss Battle',
    description: 'Harder problems with massive rewards',
    color: 'from-purple-500 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    badge: '+200% XP',
    locked: true // TODO: Unlock after completing level in normal mode
  },
]

export default function GameModeSelector({ onSelectMode, onCancel }: GameModeSelectorProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-8 text-center">
          <h2 className="text-3xl font-black text-white mb-2">Choose Your Challenge</h2>
          <p className="text-white/90">Pick a game mode and earn bonus XP!</p>
        </div>

        {/* Game Modes */}
        <div className="p-6 space-y-4">
          {gameModes.map((gameMode) => {
            const Icon = gameMode.icon
            const isLocked = gameMode.locked

            return (
              <button
                key={gameMode.mode}
                onClick={() => !isLocked && onSelectMode(gameMode.mode)}
                disabled={isLocked}
                className={`w-full text-left transition-all duration-200 ${
                  isLocked 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:scale-105 hover:shadow-xl cursor-pointer'
                }`}
              >
                <div className={`${gameMode.bgColor} ${gameMode.borderColor} border-2 rounded-2xl p-5 relative overflow-hidden`}>
                  {/* Gradient accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gameMode.color} opacity-10 rounded-full -mr-16 -mt-16`} />
                  
                  <div className="relative flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${gameMode.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-xl font-bold ${gameMode.textColor}`}>
                          {gameMode.name}
                        </h3>
                        {gameMode.badge && (
                          <span className={`text-xs font-bold px-2 py-1 bg-gradient-to-r ${gameMode.color} text-white rounded-full`}>
                            {gameMode.badge}
                          </span>
                        )}
                        {isLocked && (
                          <span className="text-xs font-bold px-2 py-1 bg-gray-400 text-white rounded-full">
                            🔒 LOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm">
                        {gameMode.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    {!isLocked && (
                      <div className={`${gameMode.textColor} opacity-50`}>
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Cancel Button */}
        <div className="p-6 pt-0">
          <button
            onClick={onCancel}
            className="w-full py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl font-bold transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
