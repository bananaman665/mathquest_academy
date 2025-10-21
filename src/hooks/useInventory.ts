import { useState, useEffect } from 'react'

export interface InventoryItem {
  id: string
  itemId: string
  quantity: number
  isActive: boolean
  expiresAt: string | null
  item: {
    id: string
    name: string
    icon: string
    effect: string | null
  }
}

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/inventory')
      if (response.ok) {
        const data = await response.json()
        setInventory(data.inventory || [])
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const hasItem = (itemId: string) => {
    return inventory.some(item => item.itemId === itemId && item.quantity > 0)
  }

  const hasActiveItem = (itemName: string) => {
    return inventory.some(item => 
      item.item.name === itemName && 
      item.isActive && 
      (!item.expiresAt || new Date(item.expiresAt) > new Date())
    )
  }

  const getItemQuantity = (itemId: string) => {
    const item = inventory.find(i => i.itemId === itemId)
    return item?.quantity || 0
  }

  const useItem = async (itemId: string) => {
    try {
      const response = await fetch('/api/inventory/use', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId }),
      })

      if (response.ok) {
        await fetchInventory() // Refresh inventory
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to use item:', error)
      return false
    }
  }

  return {
    inventory,
    loading,
    hasItem,
    hasActiveItem,
    getItemQuantity,
    useItem,
    refetch: fetchInventory,
  }
}
