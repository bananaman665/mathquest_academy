'use client'

import React, { useState, useEffect, useRef } from 'react'
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

/**
 * BlockStackingQuestion Component - Interactive drag-and-drop block stacking
 *
 * CRITICAL: Uses refs to prevent stale closure issues with onSubmitReady.
 * The submit function registered via onSubmitReady uses refs to always
 * access the latest state values when Check button is clicked.
 */
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

  // Refs to prevent stale closure issues
  const stackBlocksRef = useRef(stackBlocks)
  const correctAnswerRef = useRef(correctAnswer)
  const onAnswerRef = useRef(onAnswer)
  const hasSubmittedRef = useRef(false)
  const onSubmitReadyRef = useRef(onSubmitReady)

  // Keep refs in sync
  useEffect(() => {
    stackBlocksRef.current = stackBlocks
  }, [stackBlocks])

  useEffect(() => {
    correctAnswerRef.current = correctAnswer
  }, [correctAnswer])

  useEffect(() => {
    onAnswerRef.current = onAnswer
  }, [onAnswer])

  useEffect(() => {
    onSubmitReadyRef.current = onSubmitReady
  }, [onSubmitReady])

  // Initialize blocks based on operation
  useEffect(() => {
    hasSubmittedRef.current = false
    if (operation === 'add') {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `stack-block-${i}`))
      setTrashBlocks(Array.from({ length: secondNumber }, (_, i) => `trash-block-${i}`))
    } else {
      setStackBlocks(Array.from({ length: firstNumber }, (_, i) => `block-${i}`))
      setTrashBlocks([])
    }
    // Register submit function immediately
    if (onSubmitReadyRef.current) {
      onSubmitReadyRef.current(() => {
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true
          const correct = stackBlocksRef.current.length === correctAnswerRef.current
          onAnswerRef.current(correct)
        }
      })
    }
  }, [operation, firstNumber, secondNumber])

  const handleDragEnd = (result: DropResult) => {
    if (disabled) return

    const { source, destination, draggableId } = result

    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    let newStackBlocks = stackBlocks
    let newTrashBlocks = trashBlocks

    if (source.droppableId === 'stack' && destination.droppableId === 'trash') {
      newStackBlocks = stackBlocks.filter((_, idx) => idx !== source.index)
      newTrashBlocks = [...trashBlocks, draggableId]
      setStackBlocks(newStackBlocks)
      setTrashBlocks(newTrashBlocks)
    } else if (source.droppableId === 'trash' && destination.droppableId === 'stack') {
      newTrashBlocks = trashBlocks.filter((_, idx) => idx !== source.index)
      newStackBlocks = [...stackBlocks, draggableId]
      setStackBlocks(newStackBlocks)
      setTrashBlocks(newTrashBlocks)
    }

    // Re-register submit function with updated ref values after drag
    if (onSubmitReadyRef.current) {
      onSubmitReadyRef.current(() => {
        if (!hasSubmittedRef.current) {
          hasSubmittedRef.current = true
          const correct = stackBlocksRef.current.length === correctAnswerRef.current
          onAnswerRef.current(correct)
        }
      })
    }
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
