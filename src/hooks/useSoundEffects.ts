import { useCallback, useRef } from 'react'

export const useSoundEffects = () => {
  const correctSoundRef = useRef<HTMLAudioElement | null>(null)
  const levelCompleteSoundRef = useRef<HTMLAudioElement | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext on first use
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Play correct answer sound (digital chime)
  const playCorrect = useCallback(() => {
    if (!correctSoundRef.current) {
      correctSoundRef.current = new Audio('/sounds/correct-answer.mp3')
      correctSoundRef.current.volume = 0.5
    }
    correctSoundRef.current.currentTime = 0
    correctSoundRef.current.play().catch(() => {
      // Ignore errors if audio can't play
    })
  }, [])

  // Play incorrect answer sound (lower, gentle "oops" sound)
  const playIncorrect = useCallback(() => {
    const audioContext = getAudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Descending tone for incorrect: E4 -> C4
    oscillator.frequency.setValueAtTime(329.63, audioContext.currentTime) // E4
    oscillator.frequency.linearRampToValueAtTime(261.63, audioContext.currentTime + 0.2) // C4
    
    oscillator.type = 'triangle' // Softer sound
    
    // Gentler envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.5)
  }, [getAudioContext])

  // Play level complete sound (triumphant game show music)
  const playLevelComplete = useCallback(() => {
    if (!levelCompleteSoundRef.current) {
      levelCompleteSoundRef.current = new Audio('/sounds/lesson-complete.mp3')
      levelCompleteSoundRef.current.volume = 0.6
    }
    levelCompleteSoundRef.current.currentTime = 0
    levelCompleteSoundRef.current.play().catch(() => {
      // Ignore errors if audio can't play
    })
  }, [])

  // Stop level complete sound (useful when user escapes the lesson)
  const stopLevelComplete = useCallback(() => {
    if (levelCompleteSoundRef.current) {
      levelCompleteSoundRef.current.pause()
      levelCompleteSoundRef.current.currentTime = 0
    }
  }, [])

  return {
    playCorrect,
    playIncorrect,
    playLevelComplete,
    stopLevelComplete,
  }
}
