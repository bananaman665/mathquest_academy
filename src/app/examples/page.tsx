'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ChevronRight, ChevronLeft } from 'lucide-react'

// Import all question components
import BlockStackingQuestion from '@/components/game/BlockStackingQuestion'
import NumberLinePlacement from '@/components/game/NumberLinePlacement'
import TenFrame from '@/components/game/TenFrame'
import ArrayGridBuilder from '@/components/interactive/ArrayGridBuilder'
import GroupMaker from '@/components/interactive/GroupMaker'
import SkipCounter from '@/components/interactive/SkipCounter'
import FairShare from '@/components/interactive/FairShare'
import ArrayDivision from '@/components/game/ArrayDivision'
import RemainderBoxes from '@/components/game/RemainderBoxes'
import { 
  NumberLineDrag, 
  FractionBuilder, 
  ClockSetter, 
  GraphPlotter,
  MoneyCounter,
  BalanceScale,
} from '@/components/interactive'

interface ComponentExample {
  name: string
  description: string
  component: React.ReactNode
}

export default function ExamplesPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lastResult, setLastResult] = useState<string | null>(null)

  const handleAnswer = (isCorrect: boolean, componentName: string) => {
    setLastResult(`${componentName}: ${isCorrect ? '✅ Correct!' : '❌ Incorrect'}`)
    setTimeout(() => setLastResult(null), 2000)
  }

  const examples: ComponentExample[] = [
    {
      name: 'Multiple Choice',
      description: 'Standard multiple choice questions with 4 options',
      component: (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">What is 5 + 3?</h3>
          <div className="grid grid-cols-2 gap-3">
            {['6', '7', '8', '9'].map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option === '8', 'Multiple Choice')}
                className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl font-bold text-lg transition-all hover:scale-105"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    },
    {
      name: 'Fill in the Blank',
      description: 'Type in the answer using a number keyboard',
      component: (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">7 + ___ = 12</h3>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-3xl font-bold">7 +</span>
            <div className="w-16 h-14 bg-blue-100 border-2 border-blue-300 rounded-xl flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">?</span>
            </div>
            <span className="text-3xl font-bold">= 12</span>
          </div>
          <p className="text-sm text-gray-500 text-center">Answer: 5 (uses NumberKeyboard component)</p>
        </div>
      )
    },
    {
      name: 'Block Stacking',
      description: 'Visual place value with tens and ones blocks',
      component: (
        <BlockStackingQuestion
          question="What is 15 + 8?"
          firstNumber={15}
          secondNumber={8}
          operation="add"
          correctAnswer={23}
          onAnswer={(correct) => handleAnswer(correct, 'Block Stacking')}
        />
      )
    },
    {
      name: 'Number Line Placement',
      description: 'Tap to place a number on the number line',
      component: (
        <NumberLinePlacement
          question="Place 7 on the number line"
          correctPosition={7}
          numberLineMin={0}
          numberLineMax={10}
          onAnswer={(correct) => handleAnswer(correct, 'Number Line Placement')}
        />
      )
    },
    {
      name: 'Ten Frame',
      description: 'Count dots - tap boxes to show the correct number',
      component: (
        <TenFrame
          question="Show 6 dots"
          correctPosition={6}
          onAnswer={(correct) => handleAnswer(correct, 'Ten Frame')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Number Line (Drag)',
      description: 'Drag to the correct position on the number line',
      component: (
        <NumberLineDrag
          question="Where is 15 on the number line?"
          correctAnswer={15}
          min={0}
          max={20}
          onAnswer={(correct) => handleAnswer(correct, 'Number Line Drag')}
        />
      )
    },
    {
      name: 'Array Grid Builder',
      description: 'Build arrays for multiplication',
      component: (
        <ArrayGridBuilder
          targetRows={3}
          targetCols={4}
          emoji="⭐"
          onAnswer={(correct) => handleAnswer(correct, 'Array Grid Builder')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Group Maker',
      description: 'Create equal groups for multiplication',
      component: (
        <GroupMaker
          targetGroups={4}
          itemsPerGroup={3}
          emoji="🍪"
          onAnswer={(correct) => handleAnswer(correct, 'Group Maker')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Skip Counter',
      description: 'Count by skipping numbers',
      component: (
        <SkipCounter
          skipBy={5}
          numJumps={5}
          onAnswer={(correct) => handleAnswer(correct, 'Skip Counter')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Fair Share',
      description: 'Divide items equally among groups',
      component: (
        <FairShare
          totalItems={12}
          numGroups={3}
          onAnswer={(correct) => handleAnswer(correct, 'Fair Share')}
        />
      )
    },
    {
      name: 'Array Division',
      description: 'Use arrays to visualize division',
      component: (
        <ArrayDivision
          question="12 ÷ 4 = ?"
          totalItems={12}
          divisor={4}
          onAnswer={(correct) => handleAnswer(correct, 'Array Division')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Remainder Boxes',
      description: 'Division with remainders',
      component: (
        <RemainderBoxes
          question="13 ÷ 4 = ?"
          totalItems={13}
          itemsPerBox={4}
          onAnswer={(correct) => handleAnswer(correct, 'Remainder Boxes')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Fraction Builder',
      description: 'Build fractions by shading parts',
      component: (
        <FractionBuilder
          question="Shade 3/4 of the shape"
          denominator={4}
          correctNumerator={3}
          shape="circle"
          onAnswer={(correct) => handleAnswer(correct, 'Fraction Builder')}
        />
      )
    },
    {
      name: 'Balance Scale',
      description: 'Balance equations on a scale',
      component: (
        <BalanceScale
          question="5 + ? = 8"
          leftSide={[5, 0]}
          rightSide={[8]}
          missingValue={1}
          correctAnswer={3}
          onAnswer={(correct) => handleAnswer(correct, 'Balance Scale')}
          onSubmitReady={() => {}}
        />
      )
    },
    {
      name: 'Clock Setter',
      description: 'Set the clock to show a specific time',
      component: (
        <ClockSetter
          question="Set the clock to 3:30"
          correctHour={3}
          correctMinute={30}
          onAnswer={(correct) => handleAnswer(correct, 'Clock Setter')}
        />
      )
    },
    {
      name: 'Money Counter',
      description: 'Count coins and bills',
      component: (
        <MoneyCounter
          question="Make 75 cents"
          targetAmount={75}
          availableCoins={{ quarter: 10, dime: 10, nickel: 10, penny: 10 }}
          onAnswer={(correct) => handleAnswer(correct, 'Money Counter')}
        />
      )
    },
    {
      name: 'Graph Plotter',
      description: 'Plot points on a coordinate grid',
      component: (
        <GraphPlotter
          question="Plot the point (3, 4)"
          correctPoints={[{ x: 3, y: 4 }]}
          xMin={0}
          xMax={5}
          yMin={0}
          yMax={5}
          onAnswer={(correct) => handleAnswer(correct, 'Graph Plotter')}
        />
      )
    },
  ]

  const currentExample = examples[currentIndex]

  const goNext = () => {
    if (currentIndex < examples.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/learn" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Back</span>
          </Link>
          <h1 className="text-xl font-black text-gray-900">Component Examples</h1>
          <div className="w-20"></div>
        </div>
      </div>

      {/* Result Toast */}
      {lastResult && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-gray-200 font-bold">
          {lastResult}
        </div>
      )}

      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border-2 border-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>
          <span className="font-bold text-gray-600">
            {currentIndex + 1} / {examples.length}
          </span>
          <button
            onClick={goNext}
            disabled={currentIndex === examples.length - 1}
            className="flex items-center gap-1 px-4 py-2 bg-white rounded-xl border-2 border-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Component Info */}
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 mb-4">
          <h2 className="text-2xl font-black text-gray-900 mb-1">{currentExample.name}</h2>
          <p className="text-gray-600">{currentExample.description}</p>
        </div>

        {/* Component Display */}
        <div className="bg-gray-100 rounded-2xl p-4 border-2 border-gray-200 min-h-[400px]">
          {currentExample.component}
        </div>

        {/* Quick Nav */}
        <div className="mt-6 bg-white rounded-2xl p-4 border-2 border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3">Jump to Component:</h3>
          <div className="flex flex-wrap gap-2">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                  index === currentIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
