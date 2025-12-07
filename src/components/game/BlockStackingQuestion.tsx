'use client'

import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface BlockStackingQuestionProps {
  firstNumber: number
  secondNumber: number
  operation: 'add' | 'subtract'
  correctAnswer: number
  onAnswer: (isCorrect: boolean) => void
  question: string
  onSubmitReady?: (submitFn: (() => void) | null) => void
  disabled?: boolean
}

const BlockStackingQuestion = React.memo(function BlockStackingQuestion({
  firstNumber,
  secondNumber,
  operation,
  correctAnswer,
  onAnswer,
  question,
  onSubmitReady,
  disabled = false,
}: BlockStackingQuestionProps) {
  const [stackBlocks, setStackBlocks] = useState<string[]>([])
  const [trashBlocks, setTrashBlocks] = useState<string[]>([])

  // Initialize blocks based on operation
  useEffect(() => {
    if (operation === 'add') {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `stack-block-${i}`))
      setTrashBlocks(Array.from({ length: secondNumber }, (_, i) => `trash-block-${i}`))
    } else {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `block-${i}`))
      setTrashBlocks([])
    }
  }, [operation, firstNumber, secondNumber])

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
  }, [onSubmitReady, stackBlocks])

  const handleDragEnd = (result: DropResult) => {
    if (disabled) return

    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    if (source.droppableId === 'stack' && destination.droppableId === 'trash') {
      const newStack = stackBlocks.filter((_, idx) => idx !== source.index)
      const newTrash = [...trashBlocks, draggableId]
      setStackBlocks(newStack)
      setTrashBlocks(newTrash)
    } else if (source.droppableId === 'trash' && destination.droppableId === 'stack') {
      const newTrash = trashBlocks.filter((_, idx) => idx !== source.index)
      const newStack = [...stackBlocks, draggableId]
      setStackBlocks(newStack)
      setTrashBlocks(newTrash)
    }
  }

  const handleSubmit = () => {
    const correct = stackBlocks.length === correctAnswer
    onAnswer(correct)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col w-full max-w-md mx-auto px-4 pb-24">
        {/* Answer Zone */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Answer
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {stackBlocks.length}
            </span>
          </div>
          <Droppable droppableId="stack">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  flex flex-wrap content-start gap-2 p-4 rounded-2xl min-h-[140px] transition-all
                  ${snapshot.isDraggingOver
                    ? 'bg-blue-50 border-2 border-blue-400'
                    : 'bg-gray-50 border-2 border-gray-200'
                  }
                `}
              >
                {stackBlocks.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-gray-400 text-sm">
                    Drag blocks here
                  </div>
                ) : (
                  stackBlocks.map((blockId, idx) => (
                    <Draggable key={blockId} draggableId={blockId} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            w-12 h-12 bg-blue-500 rounded-xl cursor-grab
                            flex items-center justify-center
                            ${snapshot.isDragging ? 'shadow-lg scale-110 rotate-3' : 'shadow-sm hover:shadow-md'}
                            transition-shadow
                          `}
                          style={provided.draggableProps.style}
                        >
                          <div className="w-5 h-5 bg-white/30 rounded-full" />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                <div className="hidden">{provided.placeholder}</div>
              </div>
            )}
          </Droppable>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs font-medium text-gray-400">DRAG TO MOVE</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Available Zone */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              {operation === 'add' ? 'Add these' : 'Removed'}
            </span>
            <span className="text-2xl font-bold text-gray-900">
              {trashBlocks.length}
            </span>
          </div>
          <Droppable droppableId="trash">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`
                  flex flex-wrap content-start gap-2 p-4 rounded-2xl min-h-[140px] transition-all
                  ${snapshot.isDraggingOver
                    ? 'bg-emerald-50 border-2 border-emerald-400'
                    : 'bg-gray-50 border-2 border-gray-200'
                  }
                `}
              >
                {trashBlocks.length === 0 ? (
                  <div className="w-full flex items-center justify-center text-gray-400 text-sm">
                    {operation === 'add' ? 'All added' : 'Drag blocks here to remove'}
                  </div>
                ) : (
                  trashBlocks.map((blockId, idx) => (
                    <Draggable key={blockId} draggableId={blockId} index={idx}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`
                            w-12 h-12 bg-emerald-500 rounded-xl cursor-grab
                            flex items-center justify-center
                            ${snapshot.isDragging ? 'shadow-lg scale-110 rotate-3' : 'shadow-sm hover:shadow-md'}
                            transition-shadow
                          `}
                          style={provided.draggableProps.style}
                        >
                          <div className="w-5 h-5 bg-white/30 rounded-full" />
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                <div className="hidden">{provided.placeholder}</div>
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  )
})

export default BlockStackingQuestion
