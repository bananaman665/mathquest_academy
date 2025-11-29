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
      // For addition: start with firstNumber in stack, secondNumber in trash to add
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `stack-block-${i}`))
      setTrashBlocks(Array.from({ length: secondNumber }, (_, i) => `trash-block-${i}`))
    } else {
      // For subtraction: start with firstNumber in stack, remove secondNumber
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

    // If dragging from stack to trash (for subtraction)
    if (source.droppableId === 'stack' && destination.droppableId === 'trash') {
      if (operation === 'subtract' || operation === 'add') {
        const newStack = stackBlocks.filter((_, idx) => idx !== source.index)
        const newTrash = [...trashBlocks, draggableId]
        setStackBlocks(newStack)
        setTrashBlocks(newTrash)
      }
    }
    // If dragging from trash back to stack
    else if (source.droppableId === 'trash' && destination.droppableId === 'stack') {
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
      <div className="flex flex-col items-center gap-3 px-3 pb-24">
        {/* Main workspace */}
        <div className="flex flex-col gap-3 items-center w-full max-w-7xl">
          {/* Your Stack - Top Zone */}
          <div className="w-full">
            <div className="text-center mb-1">
              <h3 className="text-xs font-bold text-black mb-0.5">Your Stack</h3>
              <div className="inline-block bg-blue-500 text-white px-2.5 py-0.5 rounded-lg font-bold text-base border-2 border-black">
                {stackBlocks.length}
              </div>
            </div>
            <Droppable droppableId="stack">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all min-h-[180px] bg-white ${
                    snapshot.isDraggingOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-black'
                  }`}
                >
                  {stackBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-4 text-xs font-semibold">
                      Empty Stack
                    </div>
                  ) : (
                    stackBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-11 h-11 sm:w-12 sm:h-12 bg-blue-500 rounded-xl cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 scale-110 rotate-6'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full"></div>
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

          {/* Divider */}
          <div className="w-full max-w-md py-0.5">
            <div className="h-0.5 bg-black rounded-full"></div>
          </div>

          {/* Tokens Zone - Bottom Zone */}
          <div className="w-full">
            <div className="text-center mb-1">
              <h3 className="text-xs font-bold text-black mb-0.5">
                {operation === 'add' ? 'Tokens to Add' : 'Removed Tokens'}
              </h3>
              <div className="inline-block bg-green-500 text-white px-2.5 py-0.5 rounded-lg font-bold text-base border-2 border-black">
                {trashBlocks.length}
              </div>
            </div>
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all min-h-[180px] bg-white ${
                    snapshot.isDraggingOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-black'
                  }`}
                >
                  {trashBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-4 text-xs font-semibold">
                      {operation === 'add' ? 'No tokens yet' : 'No removed tokens'}
                    </div>
                  ) : (
                    trashBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-11 h-11 sm:w-12 sm:h-12 bg-green-500 rounded-xl cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 scale-110 rotate-6'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full"></div>
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
        </div>
      </div>
    </DragDropContext>
  )
})

export default BlockStackingQuestion
