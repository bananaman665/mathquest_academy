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
}

export default function BlockStackingQuestion({
  firstNumber,
  secondNumber,
  operation,
  correctAnswer,
  onAnswer,
  question,
  onSubmitReady,
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
      <div className="flex flex-col items-center gap-3 pt-3 px-3 pb-24">
        {/* Instruction */}
        <div className="text-center mb-2">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {operation === 'add'
              ? `Drag ${secondNumber} token${secondNumber !== 1 ? 's' : ''} from down to up`
              : `Drag ${secondNumber} token${secondNumber !== 1 ? 's' : ''} from up to down`}
          </p>
        </div>

        {/* Main workspace */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch justify-center w-full max-w-2xl px-2">
          {/* Blocks to Add Zone - Show first on mobile for clarity */}
          <div className="flex flex-col items-center gap-2 flex-1 order-2 md:order-1">
            <div className="text-white font-bold text-sm sm:text-base text-center">
              {operation === 'add' ? 'Drag From Here' : 'Trash'}
            </div>
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start gap-1.5 p-2.5 rounded-xl border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-600 bg-slate-700/50'
                  } w-full min-h-24 transition-colors`}
                >
                  {trashBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-5 text-xs">Empty</div>
                  ) : (
                    trashBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg border-2 border-amber-200 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 shadow-2xl scale-110 rotate-12'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/40 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-sm sm:text-base font-semibold text-gray-300">
              {trashBlocks.length} {operation === 'add' ? 'to add' : 'removed'}
            </div>
          </div>

          {/* Block Stack */}
          <div className="flex flex-col items-center gap-2 flex-1 order-1 md:order-2">
            <div className="text-white font-bold text-sm sm:text-base text-center">
              {operation === 'add' ? 'Your Stack' : 'Your Stack'}
            </div>
            <Droppable droppableId="stack">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-start justify-center gap-1.5 p-2.5 rounded-xl border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-slate-600 bg-slate-700/50'
                  } min-h-24 w-full transition-colors`}
                >
                  {stackBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center py-5 w-full text-xs">No tokens</div>
                  ) : (
                    stackBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-2 border-blue-200 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 shadow-2xl scale-110 rotate-12'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/40 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-lg sm:text-xl font-bold text-white bg-slate-700 px-4 py-1.5 rounded-lg shadow-lg min-w-[50px] text-center">
              {stackBlocks.length}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}
