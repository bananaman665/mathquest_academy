'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

interface ClockSetterProps {
  correctHour: number // 0-23 (24-hour format) or 1-12
  correctMinute: number // 0-59
  question: string
  onAnswer: (isCorrect: boolean, userTime: string) => void
  use24Hour?: boolean
}

export default function ClockSetter({
  correctHour,
  correctMinute,
  question,
  onAnswer,
  use24Hour = false
}: ClockSetterProps) {
  const [hour, setHour] = useState(12)
  const [minute, setMinute] = useState(0)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isDraggingHour, setIsDraggingHour] = useState(false)
  const [isDraggingMinute, setIsDraggingMinute] = useState(false)
  const clockRef = useRef<HTMLDivElement>(null)

  const centerX = 150
  const centerY = 150
  const radius = 120

  const getAngleFromPosition = (clientX: number, clientY: number): number => {
    if (!clockRef.current) return 0
    const rect = clockRef.current.getBoundingClientRect()
    const x = clientX - (rect.left + rect.width / 2)
    const y = clientY - (rect.top + rect.height / 2)
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90
    if (angle < 0) angle += 360
    return angle
  }

  const handleHourDrag = (clientX: number, clientY: number) => {
    const angle = getAngleFromPosition(clientX, clientY)
    const newHour = Math.round((angle / 360) * 12) % 12 || 12
    setHour(newHour)
    // Hour hand affects minute position slightly
    const minuteFromHour = ((angle % 30) / 30) * 60
    if (Math.abs(minuteFromHour - minute) > 30) {
      setMinute(Math.round(minuteFromHour / 5) * 5)
    }
  }

  const handleMinuteDrag = (clientX: number, clientY: number) => {
    const angle = getAngleFromPosition(clientX, clientY)
    const newMinute = Math.round((angle / 360) * 60) % 60
    // Snap to 5-minute intervals for easier use
    const snappedMinute = Math.round(newMinute / 5) * 5 % 60
    setMinute(snappedMinute)
    
    // Adjust hour hand slightly as minutes change
    const hourFromMinute = hour + (snappedMinute / 60)
    setHour(Math.floor(hourFromMinute))
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const isCorrect = hour === (use24Hour ? correctHour : correctHour % 12 || 12) && minute === correctMinute
    setHasSubmitted(true)
    const timeString = `${hour}:${minute.toString().padStart(2, '0')}`
    onAnswer(isCorrect, timeString)
  }

  // Calculate hand positions
  const hourAngle = ((hour % 12) + minute / 60) * 30 - 90 // 30 degrees per hour
  const minuteAngle = minute * 6 - 90 // 6 degrees per minute

  const hourHandLength = 70
  const minuteHandLength = 100

  const hourHandX = centerX + hourHandLength * Math.cos((hourAngle * Math.PI) / 180)
  const hourHandY = centerY + hourHandLength * Math.sin((hourAngle * Math.PI) / 180)

  const minuteHandX = centerX + minuteHandLength * Math.cos((minuteAngle * Math.PI) / 180)
  const minuteHandY = centerY + minuteHandLength * Math.sin((minuteAngle * Math.PI) / 180)

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        <p className="text-lg text-gray-600">Drag the clock hands to set the time</p>
      </div>

      {/* Clock Display */}
      <div className="flex justify-center mb-8">
        <div
          ref={clockRef}
          className="relative"
          onMouseMove={(e) => {
            if (isDraggingHour) handleHourDrag(e.clientX, e.clientY)
            if (isDraggingMinute) handleMinuteDrag(e.clientX, e.clientY)
          }}
          onMouseUp={() => {
            setIsDraggingHour(false)
            setIsDraggingMinute(false)
          }}
          onMouseLeave={() => {
            setIsDraggingHour(false)
            setIsDraggingMinute(false)
          }}
          onTouchMove={(e) => {
            if (e.touches.length > 0) {
              if (isDraggingHour) handleHourDrag(e.touches[0].clientX, e.touches[0].clientY)
              if (isDraggingMinute) handleMinuteDrag(e.touches[0].clientX, e.touches[0].clientY)
            }
          }}
          onTouchEnd={() => {
            setIsDraggingHour(false)
            setIsDraggingMinute(false)
          }}
        >
          <svg width="300" height="300" className="drop-shadow-2xl">
            {/* Clock Face */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="white"
              stroke="#374151"
              strokeWidth="6"
            />

            {/* Hour Markers */}
            {[...Array(12)].map((_, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x1 = centerX + (radius - 15) * Math.cos(angle)
              const y1 = centerY + (radius - 15) * Math.sin(angle)
              const x2 = centerX + (radius - 5) * Math.cos(angle)
              const y2 = centerY + (radius - 5) * Math.sin(angle)

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#374151"
                  strokeWidth="3"
                />
              )
            })}

            {/* Hour Numbers */}
            {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num, i) => {
              const angle = (i * 30 - 90) * (Math.PI / 180)
              const x = centerX + (radius - 30) * Math.cos(angle)
              const y = centerY + (radius - 30) * Math.sin(angle)

              return (
                <text
                  key={num}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold fill-gray-700 select-none"
                >
                  {num}
                </text>
              )
            })}

            {/* Hour Hand */}
            <line
              x1={centerX}
              y1={centerY}
              x2={hourHandX}
              y2={hourHandY}
              stroke={hasSubmitted ? (hour === (correctHour % 12 || 12) ? '#10b981' : '#ef4444') : '#3b82f6'}
              strokeWidth="8"
              strokeLinecap="round"
              className={hasSubmitted ? 'cursor-default' : 'cursor-grab'}
            />

            {/* Hour Hand Drag Circle */}
            <circle
              cx={hourHandX}
              cy={hourHandY}
              r="15"
              fill={hasSubmitted ? (hour === (correctHour % 12 || 12) ? '#10b981' : '#ef4444') : '#3b82f6'}
              stroke="white"
              strokeWidth="3"
              className={hasSubmitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
              onMouseDown={() => !hasSubmitted && setIsDraggingHour(true)}
              onTouchStart={() => !hasSubmitted && setIsDraggingHour(true)}
            />

            {/* Minute Hand */}
            <line
              x1={centerX}
              y1={centerY}
              x2={minuteHandX}
              y2={minuteHandY}
              stroke={hasSubmitted ? (minute === correctMinute ? '#10b981' : '#ef4444') : '#8b5cf6'}
              strokeWidth="6"
              strokeLinecap="round"
              className={hasSubmitted ? 'cursor-default' : 'cursor-grab'}
            />

            {/* Minute Hand Drag Circle */}
            <circle
              cx={minuteHandX}
              cy={minuteHandY}
              r="12"
              fill={hasSubmitted ? (minute === correctMinute ? '#10b981' : '#ef4444') : '#8b5cf6'}
              stroke="white"
              strokeWidth="3"
              className={hasSubmitted ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
              onMouseDown={() => !hasSubmitted && setIsDraggingMinute(true)}
              onTouchStart={() => !hasSubmitted && setIsDraggingMinute(true)}
            />

            {/* Center Circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="#374151"
            />
          </svg>
        </div>
      </div>

      {/* Digital Time Display */}
      <div className="text-center mb-6">
        <div className={`inline-block px-8 py-4 rounded-2xl text-6xl font-bold font-mono transition-colors duration-300 ${
          hasSubmitted
            ? hour === (correctHour % 12 || 12) && minute === correctMinute
              ? 'bg-green-100 text-green-700 border-4 border-green-500'
              : 'bg-red-100 text-red-700 border-4 border-red-500'
            : 'bg-blue-100 text-blue-700 border-4 border-blue-500'
        }`}>
          {hour}:{minute.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Submit Button */}
      {!hasSubmitted ? (
        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Submit Time
          </button>
        </div>
      ) : (
        <motion.div
          className="text-center"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          {hour === (correctHour % 12 || 12) && minute === correctMinute ? (
            <div className="bg-green-100 border-4 border-green-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🎉</div>
              <div className="text-2xl font-bold text-green-700">Perfect Time!</div>
              <div className="text-lg text-green-600 mt-2">
                {correctHour % 12 || 12}:{correctMinute.toString().padStart(2, '0')} is correct!
              </div>
            </div>
          ) : (
            <div className="bg-red-100 border-4 border-red-500 rounded-2xl p-6">
              <div className="text-6xl mb-2">🕐</div>
              <div className="text-2xl font-bold text-red-700">Try Again!</div>
              <div className="text-lg text-red-600 mt-2">
                The correct time is {correctHour % 12 || 12}:{correctMinute.toString().padStart(2, '0')}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}
