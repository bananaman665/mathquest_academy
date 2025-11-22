'use client'

import { useState } from 'react'
import { Delete } from 'lucide-react'

interface NumberKeyboardProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  allowNegative?: boolean
  allowDecimal?: boolean
  disabled?: boolean
}

export default function NumberKeyboard({ 
  value, 
  onChange, 
  maxLength = 10,
  allowNegative = false,
  allowDecimal = false,
  disabled = false
}: NumberKeyboardProps) {
  const handleKeyPress = (key: string) => {
    if (disabled) return

    let newValue = value

    if (key === 'backspace') {
      newValue = value.slice(0, -1)
    } else if (key === '-' && allowNegative) {
      if (value.startsWith('-')) {
        newValue = value.slice(1)
      } else {
        newValue = '-' + value
      }
    } else if (key === '.' && allowDecimal) {
      if (!value.includes('.')) {
        newValue = value + '.'
      }
    } else if (key >= '0' && key <= '9') {
      if (value.length < maxLength) {
        newValue = value + key
      }
    }

    onChange(newValue)
  }

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [allowNegative ? '-' : '', '0', 'backspace']
  ]

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Display */}
      <div className="mb-6 bg-white rounded-2xl border-4 border-gray-300 shadow-lg">
        <div className="px-6 py-8 text-center">
          <div className="text-5xl font-black text-gray-900 min-h-[60px] flex items-center justify-center">
            {value || (
              <span className="text-gray-300">0</span>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="grid gap-3">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-3">
            {row.map((key, keyIndex) => {
              if (!key) {
                return <div key={keyIndex} />
              }

              const isBackspace = key === 'backspace'

              return (
                <button
                  key={key}
                  onClick={() => handleKeyPress(key)}
                  disabled={disabled}
                  className={`
                    h-16 sm:h-20 rounded-2xl font-black text-2xl sm:text-3xl
                    transition-all duration-150 active:scale-95
                    flex items-center justify-center
                    ${disabled 
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                      : isBackspace
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl active:shadow-md'
                        : 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl active:shadow-md'
                    }
                  `}
                >
                  {isBackspace ? <Delete className="w-7 h-7 sm:w-8 sm:h-8" /> : key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
