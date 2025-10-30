'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MoneyCounterProps {
  question: string
  targetAmount: number // Amount in cents
  availableCoins?: {
    penny?: number    // 1 cent
    nickel?: number   // 5 cents
    dime?: number     // 10 cents
    quarter?: number  // 25 cents
    dollar?: number   // 100 cents
  }
  showCents?: boolean // Show amounts in cents vs dollars
  onAnswer: (isCorrect: boolean, userAmount: number) => void
}

const COIN_VALUES = {
  penny: 1,
  nickel: 5,
  dime: 10,
  quarter: 25,
  dollar: 100
}

const COIN_NAMES = {
  penny: 'Penny',
  nickel: 'Nickel',
  dime: 'Dime',
  quarter: 'Quarter',
  dollar: 'Dollar'
}

const COIN_COLORS = {
  penny: 'bg-gradient-to-br from-orange-400 to-orange-600',
  nickel: 'bg-gradient-to-br from-gray-300 to-gray-500',
  dime: 'bg-gradient-to-br from-gray-200 to-gray-400',
  quarter: 'bg-gradient-to-br from-gray-100 to-gray-300',
  dollar: 'bg-gradient-to-br from-green-400 to-green-600'
}

type CoinType = keyof typeof COIN_VALUES

export default function MoneyCounter({
  question,
  targetAmount,
  availableCoins = { penny: 10, nickel: 5, dime: 5, quarter: 4, dollar: 2 },
  showCents = false,
  onAnswer
}: MoneyCounterProps) {
  const [selectedCoins, setSelectedCoins] = useState<{ [key in CoinType]: number }>({
    penny: 0,
    nickel: 0,
    dime: 0,
    quarter: 0,
    dollar: 0
  })
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const addCoin = (coinType: CoinType) => {
    if (hasSubmitted) return
    const available = availableCoins[coinType] || 0
    if (selectedCoins[coinType] < available) {
      setSelectedCoins(prev => ({
        ...prev,
        [coinType]: prev[coinType] + 1
      }))
    }
  }

  const removeCoin = (coinType: CoinType) => {
    if (hasSubmitted) return
    if (selectedCoins[coinType] > 0) {
      setSelectedCoins(prev => ({
        ...prev,
        [coinType]: prev[coinType] - 1
      }))
    }
  }

  const calculateTotal = () => {
    return Object.entries(selectedCoins).reduce((total, [coin, count]) => {
      return total + COIN_VALUES[coin as CoinType] * count
    }, 0)
  }

  const formatMoney = (cents: number) => {
    if (showCents) {
      return `${cents}¢`
    }
    return `$${(cents / 100).toFixed(2)}`
  }

  const handleSubmit = () => {
    if (hasSubmitted) return
    const total = calculateTotal()
    const isCorrect = total === targetAmount
    setHasSubmitted(true)
    onAnswer(isCorrect, total)
  }

  const handleClear = () => {
    if (!hasSubmitted) {
      setSelectedCoins({
        penny: 0,
        nickel: 0,
        dime: 0,
        quarter: 0,
        dollar: 0
      })
    }
  }

  const currentTotal = calculateTotal()

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Question */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{question}</h3>
        <p className="text-3xl font-bold text-green-600">
          Target: {formatMoney(targetAmount)}
        </p>
      </div>

      {/* Current Total */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">Your Total:</p>
          <p className={`text-5xl font-bold transition-colors duration-300 ${
            hasSubmitted
              ? currentTotal === targetAmount
                ? 'text-green-600'
                : 'text-red-600'
              : currentTotal === targetAmount
              ? 'text-yellow-500'
              : 'text-blue-600'
          }`}>
            {formatMoney(currentTotal)}
          </p>
          {!hasSubmitted && currentTotal === targetAmount && (
            <p className="text-yellow-600 font-semibold mt-2 text-lg">
              ✨ Exact amount! Click Submit!
            </p>
          )}
        </div>
      </div>

      {/* Coin Selection Area */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 mb-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
          💰 Select Coins and Bills
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {(Object.keys(COIN_VALUES) as CoinType[]).map((coinType) => {
            const available = availableCoins[coinType] || 0
            const selected = selectedCoins[coinType]
            const remaining = available - selected

            if (available === 0) return null

            return (
              <div key={coinType} className="bg-white rounded-xl p-4 shadow-lg">
                {/* Coin Display */}
                <div className="text-center mb-3">
                  <div className={`w-20 h-20 mx-auto rounded-full ${COIN_COLORS[coinType]} shadow-lg flex items-center justify-center mb-2`}>
                    <div className="text-white font-bold text-center">
                      <div className="text-xs">{COIN_NAMES[coinType]}</div>
                      <div className="text-lg">{formatMoney(COIN_VALUES[coinType])}</div>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-600">
                    {remaining} left
                  </p>
                </div>

                {/* Add/Remove Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => removeCoin(coinType)}
                    disabled={hasSubmitted || selected === 0}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      hasSubmitted || selected === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                    }`}
                  >
                    −
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg font-bold text-xl">
                    {selected}
                  </div>
                  <button
                    onClick={() => addCoin(coinType)}
                    disabled={hasSubmitted || remaining === 0}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${
                      hasSubmitted || remaining === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected Coins Display */}
      {Object.values(selectedCoins).some(count => count > 0) && (
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h4 className="text-lg font-bold text-gray-800 mb-4">Your Coins:</h4>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(selectedCoins) as [CoinType, number][]).map(([coinType, count]) => {
              if (count === 0) return null
              return (
                <div key={coinType} className="flex gap-1">
                  {Array.from({ length: count }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0, rotate: 0 }}
                      animate={{ scale: 1, rotate: 360 }}
                      transition={{ type: 'spring', stiffness: 300, delay: idx * 0.05 }}
                      className={`w-12 h-12 rounded-full ${COIN_COLORS[coinType]} shadow-md flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {formatMoney(COIN_VALUES[coinType])}
                    </motion.div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={handleClear}
          disabled={hasSubmitted || Object.values(selectedCoins).every(c => c === 0)}
          className={`px-6 py-3 rounded-full font-bold text-white transition-all ${
            hasSubmitted || Object.values(selectedCoins).every(c => c === 0)
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gray-500 hover:bg-gray-600 active:scale-95'
          }`}
        >
          Clear
        </button>

        <button
          onClick={handleSubmit}
          disabled={hasSubmitted || currentTotal === 0}
          className={`px-8 py-3 rounded-full font-bold text-white text-lg transition-all ${
            hasSubmitted || currentTotal === 0
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
          className={`p-6 rounded-lg text-center font-bold text-lg ${
            currentTotal === targetAmount
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {currentTotal === targetAmount ? (
            <>
              🎉 Perfect! You made exactly {formatMoney(targetAmount)}!
            </>
          ) : (
            <>
              ❌ Not quite. You have {formatMoney(currentTotal)}, but need {formatMoney(targetAmount)}.
              <br />
              <span className="text-sm">
                {currentTotal > targetAmount
                  ? `You have ${formatMoney(currentTotal - targetAmount)} too much.`
                  : `You need ${formatMoney(targetAmount - currentTotal)} more.`}
              </span>
            </>
          )}
        </motion.div>
      )}
    </div>
  )
}
