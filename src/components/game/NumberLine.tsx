'use client'

import { useState, useRef } from 'react'
import { PartyPopper, X } from 'lucide-react'

interface NumberLineProps {
  question: string
  min: number
  max: number
  correctAnswer: number
  labelInterval?: number
  onAnswer: (isCorrect: boolean) => void
}

export default function NumberLine({
  question,
  min,
  max,
  correctAnswer,
  labelInterval = 1,
  onAnswer,
}: NumberLineProps) {
  const [markedPosition, setMarkedPosition] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const lineRef = useRef<HTMLDivElement>(null)
  const tolerance = 1 // Within 1 unit

  // Smart label interval calculation to avoid overcrowding
  const range = max - min
  let smartInterval = labelInterval
  
  // If range is too large, increase interval to show fewer labels
  if (range > 15) {
    smartInterval = 5 // Show every 5th number
  } else if (range > 10) {
    smartInterval = 2 // Show every 2nd number
  } else {
    smartInterval = 1 // Show every number
  }

  // Generate labels for the number line
  const labels = []
  for (let i = min; i <= max; i += smartInterval) {
    labels.push(i)
  }
  // Always include the max value if not already included
  if (labels[labels.length - 1] !== max) {
    labels.push(max)
  }

  // Calculate pixel position from value
  const getPixelPosition = (value: number): number => {
    if (!lineRef.current) return 0
    const lineWidth = lineRef.current.offsetWidth
    const range = max - min
    return ((value - min) / range) * lineWidth
  }

  // Calculate value from pixel position
  const getValueFromPixel = (pixelX: number): number => {
    if (!lineRef.current) return min
    const lineRect = lineRef.current.getBoundingClientRect()
    const relativeX = pixelX - lineRect.left
    const lineWidth = lineRect.width
    const range = max - min
    const value = min + (relativeX / lineWidth) * range
    return Math.round(value * 10) / 10 // Round to 1 decimal
  }

  // Handle click on the number line
  const handleLineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFeedback) return
    const value = getValueFromPixel(e.clientX)
    setMarkedPosition(Math.max(min, Math.min(max, value)))
  }

  // Handle touch on the number line
  const handleLineTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showFeedback) return
    const touch = e.touches[0]
    const value = getValueFromPixel(touch.clientX)
    setMarkedPosition(Math.max(min, Math.min(max, value)))
  }

  // Handle submit
  const handleSubmit = () => {
    if (markedPosition === null) return

    const correct = Math.abs(markedPosition - correctAnswer) <= tolerance
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  // Handle reset
  const handleReset = () => {
    setMarkedPosition(null)
    setShowFeedback(false)
  }

  const markedPixelPosition = markedPosition !== null ? getPixelPosition(markedPosition) : null
  const correctPixelPosition = getPixelPosition(correctAnswer)

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-4">{question}</h3>
        <p className="text-gray-300 text-lg">
          Click or tap on the number line to place <span className="font-bold text-blue-400">{correctAnswer}</span>
        </p>
      </div>

      {/* Number Line Container */}
      <div className="w-full max-w-4xl bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl p-12 border-2 border-purple-500/50">
        {/* Title showing range */}
        <div className="text-center mb-8">
          <p className="text-gray-300 font-semibold">
            From <span className="text-blue-400 font-bold">{min}</span> to <span className="text-blue-400 font-bold">{max}</span>
          </p>
        </div>

        {/* The Number Line */}
        <div className="relative mb-12">
          {/* Line container and interactive area */}
          <div
            ref={lineRef}
            onClick={handleLineClick}
            onTouchStart={handleLineTouchStart}
            className="relative h-16 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors border-2 border-slate-600"
          >
            {/* Main line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-500 -translate-y-1/2" />

            {/* Tick marks and labels */}
            <div className="absolute top-0 left-0 right-0 h-full flex justify-between px-2">
              {labels.map((label) => {
                const isEndpoint = label === min || label === max
                return (
                  <div key={`tick-${label}`} className="flex flex-col items-center h-full relative">
                    {/* Tick mark */}
                    <div
                      className={`${
                        isEndpoint ? 'h-8 bg-slate-300' : 'h-5 bg-slate-400'
                      } w-1 rounded-full -translate-x-0.5`}
                    />
                    {/* Label */}
                    <div className="absolute -bottom-8 text-slate-300 font-bold text-sm whitespace-nowrap">
                      {label}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Marked position indicator */}
            {markedPosition !== null && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all"
                style={{ left: `${markedPixelPosition}px` }}
              >
                <div className="flex flex-col items-center">
                  {/* Marker dot */}
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-blue-300 shadow-lg shadow-blue-500/50 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  {/* Value display */}
                  <div className="mt-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold whitespace-nowrap">
                    {markedPosition}
                  </div>
                </div>
              </div>
            )}

            {/* Correct answer indicator (shown after feedback) */}
            {showFeedback && (
              <div
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                style={{ left: `${correctPixelPosition}px` }}
              >
                <div className="flex flex-col items-center">
                  {isCorrect ? (
                    <>
                      <div className="w-6 h-6 bg-green-500 rounded-full border-2 border-green-300 shadow-lg shadow-green-500/50 flex items-center justify-center">
                        <span className="text-white font-bold">✓</span>
                      </div>
                      <div className="mt-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        {correctAnswer}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 bg-red-500 rounded-full border-2 border-red-300 shadow-lg shadow-red-500/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">✓</span>
                      </div>
                      <div className="mt-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        {correctAnswer}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Spacing for labels */}
          <div className="h-12" />
        </div>

        {/* Current selection display */}
        {markedPosition !== null && !showFeedback && (
          <div className="text-center mb-6">
            <p className="text-gray-300 text-lg">
              You selected: <span className="text-blue-400 font-bold text-2xl">{markedPosition}</span>
            </p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      {!showFeedback && (
        <button
          onClick={handleSubmit}
          disabled={markedPosition === null}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-colors ${
            markedPosition !== null
              ? 'bg-purple-500 hover:bg-purple-600 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-600'
          }`}
        >
          Check Answer
        </button>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div className="w-full max-w-md">
          <div
            className={`p-6 rounded-lg text-center font-bold text-lg ${
              isCorrect
                ? 'bg-green-500/20 text-green-300 border-2 border-green-500'
                : 'bg-red-500/20 text-red-300 border-2 border-red-500'
            }`}
          >
            {isCorrect ? (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <PartyPopper className="w-6 h-6" />
                  Perfect!
                </div>
                <div>You found {correctAnswer} on the number line!</div>
              </div>
            ) : (
              <div>
                <div className="text-2xl mb-2 flex items-center justify-center gap-2">
                  <X className="w-6 h-6" />
                  Not quite
                </div>
                <div>You marked {markedPosition}, but the correct answer is {correctAnswer}</div>
              </div>
            )}
          </div>

          {!isCorrect && (
            <button
              onClick={handleReset}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
