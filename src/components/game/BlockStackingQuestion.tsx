'use client'

import { useState, useEffect } from 'react'
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

export default function BlockStackingQuestion({
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
      <div className="flex flex-col items-center gap-6 pt-4 px-4 pb-24">
        {/* Instruction */}
        <div className="text-center mb-2">
          <p className="text-2xl sm:text-3xl font-bold text-black">
            {operation === 'add'
              ? `Drag ${secondNumber} token${secondNumber !== 1 ? 's' : ''} from bottom to top`
              : `Remove ${secondNumber} token${secondNumber !== 1 ? 's' : ''} by dragging down`}
          </p>
        </div>

        {/* Main workspace */}
        <div className="flex flex-col gap-6 items-center w-full max-w-4xl">
          {/* Your Stack - Top Zone */}
          <div className="w-full">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-black mb-1">Your Stack</h3>
              <div className="inline-block bg-blue-500 text-white px-6 py-2 rounded-xl font-bold text-2xl border-4 border-black">
                {stackBlocks.length}
              </div>
            </div>
            <Droppable droppableId="stack">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-center justify-center gap-3 p-6 rounded-2xl border-4 transition-all min-h-[200px] bg-white ${
                    snapshot.isDraggingOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-black'
                  }`}
                >
                  {stackBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-12 text-lg font-semibold">
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
                            className={`w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-2xl border-4 border-black cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 scale-110 rotate-6'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full"></div>
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
          <div className="w-full max-w-md">
            <div className="h-1 bg-black rounded-full"></div>
          </div>

          {/* Tokens Zone - Bottom Zone */}
          <div className="w-full">
            <div className="text-center mb-3">
              <h3 className="text-lg font-bold text-black mb-1">
                {operation === 'add' ? 'Tokens to Add' : 'Removed Tokens'}
              </h3>
              <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-2xl border-4 border-black">
                {trashBlocks.length}
              </div>
            </div>
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-center justify-center gap-3 p-6 rounded-2xl border-4 transition-all min-h-[200px] bg-white ${
                    snapshot.isDraggingOver
                      ? 'border-green-500 bg-green-50'
                      : 'border-black'
                  }`}
                >
                  {trashBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-12 text-lg font-semibold">
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
                            className={`w-16 h-16 sm:w-20 sm:h-20 bg-green-500 rounded-2xl border-4 border-black cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 scale-110 rotate-6'
                                : 'hover:scale-105 active:scale-95'
                            }`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full"></div>
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
}
