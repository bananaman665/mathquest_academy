'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ArrowRight, Check, X, Heart, Sparkles, Zap, Clock, Flame } from 'lucide-react'
import { Question, GameMode } from '@/data/questions'
import AITutor from '@/components/AITutor'
import { useSoundEffects } from '@/hooks/useSoundEffects'
import { useInventory } from '@/hooks/useInventory'

interface LessonClientProps {
  levelId: number
  introduction: {
    title: string
    content: string[]
    examples: Array<{ number: string; visual: string; word: string }>
  }
  questions: Question[]
  gameMode?: GameMode
}

export default function LessonClient({ levelId, introduction, questions, gameMode = 'normal' }: LessonClientProps) {
  // Inventory hook
  const inventoryHook = useInventory()
  
  // Check if XP Boost is active
  const xpBoostActive = inventoryHook.hasActiveItem('XP Boost')
  const xpMultiplier = xpBoostActive ? 2 : 1
  
  // Log inventory status
  console.log('Inventory loaded:', inventoryHook.inventory.length, 'items')
  
  // Game mode state
  const [gameTimer, setGameTimer] = useState(gameMode === 'speed-round' ? 60 : 0)
  const [questionTimer, setQuestionTimer] = useState(gameMode === 'lightning' ? 10 : 0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [comboMultiplier, setComboMultiplier] = useState(1)
  
  // Local state for drag-and-drop pairs
  // For matching UI: numbers to words
  const initialNumbers = questions[0]?.pairs ? questions[0].pairs.map(p => p.left) : [];
  const initialWords = questions[0]?.pairs ? questions[0].pairs.map(p => p.right) : [];
  const [numbers, setNumbers] = useState<string[]>(initialNumbers);
  const [matched, setMatched] = useState<(string | null)[]>(Array(initialWords.length).fill(null));
  const words = initialWords;
  
  // For match-equation
  const initialEquations = questions[0]?.equations ? questions[0].equations.map(e => e.equation) : [];
  const initialAnswers = questions[0]?.equations ? questions[0].equations.map(e => e.answer) : [];
  const [equationItems, setEquationItems] = useState<string[]>(initialEquations);
  const [equationMatched, setEquationMatched] = useState<(string | null)[]>(Array(initialAnswers.length).fill(null));
  
  const router = useRouter()
  const { playCorrect, playIncorrect, playLevelComplete } = useSoundEffects()
  const [phase, setPhase] = useState<'intro' | 'practice'>('intro')
  
  // Log sound effects loaded
  console.log('Sound effects ready:', { playCorrect, playIncorrect, playLevelComplete })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  // For type-answer questions
  const [typedAnswer, setTypedAnswer] = useState('')
  // For multi-select (tap, highlight)
  const [multiSelected, setMultiSelected] = useState<string[]>([])
  // For fill-in-the-blank
  const [blankAnswers, setBlankAnswers] = useState<string[]>([])
  // For order/sequence
  const [sequenceOrder, setSequenceOrder] = useState<string[]>(() => questions[0]?.sequence || [])
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [earnedXP, setEarnedXP] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [showAITutor, setShowAITutor] = useState(false)
  const [isPremium, setIsPremium] = useState(false) // TODO: Get from user context

  const currentQuestion = questions[currentQuestionIndex]
  
  // Log premium status and AI tutor state
  console.log('Premium features:', { isPremium, showAITutor, setIsPremium })
  
  // Get answer boxes dynamically based on current question
  const answerBoxes = currentQuestion.type === 'match-equation' && currentQuestion.equations 
    ? currentQuestion.equations.map(e => e.answer) 
    : []
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Timer effects for Speed Round
  useEffect(() => {
    if (gameMode === 'speed-round' && phase === 'practice' && gameTimer > 0) {
      const timer = setInterval(() => {
        setGameTimer(prev => {
          if (prev <= 1) {
            // Time's up!
            router.push(`/learn/level/${levelId}/complete?xp=${earnedXP}&correct=${correctCount}&total=${currentQuestionIndex + 1}&mode=speed-round`)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameMode, phase, gameTimer, router, levelId, earnedXP, correctCount, currentQuestionIndex])

  // Timer effects for Lightning Mode
  useEffect(() => {
    if (gameMode === 'lightning' && phase === 'practice' && !showExplanation && questionTimer > 0) {
      const timer = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            // Time's up for this question - count as wrong
            setIsCorrect(false)
            setShowExplanation(true)
            playIncorrect()
            setHearts(prev => Math.max(0, prev - 1))
            setCurrentStreak(0)
            setComboMultiplier(1)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameMode, phase, showExplanation, questionTimer, playIncorrect])

  // Reset question timer for Lightning Mode
  useEffect(() => {
    if (gameMode === 'lightning' && !showExplanation) {
      setQuestionTimer(10)
    }
  }, [currentQuestionIndex, gameMode, showExplanation])

  const handleStartPractice = () => {
    setPhase('practice')
  }

  const handleAnswerSelect = (answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
  }

  // Multi-select handler
  const handleMultiSelect = (option: string) => {
    if (showExplanation) return
    setMultiSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
  }

  // Fill-in-the-blank handler
  const handleBlankChange = (idx: number, value: string) => {
    setBlankAnswers(prev => {
      const copy = [...prev]
      copy[idx] = value
      return copy
    })
  }

  // Sequence drag handler
  const handleSequenceDrag = (result: DropResult) => {
    if (!result.destination) return
    const items = Array.from(sequenceOrder)
    const [removed] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, removed)
    setSequenceOrder(items)
  }

  const handleSubmit = () => {
    let correct = false
    if (currentQuestion.type === 'multiple-choice' || 
        currentQuestion.type === 'audio' || 
        currentQuestion.type === 'mini-game' ||
        currentQuestion.type === 'number-sequence' ||
        currentQuestion.type === 'visual-count') {
      correct = selectedAnswer === currentQuestion.correctAnswer
    } else if (currentQuestion.type === 'tap-select') {
      correct = JSON.stringify(multiSelected.sort()) === JSON.stringify((currentQuestion.tapCorrect || []).sort())
    } else if (currentQuestion.type === 'highlight') {
      correct = JSON.stringify(multiSelected.sort()) === JSON.stringify((currentQuestion.highlightCorrect || []).sort())
    } else if (currentQuestion.type === 'fill-blank') {
      correct = blankAnswers.every((ans, idx) => ans === (currentQuestion.blanks?.[idx].answer))
    } else if (currentQuestion.type === 'order-sequence') {
      correct = JSON.stringify(sequenceOrder) === JSON.stringify(currentQuestion.sequenceCorrect)
    } else if (currentQuestion.type === 'true-false') {
      correct = selectedAnswer === (currentQuestion.isTrue ? 'True' : 'False')
    } else if (currentQuestion.type === 'picture-choice') {
      correct = selectedAnswer === currentQuestion.imageCorrect
    } else if (currentQuestion.type === 'drag-and-drop') {
      // For demo, always correct
      correct = true
    } else if (currentQuestion.type === 'type-answer') {
      const userAnswer = typedAnswer.trim()
      const acceptable = currentQuestion.acceptableAnswers || []
      
      // Debug logging
      console.log('Type-answer validation:', {
        userAnswer,
        typedAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        acceptableAnswers: acceptable,
      })
      
      // Check acceptableAnswers if they exist
      if (acceptable.length > 0) {
        correct = acceptable.some(ans => {
          const normalizedAns = ans.trim()
          const normalizedUser = userAnswer
          const matches = normalizedAns.toLowerCase() === normalizedUser.toLowerCase()
          console.log(`Comparing "${normalizedAns}" with "${normalizedUser}":`, matches)
          // Case-insensitive comparison
          return matches
        })
      } 
      // Fall back to correctAnswer
      else if (currentQuestion.correctAnswer) {
        const normalizedCorrect = currentQuestion.correctAnswer.trim()
        correct = normalizedCorrect.toLowerCase() === userAnswer.toLowerCase()
      }
      
      console.log('Final result:', correct)
    } else if (currentQuestion.type === 'match-equation') {
      correct = !equationMatched.some(m => !m)
    }
    
    setIsCorrect(correct)
    setShowExplanation(true)
    if (correct) {
      playCorrect() // Play success sound
      
      // Update streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak)
      }
      
      // Calculate combo multiplier based on streak
      let newComboMultiplier = 1
      if (newStreak >= 10) newComboMultiplier = 5
      else if (newStreak >= 7) newComboMultiplier = 3
      else if (newStreak >= 5) newComboMultiplier = 2
      setComboMultiplier(newComboMultiplier)
      
      // Calculate game mode bonus
      let gameModeBonus = 1
      if (gameMode === 'speed-round') gameModeBonus = 1.5
      else if (gameMode === 'lightning') gameModeBonus = 1.75
      else if (gameMode === 'perfect-streak') gameModeBonus = 2
      else if (gameMode === 'boss-battle') gameModeBonus = 3
      
      // Total XP = base XP × XP boost × combo multiplier × game mode bonus
      const earnedPoints = Math.floor(currentQuestion.xp * xpMultiplier * newComboMultiplier * gameModeBonus)
      setEarnedXP(prev => prev + earnedPoints)
      setCorrectCount(prev => prev + 1)
      
      // Perfect Streak mode: End if we've got 10 in a row
      if (gameMode === 'perfect-streak' && newStreak >= 10) {
        setTimeout(() => {
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP + earnedPoints}&correct=${correctCount + 1}&total=${currentQuestionIndex + 1}&mode=perfect-streak&perfect=true`)
        }, 1000)
      }
    } else {
      playIncorrect() // Play error sound
      setHearts(prev => Math.max(0, prev - 1))
      setCurrentStreak(0)
      setComboMultiplier(1)
      
      // Perfect Streak mode: End immediately on wrong answer
      if (gameMode === 'perfect-streak') {
        setTimeout(() => {
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP}&correct=${correctCount}&total=${currentQuestionIndex + 1}&mode=perfect-streak&failed=true`)
        }, 2000)
      }
    }
  }

  const handleUseExtraHearts = async () => {
    const success = await inventoryHook.useItem('extra-hearts')
    if (success) {
      setHearts(5)
      playCorrect()
      await inventoryHook.refetch()
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setTypedAnswer('')
      setMultiSelected([])
      setBlankAnswers([])
      // Reset drag-and-drop state for next question
      const nextQuestion = questions[currentQuestionIndex + 1]
      if (nextQuestion.type === 'drag-and-drop' && nextQuestion.pairs) {
        setNumbers(nextQuestion.pairs.map(p => p.left))
        setMatched(Array(nextQuestion.pairs.length).fill(null))
      }
      if (nextQuestion.type === 'match-equation' && nextQuestion.equations) {
        setEquationItems(nextQuestion.equations.map(e => e.equation))
        setEquationMatched(Array(nextQuestion.equations.length).fill(null))
      }
      if (nextQuestion.type === 'order-sequence' && nextQuestion.sequence) {
        setSequenceOrder(nextQuestion.sequence)
      }
      setShowExplanation(false)
    } else {
      router.push(`/learn/level/${levelId}/complete?xp=${earnedXP}&correct=${correctCount}&total=${questions.length}`)
    }
  }

  // INTRODUCTION PHASE
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <header className="relative backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/learn" className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group">
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Path</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">Level {levelId}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-2xl mx-auto px-4 py-12">
          <div className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl shadow-2xl p-10 mb-8">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/50 animate-pulse">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black text-white mb-3">{introduction.title}</h1>
              <p className="text-gray-300 text-lg">Let&apos;s learn something new!</p>
            </div>

            <div className="space-y-6 mb-10">
              {introduction.content.map((paragraph, index) => (
                <p key={index} className="text-xl text-gray-200 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {introduction.examples && introduction.examples.length > 0 && (
              <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  Examples:
                </h3>
                <div className="space-y-4">
                  {introduction.examples.map((example, index) => (
                    <div key={index} className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-6 flex items-center gap-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                      <div className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent w-20 text-center">
                        {example.number}
                      </div>
                      <div className="text-4xl">{example.visual}</div>
                      <div className="text-xl text-gray-200 font-bold">{example.word}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <button
              onClick={handleStartPractice}
              className="group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-500 hover:via-pink-500 hover:to-blue-500 text-white font-black py-5 px-16 rounded-2xl shadow-2xl shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 text-xl"
            >
              <span className="flex items-center gap-3">
                Start Practice
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </div>
        </main>
      </div>
    )
  }

  // PRACTICE PHASE - Duolingo-Inspired Clean Theme
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200">
        <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <header className="px-4 py-4 border-b border-gray-200">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <Link href="/learn" className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100">
            <X className="w-7 h-7" />
          </Link>
          <div className="flex items-center gap-3">
            {/* Speed Round Timer */}
            {gameMode === 'speed-round' && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold ${
                gameTimer <= 10 
                  ? 'bg-red-100 border-red-400 text-red-600 animate-pulse' 
                  : 'bg-green-100 border-green-400 text-green-600'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl">{gameTimer}s</span>
              </div>
            )}
            
            {/* Lightning Mode Timer */}
            {gameMode === 'lightning' && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold ${
                questionTimer <= 3 
                  ? 'bg-red-100 border-red-400 text-red-600 animate-pulse' 
                  : 'bg-yellow-100 border-yellow-400 text-yellow-600'
              }`}>
                <Zap className="w-5 h-5 fill-current" />
                <span className="text-xl">{questionTimer}s</span>
              </div>
            )}
            
            {/* Streak Counter */}
            {currentStreak > 0 && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold ${
                currentStreak >= 10 
                  ? 'bg-purple-100 border-purple-400 text-purple-600' 
                  : currentStreak >= 5 
                  ? 'bg-orange-100 border-orange-400 text-orange-600' 
                  : 'bg-blue-100 border-blue-400 text-blue-600'
              }`}>
                <Flame className="w-5 h-5" />
                <span>{currentStreak} 🔥</span>
                {comboMultiplier > 1 && (
                  <span className="text-xs ml-1">{comboMultiplier}x</span>
                )}
              </div>
            )}
            
            {xpBoostActive && (
              <div className="flex items-center gap-2 bg-yellow-100 px-3 py-2 rounded-xl border-2 border-yellow-400">
                <Zap className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                <span className="text-yellow-600 font-bold text-sm">2x XP</span>
              </div>
            )}
            
            {gameMode === 'normal' && (
              <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-xl">
                <Heart className="w-6 h-6 text-red-500 fill-red-500" />
                <span className="text-red-500 font-bold text-xl">{hearts}</span>
              </div>
            )}
            
            {hearts <= 2 && inventoryHook.hasItem('extra-hearts') && gameMode === 'normal' && (
              <button
                onClick={handleUseExtraHearts}
                className="px-3 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl text-sm hover:from-pink-600 hover:to-red-600 transition-all shadow-lg flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                Refill
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-700 font-bold text-sm uppercase tracking-wide">
              {currentQuestion.type === 'visual-count' ? 'Count the items' : 
               currentQuestion.type === 'number-sequence' ? 'Number sequence' : 
               currentQuestion.type === 'type-answer' ? 'Type your answer' :
               currentQuestion.type === 'match-equation' ? 'Match equations' : 'Math question'}
            </span>
          </div>


          <h2 className="text-3xl font-bold text-gray-800 mb-10 leading-tight">{currentQuestion.question}</h2>

          {/* Visual Content */}
          {currentQuestion.visualContent && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-10">
              <div className="flex flex-wrap justify-center items-center gap-2 max-w-xl mx-auto">
                {currentQuestion.visualContent.split('').map((char, index) => (
                  <span key={index} className="text-5xl">{char}</span>
                ))}
              </div>
            </div>
          )}

          {/* Visual Count - Show answer options */}
          {currentQuestion.type === 'visual-count' && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrectOption = option === currentQuestion.correctAnswer
                let cardClass = "relative p-8 rounded-2xl border-2 transition-all duration-200 cursor-pointer "
                if (showExplanation) {
                  if (isCorrectOption) {
                    cardClass += "bg-green-100 border-green-500"
                  } else if (isSelected && !isCorrect) {
                    cardClass += "bg-red-100 border-red-500"
                  } else {
                    cardClass += "bg-gray-50 border-gray-200 opacity-50"
                  }
                } else {
                  if (isSelected) {
                    cardClass += "bg-blue-100 border-blue-500 scale-105"
                  } else {
                    cardClass += "bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105"
                  }
                }
                return (
                  <button key={option} onClick={() => handleAnswerSelect(option)} disabled={showExplanation} className={cardClass}>
                    <div className="absolute top-3 right-3 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">{index + 1}</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-800 text-center">{option}</div>
                    {showExplanation && isCorrectOption && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <Check className="w-10 h-10 text-green-600" />
                        </div>
                      </div>
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <X className="w-10 h-10 text-red-600" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Multiple Choice & Number Sequence - use same UI */}
          {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'number-sequence') && currentQuestion.options && (
            <div className="grid grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrectOption = option === currentQuestion.correctAnswer
                let cardClass = "relative p-8 rounded-2xl border-4 transition-all duration-200 cursor-pointer "
                if (showExplanation) {
                  if (isCorrectOption) {
                    cardClass += "bg-green-600 border-green-500 shadow-lg shadow-green-500/50"
                  } else if (isSelected && !isCorrect) {
                    cardClass += "bg-red-600 border-red-500 shadow-lg shadow-red-500/50"
                  } else {
                    cardClass += "bg-slate-700 border-slate-600 opacity-50"
                  }
                } else {
                  if (isSelected) {
                    cardClass += "bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/50"
                  } else {
                    cardClass += "bg-slate-700 border-slate-600 hover:border-slate-500 hover:bg-slate-600"
                  }
                }
                return (
                  <button key={option} onClick={() => handleAnswerSelect(option)} disabled={showExplanation} className={cardClass}>
                    <div className="absolute top-3 right-3 w-6 h-6 bg-slate-800/50 rounded-full flex items-center justify-center">
                      <span className="text-xs text-slate-300">{index + 1}</span>
                    </div>
                    <div className="text-4xl font-bold text-white text-center">{option}</div>
                    {showExplanation && isCorrectOption && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-10 h-10 text-green-600" />
                        </div>
                      </div>
                    )}
                    {showExplanation && isSelected && !isCorrect && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <X className="w-10 h-10 text-red-600" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          {/* Drag-and-Drop */}
          {currentQuestion.type === 'drag-and-drop' && (
            <div className="mb-8">
              <p className="text-white mb-4">Match the number to its word:</p>
              <div className="flex gap-12 justify-center">
                <DragDropContext
                  onDragEnd={result => {
                    if (!result.destination || result.destination.droppableId === 'numbers') return;
                    const numIdx = result.source.index;
                    const wordIdx = parseInt(result.destination.droppableId.replace('word-', ''), 10);
                    setMatched(prev => {
                      const updated = [...prev];
                      updated[wordIdx] = numbers[numIdx];
                      return updated;
                    });
                    setNumbers(prev => prev.filter((_, idx) => idx !== numIdx));
                  }}
                >
                  {/* Draggable numbers */}
                  <Droppable droppableId="numbers">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-4">
                        {numbers.map((num, idx) => (
                          <Draggable key={num} draggableId={num} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-purple-900 text-white px-6 py-3 rounded-lg shadow-lg cursor-grab text-xl font-bold"
                                style={{ userSelect: 'none', ...provided.draggableProps.style }}
                              >
                                {num}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {/* Droppable word targets */}
                  <div className="flex flex-col gap-4">
                    {words.map((word, idx) => (
                      <Droppable droppableId={`word-${idx}`} key={word}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`bg-gray-800 text-purple-300 px-6 py-3 rounded-lg shadow text-xl font-semibold min-w-[120px] min-h-[48px] flex items-center justify-center border-2 ${snapshot.isDraggingOver ? 'border-purple-400' : 'border-transparent'}`}
                          >
                            {matched[idx] ? (
                              <span className="text-purple-100 font-bold text-xl">{matched[idx]}</span>
                            ) : (
                              <span>{word}</span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>
              </div>
            </div>
          )}

          {/* Type Answer */}
          {currentQuestion.type === 'type-answer' && (
            <div className="mb-8">
              <input
                type="text"
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={showExplanation}
                placeholder="Type your answer here..."
                className="w-full max-w-md mx-auto block px-6 py-4 text-2xl text-center bg-white text-gray-800 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-bold placeholder:text-gray-400"
                autoFocus
              />
            </div>
          )}

          {/* Match Equation - Drag equations to answers */}
          {currentQuestion.type === 'match-equation' && currentQuestion.equations && (
            <div className="mb-8">
              <p className="text-white mb-4">Drag each equation to its answer:</p>
              <div className="flex gap-12 justify-center">
                <DragDropContext
                  onDragEnd={result => {
                    if (!result.destination || result.destination.droppableId === 'equations') return;
                    
                    const answerIdx = parseInt(result.destination.droppableId.replace('answer-', ''), 10);
                    
                    // Don't allow dropping if the answer box already has an equation
                    if (equationMatched[answerIdx]) return;
                    
                    const eqIdx = result.source.index;
                    setEquationMatched(prev => {
                      const updated = [...prev];
                      updated[answerIdx] = equationItems[eqIdx];
                      return updated;
                    });
                    setEquationItems(prev => prev.filter((_, idx) => idx !== eqIdx));
                  }}
                >
                  {/* Draggable equations */}
                  <Droppable droppableId="equations">
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-4">
                        {equationItems.map((eq, idx) => (
                          <Draggable key={eq} draggableId={eq} index={idx}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-purple-900 text-white px-6 py-3 rounded-lg shadow-lg cursor-grab text-xl font-bold"
                                style={{ userSelect: 'none', ...provided.draggableProps.style }}
                              >
                                {eq}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  {/* Droppable answer targets */}
                  <div className="flex flex-col gap-4">
                    {answerBoxes.map((answer, idx) => (
                      <Droppable 
                        droppableId={`answer-${idx}`} 
                        key={answer}
                        isDropDisabled={!!equationMatched[idx]}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`bg-gray-800 text-purple-300 px-6 py-3 rounded-lg shadow text-xl font-semibold min-w-[120px] min-h-[48px] flex items-center justify-between gap-2 border-2 ${
                              snapshot.isDraggingOver && !equationMatched[idx] ? 'border-purple-400' : 
                              equationMatched[idx] ? 'border-green-500' : 'border-transparent'
                            }`}
                          >
                            {equationMatched[idx] ? (
                              <>
                                <span className="text-purple-100 font-bold text-xl">{equationMatched[idx]}</span>
                                <button
                                  onClick={() => {
                                    // Remove equation from matched and add back to equation items
                                    const equation = equationMatched[idx];
                                    setEquationMatched(prev => {
                                      const updated = [...prev];
                                      updated[idx] = null;
                                      return updated;
                                    });
                                    if (equation) {
                                      setEquationItems(prev => [...prev, equation]);
                                    }
                                  }}
                                  disabled={showExplanation}
                                  className="text-red-400 hover:text-red-300 bg-red-900/30 hover:bg-red-900/50 rounded-full p-1 transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <span>{answer}</span>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </DragDropContext>
              </div>
            </div>
          )}

          {/* Fill-in-the-Blank */}
          {currentQuestion.type === 'fill-blank' && currentQuestion.blanks && (
            <div className="mb-8">
              {currentQuestion.blanks.map((blank, idx) => {
                const parts = blank.text.split('__');
                return (
                  <div key={idx} className="mb-2">
                    {parts[0]}
                    <input
                      type="text"
                      className="underline mx-2 px-2 py-1 rounded bg-slate-700 text-white"
                      value={blankAnswers[idx] || ''}
                      onChange={e => handleBlankChange(idx, e.target.value)}
                      disabled={showExplanation}
                    />
                    {parts[1]}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tap-to-Select */}
          {currentQuestion.type === 'tap-select' && currentQuestion.tapOptions && (
            <div className="mb-8">
              <div className="flex gap-4">
                {currentQuestion.tapOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-6 py-4 rounded-xl font-bold ${multiSelected.includes(opt) ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-300'} ${showExplanation && (currentQuestion.tapCorrect?.includes(opt) ? 'border-4 border-green-400' : '')}`}
                    onClick={() => handleMultiSelect(opt)}
                    disabled={showExplanation}
                  >{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Order/Sequence */}
          {currentQuestion.type === 'order-sequence' && currentQuestion.sequence && (
            <div className="mb-8">
              <DragDropContext onDragEnd={handleSequenceDrag}>
                <Droppable droppableId="sequence">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex gap-4">
                      {sequenceOrder.map((item, idx) => (
                        <Draggable key={item} draggableId={item} index={idx}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-slate-700 text-white px-6 py-4 rounded-xl cursor-move"
                            >{item}</div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}

          {/* Audio */}
          {currentQuestion.type === 'audio' && currentQuestion.audioUrl && (
            <div className="mb-8">
              <audio controls src={currentQuestion.audioUrl} className="mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`bg-blue-600 text-white px-6 py-4 rounded-xl font-bold ${selectedAnswer === opt ? 'border-4 border-green-400' : ''}`}
                    onClick={() => handleAnswerSelect(opt)}
                    disabled={showExplanation}
                  >{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Picture Choice */}
          {currentQuestion.type === 'picture-choice' && currentQuestion.images && (
            <div className="mb-8 grid grid-cols-3 gap-4">
              {currentQuestion.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`bg-slate-700 rounded-xl p-4 flex flex-col items-center border-4 ${selectedAnswer === img.label ? 'border-green-400' : 'border-transparent'}`}
                  onClick={() => handleAnswerSelect(img.label)}
                  disabled={showExplanation}
                >
                  <img src={img.url} alt={img.label} className="w-24 h-24 object-contain mb-2" />
                  <span className="text-white font-bold">{img.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === 'true-false' && (
            <div className="mb-8 flex gap-8">
              <button
                className={`px-8 py-4 rounded-xl font-bold ${selectedAnswer === 'True' ? 'bg-green-600 text-white' : 'bg-slate-700 text-green-300'}`}
                onClick={() => handleAnswerSelect('True')}
                disabled={showExplanation}
              >True</button>
              <button
                className={`px-8 py-4 rounded-xl font-bold ${selectedAnswer === 'False' ? 'bg-red-600 text-white' : 'bg-slate-700 text-red-300'}`}
                onClick={() => handleAnswerSelect('False')}
                disabled={showExplanation}
              >False</button>
            </div>
          )}

          {/* Highlight */}
          {currentQuestion.type === 'highlight' && currentQuestion.highlightOptions && (
            <div className="mb-8">
              <div className="flex gap-4">
                {currentQuestion.highlightOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-6 py-4 rounded-xl font-bold ${multiSelected.includes(opt) ? 'bg-yellow-400 text-black' : 'bg-slate-700 text-yellow-300'} ${showExplanation && (currentQuestion.highlightCorrect?.includes(opt) ? 'border-4 border-green-400' : '')}`}
                    onClick={() => handleMultiSelect(opt)}
                    disabled={showExplanation}
                  >{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Mini-game */}
          {currentQuestion.type === 'mini-game' && (
            <div className="mb-8">
              <div className="flex gap-4">
                {currentQuestion.options?.map((opt, idx) => (
                  <button
                    key={idx}
                    className={`px-6 py-4 rounded-xl font-bold ${selectedAnswer === opt ? 'bg-pink-400 text-black' : 'bg-slate-700 text-pink-300'}`}
                    onClick={() => handleAnswerSelect(opt)}
                    disabled={showExplanation}
                  >{opt}</button>
                ))}
              </div>
              <p className="text-pink-300 mt-2">Pop every balloon labeled &apos;2&apos;!</p>
            </div>
          )}

          {/* Drag-and-Drop */}

          {/* Fill-in-the-Blank */}
          {currentQuestion.type === 'fill-blank' && currentQuestion.blanks && (
            <div className="mb-8">
              <p className="text-white mb-4">(Fill in the blank. UI not implemented yet.)</p>
              {currentQuestion.blanks.map((blank, idx) => {
                const parts = blank.text.split('__');
                return (
                  <div key={idx} className="mb-2">
                    {parts[0]}
                    <span className="underline mx-2">___</span>
                    {parts[1]}
                    <span className="ml-2 text-slate-400">(Answer: {blank.answer})</span>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tap-to-Select */}
          {currentQuestion.type === 'tap-select' && currentQuestion.tapOptions && (
            <div className="mb-8">
              <p className="text-white mb-4">(Tap all correct options. UI not implemented yet.)</p>
              <div className="flex gap-4">
                {currentQuestion.tapOptions.map((opt, idx) => (
                  <button key={idx} className="bg-blue-600 text-white px-6 py-4 rounded-xl">{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Order/Sequence */}
          {currentQuestion.type === 'order-sequence' && currentQuestion.sequence && (
            <div className="mb-8">
              <p className="text-white mb-4">(Arrange in order. UI not implemented yet.)</p>
              <div className="flex gap-4">
                {currentQuestion.sequence.map((item, idx) => (
                  <span key={idx} className="bg-slate-700 text-white px-6 py-4 rounded-xl">{item}</span>
                ))}
              </div>
            </div>
          )}

          {/* Audio */}
          {currentQuestion.type === 'audio' && currentQuestion.audioUrl && (
            <div className="mb-8">
              <audio controls src={currentQuestion.audioUrl} className="mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {currentQuestion.options?.map((opt, idx) => (
                  <button key={idx} className="bg-blue-600 text-white px-6 py-4 rounded-xl">{opt}</button>
                ))}
              </div>
            </div>
          )}

          {/* Picture Choice */}
          {currentQuestion.type === 'picture-choice' && currentQuestion.images && (
            <div className="mb-8 grid grid-cols-3 gap-4">
              {currentQuestion.images.map((img, idx) => (
                <div key={idx} className="bg-slate-700 rounded-xl p-4 flex flex-col items-center">
                  <img src={img.url} alt={img.label} className="w-24 h-24 object-contain mb-2" />
                  <span className="text-white font-bold">{img.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* True/False */}
          {currentQuestion.type === 'true-false' && (
            <div className="mb-8 flex gap-8">
              <button className="bg-green-600 text-white px-8 py-4 rounded-xl font-bold">True</button>
              <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold">False</button>
            </div>
          )}

          {/* Highlight */}
          {currentQuestion.type === 'highlight' && currentQuestion.highlightOptions && (
            <div className="mb-8">
              <p className="text-white mb-4">(Highlight all correct options. UI not implemented yet.)</p>
              <div className="flex gap-4">
                {currentQuestion.highlightOptions.map((opt, idx) => (
                  <span key={idx} className="bg-yellow-400 text-black px-6 py-4 rounded-xl cursor-pointer">{opt}</span>
                ))}
              </div>
            </div>
          )}

          {/* Mini-game */}
          {currentQuestion.type === 'mini-game' && (
            <div className="mb-8">
              <p className="text-white mb-4">(Mini-game: {currentQuestion.gameType}. UI not implemented yet.)</p>
              <div className="flex gap-4">
                {currentQuestion.options?.map((opt, idx) => (
                  <span key={idx} className="bg-pink-400 text-black px-6 py-4 rounded-xl cursor-pointer">{opt}</span>
                ))}
              </div>
            </div>
          )}

          {showExplanation && (
            <div className={`rounded-2xl p-6 mb-8 border-2 ${
              isCorrect 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="flex items-start gap-3">
                {isCorrect ? (
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Check className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <X className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <h3 className={`font-bold text-xl mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Awesome!' : 'Not quite'}
                  </h3>
                  <p className={`text-base leading-relaxed ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {currentQuestion.explanation}
                  </p>
                  {isCorrect && (
                    <div className="mt-3 inline-flex items-center gap-2 bg-yellow-100 border border-yellow-400 px-3 py-1 rounded-lg">
                      <span className="text-yellow-600 font-bold">
                        +{currentQuestion.xp * xpMultiplier} XP
                        {xpBoostActive && <span className="ml-1 text-xs">(2x)</span>}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-4 md:py-6 shadow-lg">
        <div className="max-w-5xl mx-auto">
          {!showExplanation ? (
            <>
              {/* Mobile: Stack buttons vertically */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* Top row on mobile: Skip and AI Tutor side by side */}
                <div className="flex gap-2 justify-between md:justify-start">
                  <button 
                    onClick={() => handleNext()} 
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wide hover:bg-gray-100 text-sm"
                  >
                    Skip
                  </button>
                  <button
                    onClick={() => setShowAITutor(true)}
                    className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all uppercase tracking-wide flex items-center gap-2 text-sm shadow-lg"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>AI Tutor</span>
                  </button>
                </div>

                {/* Bottom row on mobile: Check button full width */}
                <button
                  onClick={handleSubmit}
                  disabled={
                    currentQuestion.type === 'drag-and-drop'
                      ? matched.some(m => !m)
                      : currentQuestion.type === 'tap-select' || currentQuestion.type === 'highlight'
                      ? multiSelected.length === 0
                      : currentQuestion.type === 'fill-blank'
                      ? blankAnswers.length === 0 || blankAnswers.some(a => !a)
                      : currentQuestion.type === 'order-sequence'
                      ? false // Always enabled for sequence
                      : currentQuestion.type === 'type-answer'
                      ? !typedAnswer.trim()
                      : currentQuestion.type === 'match-equation'
                      ? equationMatched.some(eq => !eq)
                      : !selectedAnswer
                  }
                  className={`w-full md:w-auto px-12 py-4 rounded-xl font-bold text-white uppercase tracking-wide transition-all duration-200 ${
                    (currentQuestion.type === 'drag-and-drop'
                      ? !matched.some(m => !m)
                      : currentQuestion.type === 'tap-select' || currentQuestion.type === 'highlight'
                      ? multiSelected.length > 0
                      : currentQuestion.type === 'fill-blank'
                      ? blankAnswers.length > 0 && blankAnswers.every(a => a)
                      : currentQuestion.type === 'order-sequence'
                      ? true // Always enabled for sequence
                      : currentQuestion.type === 'type-answer'
                      ? !!typedAnswer.trim()
                      : currentQuestion.type === 'match-equation'
                      ? !equationMatched.some(eq => !eq)
                      : !!selectedAnswer)
                      ? 'bg-green-500 hover:bg-green-600 shadow-lg'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Check
                </button>
              </div>
            </>
          ) : (
            <button onClick={handleNext} className="w-full px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-200 shadow-lg">
              {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Complete'}
            </button>
          )}
        </div>
      </div>

      {/* AI Tutor Modal */}
      <AITutor
        question={currentQuestion.question}
        correctAnswer={currentQuestion.correctAnswer || ''}
        userAnswer={selectedAnswer || typedAnswer || ''}
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
      />
    </div>
  )
}
