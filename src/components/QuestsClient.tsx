'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

interface Quest {
  id: string
  questId: string
  title: string
  description: string
  reward: string
  progress: number
  max: number
  icon: string
  isCompleted: boolean
  rewardClaimed: boolean
}

export default function QuestsClient() {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingReward, setClaimingReward] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    try {
      const response = await fetch('/api/quests/active')
      if (response.ok) {
        const data = await response.json()
        setQuests(data.quests)
      }
    } catch (error) {
      console.error('Error fetching quests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClaimReward = async (userQuestId: string) => {
    setClaimingReward(userQuestId)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/quests/claim-reward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestId }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage(data.message)
        // Refresh quests to show claimed status
        await fetchQuests()
      } else {
        alert(data.error || 'Failed to claim reward')
      }
    } catch (error) {
      console.error('Error claiming reward:', error)
      alert('Failed to claim reward')
    } finally {
      setClaimingReward(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <>
      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-800 font-semibold">{successMessage}</p>
        </div>
      )}

      {/* Daily Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quests.map((quest) => {
          const isComplete = quest.isCompleted
          const progressPercentage = (quest.progress / quest.max) * 100

          return (
            <div
              key={quest.id}
              className={`
                bg-white rounded-2xl shadow-lg border-3 p-6 transition-all duration-300
                ${isComplete ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:shadow-xl hover:scale-105'}
              `}
            >
              {/* Quest Icon */}
              <div className={`
                w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto
                ${isComplete ? 'bg-green-100' : 'bg-gradient-to-br from-blue-100 to-purple-100'}
              `}>
                {quest.icon}
              </div>

              {/* Quest Info */}
              <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                {quest.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 text-center">
                {quest.description}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-700 mb-2">
                  <span>Progress</span>
                  <span className="font-bold">{quest.progress}/{quest.max}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isComplete ? 'bg-green-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
              </div>

              {/* Reward */}
              <div className="flex items-center justify-center gap-2 mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-2">
                <span className="text-lg font-bold text-yellow-700">Reward:</span>
                <span className="text-lg font-bold text-yellow-700">{quest.reward}</span>
              </div>

              {/* Action Button */}
              {isComplete && !quest.rewardClaimed ? (
                <button
                  onClick={() => handleClaimReward(quest.id)}
                  disabled={claimingReward === quest.id}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  {claimingReward === quest.id ? 'Claiming...' : '🎉 Claim Reward'}
                </button>
              ) : isComplete && quest.rewardClaimed ? (
                <button
                  disabled
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-xl opacity-50 cursor-not-allowed"
                >
                  ✓ Claimed!
                </button>
              ) : (
                <Link
                  href="/learn"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-center transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Start Learning →
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
