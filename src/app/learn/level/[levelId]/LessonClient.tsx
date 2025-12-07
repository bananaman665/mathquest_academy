'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowRight, Check, X, Heart, Sparkles, Zap, Clock, Flame, Target, Lightbulb, Shield, Gift, FastForward, Brain } from 'lucide-react'
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
import ArrayDivision from '@/components/game/ArrayDivision'
import RemainderBoxes from '@/components/game/RemainderBoxes'
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
  // Loading state for async operations
  const [isProcessing, setIsProcessing] = useState(false)
  // Power-up usage tracking
  const [freebieUsedOnQuestion, setFreebieUsedOnQuestion] = useState(false)
  const [skipUsedOnQuestion, setSkipUsedOnQuestion] = useState(false)
  const [megaBrainUsed, setMegaBrainUsed] = useState(false)
  const [eliminatedAnswers, setEliminatedAnswers] = useState<string[]>([])

  // Confirmation dialog states
  const [showSkipConfirm, setShowSkipConfirm] = useState(false)
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  // Memoize expensive computations to prevent unnecessary re-renders
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex])

  // Get answer boxes dynamically based on current question
  const answerBoxes = useMemo(() =>
    currentQuestion?.type === 'match-equation' && currentQuestion?.equations
      ? currentQuestion.equations.map(e => e.answer)
      : [],
    [currentQuestion]
  )

  const progress = useMemo(() => ((currentQuestionIndex + 1) / questions.length) * 100, [currentQuestionIndex, questions.length])

  // Memoize inventory quantities to prevent excessive lookups
  const freebieCount = useMemo(() => inventoryHook.getItemQuantity('freebie'), [inventoryHook.inventory])
  const skipTokenCount = useMemo(() => inventoryHook.getItemQuantity('skip-token'), [inventoryHook.inventory])
  const megaBrainCount = useMemo(() => inventoryHook.getItemQuantity('mega-brain'), [inventoryHook.inventory])
  const extraHeartsCount = useMemo(() => inventoryHook.getItemQuantity('extra-hearts'), [inventoryHook.inventory])
  const hasActiveShield = useMemo(() =>
    inventoryHook.inventory.find(item => item.itemId === 'shield' && item.isActive),
    [inventoryHook.inventory]
  )

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
            // Time's up! End speed round
            // DISABLED: Infinite hearts mode - no game over
            // setHearts(0)
            // setShowGameOverModal(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameMode, phase, gameTimer])

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
            handleHeartLoss()
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
  // DISABLED: Infinite hearts mode - no game over
  /* useEffect(() => {
    if (hearts === 0 && phase === 'practice') {
      setShowGameOverModal(true)
    }
  }, [hearts, phase]) */

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
          setIsProcessing(true)
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP + earnedPoints}&correct=${correctCount + 1}&total=${currentQuestionIndex + 1}&mode=perfect-streak&perfect=true`)
        }, 1000)
      }
    } else {
      playIncorrect()
      handleHeartLoss()
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
          setIsProcessing(true)
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP + earnedPoints}&correct=${correctCount + 1}&total=${currentQuestionIndex + 1}&mode=perfect-streak&perfect=true`)
        }, 1000)
      }
    } else {
      playIncorrect()
      handleHeartLoss()
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
          setIsProcessing(true)
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP + earnedPoints}&correct=${correctCount + 1}&total=${currentQuestionIndex + 1}&mode=perfect-streak&perfect=true`)
        }, 1000)
      }
    } else {
      playIncorrect()
      handleHeartLoss()
      setCurrentStreak(0)
      setComboMultiplier(1)
    }
  }

  const handleSubmit = () => {
    // Prevent submitting if no hearts left
    // DISABLED: Infinite hearts mode
    /* if (hearts === 0) {
      setShowGameOverModal(true)
      return
    } */

    // Handle interactive components with their own submit logic
    if (interactiveSubmitFn && (
      currentQuestion.type === 'array-grid-builder' ||
      currentQuestion.type === 'group-maker' ||
      currentQuestion.type === 'skip-counter' ||
      currentQuestion.type === 'fair-share' ||
      currentQuestion.type === 'array-division' ||
      currentQuestion.type === 'remainder-boxes' ||
      currentQuestion.type === 'fill-the-jar' ||
      currentQuestion.type === 'balance-scale' ||
      currentQuestion.type === 'block-stacking' ||
      currentQuestion.type === 'ten-frame'
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
      // Check if all equation-answer pairs are correctly matched
      if (equationMatched.some(m => !m)) {
        // Not all boxes are filled
        correct = false
      } else {
        // All boxes are filled - now verify each match is correct
        correct = currentQuestion.equations?.every((pair, idx) => {
          return equationMatched[idx] === pair.equation
        }) || false
      }
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
          setIsProcessing(true)
          router.push(`/learn/level/${levelId}/complete?xp=${earnedXP + earnedPoints}&correct=${correctCount + 1}&total=${currentQuestionIndex + 1}&mode=perfect-streak&perfect=true`)
        }, 1000)
      }
    } else {
      playIncorrect() // Play error sound
      handleHeartLoss()
      setCurrentStreak(0)
      setComboMultiplier(1)
      
      // Perfect Streak mode: End immediately on wrong answer
      if (gameMode === 'perfect-streak') {
        setTimeout(() => {
          setIsProcessing(true)
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

  // Handle heart loss with Shield protection
  const handleHeartLoss = () => {
    // Check if Shield is active
    const hasActiveShield = inventoryHook.inventory.find(
      item => item.itemId === 'shield' && item.isActive
    )

    if (hasActiveShield) {
      // Shield protects from heart loss - deactivate it
      fetch('/api/inventory/deactivate-shield', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then(response => {
          if (response.ok) {
            // Shield consumed - refetch inventory to update UI
            inventoryHook.refetch()
          }
        })
        .catch(error => {
          console.error('Error deactivating shield:', error)
        })

      // Don't lose a heart - shield protects
      return
    }

    // No shield - lose a heart normally
    // DISABLED: Infinite hearts mode
    // setHearts(prev => Math.max(0, prev - 1))
  }

  // Handle using Freebie power-up
  const handleUseFreebie = async () => {
    if (freebieUsedOnQuestion) return

    try {
      const response = await fetch('/api/inventory/use-freebie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to use freebie')
      }

      // Success - auto-solve the question
      setFreebieUsedOnQuestion(true)
      setIsCorrect(true)
      setShowExplanation(true)
      playCorrect()

      // Award XP and update streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      if (newStreak > maxStreak) setMaxStreak(newStreak)

      const baseXP = currentQuestion.xp || 10
      const earnedPoints = Math.floor(baseXP * xpMultiplier * comboMultiplier)
      setEarnedXP(prev => prev + earnedPoints)
      setCorrectCount(prev => prev + 1)

      // Refetch inventory
      await inventoryHook.refetch()
    } catch (error) {
      console.error('Error using freebie:', error)
    }
  }

  // Handle using Skip Token power-up
  const handleUseSkipToken = async () => {
    if (skipUsedOnQuestion) return

    try {
      const response = await fetch('/api/inventory/use-skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to use skip token')
      }

      // Success - skip to next question without penalty
      setSkipUsedOnQuestion(true)

      // Refetch inventory
      await inventoryHook.refetch()

      // Move to next question
      handleNext()
    } catch (error) {
      console.error('Error using skip token:', error)
    }
  }

  // Handle using Mega Brain power-up
  const handleUseMegaBrain = async () => {
    if (megaBrainUsed || !currentQuestion.options) return

    try {
      const response = await fetch('/api/inventory/use-mega-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to use Mega Brain')
      }

      // Success - eliminate wrong answers
      setMegaBrainUsed(true)

      const wrongAnswers = currentQuestion.options.filter(
        opt => opt !== currentQuestion.correctAnswer
      )

      // Eliminate 2 random wrong answers
      const toEliminate = wrongAnswers
        .sort(() => Math.random() - 0.5)
        .slice(0, data.eliminateCount || 2)

      setEliminatedAnswers(toEliminate)

      // Refetch inventory
      await inventoryHook.refetch()
    } catch (error) {
      console.error('Error using Mega Brain:', error)
    }
  }

  // Game Over Modal Handlers
  const handleExitLevel = () => {
    stopLevelComplete() // Stop music if playing
    setIsProcessing(true)
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
      setFreebieUsedOnQuestion(false) // Reset power-up flags
      setSkipUsedOnQuestion(false)
      setMegaBrainUsed(false)
      setEliminatedAnswers([])
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
      setIsProcessing(true)
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
      <div className="min-h-screen bg-white">
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center items-center py-4 pt-16 sm:pt-6">
              <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-gray-900">Level {levelId}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-2xl mx-auto px-4 pt-48 sm:pt-40 py-8 pb-24">
          <div className="space-y-8">
            {/* Title Section */}
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-black text-black mb-2">{introduction.title}</h1>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-xl p-6 space-y-4">
              {introduction.content.map((paragraph, index) => (
                <p key={index} className="text-lg text-gray-800 leading-relaxed">{paragraph}</p>
              ))}
            </div>

            {/* Examples Section */}
            {introduction.examples && introduction.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-black">Examples</h3>
                <div className="space-y-3">
                  {introduction.examples.map((example, index) => (
                    <div key={index} className="bg-white border-2 border-gray-200 rounded-xl p-4">
                      <div className="text-2xl text-black mb-2">{example.visual}</div>
                      <div className="text-base text-gray-700">{example.word}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Start Button */}
            <div className="text-center pt-4">
              <button
                onClick={handleStartPractice}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-16 rounded-xl text-xl w-full sm:w-auto transition-colors"
              >
                Start Practice
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // PRACTICE PHASE - Duolingo-Inspired Clean Theme
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-full">
      {/* Loading Spinner Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 font-semibold">Loading...</p>
          </div>
        </div>
      )}

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

            {/* Shield Active Indicator */}
            {hasActiveShield && (
              <div className="flex items-center gap-1 sm:gap-2 bg-blue-100 px-2 sm:px-3 py-1 sm:py-2 rounded-xl border-2 border-blue-400">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                <span className="text-blue-600 font-bold text-xs sm:text-sm">Shield</span>
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
                  ∞
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-40 overflow-hidden" style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 6rem)' }}>
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
              {currentQuestion.options.filter(opt => !eliminatedAnswers.includes(opt)).map((option, index) => {
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

          {/* Multiple Choice & Number Sequence - use same UI */}
          {(currentQuestion.type === 'multiple-choice' || currentQuestion.type === 'number-sequence') && currentQuestion.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {currentQuestion.options.filter(opt => !eliminatedAnswers.includes(opt)).map((option, index) => {
                const isSelected = selectedAnswer === option
                const isCorrectOption = option === currentQuestion.correctAnswer

                let cardClass = "relative p-6 sm:p-8 rounded-2xl transition-all duration-200 cursor-pointer "

                if (showExplanation) {
                  if (isCorrectOption) {
                    cardClass += "bg-green-600 border-4 border-green-500"
                  } else if (isSelected && !isCorrect) {
                    cardClass += "bg-red-500 border-4 border-red-400"
                  } else {
                    cardClass += "bg-green-100 border-4 border-green-200 opacity-50"
                  }
                } else {
                  if (isSelected) {
                    cardClass += "bg-green-500 border-4 border-green-400 scale-105"
                  } else {
                    cardClass += "bg-green-100 hover:bg-green-200 border-4 border-green-300 hover:scale-105 active:scale-95"
                  }
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showExplanation}
                    className={cardClass}
                  >
                    {/* Option number badge */}
                    <div className="absolute top-3 right-3 w-7 h-7 bg-green-700 rounded-full flex items-center justify-center shadow">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>

                    {/* Answer text */}
                    <div className={`text-3xl sm:text-4xl font-bold text-center break-words ${
                      showExplanation
                        ? (isCorrectOption || (isSelected && !isCorrect)) ? 'text-white' : 'text-green-800'
                        : isSelected ? 'text-white' : 'text-green-900'
                    }`}>
                      {option}
                    </div>
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
                    // Don't remove numbers - keep them visible
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
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-grab text-xl font-bold"
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
                            className={`bg-white text-gray-700 px-6 py-3 rounded-lg shadow text-xl font-semibold min-w-[120px] min-h-[48px] flex items-center justify-center border-2 ${snapshot.isDraggingOver ? 'border-blue-400' : 'border-gray-300'}`}
                          >
                            {matched[idx] ? (
                              <span className="text-blue-600 font-bold text-xl">{matched[idx]}</span>
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
                allowNegative={levelId < 41 || levelId > 45}
                allowDecimal={false}
                allowFraction={levelId >= 41 && levelId <= 45}
                maxLength={10}
              />
            </div>
          )}

          {/* Block Stacking Question */}
          {currentQuestion.type === 'block-stacking' && currentQuestion.firstNumber !== undefined && currentQuestion.secondNumber !== undefined && currentQuestion.operation && (
            <div className="mb-8">
              <BlockStackingQuestion
                firstNumber={currentQuestion.firstNumber}
                secondNumber={currentQuestion.secondNumber}
                operation={currentQuestion.operation}
                correctAnswer={currentQuestion.correctAnswer ? parseInt(currentQuestion.correctAnswer.toString()) : 0}
                onAnswer={handleBlockStackingAnswer}
                question={currentQuestion.question}
                onSubmitReady={(fn) => setInteractiveSubmitFn(fn)}
                disabled={showExplanation}
              />
            </div>
          )}

          {/* Ten Frame Question */}
          {currentQuestion.type === 'ten-frame' && currentQuestion.correctPosition !== undefined && (
            <div className="mb-8">
              <TenFrame
                question={currentQuestion.question}
                correctPosition={currentQuestion.correctPosition}
                onAnswer={handleTenFrameAnswer}
                onSubmitReady={(fn) => setInteractiveSubmitFn(fn)}
              />
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
                onSubmitReady={setInteractiveSubmitFn}
              />
            </div>
          )}

          {/* Match Equation - Drag equations to answers */}
          {currentQuestion.type === 'match-equation' && currentQuestion.equations && (
            <div className="mb-8">
              <p className="text-center text-2xl sm:text-3xl font-bold text-black mb-6">Drag each equation to its answer</p>
              <div className="flex gap-3 sm:gap-6 justify-center items-start">
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
                      <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-2 sm:gap-3 flex-1 max-w-[45%]">
                        <div className="text-xs sm:text-sm font-bold text-black mb-1 text-center uppercase tracking-wide">Equations</div>
                        {equationItems.map((eq, idx) => (
                          <Draggable key={eq} draggableId={eq} index={idx}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-blue-500 text-white px-3 py-3 sm:px-6 sm:py-4 rounded-xl cursor-grab text-lg sm:text-xl font-bold transition-all ${
                                  snapshot.isDragging ? 'scale-110' : 'hover:scale-105'
                                }`}
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
                  <div className="flex flex-col gap-2 sm:gap-3 flex-1 max-w-[45%]">
                    <div className="text-xs sm:text-sm font-bold text-black mb-1 text-center uppercase tracking-wide">Answers</div>
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
                            className={`px-3 py-3 sm:px-6 sm:py-4 rounded-xl text-lg sm:text-xl font-bold min-h-[60px] sm:min-h-[72px] flex items-center justify-between gap-2 transition-all ${
                              snapshot.isDraggingOver && !equationMatched[idx] ? 'bg-white text-black scale-105' :
                              equationMatched[idx] ? 'bg-green-500 text-white' : 'bg-white text-black'
                            }`}
                          >
                            {equationMatched[idx] ? (
                              <>
                                <span className="text-white font-bold text-lg sm:text-xl flex-1 text-center">{equationMatched[idx]}</span>
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
                                  className="text-white bg-black hover:bg-white hover:text-black border-2 border-white rounded-full p-1.5 transition-colors flex-shrink-0"
                                >
                                  <X className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-black font-bold text-2xl sm:text-3xl text-center w-full">{answer}</span>
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
                  const userAnswer = blankAnswers[idx] || '';
                  const isAnswered = userAnswer.trim() !== '';
                  const isCorrectBlank = showExplanation && blank.answer === userAnswer.trim();
                  const isIncorrectBlank = showExplanation && isAnswered && !isCorrectBlank;
                  
                  let inputClass = "mx-2 px-4 py-2 rounded-xl text-2xl font-bold w-32 text-center border-4 transition-all duration-200 ";
                  
                  if (showExplanation) {
                    if (isCorrectBlank) {
                      inputClass += "bg-green-500 text-white border-green-400";
                    } else if (isIncorrectBlank) {
                      inputClass += "bg-red-500 text-white border-red-400";
                    } else {
                      inputClass += "bg-white text-black border-gray-300";
                    }
                  } else {
                    if (isAnswered) {
                      inputClass += "bg-blue-500 text-white border-blue-400";
                    } else {
                      inputClass += "bg-white text-gray-400 border-blue-300 focus:border-blue-500";
                    }
                  }
                  
                  return (
                    <div key={idx} className="mb-4 text-2xl font-bold text-black flex items-center justify-center">
                      <span className="mr-2">{parts[0]}</span>
                      <input
                        type="text"
                        className={inputClass}
                        value={userAnswer}
                        onChange={e => handleBlankChange(idx, e.target.value)}
                        disabled={showExplanation}
                        placeholder="?"
                      />
                      {parts[1] && parts[1] !== '_' && <span className="ml-2">{parts[1]}</span>}
                    </div>
                  );
                })
              ) : (
                // Simple fill-blank with just correctAnswer
                (() => {
                  const userAnswer = blankAnswers[0] || '';
                  const isAnswered = userAnswer.trim() !== '';
                  const isCorrectAnswer = showExplanation && currentQuestion.correctAnswer === userAnswer.trim();
                  const isIncorrectAnswer = showExplanation && isAnswered && !isCorrectAnswer;
                  
                  let inputClass = "px-6 py-3 rounded-xl text-2xl font-bold w-32 text-center border-4 transition-all duration-200 ";
                  
                  if (showExplanation) {
                    if (isCorrectAnswer) {
                      inputClass += "bg-green-500 text-white border-green-400";
                    } else if (isIncorrectAnswer) {
                      inputClass += "bg-red-500 text-white border-red-400";
                    } else {
                      inputClass += "bg-white text-black border-gray-300";
                    }
                  } else {
                    if (isAnswered) {
                      inputClass += "bg-blue-500 text-white border-blue-400";
                    } else {
                      inputClass += "bg-white text-gray-400 border-blue-300 focus:border-blue-500";
                    }
                  }
                  
                  return (
                    <div className="flex items-center justify-center gap-4 text-2xl font-bold text-black">
                      <span>{currentQuestion.question.split('___')[0]}</span>
                      <input
                        type="text"
                        className={inputClass}
                        value={userAnswer}
                        onChange={e => handleBlankChange(0, e.target.value)}
                        disabled={showExplanation}
                        placeholder="?"
                      />
                      {currentQuestion.question.split('___')[1] && currentQuestion.question.split('___')[1] !== '_' && (
                        <span>{currentQuestion.question.split('___')[1]}</span>
                      )}
                    </div>
                  );
                })()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                onSubmitReady={setInteractiveSubmitFn}
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                    handleHeartLoss()
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
                key={`skip-counter-${currentQuestionIndex}-${currentQuestion.id}`}
                skipBy={currentQuestion.skipCountBy ?? 5}
                numJumps={currentQuestion.skipCountJumps ?? 4}
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
                    handleHeartLoss()
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
                    handleHeartLoss()
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Array Division */}
          {currentQuestion.type === 'array-division' && (
            <div className="mb-8">
              <ArrayDivision
                totalItems={currentQuestion.arrayDivisionTotal || 15}
                divisor={currentQuestion.arrayDivisionDivisor || 5}
                question={currentQuestion.question}
                onSubmitReady={setInteractiveSubmitFn}
                onAnswer={(isCorrect: boolean) => {
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
                    handleHeartLoss()
                    setCurrentStreak(0)
                    setComboMultiplier(1)
                  }
                }}
              />
            </div>
          )}

          {/* Remainder Boxes */}
          {currentQuestion.type === 'remainder-boxes' && (
            <div className="mb-8">
              <RemainderBoxes
                totalItems={currentQuestion.remainderTotal || 17}
                itemsPerBox={currentQuestion.remainderPerBox || 5}
                question={currentQuestion.question}
                onSubmitReady={setInteractiveSubmitFn}
                onAnswer={(isCorrect: boolean) => {
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
                    handleHeartLoss()
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
                {currentQuestion.options?.filter(opt => !eliminatedAnswers.includes(opt)).map((opt, idx) => (
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
                {currentQuestion.options?.filter(opt => !eliminatedAnswers.includes(opt)).map((opt, idx) => (
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
</>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 py-4 md:py-6 pb-12 z-50">
        <div className="max-w-5xl mx-auto">
          {!showExplanation ? (
            <>
              {/* Mobile: Stack buttons vertically */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                {/* Top row on mobile: Power-ups and actions */}
                <div className="flex gap-2 flex-wrap justify-between md:justify-start">
                  {/* Freebie Button */}
                  {freebieCount > 0 && !freebieUsedOnQuestion && (
                    <button
                      onClick={handleUseFreebie}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                    >
                      <Gift size={20} />
                      Freebie
                    </button>
                  )}

                  {/* Skip Token Button */}
                  {skipTokenCount > 0 && !skipUsedOnQuestion && (
                    <button
                      onClick={handleUseSkipToken}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                    >
                      <FastForward size={20} />
                      Skip
                    </button>
                  )}

                  {/* Mega Brain Button - Only for multiple choice questions */}
                  {megaBrainCount > 0 && !megaBrainUsed && currentQuestion.options && currentQuestion.options.length > 2 && (
                    <button
                      onClick={handleUseMegaBrain}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                    >
                      <Brain size={20} />
                      Mega Brain
                    </button>
                  )}

                  {/* Hint Button */}
                  {currentQuestion.hints && currentQuestion.hints.length > 0 && (
                    <button
                      onClick={() => {
                        setShowHints(!showHints)
                        if (!showHints) {
                          setHintsUsed(prev => prev + 1)
                        }
                      }}
                      className="px-4 py-3 rounded-xl font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                    >
                      <Lightbulb size={20} className="opacity-90" />
                      Hint
                    </button>
                  )}

                  {/* Free Skip Button - Testing only */}
                  <button
                    onClick={() => setShowSkipConfirm(true)}
                    className="px-4 py-3 rounded-xl font-bold text-white bg-gray-500 hover:bg-gray-600 transition-all uppercase tracking-wide flex items-center gap-2 text-sm"
                  >
                    <FastForward size={20} />
                    Skip
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
                      : currentQuestion.type === 'array-grid-builder' ||
                        currentQuestion.type === 'group-maker' ||
                        currentQuestion.type === 'skip-counter' ||
                        currentQuestion.type === 'fair-share' ||
                        currentQuestion.type === 'array-division' ||
                        currentQuestion.type === 'remainder-boxes' ||
                        currentQuestion.type === 'fill-the-jar' ||
                        currentQuestion.type === 'balance-scale' ||
                        currentQuestion.type === 'block-stacking' ||
                        currentQuestion.type === 'ten-frame' ||
                        currentQuestion.type === 'number-line-placement'
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
                        currentQuestion.type === 'array-division' ||
                        currentQuestion.type === 'remainder-boxes' ||
                        currentQuestion.type === 'fill-the-jar' ||
                        currentQuestion.type === 'balance-scale' ||
                        currentQuestion.type === 'block-stacking' ||
                        currentQuestion.type === 'ten-frame' ||
                        currentQuestion.type === 'number-line-placement'
                      ? !!interactiveSubmitFn // Enabled when component provides submit function
                      : !!selectedAnswer)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  Check
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3">
              {/* Compact Feedback Display */}
              <div className={`flex items-center gap-3 p-3 rounded-xl border-2 ${
                isCorrect
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}>
                {/* Icon */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {isCorrect ? (
                    <Check className="w-6 h-6 text-white" />
                  ) : (
                    <X className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* Feedback Text */}
                <div className="flex-1 min-w-0">
                  <h3 className={`font-bold text-base ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? 'Awesome!' : 'Not quite'}
                  </h3>
                  <p className={`text-sm leading-snug line-clamp-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {currentQuestion.explanation}
                  </p>
                </div>

                {/* XP Badge */}
                {isCorrect && (
                  <div className="flex-shrink-0 bg-yellow-100 border border-yellow-400 px-3 py-1.5 rounded-lg">
                    <span className="text-yellow-700 font-bold text-sm whitespace-nowrap">
                      +{currentQuestion.xp * xpMultiplier} XP
                      {xpBoostActive && <span className="ml-1 text-xs">(2x)</span>}
                    </span>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button onClick={handleNext} className="w-full px-12 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl uppercase tracking-wide transition-all duration-200">
                {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Complete'}
              </button>
            </div>
          )}
        </div>
      </div> 

      {/* Game Over Modal - Ran Out of Hearts */}
      {showGameOverModal && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border-4 border-red-400 relative overflow-hidden">
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
                  <Heart className="w-32 h-32 text-red-500 fill-red-500" strokeWidth={2} />
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
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
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
              {extraHeartsCount > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 mb-6 border-2 border-green-300">
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="w-6 h-6 fill-green-500 text-green-500 animate-pulse" />
                    <p className="text-green-700 text-base font-bold">
                      {extraHeartsCount} Extra Heart{extraHeartsCount !== 1 ? 's' : ''} Available!
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Use Extra Hearts Button - Only show if available */}
                {extraHeartsCount > 0 && (
                  <button
                    onClick={handleUseExtraHearts}
                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-black text-lg rounded-xl transition-all duration-200 hover:scale-105 uppercase tracking-wide flex items-center justify-center gap-3 group"
                  >
                    <Heart className="w-6 h-6 fill-current group-hover:animate-pulse" />
                    Refill Hearts & Continue
                  </button>
                )}

                {/* Exit Button */}
                <button
                  onClick={handleExitLevel}
                  className="w-full px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-black text-lg rounded-xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2"
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
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full border-4 border-orange-400 animate-scale-up relative overflow-hidden">
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
                <Flame className="w-32 h-32 text-orange-500" strokeWidth={2} />
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

