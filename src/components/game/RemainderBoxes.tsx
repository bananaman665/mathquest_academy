'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Star } from 'lucide-react'

interface RemainderBoxesProps {
  totalItems: number
  itemsPerBox: number
  onAnswer: (isCorrect: boolean) => void
  question: string
  onSubmitReady?: (submitFn: (() => void) | null) => void
}

export default function RemainderBoxes({
  totalItems,
  itemsPerBox,
  onAnswer,
  question,
  onSubmitReady,
}: RemainderBoxesProps) {
  const [availableItems, setAvailableItems] = useState<string[]>([])
  const [boxes, setBoxes] = useState<string[][]>([])

  const correctBoxes = Math.floor(totalItems / itemsPerBox)
  const correctRemainder = totalItems % itemsPerBox

  // Initialize items and boxes
  useEffect(() => {
    setAvailableItems(Array.from({ length: totalItems }, (_, i) => `item-${i}`))
    setBoxes([])
  }, [totalItems, itemsPerBox])

  // Register submit function with parent
  useEffect(() => {
    if (onSubmitReady) {
      onSubmitReady(() => handleSubmit)
    }
    return () => {
      if (onSubmitReady) {
        onSubmitReady(null)
      }
    }
  }, [onSubmitReady, boxes, availableItems])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination) return

    // Moving from available items to a box
    if (source.droppableId === 'available' && destination.droppableId.startsWith('box-')) {
      const boxIndex = parseInt(destination.droppableId.split('-')[1])
      const newBoxes = [...boxes]

      // Create box if it doesn't exist
      while (newBoxes.length <= boxIndex) {
        newBoxes.push([])
      }

      // Don't allow more than itemsPerBox in a box
      if (newBoxes[boxIndex].length >= itemsPerBox) return

      const itemId = availableItems[source.index]
      const newAvailable = availableItems.filter((_, idx) => idx !== source.index)
      newBoxes[boxIndex] = [...newBoxes[boxIndex], itemId]

      setAvailableItems(newAvailable)
      setBoxes(newBoxes)
    }
    // Moving from a box back to available items
    else if (source.droppableId.startsWith('box-') && destination.droppableId === 'available') {
      const boxIndex = parseInt(source.droppableId.split('-')[1])
      const newBoxes = [...boxes]
      const itemId = newBoxes[boxIndex][source.index]

      newBoxes[boxIndex] = newBoxes[boxIndex].filter((_, idx) => idx !== source.index)
      const newAvailable = [...availableItems, itemId]

      setAvailableItems(newAvailable)
      setBoxes(newBoxes.filter(box => box.length > 0))
    }
  }

  const handleSubmit = () => {
    const fullBoxes = boxes.filter(box => box.length === itemsPerBox).length
    const remainder = availableItems.length
    const correct = fullBoxes === correctBoxes && remainder === correctRemainder
    onAnswer(correct)
  }

  const handleAutoFill = () => {
    const newBoxes: string[][] = []
    const items = Array.from({ length: totalItems }, (_, i) => `item-${i}`)

    for (let i = 0; i < correctBoxes; i++) {
      newBoxes.push(items.slice(i * itemsPerBox, (i + 1) * itemsPerBox))
    }

    setBoxes(newBoxes)
    setAvailableItems(items.slice(correctBoxes * itemsPerBox))
  }

  const handleReset = () => {
    setAvailableItems(Array.from({ length: totalItems }, (_, i) => `item-${i}`))
    setBoxes([])
  }

  const filledBoxes = boxes.filter(box => box.length === itemsPerBox).length

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center gap-3 pt-3 px-3 pb-24">
        {/* Instruction */}
        <div className="text-center mb-2">
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            Put {itemsPerBox} stars in each box
          </p>
        </div>

        {/* Available Items Pool */}
        <div className="w-full max-w-2xl">
          <div className="text-center text-sm font-semibold text-gray-700 mb-2">
            Available Stars: {availableItems.length}
          </div>
          <Droppable droppableId="available" direction="horizontal">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`flex flex-wrap justify-center gap-2 p-3 rounded-xl border-2 min-h-20 ${
                  snapshot.isDraggingOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 bg-gray-50'
                }`}
              >
                {availableItems.length === 0 ? (
                  <div className="text-gray-400 text-xs py-4">All stars placed</div>
                ) : (
                  availableItems.map((itemId, idx) => (
                    <Draggable key={itemId} draggableId={itemId} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`cursor-grab ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Boxes Grid */}
        <div className="w-full max-w-2xl">
          <div className="text-center text-sm font-semibold text-gray-700 mb-2">
            Boxes: {filledBoxes} full
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: Math.max(boxes.length + 1, correctBoxes + 1) }).map((_, boxIdx) => (
              <Droppable key={boxIdx} droppableId={`box-${boxIdx}`}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-wrap justify-center gap-1.5 p-3 rounded-xl border-2 min-h-24 ${
                      boxes[boxIdx]?.length === itemsPerBox
                        ? 'border-green-500 bg-green-50'
                        : snapshot.isDraggingOver
                        ? 'border-purple-400 bg-purple-50'
                        : 'border-slate-400 bg-slate-50'
                    }`}
                  >
                    {boxes[boxIdx]?.length === 0 || !boxes[boxIdx] ? (
                      <div className="text-gray-400 text-xs text-center w-full py-6">
                        Empty
                      </div>
                    ) : (
                      boxes[boxIdx]?.map((itemId, idx) => (
                        <Draggable key={itemId} draggableId={itemId} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab ${
                                snapshot.isDragging ? 'opacity-50' : ''
                              }`}
                            >
                              <Star className="w-7 h-7 text-yellow-500 fill-yellow-500" />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </div>

        {/* Stats Display */}
        <div className="flex items-center gap-3 text-lg font-bold text-gray-800">
          <span className="text-blue-600">{totalItems}</span>
          <span className="text-gray-500">÷</span>
          <span className="text-purple-600">{itemsPerBox}</span>
          <span className="text-gray-500">=</span>
          <span className="text-green-600">
            {filledBoxes}
            {availableItems.length > 0 && (
              <span className="text-orange-600 ml-1">R{availableItems.length}</span>
            )}
          </span>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleAutoFill}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg"
          >
            Auto Fill
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm font-bold rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </DragDropContext>
  )
}
