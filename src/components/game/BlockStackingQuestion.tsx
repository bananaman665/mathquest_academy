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
}

export default function BlockStackingQuestion({
  firstNumber,
  secondNumber,
  operation,
  correctAnswer,
  onAnswer,
  question,
}: BlockStackingQuestionProps) {
  const [stackBlocks, setStackBlocks] = useState<string[]>([])
  const [trashBlocks, setTrashBlocks] = useState<string[]>([])
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

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
    setIsCorrect(correct)
    setShowFeedback(true)
    onAnswer(correct)
  }

  const handleReset = () => {
    setShowFeedback(false)
    if (operation === 'add') {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `stack-block-${i}`))
      setTrashBlocks(Array.from({ length: secondNumber }, (_, i) => `trash-block-${i}`))
    } else {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `block-${i}`))
      setTrashBlocks([])
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col items-center gap-8 py-8">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">{question}</h3>
          <p className="text-gray-300 text-lg">
            {operation === 'add'
              ? `Drag ${secondNumber} block${secondNumber !== 1 ? 's' : ''} from the trash to add them to your stack`
              : `Drag ${secondNumber} block${secondNumber !== 1 ? 's' : ''} from the stack to the trash`}
          </p>
        </div>

        {/* Main workspace */}
        <div className="flex gap-8 items-start justify-center w-full">
          {/* Block Stack */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-white font-bold text-lg">
              {operation === 'add' ? 'Your Stack (Drag blocks here)' : 'Your Stack'}
            </div>
            <Droppable droppableId="stack">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-center justify-center gap-2 p-6 rounded-lg border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-slate-600 bg-slate-800/50'
                  } min-h-48 w-60 transition-colors`}
                >
                  {stackBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center py-12">No blocks</div>
                  ) : (
                    stackBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-3 border-blue-300 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-50 shadow-2xl scale-110'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-2xl font-bold text-white bg-slate-700 px-6 py-2 rounded-lg">
              {stackBlocks.length}
            </div>
          </div>

          {/* Blocks to Add Zone */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-white font-bold text-lg">
              {operation === 'add' ? 'Blocks to Add' : 'Trash'}
            </div>
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start gap-2 p-6 rounded-lg border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-red-400 bg-red-500/10'
                      : 'border-slate-600 bg-slate-800/50'
                  } w-60 min-h-48 transition-colors`}
                >
                  {trashBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-12">Empty</div>
                  ) : (
                    trashBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg border-3 border-amber-300 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-50 shadow-2xl scale-110'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-lg font-semibold text-gray-400">
              {trashBlocks.length} removed
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {!showFeedback && (
          <button
            onClick={handleSubmit}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition-colors text-lg"
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
                  <div className="text-2xl mb-2">🎉 Correct!</div>
                  <div>You have {stackBlocks.length} blocks left!</div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-2">❌ Not quite right</div>
                  <div>You have {stackBlocks.length} blocks, but the answer is {correctAnswer}</div>
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
    </DragDropContext>
  )
}
