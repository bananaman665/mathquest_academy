'use client'

import { Heart, Snowflake, Zap, Lightbulb, Trophy, Palette, Package } from 'lucide-react'
import { useInventory } from '@/hooks/useInventory'
import { useState } from 'react'
import { useSoundEffects } from '@/hooks/useSoundEffects'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Heart,
  Snowflake,
  Zap,
  Lightbulb,
  Trophy,
  Palette,
}

export default function InventoryClient() {
  const { inventory, loading, useItem, refetch } = useInventory()
  const [usingItem, setUsingItem] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { playCorrect } = useSoundEffects()

  const handleUseItem = async (itemId: string) => {
    setUsingItem(itemId)
    setMessage(null)

    const success = await useItem(itemId)
    
    if (success) {
      playCorrect()
      setMessage('Item used successfully!')
      setTimeout(() => setMessage(null), 3000)
      await refetch()
    } else {
      setMessage('Failed to use item')
      setTimeout(() => setMessage(null), 3000)
    }

    setUsingItem(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (inventory.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Items Yet</h3>
        <p className="text-gray-600">Visit the shop to purchase power-ups and cosmetics!</p>
      </div>
    )
  }

  return (
    <div>
      {message && (
        <div className="mb-4 p-4 bg-green-100 border-2 border-green-300 rounded-xl text-green-800 font-bold animate-pulse">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => {
          const ItemIcon = iconMap[item.item.icon] || Package
          const isUsing = usingItem === item.itemId
          const effect = item.item.effect ? JSON.parse(item.item.effect) : null
          const isCosmetic = effect?.type === 'cosmetic'

          return (
            <div
              key={item.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                    <ItemIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{item.item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                {item.isActive && (
                  <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Active
                  </span>
                )}
              </div>

              {item.expiresAt && new Date(item.expiresAt) > new Date() && (
                <div className="text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-lg mb-3">
                  Expires: {new Date(item.expiresAt).toLocaleString()}
                </div>
              )}

              <button
                onClick={() => handleUseItem(item.itemId)}
                disabled={isUsing || (item.quantity <= 0 && !isCosmetic)}
                className={`w-full font-bold py-2 px-4 rounded-xl transition-all ${
                  isUsing
                    ? 'bg-gray-300 text-gray-500 cursor-wait'
                    : item.quantity <= 0 && !isCosmetic
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : item.isActive && isCosmetic
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
                }`}
              >
                {isUsing
                  ? 'Using...'
                  : isCosmetic
                  ? item.isActive
                    ? 'Unequip'
                    : 'Equip'
                  : item.quantity <= 0
                  ? 'Out of Stock'
                  : 'Use Item'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
