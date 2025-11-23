'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { PartyPopper, X } from 'lucide-react'

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
      <div className="flex flex-col items-center gap-6 py-6 px-4">
        {/* Question */}
        <div className="text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">{question}</h3>
          <p className="text-gray-900 font-medium text-base sm:text-lg">
            {operation === 'add'
              ? `Drag ${secondNumber} token${secondNumber !== 1 ? 's' : ''} from down to up`
              : `Drag ${secondNumber} token${secondNumber !== 1 ? 's' : ''} from up to down`}
          </p>
        </div>

        {/* Main workspace */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-stretch justify-center w-full max-w-2xl px-2">
          {/* Blocks to Add Zone - Show first on mobile for clarity */}
          <div className="flex flex-col items-center gap-3 flex-1 order-2 md:order-1">
            <div className="text-white font-bold text-base sm:text-lg text-center">
              {operation === 'add' ? 'Drag From Here' : 'Trash'}
            </div>
            <Droppable droppableId="trash">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start gap-2 p-4 rounded-xl border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-600 bg-slate-700/50'
                  } w-full min-h-36 transition-colors`}
                >
                  {trashBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center w-full py-10 text-sm">Empty</div>
                  ) : (
                    trashBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full shadow-lg border-3 border-amber-200 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 shadow-2xl scale-110 rotate-12'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-7 h-7 bg-white/40 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-base sm:text-lg font-semibold text-gray-300">
              {trashBlocks.length} {operation === 'add' ? 'to add' : 'removed'}
            </div>
          </div>

          {/* Block Stack */}
          <div className="flex flex-col items-center gap-3 flex-1 order-1 md:order-2">
            <div className="text-white font-bold text-base sm:text-lg text-center">
              {operation === 'add' ? 'Your Stack' : 'Your Stack'}
            </div>
            <Droppable droppableId="stack">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex flex-wrap content-start items-start justify-center gap-2 p-4 rounded-xl border-2 ${
                    snapshot.isDraggingOver
                      ? 'border-green-400 bg-green-500/10'
                      : 'border-slate-600 bg-slate-700/50'
                  } min-h-36 w-full transition-colors`}
                >
                  {stackBlocks.length === 0 ? (
                    <div className="text-gray-400 text-center py-10 w-full text-sm">No tokens</div>
                  ) : (
                    stackBlocks.map((blockId, idx) => (
                      <Draggable key={blockId} draggableId={blockId} index={idx}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-lg border-3 border-blue-200 cursor-grab transition-all flex items-center justify-center ${
                              snapshot.isDragging
                                ? 'opacity-70 shadow-2xl scale-110 rotate-12'
                                : 'hover:shadow-xl hover:scale-105'
                            }`}
                          >
                            <div className="w-7 h-7 bg-white/40 rounded-full"></div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className="text-xl sm:text-2xl font-bold text-white bg-slate-700 px-5 py-2 rounded-lg shadow-lg min-w-[60px] text-center">
              {stackBlocks.length}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        {!showFeedback && (
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 active:scale-95 text-white font-bold py-3 px-8 rounded-xl transition-all text-base sm:text-lg shadow-lg"
          >
            Check Answer
          </button>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="w-full max-w-md px-4">
            <div
              className={`p-5 rounded-xl text-center font-bold text-base sm:text-lg ${
                isCorrect
                  ? 'bg-green-500/20 text-green-300 border-2 border-green-500'
                  : 'bg-red-500/20 text-red-300 border-2 border-red-500'
              }`}
            >
              {isCorrect ? (
                <div>
                  <div className="text-3xl mb-2 flex items-center justify-center gap-2">
                    <PartyPopper className="w-7 h-7" />
                    Correct!
                  </div>
                  <div className="text-sm sm:text-base">You have {stackBlocks.length} tokens!</div>
                </div>
              ) : (
                <div>
                  <div className="text-3xl mb-2 flex items-center justify-center gap-2">
                    <X className="w-7 h-7" />
                    Not quite
                  </div>
                  <div className="text-sm sm:text-base">You have {stackBlocks.length} tokens, but need {correctAnswer}</div>
                </div>
              )}
            </div>

            {!isCorrect && (
              <button
                onClick={handleReset}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-95 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg"
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
