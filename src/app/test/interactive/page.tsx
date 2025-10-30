'use client'

import { useState } from 'react'
import { 
  NumberLineDrag, 
  FractionBuilder, 
  ClockSetter, 
  GraphPlotter,
  MoneyCounter,
  ArrayBuilder,
  BalanceScale,
  ShapeComposer
} from '@/components/interactive'
import FillTheJar from '@/components/interactive/FillTheJar'
import ArrayGridBuilder from '@/components/interactive/ArrayGridBuilder'
import GroupMaker from '@/components/interactive/GroupMaker'
import SkipCounter from '@/components/interactive/SkipCounter'
import FairShare from '@/components/interactive/FairShare'
import DivisionMachine from '@/components/interactive/DivisionMachine'
import PointPlotter from '@/components/interactive/PointPlotter'

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

          {/* Graph Plotter Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                4️⃣ Graph Plotter - Single Point
              </h2>
              <p className="text-gray-600">Click on the graph to plot points. Perfect for coordinate geometry!</p>
            </div>
            <GraphPlotter
              question="Plot the point (3, 2)"
              correctPoints={[{ x: 3, y: 2 }]}
              xMin={-5}
              xMax={5}
              yMin={-5}
              yMax={5}
              onAnswer={(isCorrect, points) => handleAnswer('Graph - Single Point')(isCorrect, `(${points[0]?.x}, ${points[0]?.y})`)}
            />
          </div>

          {/* Graph Plotter Demo - Multiple Points */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                5️⃣ Graph Plotter - Multiple Points
              </h2>
              <p className="text-gray-600">Plot multiple points and optionally connect them with a line!</p>
            </div>
            <GraphPlotter
              question="Plot the points that make the line y = x"
              correctPoints={[
                { x: -2, y: -2 },
                { x: 0, y: 0 },
                { x: 2, y: 2 }
              ]}
              xMin={-5}
              xMax={5}
              yMin={-5}
              yMax={5}
              allowMultiplePoints={true}
              showLine={true}
              onAnswer={(isCorrect, points) => 
                handleAnswer('Graph - Line y=x')(isCorrect, points.map(p => `(${p.x},${p.y})`).join(', '))
              }
            />
          </div>

          {/* Graph Plotter Demo - Quadrant */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-purple-600 mb-2">
                6️⃣ Graph Plotter - Triangle
              </h2>
              <p className="text-gray-600">Plot the vertices of a Shape</p>
            </div>
            <GraphPlotter
              question="Plot the three corners of a triangle: (-2, 1), (2, 1), and (0, 4)"
              correctPoints={[
                { x: -2, y: 1 },
                { x: 2, y: 1 },
                { x: 0, y: 4 }
              ]}
              xMin={-5}
              xMax={5}
              yMin={-2}
              yMax={5}
              allowMultiplePoints={true}
              showLine={true}
              onAnswer={(isCorrect, points) => 
                handleAnswer('Graph - Triangle')(isCorrect, points.map(p => `(${p.x},${p.y})`).join(', '))
              }
            />
          </div>

          {/* Money Counter Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                7️⃣ Money Counter
              </h2>
              <p className="text-gray-600">Select coins and bills to make the exact amount!</p>
            </div>
            <MoneyCounter
              question="Make exactly 67 cents using the available coins"
              targetAmount={67}
              availableCoins={{ penny: 10, nickel: 5, dime: 5, quarter: 4 }}
              showCents={true}
              onAnswer={(isCorrect, amount) => handleAnswer('Money Counter')(isCorrect, `${amount}¢`)}
            />
          </div>

          {/* Array Builder Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-indigo-600 mb-2">
                8️⃣ Array Builder
              </h2>
              <p className="text-gray-600">Click cells to fill the array and understand multiplication!</p>
            </div>
            <ArrayBuilder
              question="Build an array to show 3 × 4"
              rows={3}
              columns={4}
              correctAnswer={12}
              showMultiplication={true}
              onAnswer={(isCorrect, count) => handleAnswer('Array Builder')(isCorrect, String(count))}
            />
          </div>

          {/* Balance Scale Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-amber-600 mb-2">
                9️⃣ Balance Scale
              </h2>
              <p className="text-gray-600">Find the missing value to balance the equation!</p>
            </div>
            <BalanceScale
              question="What number balances the scale?"
              leftSide={[0, 5, 3]}  // 0 is the missing value
              rightSide={[4, 7]}
              missingValue={0}
              correctAnswer={3}
              showEquals={true}
              onAnswer={(isCorrect, answer) => handleAnswer('Balance Scale')(isCorrect, String(answer))}
            />
          </div>

          {/* Shape Composer Demo */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-pink-600 mb-2">
                🔟 Shape Composer
              </h2>
              <p className="text-gray-600">Select shapes to compose the target shape!</p>
            </div>
            <ShapeComposer
              question="Which pieces make a square?"
              targetShape="square"
              availablePieces={[
                { type: 'triangle', color: 'text-red-500', size: 1 },
                { type: 'triangle', color: 'text-red-500', size: 1 },
                { type: 'square', color: 'text-blue-500', size: 1 },
                { type: 'circle', color: 'text-green-500', size: 1 }
              ]}
              correctCombination={[
                { type: 'triangle', color: 'text-red-500', size: 1 },
                { type: 'triangle', color: 'text-red-500', size: 1 }
              ]}
              showGrid={true}
              onAnswer={(isCorrect, pieces) => 
                handleAnswer('Shape Composer')(isCorrect, pieces.map(p => p.type).join(', '))
              }
            />
          </div>

          {/* 9. Fill The Jar - Counting */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-300 hover:border-blue-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🫙 Fill The Jar</h3>
              <p className="text-gray-600">Put 7 apples in the jar!</p>
            </div>
            <FillTheJar
              question="Put 7 apples in the jar!"
              targetNumber={7}
              startingNumber={0}
              itemEmoji="🍎"
              mode="count"
              onAnswer={(isCorrect) => 
                handleAnswer('Fill The Jar - Count')(isCorrect, '7 apples')
              }
            />
          </div>

          {/* 10. Fill The Jar - Addition */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-300 hover:border-green-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🫙 Fill The Jar - Addition</h3>
              <p className="text-gray-600">There are 4 cookies. Add 3 more to make 7!</p>
            </div>
            <FillTheJar
              question="There are 4 cookies in the jar. Add 3 more!"
              targetNumber={7}
              startingNumber={4}
              itemEmoji="🍪"
              mode="add"
              onAnswer={(isCorrect) => 
                handleAnswer('Fill The Jar - Add')(isCorrect, '4 + 3 = 7')
              }
            />
          </div>

          {/* 11. Fill The Jar - Subtraction */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-300 hover:border-red-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🫙 Fill The Jar - Subtraction</h3>
              <p className="text-gray-600">There are 8 candies. Take out 3!</p>
            </div>
            <FillTheJar
              question="There are 8 candies. Take out 3!"
              targetNumber={5}
              startingNumber={8}
              itemEmoji="🍬"
              mode="remove"
              onAnswer={(isCorrect) => 
                handleAnswer('Fill The Jar - Remove')(isCorrect, '8 - 3 = 5')
              }
            />
          </div>

          {/* 12. Array Grid Builder - Multiplication */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-purple-300 hover:border-purple-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🎯 Array Grid Builder</h3>
              <p className="text-gray-600">Make an array with 3 rows and 4 columns!</p>
            </div>
            <ArrayGridBuilder
              targetRows={3}
              targetCols={4}
              emoji="⭐"
              onAnswer={(isCorrect) => 
                handleAnswer('Array Grid Builder')(isCorrect, '3 × 4 = 12')
              }
            />
          </div>

          {/* 13. Group Maker - Multiplication */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-orange-300 hover:border-orange-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">👥 Group Maker</h3>
              <p className="text-gray-600">Make 4 groups with 3 stars in each!</p>
            </div>
            <GroupMaker
              targetGroups={4}
              itemsPerGroup={3}
              emoji="⭐"
              onAnswer={(isCorrect) => 
                handleAnswer('Group Maker')(isCorrect, '4 groups × 3 items = 12')
              }
            />
          </div>

          {/* 14. Skip Counter - Multiplication */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-blue-300 hover:border-blue-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🦘 Skip Counter</h3>
              <p className="text-gray-600">Skip count by 5s - make 4 jumps!</p>
            </div>
            <SkipCounter
              skipBy={5}
              numJumps={4}
              onAnswer={(isCorrect) => 
                handleAnswer('Skip Counter')(isCorrect, '5 × 4 = 20')
              }
            />
          </div>

          {/* 15. Fair Share - Division */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-300 hover:border-green-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">🍕 Fair Share</h3>
              <p className="text-gray-600">Share 12 cookies equally among 3 friends!</p>
            </div>
            <FairShare
              totalItems={12}
              numGroups={3}
              emoji="🍪"
              onAnswer={(isCorrect) => 
                handleAnswer('Fair Share')(isCorrect, '12 ÷ 3 = 4')
              }
            />
          </div>

          {/* 16. Division Machine */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-indigo-300 hover:border-indigo-400 transition-all">
            <div className="mb-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">⚙️ Division Machine</h3>
              <p className="text-gray-600">Use the machine to divide 15 stars into groups of 5!</p>
            </div>
            <DivisionMachine
              dividend={15}
              divisor={5}
              emoji="⭐"
              onAnswer={(isCorrect) => 
                handleAnswer('Division Machine')(isCorrect, '15 ÷ 5 = 3')
              }
            />
          </div>

          {/* 17. Point Plotter - Coordinate Graphing */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-indigo-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">📍</span>
              <h2 className="text-3xl font-bold text-indigo-600">17. Point Plotter</h2>
            </div>
            <PointPlotter
              question="Plot the points on the graph"
              targetPoints={[
                { x: 2, y: 3, label: 'A' },
                { x: 5, y: 7, label: 'B' }
              ]}
              xMin={0}
              xMax={10}
              yMin={0}
              yMax={10}
              showLabels={true}
              onAnswer={(isCorrect, points) => 
                handleAnswer('Point Plotter')(isCorrect, points ? JSON.stringify(points) : 'No points')
              }
            />
          </div>

        </div>

        {/* Instructions */}
        <div className="mt-12 bg-yellow-50 rounded-2xl shadow-xl p-8 border-4 border-yellow-200">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">📋 Testing Instructions:</h2>
          <ul className="space-y-2 text-gray-700 text-lg">
            <li>• <strong>Test on iOS device:</strong> Access at http://10.200.1.150:3000/test/interactive</li>
            <li>• <strong>Try all 17 components:</strong> Number line, fractions, clock, graph, money, arrays, balance, shapes, jar, multiplication, division, and coordinate plotting!</li>
            <li>• <strong>Check feedback:</strong> Green for correct, red for wrong</li>
            <li>• <strong>Test edge cases:</strong> Try dragging off-screen, rapid taps, clicking same point twice</li>
          </ul>
        </div>

        {/* Tech Info */}
        <div className="mt-8 bg-gray-100 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠️ Technical Info:</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Core Components:</strong> NumberLineDrag, FractionBuilder, ClockSetter, GraphPlotter, MoneyCounter, ArrayBuilder, BalanceScale, ShapeComposer, FillTheJar</p>
            <p><strong>NEW Multiplication/Division:</strong> ArrayGridBuilder, GroupMaker, SkipCounter, FairShare, DivisionMachine</p>
            <p><strong>NEW Graphing:</strong> PointPlotter (coordinate plane with point plotting)</p>
            <p><strong>Total Interactive Components:</strong> 15 complete components! 🎉</p>
            <p><strong>Libraries:</strong> Framer Motion (animations), @dnd-kit (drag & drop), SVG (graphs)</p>
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
