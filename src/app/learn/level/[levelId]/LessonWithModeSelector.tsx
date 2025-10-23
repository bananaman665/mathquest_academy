'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameMode, Question } from '@/data/questions'
import GameModeSelector from '@/components/game/GameModeSelector'
import LessonClient from './LessonClient'

interface LessonWithModeSelectorProps {
  levelId: number
  introduction: {
    title: string
    content: string[]
    examples: Array<{ number: string; visual: string; word: string }>
  }
  questions: Question[]
}

export default function LessonWithModeSelector({ levelId, introduction, questions }: LessonWithModeSelectorProps) {
  const [showModeSelector, setShowModeSelector] = useState(true)
  const [selectedMode, setSelectedMode] = useState<GameMode>('normal')
  const router = useRouter()

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode)
    setShowModeSelector(false)
  }

  const handleCancel = () => {
    router.push('/learn')
  }

  if (showModeSelector) {
    return <GameModeSelector onSelectMode={handleSelectMode} onCancel={handleCancel} />
  }

  return (
    <LessonClient 
      levelId={levelId} 
      introduction={introduction} 
      questions={questions}
      gameMode={selectedMode}
    />
  )
}
