'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, X } from 'lucide-react'

interface TutorialStep {
  title: string
  description: string
  target: string | null
  position: 'center' | 'top' | 'bottom'
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to Mathly! 🎉",
    description: "Let&apos;s take a quick tour to help you get started. This will only take 30 seconds!",
    target: null,
    position: "center"
  },
  {
    title: "Your Progress",
    description: "This is your home base! Here you can see your current level, XP, and streak.",
    target: "progress-card",
    position: "bottom"
  },
  {
    title: "Daily Streak 🔥",
    description: "Keep your streak alive by playing every day! The longer your streak, the more rewards you get.",
    target: "streak-stat",
    position: "bottom"
  },
  {
    title: "Continue Learning",
    description: "Click here to jump right into your next lesson. Each level has 10 fun questions!",
    target: "continue-button",
    position: "top"
  },
  {
    title: "Earn Coins 💰",
    description: "Complete lessons to earn coins! Use them in the shop to buy power-ups and cool themes.",
    target: "coins-stat",
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

interface TutorialProps {
  onComplete: () => void
  onSkip: () => void
}

export default function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const step = tutorialSteps[currentStep]

  useEffect(() => {
    // Scroll to highlighted element
    if (step.target) {
      const element = document.getElementById(step.target)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentStep, step.target])

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/60 z-[100] pointer-events-none" />

      {/* Highlight ring for target element */}
      {step.target && (
        <style jsx global>{`
          #${step.target} {
            position: relative;
            z-index: 101 !important;
            box-shadow: 0 0 0 4px rgb(59 130 246), 0 0 0 8px rgb(59 130 246 / 0.5) !important;
            border-radius: 1rem !important;
          }
        `}</style>
      )}

      {/* Tutorial Card */}
      <div className={`fixed z-[102] max-w-sm w-full mx-4 ${
        step.position === 'center' 
          ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
          : step.position === 'top'
          ? 'bottom-28 left-1/2 -translate-x-1/2'
          : 'top-24 left-1/2 -translate-x-1/2'
      }`}>
        <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
          {/* Close button */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close tutorial"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="mb-6 pr-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex gap-2 justify-center mb-4">
            {tutorialSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-8 bg-blue-600'
                    : index < currentStep
                    ? 'w-2 bg-blue-300'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={nextStep}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {currentStep === tutorialSteps.length - 1 ? "Let&apos;s Go!" : 'Next'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Skip option */}
          {currentStep > 0 && currentStep < tutorialSteps.length - 1 && (
            <button
              onClick={onSkip}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Skip tutorial
            </button>
          )}
        </div>
      </div>
    </>
  )
}
