'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ArrowRight, Check, X, Heart, Sparkles, Zap, Clock, Flame, Target } from 'lucide-react'
import { Question, GameMode } from '@/data/questions'
import BlockStackingQuestion from '@/components/game/BlockStackingQuestion'
import NumberLinePlacement from '@/components/game/NumberLinePlacement'
import TenFrame from '@/components/game/TenFrame'
import NumberLine from '@/components/game/NumberLine'
import NumberKeyboard from '@/components/NumberKeyboard'
import ConfirmDialog from '@/components/ConfirmDialog'
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
  const { playCorrect, playIncorrect, playLevelComplete, stopLevelComplete } = useSoundEffects()
  const [phase, setPhase] = useState<'intro' | 'practice'>('intro')
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
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showStreakMilestone, setShowStreakMilestone] = useState(false)
  const [streakMilestone, setStreakMilestone] = useState(0)
  // For interactive components that need manual CHECK button
  const [interactiveSubmitFn, setInteractiveSubmitFn] = useState<(() => void) | null>(null)

  // Confirmation dialog states
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  
  // Get answer boxes dynamically based on current question
  const answerBoxes = currentQuestion?.type === 'match-equation' && currentQuestion?.equations 
    ? currentQuestion.equations.map(e => e.answer) 
    : []
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  // Cleanup effect to restore scroll on unmount
  useEffect(() => {
    return () => {
      // Remove any scroll locks when component unmounts
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [])

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

  // Game Over Effect - Check if hearts reach 0
  useEffect(() => {
    if (hearts === 0 && phase === 'practice') {
      setShowGameOverModal(true)
    }
  }, [hearts, phase])

  const handleStartPractice = () => {
    setPhase('practice')
  }

  // Check for streak milestones and trigger celebration
  const checkStreakMilestone = (streak: number) => {
    const milestones = [5, 10, 15, 20, 25, 30]
    if (milestones.includes(streak)) {
      setStreakMilestone(streak)
      setShowStreakMilestone(true)
      // Auto-hide after 3 seconds
      setTimeout(() => {
        setShowStreakMilestone(false)
      }, 3000)
    }
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

  // Block stacking answer handler
  const handleBlockStackingAnswer = (isCorrect: boolean) => {
    setIsCorrect(isCorrect)
    setShowExplanation(true)
    
    if (isCorrect) {
      playCorrect()
      
      // Update streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak)
      }
      
      // Check for milestone celebration
      checkStreakMilestone(newStreak)
      
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
      playIncorrect()
      setHearts(prev => Math.max(0, prev - 1))
      setCurrentStreak(0)
      setComboMultiplier(1)
    }
  }

  // Ten frame answer handler
  const handleTenFrameAnswer = (isCorrect: boolean) => {
    setIsCorrect(isCorrect)
    setShowExplanation(true)
    
    if (isCorrect) {
      playCorrect()
      
      // Update streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak)
      }
      
      // Check for milestone celebration
      checkStreakMilestone(newStreak)
      
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
      playIncorrect()
      setHearts(prev => Math.max(0, prev - 1))
      setCurrentStreak(0)
      setComboMultiplier(1)
    }
  }

  // Number line answer handler
  const handleNumberLineAnswer = (isCorrect: boolean) => {
    setIsCorrect(isCorrect)
    setShowExplanation(true)
    
    if (isCorrect) {
      playCorrect()
      
      // Update streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak)
      }
      
      // Check for milestone celebration
      checkStreakMilestone(newStreak)
      
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
      playIncorrect()
      setHearts(prev => Math.max(0, prev - 1))
      setCurrentStreak(0)
      setComboMultiplier(1)
    }
  }

  const handleSubmit = () => {
    // Prevent submitting if no hearts left
    if (hearts === 0) {
      setShowGameOverModal(true)
      return
    }

    // Handle interactive components with their own submit logic
    if (interactiveSubmitFn && (
      currentQuestion.type === 'array-grid-builder' ||
      currentQuestion.type === 'group-maker' ||
      currentQuestion.type === 'skip-counter' ||
      currentQuestion.type === 'fair-share' ||
      currentQuestion.type === 'division-machine' ||
      currentQuestion.type === 'fill-the-jar'
    )) {
      interactiveSubmitFn()
      return
    }

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
      if (currentQuestion.blanks) {
        // Complex blanks with structured format
        correct = blankAnswers.every((ans, idx) => ans === (currentQuestion.blanks?.[idx].answer))
      } else if (currentQuestion.correctAnswer) {
        // Simple fill-blank with just correctAnswer
        correct = blankAnswers[0]?.trim().toLowerCase() === currentQuestion.correctAnswer.trim().toLowerCase()
      } else {
        correct = false
      }
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

      // Check acceptableAnswers if they exist
      if (acceptable.length > 0) {
        correct = acceptable.some(ans => {
          const normalizedAns = ans.trim()
          const normalizedUser = userAnswer
          const matches = normalizedAns.toLowerCase() === normalizedUser.toLowerCase()
          // Case-insensitive comparison
          return matches
        })
      }
      // Fall back to correctAnswer
      else if (currentQuestion.correctAnswer) {
        const normalizedCorrect = currentQuestion.correctAnswer.trim()
        correct = normalizedCorrect.toLowerCase() === userAnswer.toLowerCase()
      }
    } else if (currentQuestion.type === 'match-equation') {
      correct = !equationMatched.some(m => !m)
    } else if (currentQuestion.type === 'block-stacking') {
      // Block stacking is handled in the component itself
      // This is just for structure - actual validation happens in BlockStackingQuestion
      correct = selectedAnswer === currentQuestion.correctAnswer?.toString()
    } else if (currentQuestion.type === 'ten-frame') {
      // Ten frame is handled in the component itself
      // The component will call onAnswer with the result
      return // Don't continue to set feedback yet
    } else if (currentQuestion.type === 'number-line-placement') {
      // Number line is handled in the component itself
      // The component will call onAnswer with the result
      return // Don't continue to set feedback yet
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
      
      // Check for milestone celebration
      checkStreakMilestone(newStreak)
      
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
      
      // Calculate hint penalty
      const hintPenalty = hintsUsed > 0 ? 0.8 : 1
      
      // Total XP = base XP × XP boost × combo multiplier × game mode bonus × hint penalty
      const earnedPoints = Math.floor(currentQuestion.xp * xpMultiplier * newComboMultiplier * gameModeBonus * hintPenalty)
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
    try {
      const response = await fetch('/api/inventory/use-hearts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to use extra hearts')
      }

      // Success - restore hearts
      playCorrect()
      setHearts(prev => Math.min(prev + data.heartsAdded, 10))
      setShowGameOverModal(false)
      
      // Refetch inventory to update extra hearts count
      await inventoryHook.refetch()
    } catch (error) {
      console.error('Error using extra hearts:', error)
      playIncorrect()
    }
  }

  // Game Over Modal Handlers
  const handleExitLevel = () => {
    stopLevelComplete() // Stop music if playing
    router.push('/learn')
  }


  // Confirmation handlers
  const handleConfirmSkip = () => {
    setShowSkipConfirm(false)
    handleNext()
  }

  const handleConfirmExit = () => {
    setShowQuitConfirm(false)
    handleExitLevel()
  }

  const handleNext = () => {
    // Prevent advancing if no hearts left
    if (hearts === 0) {
      setShowGameOverModal(true)
      return
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setTypedAnswer('')
      setMultiSelected([])
      setBlankAnswers([])
      setInteractiveSubmitFn(null) // Reset interactive component submit function
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

  // Safety check: if currentQuestion is undefined, show loading state
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading question...</p>
        </div>
      </div>
    )
  }

  // INTRODUCTION PHASE
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        </div>

        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 pt-16 sm:pt-6">
              <Link href="/learn" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors group">
                <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                <span className="font-semibold">Back to Path</span>
              </Link>
              <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Level {levelId}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-2xl mx-auto px-4 pt-32 sm:pt-28 py-8 pb-24">
          <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-6 sm:p-10 mb-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3">{introduction.title}</h1>
              <p className="text-gray-600 text-lg sm:text-xl">Let&apos;s learn something new!</p>
            </div>

            <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
              {introduction.content.map((paragraph, index) => (
                <p key={index} className="text-lg sm:text-xl text-gray-700 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {introduction.examples && introduction.examples.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-purple-600" />
                  Examples:
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {introduction.examples.map((example, index) => (
                    <div key={index} className="bg-white border-2 border-purple-200 rounded-xl p-4 sm:p-6 hover:border-purple-400 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent min-w-fit">
                          {example.number}
                        </div>
                        <div className="flex-1 overflow-x-auto">
                          <div className="text-2xl sm:text-3xl text-black whitespace-nowrap pb-2">{example.visual}</div>
                        </div>
                      </div>
                      <div className="text-base sm:text-lg text-gray-700 font-semibold mt-2 ml-12 sm:ml-16">{example.word}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-center sticky bottom-4">
            <button
              onClick={handleStartPractice}
              className="group bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white font-black py-4 sm:py-5 px-12 sm:px-16 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 text-lg sm:text-xl w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-3">
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
    <div className="min-h-screen bg-white flex flex-col max-w-full">
      {/* White background extension for safe area */}
      <div className="w-full fixed top-0 left-0 right-0 bg-white z-50" style={{ height: 'calc(env(safe-area-inset-top, 0px) + 1rem + 4px)' }} />
      
      {/* Progress Bar */}
      <div className="w-full h-4 bg-gray-200 fixed safe-top left-0 right-0 z-50">
        <div className="bg-green-500 h-4 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <header className="px-4 py-4 border-b border-gray-200 bg-white fixed left-0 right-0 z-40" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 1rem)' }}>
        <div className="max-w-5xl mx-auto flex justify-between items-center gap-2">
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-xl hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
          <div className="flex items-center gap-1 sm:gap-3 flex-wrap justify-end">
            {/* Speed Round Timer */}
            {gameMode === 'speed-round' && (
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-xl border-2 font-bold text-sm sm:text-base ${
                gameTimer <= 10 
                  ? 'bg-red-100 border-red-400 text-red-600 animate-pulse' 
                  : 'bg-green-100 border-green-400 text-green-600'
              }`}>
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-lg sm:text-xl">{gameTimer}s</span>
              </div>
            )}
            
            {/* Lightning Mode Timer */}
            {gameMode === 'lightning' && (
              <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-xl border-2 font-bold text-sm sm:text-base ${
                questionTimer <= 3 
                  ? 'bg-red-100 border-red-400 text-red-600 animate-pulse' 
                  : 'bg-yellow-100 border-yellow-400 text-yellow-600'
              }`}>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                <span className="text-lg sm:text-xl">{questionTimer}s</span>
              </div>
            )}
            
            {xpBoostActive && (
              <div className="flex items-center gap-1 sm:gap-2 bg-yellow-100 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border-2 border-yellow-400">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 fill-yellow-600" />
                <span className="text-yellow-600 font-bold text-xs sm:text-sm">2x XP</span>
              </div>
            )}
            
            {gameMode === 'normal' && (
              <div className="flex items-center gap-1 sm:gap-2 bg-red-100 px-2 sm:px-4 py-1 sm:py-2 rounded-xl">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 fill-red-500" />
                <span className="text-red-500 font-bold text-lg sm:text-xl">
                  {hearts + (inventoryHook.getItemQuantity('extra-hearts') * 5)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-32" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6rem)' }}>
        <div className="w-full max-w-3xl">
          {!currentQuestion ? (
            <div className="text-center py-10">
              <p className="text-red-600 font-bold text-lg">Error: Question not found</p>
              <p className="text-gray-600 text-sm mt-2">Index: {currentQuestionIndex}, Total: {questions.length}</p>
            </div>
          ) : (
            <>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-10 leading-tight">{currentQuestion.question}</h2>

          {/* Hints Display */}
          {showHints && currentQuestion.hints && currentQuestion.hints.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">💡</span>
                </div>
                <div>
                  <h3 className="font-bold text-blue-700 mb-2">Hint:</h3>
                  <ul className="space-y-1">
                    {currentQuestion.hints.map((hint, index) => (
                      <li key={index} className="text-blue-800 text-base leading-relaxed">
                        • {hint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Visual Content */}
          {currentQuestion.visualContent && (
            <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-8 mb-10">
              <div className="flex flex-wrap justify-center items-center gap-2 max-w-xl mx-auto">
                {currentQuestion.visualContent.split('').map((char, index) => (
                  <span key={index} className="text-5xl text-black">{char}</span>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrectOption = option === currentQuestion.correctAnswer

                // Define vibrant color schemes for each option
                const colorSchemes = [
                  {
                    bg: 'from-blue-400 to-blue-600',
                    bgHover: 'from-blue-500 to-blue-700',
                    border: 'border-blue-300',
                    shadow: 'shadow-blue-500/30',
                    badge: 'bg-blue-700/80',
                    ring: 'ring-blue-400'
                  },
                  {
                    bg: 'from-purple-400 to-purple-600',
                    bgHover: 'from-purple-500 to-purple-700',
                    border: 'border-purple-300',
                    shadow: 'shadow-purple-500/30',
                    badge: 'bg-purple-700/80',
                    ring: 'ring-purple-400'
                  },
                  {
                    bg: 'from-pink-400 to-pink-600',
                    bgHover: 'from-pink-500 to-pink-700',
                    border: 'border-pink-300',
                    shadow: 'shadow-pink-500/30',
                    badge: 'bg-pink-700/80',
                    ring: 'ring-pink-400'
                  },
                  {
                    bg: 'from-orange-400 to-orange-600',
                    bgHover: 'from-orange-500 to-orange-700',
                    border: 'border-orange-300',
                    shadow: 'shadow-orange-500/30',
                    badge: 'bg-orange-700/80',
                    ring: 'ring-orange-400'
                  },
                ]

                const colors = colorSchemes[index % colorSchemes.length]

                let cardClass = "relative group p-6 sm:p-8 rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden "

                if (showExplanation) {
                  if (isCorrectOption) {
                    cardClass += "bg-gradient-to-br from-green-400 to-green-600 border-4 border-green-300 shadow-2xl shadow-green-500/50 scale-105 animate-pulse"
                  } else if (isSelected && !isCorrect) {
                    cardClass += "bg-gradient-to-br from-red-400 to-red-600 border-4 border-red-300 shadow-2xl shadow-red-500/50 scale-95"
                  } else {
                    cardClass += `bg-gradient-to-br ${colors.bg} border-4 ${colors.border} opacity-40 scale-95`
                  }
                } else {
                  if (isSelected) {
                    cardClass += `bg-gradient-to-br ${colors.bg} border-4 ${colors.border} shadow-2xl ${colors.shadow} scale-105 ring-4 ${colors.ring}`
                  } else {
                    cardClass += `bg-gradient-to-br ${colors.bg} border-4 ${colors.border} shadow-xl ${colors.shadow} hover:scale-105 hover:shadow-2xl active:scale-95`
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                    className={cardClass}
                  >
                    {/* Animated shimmer effect */}
                    {!showExplanation && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    )}

                    {/* Option number badge */}
                    <div className={`absolute top-4 right-4 w-8 h-8 ${colors.badge} backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 shadow-lg`}>
                      <span className="text-sm font-black text-white">{index + 1}</span>
                    </div>

                    {/* Answer text */}
                    <div className="relative z-10 text-3xl sm:text-4xl font-black text-white text-center break-words drop-shadow-lg">
                      {option}
                    </div>

                    {/* Correct answer overlay */}
                    {showExplanation && isCorrectOption && (
                      <div className="absolute inset-0 flex items-center justify-center bg-green-600/20 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                          <Check className="w-12 h-12 text-green-600 stroke-[3]" />
                        </div>
                      </div>
                    )}

                    {/* Wrong answer overlay */}
                    {showExplanation && isSelected && !isCorrect && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-600/20 backdrop-blur-sm">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <X className="w-12 h-12 text-red-600 stroke-[3]" />
                        </div>
                      </div>
                    )}

                    {/* Selection pulse animation */}
                    {isSelected && !showExplanation && (
                      <div className="absolute inset-0 rounded-3xl border-4 border-white/50 animate-ping"></div>
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
              <NumberKeyboard
                value={typedAnswer}
                onChange={setTypedAnswer}
                disabled={showExplanation}
                allowNegative={true}
                allowDecimal={false}
                maxLength={10}
              />
            </div>
          )}

          {/* Block Stacking Question */}
          {currentQuestion.type === 'block-stacking' && currentQuestion.firstNumber !== undefined && currentQuestion.secondNumber !== undefined && currentQuestion.operation && (
            <div className="mb-8">
              {!showExplanation && (
                <BlockStackingQuestion
                  firstNumber={currentQuestion.firstNumber}
                  secondNumber={currentQuestion.secondNumber}
                  operation={currentQuestion.operation}
                  correctAnswer={currentQuestion.correctAnswer ? parseInt(currentQuestion.correctAnswer.toString()) : 0}
                  onAnswer={handleBlockStackingAnswer}
                  question={currentQuestion.question}
                />
              )}
            </div>
          )}

          {/* Ten Frame Question */}
          {currentQuestion.type === 'ten-frame' && currentQuestion.correctPosition !== undefined && (
            <div className="mb-8">
              {!showExplanation && (
                <TenFrame
                  question={currentQuestion.question}
                  correctPosition={currentQuestion.correctPosition}
                  onAnswer={handleTenFrameAnswer}
                />
              )}
            </div>
          )}

          {/* Number Line Question */}
          {currentQuestion.type === 'number-line-placement' && currentQuestion.correctPosition !== undefined && (
            <div className="mb-8">
              <NumberLine
                question={currentQuestion.question}
                min={('numberLineMin' in currentQuestion ? (currentQuestion as unknown as Record<string, number>).numberLineMin : 0) || 0}
                max={('numberLineMax' in currentQuestion ? (currentQuestion as unknown as Record<string, number>).numberLineMax : 10) || 10}
                correctAnswer={currentQuestion.correctPosition}
                labelInterval={('numberLineLabelInterval' in currentQuestion ? (currentQuestion as unknown as Record<string, number>).numberLineLabelInterval : 1) || 1}
                onAnswer={handleNumberLineAnswer}
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
          {currentQuestion.type === 'fill-blank' && (
            <div className="mb-8">
              {currentQuestion.blanks ? (
                // Complex blanks with structured format
                currentQuestion.blanks.map((blank, idx) => {
                  const parts = blank.text.split('__');
                  return (
                    <div key={idx} className="mb-2 text-2xl font-bold text-black">
                      {parts[0]}
                      <input
                        type="text"
                        className="mx-2 px-2 py-1 rounded bg-slate-700 text-white border-0 outline-none"
                        value={blankAnswers[idx] || ''}
                        onChange={e => handleBlankChange(idx, e.target.value)}
                        disabled={showExplanation}
                      />
                      {parts[1]}
                    </div>
                  );
                })
              ) : (
                // Simple fill-blank with just correctAnswer
                <div className="flex items-center gap-4 text-2xl font-bold text-black">
                  <span>{currentQuestion.question.split('___')[0]}</span>
                  <input
                    type="text"
                    className="bg-slate-100 text-black text-2xl font-bold w-24 text-center px-2 py-1 border-0 outline-none focus:ring-2 focus:ring-blue-500 rounded transition-colors"
                    value={blankAnswers[0] || ''}
                    onChange={e => handleBlankChange(0, e.target.value)}
                    disabled={showExplanation}
                    placeholder="?"
                  />
                  <span>{currentQuestion.question.split('___')[1] || ''}</span>
                </div>
              )}
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

          {/* Number Line Drag */}
          {currentQuestion.type === 'number-line-drag' && (
            <div className="mb-8">
              <NumberLineDrag
                min={currentQuestion.numberLineMin || 0}
                max={currentQuestion.numberLineMax || 10}
                correctAnswer={currentQuestion.numberLineDragCorrect || 0}
                question={currentQuestion.question}
                onAnswer={(isCorrect, userAnswer) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Fraction Builder */}
          {currentQuestion.type === 'fraction-builder' && (
            <div className="mb-8">
              <FractionBuilder
                question={currentQuestion.question}
                denominator={currentQuestion.fractionDenominator || 4}
                correctNumerator={currentQuestion.fractionNumerator || 1}
                shape={'circle'}
                onAnswer={(isCorrect, userAnswer) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Clock Setter */}
          {currentQuestion.type === 'clock-setter' && (
            <div className="mb-8">
              <ClockSetter
                question={currentQuestion.question}
                correctHour={currentQuestion.clockHour || 12}
                correctMinute={currentQuestion.clockMinute || 0}
                use24Hour={currentQuestion.clockFormat === '24h'}
                onAnswer={(isCorrect, userAnswer) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Graph Plotter */}
          {currentQuestion.type === 'graph-plotter' && (
            <div className="mb-8">
              <GraphPlotter
                question={currentQuestion.question}
                correctPoints={[{ x: currentQuestion.correctPosition || 0, y: currentQuestion.secondNumber || 0 }]}
                xMin={currentQuestion.numberLineMin || -5}
                xMax={currentQuestion.numberLineMax || 5}
                yMin={-5}
                yMax={5}
                onAnswer={(isCorrect, userPoints) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Money Counter */}
          {currentQuestion.type === 'money-counter' && (
            <div className="mb-8">
              <MoneyCounter
                question={currentQuestion.question}
                targetAmount={currentQuestion.moneyTotal || 25}
                availableCoins={{ penny: 10, nickel: 5, dime: 5, quarter: 4, dollar: 2 }}
                showCents={true}
                onAnswer={(isCorrect, userAmount) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Array Builder */}
          {currentQuestion.type === 'array-builder' && (
            <div className="mb-8">
              <ArrayBuilder
                question={currentQuestion.question}
                rows={currentQuestion.arrayRows || 3}
                columns={currentQuestion.arrayColumns || 4}
                correctAnswer={(currentQuestion.arrayRows || 3) * (currentQuestion.arrayColumns || 4)}
                showMultiplication={true}
                onAnswer={(isCorrect, userAnswer) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Balance Scale */}
          {currentQuestion.type === 'balance-scale' && (
            <div className="mb-8">
              <BalanceScale
                question={currentQuestion.question}
                leftSide={[currentQuestion.balanceLeft !== undefined ? currentQuestion.balanceLeft : 0, 0]}
                rightSide={[currentQuestion.balanceRight !== undefined ? currentQuestion.balanceRight : 0]}
                missingValue={1}
                correctAnswer={parseInt(currentQuestion.correctAnswer || '0')}
                showEquals={true}
                onAnswer={(isCorrect, userAnswer) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Fill The Jar */}
          {currentQuestion.type === 'fill-the-jar' && (
            <div className="mb-8">
              <FillTheJar
                question={currentQuestion.question}
                targetNumber={currentQuestion.jarCapacity || 10}
                startingNumber={currentQuestion.jarFilled || 0}
                itemEmoji={currentQuestion.jarUnit || '🍎'}
                mode={'count'}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Shape Composer */}
          {currentQuestion.type === 'shape-composer' && (
            <div className="mb-8">
              <ShapeComposer
                question={currentQuestion.question}
                targetShape={(currentQuestion.shapeTargetSvg as 'square' | 'triangle' | 'circle' | 'rectangle') || 'square'}
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
                onAnswer={(isCorrect, selectedPieces) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Array Grid Builder - Multiplication */}
          {currentQuestion.type === 'array-grid-builder' && (
            <div className="mb-8">
              <ArrayGridBuilder
                targetRows={currentQuestion.arrayRows || 3}
                targetCols={currentQuestion.arrayColumns || 4}
                emoji={currentQuestion.arrayEmoji || '⭐'}
                onSubmitReady={setInteractiveSubmitFn}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Group Maker - Multiplication */}
          {currentQuestion.type === 'group-maker' && (
            <div className="mb-8">
              <GroupMaker
                targetGroups={currentQuestion.numberOfGroups || 4}
                itemsPerGroup={currentQuestion.groupSize || 3}
                emoji={currentQuestion.groupEmoji || '⭐'}
                onSubmitReady={setInteractiveSubmitFn}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Skip Counter - Multiplication */}
          {currentQuestion.type === 'skip-counter' && (
            <div className="mb-8">
              <SkipCounter
                skipBy={currentQuestion.skipCountBy || 5}
                numJumps={currentQuestion.skipCountJumps || 4}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Fair Share - Division */}
          {currentQuestion.type === 'fair-share' && (
            <div className="mb-8">
              <FairShare
                totalItems={currentQuestion.fairShareTotal || 12}
                numGroups={currentQuestion.fairShareGroups || 3}
                emoji={currentQuestion.fairShareEmoji || '🍪'}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Division Machine */}
          {currentQuestion.type === 'division-machine' && (
            <div className="mb-8">
              <DivisionMachine
                dividend={currentQuestion.divisionDividend || 15}
                divisor={currentQuestion.divisionDivisor || 5}
                emoji={currentQuestion.divisionEmoji || '⭐'}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                  if (isCorrect) {
                    playCorrect()
                    const xp = currentQuestion.xp * xpMultiplier
                    setEarnedXP(prev => prev + xp)
                    setCorrectCount(prev => prev + 1)
                    setCurrentStreak(prev => prev + 1)
                    setMaxStreak(prev => Math.max(prev, currentStreak + 1))
                    if (gameMode === 'perfect-streak') {
                      const newMultiplier = Math.min(Math.floor((currentStreak + 1) / 3) + 1, 5)
                      setComboMultiplier(newMultiplier)
                    }
                  } else {
                    playIncorrect()
                    setHearts(prev => Math.max(0, prev - 1))
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
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
              <p className="text-pink-300 mt-2">Mini-game: {currentQuestion.gameType || 'Unknown game type'}</p>
            </div>
          )}

          {/* Drag-and-Drop */}

          {/* Number Line Placement */}
          {currentQuestion.type === 'number-line-placement' && currentQuestion.numberLineMin !== undefined && currentQuestion.numberLineMax !== undefined && currentQuestion.correctPosition !== undefined && (
            <div className="mb-8 bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-8 border-2 border-purple-500/50">
              <NumberLinePlacement
                question={currentQuestion.question}
                correctPosition={currentQuestion.correctPosition}
                numberLineMin={currentQuestion.numberLineMin}
                numberLineMax={currentQuestion.numberLineMax}
                onAnswer={(isCorrect) => {
                  setIsCorrect(isCorrect)
                  setShowExplanation(true)
                }}
              />
            </div>
          )}

          {showExplanation && currentQuestion.type !== 'number-line-placement' && (
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
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-4 md:py-6 pb-12 shadow-lg z-50">
        <div className="max-w-5xl mx-auto">
          {!showExplanation ? (
            <>
              {/* Mobile: Stack buttons vertically */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* Top row on mobile: Skip and Hint */}
                <div className="flex gap-2 justify-between md:justify-start">
                  <button 
                    onClick={() => setShowSkipConfirm(true)} 
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:text-gray-700 transition-colors uppercase tracking-wide hover:bg-gray-100 text-sm"
                  >
                    Skip
                  </button>
                  {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                    <button
                      onClick={() => {
                        setShowHints(!showHints)
                        if (!showHints) {
                          setHintsUsed(prev => prev + 1)
                        }
                      }}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all uppercase tracking-wide flex items-center gap-2 text-sm shadow-lg"
                    >
                      💡 Hint
                    </button>
                  )}
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
                      : currentQuestion.type === 'array-grid-builder' ||
                        currentQuestion.type === 'group-maker' ||
                        currentQuestion.type === 'skip-counter' ||
                        currentQuestion.type === 'fair-share' ||
                        currentQuestion.type === 'division-machine' ||
                        currentQuestion.type === 'fill-the-jar'
                      ? !interactiveSubmitFn // Enabled when component provides submit function
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
                      : currentQuestion.type === 'array-grid-builder' ||
                        currentQuestion.type === 'group-maker' ||
                        currentQuestion.type === 'skip-counter' ||
                        currentQuestion.type === 'fair-share' ||
                        currentQuestion.type === 'division-machine' ||
                        currentQuestion.type === 'fill-the-jar'
                      ? !!interactiveSubmitFn // Enabled when component provides submit function
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

      {/* Game Over Modal - Ran Out of Hearts */}
      {showGameOverModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-4 border-red-400 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-red-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-100 rounded-full blur-2xl opacity-50 animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 w-28 h-28 bg-purple-100 rounded-full blur-2xl opacity-50 animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Broken Heart Animation */}
              <div className="mb-6 flex justify-center">
                <div className="relative animate-bounce">
                  <Heart className="w-32 h-32 text-red-500 fill-red-500 drop-shadow-2xl" strokeWidth={2} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1 h-40 bg-white rotate-45 absolute"></div>
                  </div>
                </div>
              </div>

              <h2 className="text-4xl font-black text-gray-900 mb-2 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Out of Hearts!
              </h2>
              <p className="text-gray-700 text-lg mb-6 font-semibold">Don&apos;t give up! You&apos;re learning!</p>

              {/* Progress Display */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-orange-200 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700 font-bold text-sm uppercase tracking-wide">Your Progress</span>
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-4xl font-black text-transparent bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text mb-1">
                  {correctCount} / {questions.length}
                </p>
                <p className="text-gray-600 text-sm font-medium">Questions Correct</p>
                {earnedXP > 0 && (
                  <div className="mt-3 pt-3 border-t border-orange-200">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-lg font-bold text-orange-600">+{earnedXP} XP Earned</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Extra Hearts Available */}
              {inventoryHook.getItemQuantity('extra-hearts') > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border-2 border-green-300 shadow-md">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 fill-green-500 text-green-500 animate-pulse" />
                    <p className="text-green-700 text-base font-bold">
                      {inventoryHook.getItemQuantity('extra-hearts')} Extra Heart{inventoryHook.getItemQuantity('extra-hearts') !== 1 ? 's' : ''} Available!
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Use Extra Hearts Button - Only show if available */}
                {inventoryHook.getItemQuantity('extra-hearts') > 0 && (
                  <button
                    onClick={handleUseExtraHearts}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 uppercase tracking-wide flex items-center justify-center gap-3 group"
                  >
                    <Heart className="w-6 h-6 fill-current group-hover:animate-pulse" />
                    Refill Hearts & Continue
                  </button>
                )}

                {/* Exit Button */}
                <button
                  onClick={handleExitLevel}
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl uppercase tracking-wide flex items-center justify-center gap-2"
                >
                  Exit Level
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Tip Text */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                <p className="text-blue-800 text-sm font-semibold flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Visit the Shop to stock up on Extra Hearts!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak Milestone Celebration Modal */}
      {showStreakMilestone && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-4 border-orange-400 animate-scale-up relative overflow-hidden">
            {/* Animated background sparkles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-10 left-10 w-20 h-20 bg-orange-100 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-100 rounded-full blur-xl animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-orange-50 rounded-full blur-xl animate-pulse delay-500"></div>
            </div>

            {/* Content */}
            <div className="text-center relative z-10">
              {/* Modern Fire Icon */}
              <div className="mb-6 flex justify-center animate-bounce">
                <Flame className="w-32 h-32 text-orange-500 drop-shadow-2xl" strokeWidth={2} />
              </div>
              
              <h2 className="text-4xl font-black text-gray-900 mb-2">
                {streakMilestone >= 20 ? 'LEGENDARY!' : 
                 streakMilestone >= 15 ? 'PHENOMENAL!' :
                 streakMilestone >= 10 ? 'AMAZING!' : 
                 'ON FIRE!'}
              </h2>
              <p className="text-gray-700 text-2xl font-bold mb-4">
                {streakMilestone} Question Streak!
              </p>

              {/* Bonus XP Display */}
              <div className="bg-orange-50 rounded-xl p-4 mb-6 border-2 border-orange-200">
                <p className="text-orange-600 text-sm font-semibold mb-1">Streak Bonus</p>
                <p className="text-3xl font-black text-orange-600">
                  +{streakMilestone >= 20 ? 500 : streakMilestone >= 15 ? 300 : streakMilestone >= 10 ? 200 : 100} XP
                </p>
              </div>

              {/* Combo Multiplier */}
              {comboMultiplier > 1 && (
                <div className="bg-yellow-50 rounded-xl p-3 mb-6 border-2 border-yellow-200">
                  <p className="text-yellow-700 text-lg font-bold flex items-center gap-2">
                    <Target className="w-6 h-6 text-yellow-700" />
                    {comboMultiplier}x Combo Multiplier Active!
                  </p>
                </div>
              )}

              {/* Encouragement Text */}
              <p className="text-gray-700 text-lg font-semibold">
                {streakMilestone >= 20 ? 'You\'re unstoppable!' :
                 streakMilestone >= 15 ? 'Keep crushing it!' :
                 streakMilestone >= 10 ? 'You\'re a math champion!' :
                 'Keep the streak alive!'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Skip Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showSkipConfirm}
        onClose={() => setShowSkipConfirm(false)}
        onConfirm={handleConfirmSkip}
        title="Skip this question?"
        message="You won't earn XP for skipped questions. Are you sure you want to skip?"
        confirmText="Skip"
        cancelText="Keep Learning"
        variant="warning"
      />

      {/* Exit/Quit Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showQuitConfirm}
        onClose={() => setShowQuitConfirm(false)}
        onConfirm={handleConfirmExit}
        title="Exit lesson?"
        message="Your progress will be saved, but you'll return to the Learn page. Are you sure you want to exit?"
        confirmText="Exit"
        cancelText="Stay"
        variant="danger"
      />
    </div>
  )
}

