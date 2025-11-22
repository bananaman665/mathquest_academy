'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Check, X, Heart, Sparkles, ArrowRight, Target, CheckCircle, XCircle } from 'lucide-react'
import { placementTestQuestions, calculatePlacementLevel, getPlacementTestFeedback } from '@/data/placementTest'
import { useSoundEffects } from '@/hooks/useSoundEffects'

export default function PlacementTestClient() {
  const router = useRouter()
  const { playCorrect, playIncorrect } = useSoundEffects()
  const [phase, setPhase] = useState<'intro' | 'test' | 'results'>('intro')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<number[]>([])
  const [hearts, setHearts] = useState(5)
  const [recommendedLevel, setRecommendedLevel] = useState(1)

  const currentQuestion = placementTestQuestions[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer
  const progress = ((currentQuestionIndex + 1) / placementTestQuestions.length) * 100

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }

  const handleSubmit = () => {
    if (!selectedAnswer) return
    setShowExplanation(true)
    
    if (isCorrect) {
      playCorrect() // Play success sound
      setCorrectAnswers(prev => [...prev, currentQuestionIndex])
    } else {
      playIncorrect() // Play error sound
      setHearts(prev => Math.max(0, prev - 1))
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < placementTestQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Test complete - calculate placement
      const level = calculatePlacementLevel(correctAnswers)
      setRecommendedLevel(level)
      setPhase('results')
    }
  }

  const handleAcceptPlacement = async () => {
    // Save the placement level to the database
    try {
      const response = await fetch('/api/progress/set-level', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level: recommendedLevel }),
      })
      
      if (response.ok) {
        router.push('/learn')
      }
    } catch (error) {
      console.error('Error saving placement:', error)
      router.push('/learn')
    }
  }

  // INTRO PHASE
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/learn" className="text-blue-600 hover:underline flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" />
              Back to Learning Path
            </Link>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Placement Test</h1>
              <p className="text-xl text-gray-600">Find your perfect starting point!</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What is this?</h3>
                <p className="text-gray-700">
                  This quick test will help us understand your current math skills and place you at the right level. 
                  Don&apos;t worry - there&apos;s no pressure! Just do your best.
                </p>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">What to expect:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>10 questions covering counting, addition, and subtraction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Takes about 3-5 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Questions get progressively harder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>We&apos;ll recommend the best starting level for you</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Remember:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">!</span>
                    <span>It&apos;s okay if some questions are hard - that&apos;s expected!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">!</span>
                    <span>You can skip questions you&apos;re not sure about</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">!</span>
                    <span>You can always start from Level 1 if you prefer</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setPhase('test')}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2"
            >
              Start Placement Test
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="mt-4 text-center">
              <Link href="/learn" className="text-gray-500 hover:text-gray-700 text-sm">
                Skip and start from Level 1
              </Link>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // RESULTS PHASE
  if (phase === 'results') {
    const feedback = getPlacementTestFeedback(recommendedLevel)
    const accuracy = Math.round((correctAnswers.length / placementTestQuestions.length) * 100)

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <div className="text-8xl mb-6">{feedback.emoji}</div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{feedback.title}</h1>
            <p className="text-xl text-gray-600 mb-8">{feedback.message}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <div className="text-3xl font-bold text-green-700">{correctAnswers.length}/{placementTestQuestions.length}</div>
                <div className="text-sm text-green-600 font-medium">Correct</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="text-3xl font-bold text-blue-700">{accuracy}%</div>
                <div className="text-sm text-blue-600 font-medium">Accuracy</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 mb-8 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Recommended Starting Level</h3>
              <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                Level {recommendedLevel}
              </div>
              <p className="text-gray-600">
                Based on your performance, we recommend starting at Level {recommendedLevel}. 
                This will provide the right balance of challenge and success!
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleAcceptPlacement}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                Start at Level {recommendedLevel}
              </button>
              
              <Link
                href="/learn"
                className="block w-full bg-white border-2 border-gray-300 hover:border-purple-500 text-gray-700 hover:text-purple-600 font-bold py-4 px-8 rounded-xl transition-all duration-200"
              >
                Choose My Own Level
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // TEST PHASE - Clean White Design
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-full">
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 fixed top-0 left-0 right-0 z-50 mt-safe">
        <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <header className="px-4 py-4 border-b border-gray-200 bg-white fixed top-4 left-0 right-0 z-40 pt-safe-header">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-2">
          <Link href="/placement-test" onClick={() => setPhase('intro')} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-8 h-8" />
          </Link>
          <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-xl">
            <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            <span className="text-red-600 font-bold text-xl">{hearts}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32 pt-32">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-500 font-bold text-sm uppercase tracking-wide">
              Question {currentQuestionIndex + 1} of {placementTestQuestions.length}
            </span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-12">{currentQuestion.question}</h2>

          {currentQuestion.visualContent && currentQuestion.type === 'visual-count' ? (
            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border-2 border-gray-200">
              <p className="text-center text-gray-600 font-semibold mb-6">Tap the correct number of boxes</p>
              <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
                {Array.from({ length: 10 }).map((_, index) => {
                  const boxNumber = index + 1
                  const isSelected = selectedAnswer === boxNumber.toString()

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(boxNumber.toString())}
                      disabled={showExplanation}
                      className={`
                        aspect-square rounded-xl border-4 transition-all duration-200
                        ${isSelected
                          ? 'bg-blue-500 border-blue-600 scale-110 shadow-lg'
                          : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                        }
                        ${showExplanation && boxNumber.toString() === currentQuestion.correctAnswer
                          ? 'bg-green-500 border-green-600'
                          : ''
                        }
                        ${showExplanation && isSelected && boxNumber.toString() !== currentQuestion.correctAnswer
                          ? 'bg-red-500 border-red-600'
                          : ''
                        }
                        disabled:cursor-not-allowed
                      `}
                    >
                      <span className={`text-2xl font-bold ${isSelected || showExplanation ? 'text-white' : 'text-gray-700'}`}>
                        {boxNumber}
                      </span>
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">Count: {currentQuestion.visualContent}</p>
              </div>
            </div>
          ) : currentQuestion.visualContent ? (
            <div className="bg-gray-50 rounded-2xl p-8 mb-12 border-2 border-gray-200">
              <div className="flex flex-wrap justify-center items-center gap-2 max-w-xl mx-auto">
                {currentQuestion.visualContent.split('').map((char, index) => (
                  <span key={index} className="text-5xl">{char}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div className={`grid grid-cols-2 gap-4 mb-8 ${currentQuestion.type === 'visual-count' ? 'hidden' : ''}`}>
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === option
              const isCorrectOption = option === currentQuestion.correctAnswer

              let cardClass = "relative p-8 rounded-2xl border-4 transition-all duration-200 cursor-pointer "

              if (showExplanation) {
                if (isCorrectOption) {
                  cardClass += "bg-green-50 border-green-500 shadow-lg"
                } else if (isSelected && !isCorrect) {
                  cardClass += "bg-red-50 border-red-500 shadow-lg"
                } else {
                  cardClass += "bg-gray-50 border-gray-200 opacity-50"
                }
              } else {
                if (isSelected) {
                  cardClass += "bg-blue-50 border-blue-500 shadow-lg"
                } else {
                  cardClass += "bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                }
              }

              return (
                <button key={option} onClick={() => handleAnswerSelect(option)} disabled={showExplanation} className={cardClass}>
                  <div className="absolute top-3 right-3 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-bold">{index + 1}</span>
                  </div>
                  <div className="text-4xl font-bold text-gray-900 text-center">{option}</div>
                  {showExplanation && isCorrectOption && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-10 h-10 text-green-600" />
                      </div>
                    </div>
                  )}
                  {showExplanation && isSelected && !isCorrect && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md">
                        <X className="w-10 h-10 text-red-600" />
                      </div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <div className={`rounded-2xl p-6 mb-8 border-2 ${isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
              <div className="flex items-start gap-3">
                {isCorrect ? <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" /> : <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />}
                <div>
                  <h3 className={`font-bold text-lg mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Correct!' : 'Not quite!'}
                  </h3>
                  <p className={isCorrect ? 'text-green-700' : 'text-red-700'}>{currentQuestion.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-6 pb-safe">
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-4">
          {!showExplanation ? (
            <>
              <button onClick={() => handleNext()} className="px-8 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wide">
                Skip
              </button>
              <button onClick={handleSubmit} disabled={!selectedAnswer} className={`px-12 py-4 rounded-xl font-bold text-white uppercase tracking-wide transition-all ${
                selectedAnswer ? 'bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl' : 'bg-gray-300 cursor-not-allowed opacity-50'
              }`}>
                Check
              </button>
            </>
          ) : (
            <button onClick={handleNext} className="w-full px-12 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl uppercase tracking-wide transition-all shadow-lg hover:shadow-xl">
              {currentQuestionIndex < placementTestQuestions.length - 1 ? 'Continue' : 'See Results'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
