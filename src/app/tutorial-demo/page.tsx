'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Home, Sparkles, Trophy, ShoppingBag, Target, Flame, Zap, Star, ArrowRight, X } from 'lucide-react'

export default function TutorialDemoPage() {
  const [tutorialStep, setTutorialStep] = useState(0)
  const [showTutorial, setShowTutorial] = useState(true)

  const tutorialSteps = [
    {
      title: "Welcome to Mathly! 🎉",
      description: "Let&apos;s take a quick tour to help you get started. This will only take 30 seconds!",
      target: null,
      position: "center"
    },
    {
      title: "Your Dashboard",
      description: "This is your home base! Here you can see your progress, streak, and total XP.",
      target: "dashboard-card",
      position: "bottom"
    },
    {
      title: "Daily Streak 🔥",
      description: "Keep your streak alive by playing every day! The longer your streak, the more rewards you get.",
      target: "streak-display",
      position: "bottom"
    },
    {
      title: "Start Learning",
      description: "Click &quot;Continue Learning&quot; to jump right into your next lesson. Each level has 10 fun questions!",
      target: "continue-button",
      position: "top"
    },
    {
      title: "Track Your Progress",
      description: "Your XP bar shows how close you are to the next level. Earn XP by completing lessons!",
      target: "xp-bar",
      position: "bottom"
    },
    {
      title: "Earn Coins 💰",
      description: "Complete lessons to earn coins! Use them in the shop to buy power-ups and cool themes.",
      target: "coins-display",
      position: "bottom"
    },
    {
      title: "Bottom Navigation",
      description: "Use these buttons to navigate between Learn, Quests, Shop, and your Profile.",
      target: "bottom-nav",
      position: "top"
    },
    {
      title: "Ready to Start! 🚀",
      description: "That&apos;s it! You&apos;re all set. Click &quot;Start Learning&quot; to begin your math adventure!",
      target: null,
      position: "center"
    }
  ]

  const currentStep = tutorialSteps[tutorialStep]

  const nextStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1)
    } else {
      setShowTutorial(false)
    }
  }

  const skipTutorial = () => {
    setShowTutorial(false)
  }

  const restartTutorial = () => {
    setTutorialStep(0)
    setShowTutorial(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 relative">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Mathly
          </Link>
          <button
            onClick={restartTutorial}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Restart Tutorial
          </button>
        </div>
      </header>

      {/* Mock Dashboard Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div 
          id="dashboard-card"
          className={`bg-white rounded-3xl shadow-lg p-8 mb-8 relative ${
            showTutorial && currentStep.target === 'dashboard-card' ? 'ring-4 ring-blue-500 ring-offset-4 z-30' : ''
          }`}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-900">Welcome back!</h1>
              <p className="text-gray-600">Ready to continue your math journey?</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Streak */}
          <div 
            id="streak-display"
            className={`bg-white rounded-2xl shadow-md p-6 relative ${
              showTutorial && currentStep.target === 'streak-display' ? 'ring-4 ring-blue-500 ring-offset-4 z-30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-sm text-gray-500">Day Streak</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">7</div>
            <div className="text-sm text-green-600 font-medium">Keep it up! 🔥</div>
          </div>

          {/* XP */}
          <div 
            id="xp-bar"
            className={`bg-white rounded-2xl shadow-md p-6 relative ${
              showTutorial && currentStep.target === 'xp-bar' ? 'ring-4 ring-blue-500 ring-offset-4 z-30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Zap className="w-8 h-8 text-yellow-500" />
              <span className="text-sm text-gray-500">Total XP</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">450</div>
            <div className="mt-2 bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1">550 XP to next level</div>
          </div>

          {/* Coins */}
          <div 
            id="coins-display"
            className={`bg-white rounded-2xl shadow-md p-6 relative ${
              showTutorial && currentStep.target === 'coins-display' ? 'ring-4 ring-blue-500 ring-offset-4 z-30' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-amber-500" />
              <span className="text-sm text-gray-500">Coins</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">125</div>
            <div className="text-sm text-blue-600 font-medium">Visit the shop! 🛒</div>
          </div>
        </div>

        {/* Continue Learning Button */}
        <div 
          id="continue-button"
          className={`relative ${
            showTutorial && currentStep.target === 'continue-button' ? 'ring-4 ring-blue-500 ring-offset-4 z-30 rounded-2xl' : ''
          }`}
        >
          <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">Continue Learning</div>
                <div className="text-sm opacity-90">Level 5: Addition 6-10</div>
              </div>
            </div>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <button className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center gap-2">
            <Trophy className="w-8 h-8 text-purple-500" />
            <span className="font-bold text-gray-900">Achievements</span>
            <span className="text-sm text-gray-500">5/10 unlocked</span>
          </button>
          <button className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center gap-2">
            <ShoppingBag className="w-8 h-8 text-pink-500" />
            <span className="font-bold text-gray-900">Shop</span>
            <span className="text-sm text-gray-500">Buy power-ups</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <div 
        id="bottom-nav"
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${
          showTutorial && currentStep.target === 'bottom-nav' ? 'ring-4 ring-blue-500 ring-offset-4' : ''
        }`}
      >
        <nav className="max-w-md mx-auto flex justify-around py-3">
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-blue-600">
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Learn</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Quests</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Shop</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400">
            <Trophy className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </nav>
      </div>

      {/* Tutorial Overlay */}
      {showTutorial && (
        <>
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-black/50 z-40 pointer-events-none" />

          {/* Tutorial Card */}
          <div className={`fixed z-50 max-w-sm w-full mx-4 ${
            currentStep.position === 'center' 
              ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              : currentStep.position === 'top'
              ? 'bottom-24 left-1/2 -translate-x-1/2'
              : currentStep.position === 'bottom'
              ? 'top-24 left-1/2 -translate-x-1/2'
              : 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          }`}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
              {/* Close button */}
              <button
                onClick={skipTutorial}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentStep.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 justify-center mb-4">
                {tutorialSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === tutorialStep
                        ? 'w-8 bg-blue-600'
                        : index < tutorialStep
                        ? 'w-2 bg-blue-300'
                        : 'w-2 bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                {tutorialStep > 0 && (
                  <button
                    onClick={() => setTutorialStep(tutorialStep - 1)}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={nextStep}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {tutorialStep === tutorialSteps.length - 1 ? "Let&apos;s Go!" : 'Next'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Skip option */}
              {tutorialStep > 0 && tutorialStep < tutorialSteps.length - 1 && (
                <button
                  onClick={skipTutorial}
                  className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Skip tutorial
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Tutorial complete message */}
      {!showTutorial && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-bold">
            ✅ Tutorial Complete! Click &quot;Restart Tutorial&quot; to see it again.
          </div>
        </div>
      )}
    </div>
  )
}
