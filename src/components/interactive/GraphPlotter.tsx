'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Point {
  x: number
  y: number
}

interface GraphPlotterProps {
  question: string
  correctPoints: Point[] // Points that need to be plotted
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  gridSize?: number // Size of each grid square
  allowMultiplePoints?: boolean // Allow plotting multiple points
  showLine?: boolean // Connect points with a line
  checkOrder?: boolean // For ordered pairs, check if points are in correct order
  onAnswer: (isCorrect: boolean, userPoints: Point[]) => void
}

export default function GraphPlotter({
  question,
  correctPoints,
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  gridSize = 40,
  allowMultiplePoints = false,
  showLine = false,
  checkOrder = false,
  onAnswer
}: GraphPlotterProps) {
  const [plottedPoints, setPlottedPoints] = useState<Point[]>([])
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null)

  const width = (xMax - xMin) * gridSize
  const height = (yMax - yMin) * gridSize

  // Convert graph coordinates to pixel coordinates
  const graphToPixel = (point: Point): { x: number; y: number } => {
    const pixelX = ((point.x - xMin) / (xMax - xMin)) * width
    const pixelY = height - ((point.y - yMin) / (yMax - yMin)) * height
    return { x: pixelX, y: pixelY }
  }

  // Convert pixel coordinates to graph coordinates (snapped to grid)
  const pixelToGraph = (pixelX: number, pixelY: number): Point => {
    const x = Math.round((pixelX / width) * (xMax - xMin) + xMin)
    const y = Math.round((1 - pixelY / height) * (yMax - yMin) + yMin)
    return { x, y }
  }

  const handleGraphClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (hasSubmitted) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const pixelX = e.clientX - rect.left
    const pixelY = e.clientY - rect.top

    const point = pixelToGraph(pixelX, pixelY)

    // Check if point already exists
    const existingIndex = plottedPoints.findIndex(
      (p) => p.x === point.x && p.y === point.y
    )

    if (existingIndex !== -1) {
      // Remove point if clicked again
      setPlottedPoints(plottedPoints.filter((_, i) => i !== existingIndex))
    } else {
      // Add new point
      if (allowMultiplePoints) {
        setPlottedPoints([...plottedPoints, point])
      } else {
        setPlottedPoints([point])
      }
    }
  }

  const handleGraphHover = (e: React.MouseEvent<SVGSVGElement>) => {
    if (hasSubmitted) return

    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const pixelX = e.clientX - rect.left
    const pixelY = e.clientY - rect.top

    const point = pixelToGraph(pixelX, pixelY)
    setHoveredPoint(point)
  }

  const handleSubmit = () => {
    if (hasSubmitted || plottedPoints.length === 0) return

    let isCorrect = false

    if (checkOrder) {
      // Check if points match in exact order
      isCorrect =
        plottedPoints.length === correctPoints.length &&
        plottedPoints.every(
          (p, i) => p.x === correctPoints[i].x && p.y === correctPoints[i].y
        )
    } else {
      // Check if all correct points are plotted (order doesn't matter)
      isCorrect =
        plottedPoints.length === correctPoints.length &&
        correctPoints.every((cp) =>
          plottedPoints.some((p) => p.x === cp.x && p.y === cp.y)
        )
    }

    setHasSubmitted(true)
    onAnswer(isCorrect, plottedPoints)
  }

  const handleClear = () => {
    if (!hasSubmitted) {
      setPlottedPoints([])
    }
  }

  // Check if a point is correct
  const isPointCorrect = (point: Point): boolean => {
    return correctPoints.some((cp) => cp.x === point.x && cp.y === point.y)
  }

  // Generate grid lines
  const renderGrid = () => {
    const lines = []

    // Vertical lines
    for (let x = xMin; x <= xMax; x++) {
      const pixel = graphToPixel({ x, y: 0 })
      const isAxis = x === 0
      lines.push(
        <line
          key={`v-${x}`}
          x1={pixel.x}
          y1={0}
          x2={pixel.x}
          y2={height}
          stroke={isAxis ? '#374151' : '#E5E7EB'}
          strokeWidth={isAxis ? 2 : 1}
        />
      )
    }

    // Horizontal lines
    for (let y = yMin; y <= yMax; y++) {
      const pixel = graphToPixel({ x: 0, y })
      const isAxis = y === 0
      lines.push(
        <line
          key={`h-${y}`}
          x1={0}
          y1={pixel.y}
          x2={width}
          y2={pixel.y}
          stroke={isAxis ? '#374151' : '#E5E7EB'}
          strokeWidth={isAxis ? 2 : 1}
        />
      )
    }

    return lines
  }

  // Generate axis labels
  const renderLabels = () => {
    const labels = []

    // X-axis labels
    for (let x = xMin; x <= xMax; x++) {
      if (x === 0) continue
      const pixel = graphToPixel({ x, y: 0 })
      labels.push(
        <text
          key={`x-label-${x}`}
          x={pixel.x}
          y={pixel.y + 20}
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-600"
        >
          {x}
        </text>
      )
    }

    // Y-axis labels
    for (let y = yMin; y <= yMax; y++) {
      if (y === 0) continue
      const pixel = graphToPixel({ x: 0, y })
      labels.push(
        <text
          key={`y-label-${y}`}
          x={pixel.x - 15}
          y={pixel.y + 5}
          textAnchor="middle"
          className="text-xs font-semibold fill-gray-600"
        >
          {y}
        </text>
      )
    }

    // Origin label
    const origin = graphToPixel({ x: 0, y: 0 })
    labels.push(
      <text
        key="origin"
        x={origin.x - 15}
        y={origin.y + 20}
        textAnchor="middle"
        className="text-xs font-bold fill-gray-700"
      >
        0
      </text>
    )

    return labels
  }

  // Render line connecting points
  const renderLine = () => {
    if (!showLine || plottedPoints.length < 2) return null

    // Create a path that connects all points and closes the shape
    const pathData = plottedPoints
      .map((point, i) => {
        const pixel = graphToPixel(point)
        return `${i === 0 ? 'M' : 'L'} ${pixel.x} ${pixel.y}`
      })
      .join(' ')

    // Close the path by connecting back to the first point (if 3+ points for a closed shape)
    const closedPath = plottedPoints.length >= 3 ? `${pathData} Z` : pathData

    // Determine color based on correctness
    const allCorrect = plottedPoints.every(isPointCorrect)
    const lineColor = hasSubmitted 
      ? (allCorrect ? '#10B981' : '#EF4444') 
      : '#3B82F6'

    return (
      <path
        d={closedPath}
        stroke={lineColor}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        <p className="text-gray-600">
          {allowMultiplePoints
            ? 'Click to plot points. Click again to remove.'
            : 'Click to plot a point on the graph.'}
        </p>
      </div>

      {/* Graph Container */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="flex justify-center">
          <svg
            width={width}
            height={height}
            className="border-2 border-gray-300 rounded-lg cursor-crosshair"
            onClick={handleGraphClick}
            onMouseMove={handleGraphHover}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            {/* Grid */}
            {renderGrid()}

            {/* Line connecting points */}
            {renderLine()}

            {/* Axis labels */}
            {renderLabels()}

            {/* Hovered point preview */}
            {hoveredPoint && !hasSubmitted && (
              <g>
                <circle
                  cx={graphToPixel(hoveredPoint).x}
                  cy={graphToPixel(hoveredPoint).y}
                  r={8}
                  fill="#93C5FD"
                  opacity={0.5}
                />
                <text
                  x={graphToPixel(hoveredPoint).x}
                  y={graphToPixel(hoveredPoint).y - 15}
                  textAnchor="middle"
                  className="text-sm font-bold fill-blue-600"
                >
                  ({hoveredPoint.x}, {hoveredPoint.y})
                </text>
              </g>
            )}

            {/* Plotted points */}
            {plottedPoints.map((point, index) => {
              const pixel = graphToPixel(point)
              const isCorrect = isPointCorrect(point)
              const color = hasSubmitted
                ? isCorrect
                  ? '#10B981'
                  : '#EF4444'
                : '#3B82F6'

              return (
                <g key={`point-${index}-${point.x}-${point.y}`}>
                  <motion.circle
                    cx={pixel.x}
                    cy={pixel.y}
                    r={10}
                    fill={color}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="cursor-pointer"
                  />
                  <circle
                    cx={pixel.x}
                    cy={pixel.y}
                    r={6}
                    fill="white"
                  />
                  <text
                    x={pixel.x}
                    y={pixel.y - 18}
                    textAnchor="middle"
                    className="text-xs font-bold"
                    fill={color}
                  >
                    ({point.x}, {point.y})
                  </text>
                </g>
              )
            })}

            {/* Show correct points after submission if wrong */}
            {hasSubmitted &&
              correctPoints.map((point, index) => {
                const isPlotted = plottedPoints.some(
                  (p) => p.x === point.x && p.y === point.y
                )
                if (isPlotted) return null

                const pixel = graphToPixel(point)
                return (
                  <g key={`correct-${index}-${point.x}-${point.y}`}>
                    <motion.circle
                      cx={pixel.x}
                      cy={pixel.y}
                      r={10}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth={3}
                      strokeDasharray="4 2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, delay: 0.3 }}
                    />
                    <text
                      x={pixel.x}
                      y={pixel.y - 18}
                      textAnchor="middle"
                      className="text-xs font-bold fill-green-600"
                    >
                      ({point.x}, {point.y})
                    </text>
                  </g>
                )
              })}
          </svg>
        </div>
      </div>

      {/* Current Answer Display */}
      <div className="text-center mb-6">
        <p className="text-lg text-gray-700 font-medium">
          Points plotted:{' '}
          <span className="font-bold text-blue-600">
            {plottedPoints.length === 0
              ? 'None'
              : plottedPoints.map((p) => `(${p.x}, ${p.y})`).join(', ')}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleClear}
          disabled={hasSubmitted || plottedPoints.length === 0}
          className={`px-6 py-3 rounded-full font-bold text-white transition-all duration-200 ${
            hasSubmitted || plottedPoints.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 active:scale-95'
          }`}
        >
          Clear
        </button>

        <button
          onClick={handleSubmit}
          disabled={hasSubmitted || plottedPoints.length === 0}
          className={`px-8 py-3 rounded-full font-bold text-white text-lg transition-all duration-200 ${
            hasSubmitted || plottedPoints.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 shadow-lg'
          }`}
        >
          Submit Answer
        </button>
      </div>

      {/* Result Message */}
      {hasSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg text-center font-bold text-lg ${
            plottedPoints.length === correctPoints.length &&
            correctPoints.every((cp) =>
              plottedPoints.some((p) => p.x === cp.x && p.y === cp.y)
            )
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {plottedPoints.length === correctPoints.length &&
          correctPoints.every((cp) =>
            plottedPoints.some((p) => p.x === cp.x && p.y === cp.y)
          )
            ? '🎉 Correct! Great job plotting those points!'
            : '❌ Not quite right. The correct points are shown with dashed circles.'}
        </motion.div>
      )}
    </div>
  )
}
