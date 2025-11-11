'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

interface PointPlotterProps {
  question: string
  targetPoints: Array<{ x: number; y: number; label?: string }>
  gridSize?: number
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  showLabels?: boolean
  onAnswer: (isCorrect: boolean, answer?: { x: number; y: number }[]) => void
}

interface PlottedPoint {
  x: number
  y: number
  id: string
}

export default function PointPlotter({
  question,
  targetPoints,
  gridSize = 10,
  xMin = 0,
  xMax = 10,
  yMin = 0,
  yMax = 10,
  showLabels = true,
  onAnswer,
}: PointPlotterProps) {
  const [plottedPoints, setPlottedPoints] = useState<PlottedPoint[]>([])
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)

  const cellSize = 40 // pixels per grid cell
  const width = (xMax - xMin) * cellSize
  const height = (yMax - yMin) * cellSize

  // Convert grid coordinates to pixel coordinates
  const gridToPixel = (x: number, y: number) => ({
    px: (x - xMin) * cellSize,
    py: height - (y - yMin) * cellSize, // Flip y-axis for screen coords
  })

  // Convert pixel coordinates to grid coordinates
  const pixelToGrid = (px: number, py: number) => ({
    x: Math.round(px / cellSize + xMin),
    y: Math.round((height - py) / cellSize + yMin),
  })

  const handleGridClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (hasAnswered) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const px = e.clientX - rect.left
    const py = e.clientY - rect.top

    const { x, y } = pixelToGrid(px, py)

    // Check if coordinates are within bounds
    if (x < xMin || x > xMax || y < yMin || y > yMax) return

    // Check if we already have enough points
    if (plottedPoints.length >= targetPoints.length) return

    // Add new point
    const newPoint: PlottedPoint = {
      x,
      y,
      id: `point-${Date.now()}`,
    }

    setPlottedPoints([...plottedPoints, newPoint])
  }

  const handlePointClick = (e: React.MouseEvent, pointId: string) => {
    e.stopPropagation()
    if (hasAnswered) return
    setSelectedPoint(pointId)
  }

  const handleRemovePoint = (pointId: string) => {
    if (hasAnswered) return
    setPlottedPoints(plottedPoints.filter(p => p.id !== pointId))
    setSelectedPoint(null)
  }

  const handleCheckAnswer = () => {
    if (plottedPoints.length !== targetPoints.length) {
      onAnswer(false)
      setHasAnswered(true)
      return
    }

    // Check if all target points are plotted (order doesn't matter)
    const isCorrect = targetPoints.every(target =>
      plottedPoints.some(plotted => plotted.x === target.x && plotted.y === target.y)
    )

    setHasAnswered(true)
    onAnswer(isCorrect, plottedPoints)
  }

  // Auto-submit when all points are plotted correctly
  useEffect(() => {
    if (!hasAnswered && plottedPoints.length === targetPoints.length) {
      const isCorrect = targetPoints.every(target =>
        plottedPoints.some(plotted => plotted.x === target.x && plotted.y === target.y)
      )
      
      if (isCorrect) {
        setTimeout(() => {
          handleCheckAnswer();
        }, 500);
      }
    }
  }, [plottedPoints, hasAnswered, targetPoints]);

  const handleClear = () => {
    setPlottedPoints([])
    setSelectedPoint(null)
    setHasAnswered(false)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl">
      {/* Question */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        {showLabels && (
          <p className="text-sm text-gray-600">
            Plot these points:{' '}
            {targetPoints.map((p, i) => (
              <span key={i} className="font-mono font-semibold text-indigo-600">
                {i > 0 && ', '}({p.x}, {p.y}){p.label && ` (${p.label})`}
              </span>
            ))}
          </p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          Click on the grid to plot points • {plottedPoints.length}/{targetPoints.length} plotted
        </p>
      </div>

      {/* Graph */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="bg-white border-2 border-indigo-300 rounded-lg cursor-crosshair"
          onClick={handleGridClick}
        >
          {/* Grid lines */}
          {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
            const x = i * cellSize
            return (
              <line
                key={`v-${i}`}
                x1={x}
                y1={0}
                x2={x}
                y2={height}
                stroke="#e5e7eb"
                strokeWidth={i === Math.abs(xMin) ? 2 : 1}
              />
            )
          })}
          {Array.from({ length: yMax - yMin + 1 }).map((_, i) => {
            const y = i * cellSize
            return (
              <line
                key={`h-${i}`}
                x1={0}
                y1={y}
                x2={width}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={i === Math.abs(yMin) ? 2 : 1}
              />
            )
          })}

          {/* Axes (if they're in range) */}
          {xMin <= 0 && xMax >= 0 && (
            <line
              x1={Math.abs(xMin) * cellSize}
              y1={0}
              x2={Math.abs(xMin) * cellSize}
              y2={height}
              stroke="#4f46e5"
              strokeWidth={2}
            />
          )}
          {yMin <= 0 && yMax >= 0 && (
            <line
              x1={0}
              y1={height - Math.abs(yMin) * cellSize}
              x2={width}
              y2={height - Math.abs(yMin) * cellSize}
              stroke="#4f46e5"
              strokeWidth={2}
            />
          )}

          {/* Axis labels */}
          {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
            const x = i * cellSize
            const label = i + xMin
            if (label === 0) return null
            return (
              <text
                key={`x-label-${i}`}
                x={x}
                y={height - 5}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {label}
              </text>
            )
          })}
          {Array.from({ length: yMax - yMin + 1 }).map((_, i) => {
            const y = i * cellSize
            const label = yMax - i
            if (label === 0) return null
            return (
              <text
                key={`y-label-${i}`}
                x={5}
                y={y + 5}
                textAnchor="start"
                fontSize="12"
                fill="#6b7280"
              >
                {label}
              </text>
            )
          })}

          {/* Plotted points */}
          <AnimatePresence>
            {plottedPoints.map((point) => {
              const { px, py } = gridToPixel(point.x, point.y)
              const isSelected = selectedPoint === point.id
              return (
                <motion.g
                  key={point.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onClick={(e) => handlePointClick(e as React.MouseEvent<SVGGElement>, point.id)}
                >
                  <circle
                    cx={px}
                    cy={py}
                    r={8}
                    fill={isSelected ? '#ef4444' : '#4f46e5'}
                    stroke="white"
                    strokeWidth={2}
                    className="cursor-pointer hover:scale-110 transition-transform"
                  />
                  <text
                    x={px}
                    y={py - 15}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#4f46e5"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    ({point.x},{point.y})
                  </text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        {selectedPoint && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => handleRemovePoint(selectedPoint)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
          >
            Remove Selected Point
          </motion.button>
        )}
        {plottedPoints.length > 0 && !hasAnswered && (
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Hint */}
      {!hasAnswered && (
        <div className="text-sm text-gray-600 bg-white/50 px-4 py-2 rounded-lg">
          💡 Tip: Click anywhere on the grid to plot a point. Click a point to select it, then remove it if needed.
        </div>
      )}
    </div>
  )
}
