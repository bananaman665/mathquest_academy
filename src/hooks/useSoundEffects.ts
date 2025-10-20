import { useCallback, useRef } from 'react'

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null)

  // Initialize AudioContext on first use
  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  // Play correct answer sound (bright, happy ding)
  const playCorrect = useCallback(() => {
    const audioContext = getAudioContext()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)

    // Duolingo-style success sound: C6 -> E6
    oscillator.frequency.setValueAtTime(1046.5, audioContext.currentTime) // C6
    oscillator.frequency.setValueAtTime(1318.5, audioContext.currentTime + 0.1) // E6
    
    oscillator.type = 'sine'
    
    // Envelope for smooth sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.4)
  }, [getAudioContext])

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

  // Play level complete sound (triumphant)
  const playLevelComplete = useCallback(() => {
    const audioContext = getAudioContext()
    
    // Play a major chord progression
    const playNote = (frequency: number, startTime: number, duration: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(frequency, startTime)
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration)

      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }

    const now = audioContext.currentTime
    // C major arpeggio
    playNote(523.25, now, 0.3) // C5
    playNote(659.25, now + 0.15, 0.3) // E5
    playNote(783.99, now + 0.3, 0.5) // G5
  }, [getAudioContext])

  return {
    playCorrect,
    playIncorrect,
    playLevelComplete,
  }
}
