'use client'

import { useState } from 'react'
import { Heart, Zap, Gem, Lightbulb, Snowflake, Trophy, Palette, PartyPopper } from 'lucide-react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

interface ShopItem {
  id: string
  name: string
  description: string
  price: number
  icon: string
  category: string
  color: string
}

interface ShopClientProps {
  items: ShopItem[]
  userBalance: number
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Snowflake,
  Zap,
  Lightbulb,
  Trophy,
  Palette,
}

export default function ShopClient({ items, userBalance }: ShopClientProps) {
  const [balance, setBalance] = useState(userBalance)
  const [purchasingItem, setPurchasingItem] = useState<string | null>(null)
  const [usingItem, setUsingItem] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { playCorrect, playIncorrect } = useSoundEffects()

  const getUseEndpoint = (itemId: string): string => {
    switch(itemId) {
      case 'extra-hearts':
        return '/api/inventory/use-hearts'
      case 'streak-freeze':
        return '/api/inventory/use-streak-freeze'
      case 'xp-boost':
        return '/api/inventory/use-xp-boost'
      case 'hint-pack':
        return '/api/inventory/use-hint-pack'
      case 'golden-trophy':
        return '/api/inventory/equip-golden-trophy'
      case 'rainbow-theme':
        return '/api/inventory/equip-rainbow-theme'
      default:
        return ''
    }
  }

  const handlePurchase = async (item: ShopItem) => {
    if (balance < item.price) {
      setErrorMessage(`Not enough gems! You need ${item.price - balance} more.`)
      playIncorrect()
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    setPurchasingItem(item.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Purchase failed')
      }

      // Success!
      playCorrect()
      setBalance(data.newBalance)
      setSuccessMessage(`Successfully purchased ${item.name}!`)
      setTimeout(() => setSuccessMessage(null), 3000)

    } catch (error) {
      playIncorrect()
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setErrorMessage(errorMessage)
      setTimeout(() => setErrorMessage(null), 3000)
    } finally {
      setPurchasingItem(null)
    }
  }

  const handleUseItem = async (item: ShopItem) => {
    setUsingItem(item.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const endpoint = getUseEndpoint(item.id)
      if (!endpoint) {
        throw new Error('Item cannot be used')
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to use item')
      }

      // Success!
      playCorrect()
      setSuccessMessage(`✨ ${data.message}`)
      setTimeout(() => setSuccessMessage(null), 4000)

    } catch (error) {
      playIncorrect()
      const errorMsg = error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      setErrorMessage(errorMsg)
      setTimeout(() => setErrorMessage(null), 3000)
    } finally {
      setUsingItem(null)
    }
  }

  return (
    <div>
      {/* Balance Display */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Your Balance</p>
            <div className="flex items-center gap-3">
              <p className="text-4xl font-black text-blue-600">{balance}</p>
              <Gem className="w-10 h-10 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mt-1">Earn more by completing lessons!</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-800 font-bold animate-pulse flex items-center gap-2">
          <PartyPopper className="w-6 h-6" />
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border-2 border-red-300 rounded-xl text-red-800 font-bold animate-pulse">
          {errorMessage}
        </div>
      )}

      {/* Power-ups Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-yellow-600" />
          <h2 className="text-2xl font-black text-gray-900">Power-ups</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.filter(item => item.category === 'power-ups').map((item) => {
            const canAfford = balance >= item.price
            const ItemIcon = iconMap[item.icon] || Heart
            const isPurchasing = purchasingItem === item.id

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="text-center mb-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 transition-all duration-300 hover:rotate-6 hover:scale-110">
                      <ItemIcon className={`w-10 h-10 ${item.color} transition-transform duration-300`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-yellow-800 animate-pulse" />
                    <p className="text-lg font-black text-yellow-800">{item.price}</p>
                  </div>
                  {canAfford ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                      ✓ Can afford
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      Need {item.price - balance} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford || isPurchasing}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                    canAfford && !isPurchasing
                      ? 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPurchasing ? 'Purchasing...' : canAfford ? 'Buy Now' : 'Not Enough Gems'}
                </button>
                
                <button
                  onClick={() => handleUseItem(item)}
                  disabled={usingItem === item.id}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 mt-2 ${
                    usingItem !== item.id
                      ? 'bg-green-600 hover:bg-green-700 text-white hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {usingItem === item.id ? 'Using...' : 'Use Item'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cosmetics Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-purple-600" />
          <h2 className="text-2xl font-black text-gray-900">Cosmetics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.filter(item => item.category === 'cosmetics').map((item) => {
            const canAfford = balance >= item.price
            const ItemIcon = iconMap[item.icon] || Trophy
            const isPurchasing = purchasingItem === item.id

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-105 hover:-translate-y-1"
              >
                <div className="text-center mb-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border-2 border-gray-200 transition-all duration-300 hover:rotate-6 hover:scale-110">
                      <ItemIcon className={`w-10 h-10 ${item.color} transition-transform duration-300`} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300 rounded-xl px-4 py-2 flex items-center gap-2">
                    <Gem className="w-4 h-4 text-yellow-800 animate-pulse" />
                    <p className="text-lg font-black text-yellow-800">{item.price}</p>
                  </div>
                  {canAfford ? (
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full animate-pulse">
                      ✓ Can afford
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                      Need {item.price - balance} more
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!canAfford || isPurchasing}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 ${
                    canAfford && !isPurchasing
                      ? 'bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isPurchasing ? 'Purchasing...' : canAfford ? 'Buy Now' : 'Not Enough Gems'}
                </button>

                <button
                  onClick={() => handleUseItem(item)}
                  disabled={usingItem === item.id}
                  className={`w-full font-bold py-3 rounded-xl transition-all duration-300 mt-2 ${
                    usingItem !== item.id
                      ? 'bg-pink-600 hover:bg-pink-700 text-white hover:scale-105 active:scale-95'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {usingItem === item.id ? 'Equipping...' : 'Equip'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
