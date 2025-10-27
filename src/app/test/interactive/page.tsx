'use client'

import { useState } from 'react'
import { NumberLineDrag, FractionBuilder, ClockSetter } from '@/components/interactive'

export default function InteractiveTestPage() {
  const [results, setResults] = useState<Array<{component: string, isCorrect: boolean, answer: string}>>([])

  const handleAnswer = (component: string) => (isCorrect: boolean, answer: string | number) => {
    setResults(prev => [...prev, { component, isCorrect, answer: String(answer) }])
    console.log(`${component}: ${isCorrect ? '✅' : '❌'} - Answer: ${answer}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            🎮 Interactive Components Test Lab
          </h1>
          <p className="text-xl text-gray-600">
            Try out the new Duolingo-style interactive learning components!
          </p>
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Your Results:</h2>
            <div className="space-y-2">
              {results.map((result, idx) => (
                <div key={idx} className="flex items-center gap-3 text-lg">
                  <span className="text-2xl">{result.isCorrect ? '✅' : '❌'}</span>
                  <span className="font-semibold text-gray-700">{result.component}:</span>
                  <span className="text-gray-600">{result.answer}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Component Demos */}
        <div className="space-y-12">
          
          {/* Number Line Drag Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                1️⃣ Number Line Drag
              </h2>
              <p className="text-gray-600">
                Drag the marker to the correct position. Great for understanding number relationships!
              </p>
            </div>
            
            <NumberLineDrag
              min={0}
              max={10}
              correctAnswer={7}
              question="Drag the marker to show the number 7"
              onAnswer={handleAnswer('Number Line')}
            />
          </div>

          {/* Number Line with Jumps */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                1️⃣.5 Number Line with Addition
              </h2>
              <p className="text-gray-600">
                See how addition works as "jumps" on the number line!
              </p>
            </div>
            
            <NumberLineDrag
              min={0}
              max={10}
              correctAnswer={7}
              question="Start at 3, add 4. Where do you land?"
              onAnswer={handleAnswer('Number Line Jump')}
              showJumps={true}
              startPosition={3}
            />
          </div>

          {/* Fraction Builder - Circle */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                2️⃣ Fraction Builder (Circle)
              </h2>
              <p className="text-gray-600">
                Tap the segments to fill them. See fractions come to life!
              </p>
            </div>
            
            <FractionBuilder
              denominator={4}
              correctNumerator={3}
              question="Build 3/4 by tapping the segments"
              onAnswer={handleAnswer('Fraction Circle')}
              shape="circle"
            />
          </div>

          {/* Fraction Builder - Rectangle */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                2️⃣.5 Fraction Builder (Rectangle)
              </h2>
              <p className="text-gray-600">
                Same concept, different shape. Try building 1/2!
              </p>
            </div>
            
            <FractionBuilder
              denominator={2}
              correctNumerator={1}
              question="Show 1/2 (one half) by tapping one segment"
              onAnswer={handleAnswer('Fraction Rectangle')}
              shape="rectangle"
            />
          </div>

          {/* Fraction Builder - Eighths */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                2️⃣.75 Fraction Builder (Advanced)
              </h2>
              <p className="text-gray-600">
                More segments = more challenge! Try eighths.
              </p>
            </div>
            
            <FractionBuilder
              denominator={8}
              correctNumerator={5}
              question="Build 5/8 by tapping five segments"
              onAnswer={handleAnswer('Fraction Eighths')}
              shape="circle"
            />
          </div>

          {/* Clock Setter - Simple */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                3️⃣ Clock Setter (Easy)
              </h2>
              <p className="text-gray-600">
                Drag the hour and minute hands to set the time. Watch how they move together!
              </p>
            </div>
            
            <ClockSetter
              correctHour={3}
              correctMinute={0}
              question="Set the clock to 3:00"
              onAnswer={handleAnswer('Clock Easy')}
            />
          </div>

          {/* Clock Setter - Harder */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                3️⃣.5 Clock Setter (Harder)
              </h2>
              <p className="text-gray-600">
                Now try a time with minutes. Set the clock to 4:45!
              </p>
            </div>
            
            <ClockSetter
              correctHour={4}
              correctMinute={45}
              question="Set the clock to 4:45 (quarter to 5)"
              onAnswer={handleAnswer('Clock Hard')}
            />
          </div>

          {/* Number Line - Larger Range */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-blue-600 mb-2">
                4️⃣ Number Line (Advanced)
              </h2>
              <p className="text-gray-600">
                Bigger numbers! Can you find 15 on the number line?
              </p>
            </div>
            
            <NumberLineDrag
              min={10}
              max={20}
              correctAnswer={15}
              question="Show the number 15 on the number line"
              onAnswer={handleAnswer('Number Line Advanced')}
            />
          </div>

        </div>

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Testing Tips:</h2>
          <ul className="space-y-3 text-lg text-gray-700">
            <li>• <strong>Drag smoothly:</strong> The components should feel responsive and natural</li>
            <li>• <strong>Try on iOS:</strong> Test touch interactions on your iPhone/iPad</li>
            <li>• <strong>Watch animations:</strong> Notice how elements animate smoothly</li>
            <li>• <strong>Check feedback:</strong> Green for correct, red for wrong</li>
            <li>• <strong>Test edge cases:</strong> Try dragging off-screen, rapid taps, etc.</li>
          </ul>
        </div>

        {/* Tech Info */}
        <div className="mt-8 bg-gray-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Technical Info:</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Components:</strong> NumberLineDrag, FractionBuilder, ClockSetter</p>
            <p><strong>Libraries:</strong> Framer Motion (animations), @dnd-kit (drag & drop)</p>
            <p><strong>Touch Support:</strong> ✅ Mouse + Touch events</p>
            <p><strong>Performance:</strong> 60fps animations, optimized re-renders</p>
            <p><strong>Accessibility:</strong> 🚧 Coming soon (screen reader support)</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <a 
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Back to Dashboard
          </a>
        </div>

      </div>
    </div>
  )
}
