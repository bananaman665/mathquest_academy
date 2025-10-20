'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AITutorProps {
  question: string
  correctAnswer: string
  userAnswer?: string
  isOpen: boolean
  onClose: () => void
}

export default function AITutor({ question, correctAnswer, userAnswer, isOpen, onClose }: AITutorProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [checkingPremium, setCheckingPremium] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      checkPremiumStatus()
    }
  }, [isOpen])

  const checkPremiumStatus = async () => {
    try {
      const response = await fetch('/api/user')
      const data = await response.json()
      setIsPremium(data.hasPremium || false)
    } catch (error) {
      console.error('Error checking premium status:', error)
      setIsPremium(false)
    } finally {
      setCheckingPremium(false)
    }
  }

  const handleUpgrade = () => {
    onClose()
    router.push('/upgrade')
  }

  const handleAsk = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          correctAnswer,
          userAnswer,
          userQuestion: userMessage,
          history: messages
        })
      })

      const data = await response.json()
      
      if (data.explanation) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.explanation }])
      }
    } catch (error) {
      console.error('AI Tutor error:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I had trouble understanding that. Can you try asking again?' 
      }])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Show premium gate if user is not premium
  if (!checkingPremium && !isPremium) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-scale-up">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black text-gray-900 mb-3">Unlock AI Tutor</h2>
            <p className="text-gray-600 mb-6 text-lg">Get instant help with every question from your personal AI math tutor!</p>
            
            <div className="bg-purple-50 rounded-2xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-4xl font-black text-purple-600 mb-1">$4.99</p>
              <p className="text-sm text-gray-600 font-semibold">per month</p>
            </div>
            
            <div className="space-y-3 mb-6 text-left">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Unlimited AI explanations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">50 bonus challenge levels</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-700">Exclusive badges & rewards</span>
              </div>
            </div>
            
            <button 
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl mb-3"
            >
              Start Free 7-Day Trial
            </button>
            <button onClick={onClose} className="w-full text-gray-600 py-3 hover:text-gray-800 font-medium">
              Maybe later
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl max-h-[85vh] md:max-h-[80vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Math Tutor</h2>
              <p className="text-sm text-white/80">Ask me anything about this question!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Question Context */}
        <div className="bg-blue-50 p-4 border-b border-blue-100">
          <p className="text-sm text-gray-600 mb-1">Question:</p>
          <p className="font-semibold text-gray-900">{question}</p>
          {userAnswer && (
            <p className="text-sm text-gray-600 mt-2">
              Your answer: <span className="font-semibold">{userAnswer}</span>
            </p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Ask me anything!</h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto">
                I can explain the concept, break down the steps, or help you understand why the answer is what it is.
              </p>
              <div className="mt-4 space-y-2">
                <button
                  onClick={() => setInput("Why is this the answer?")}
                  className="block w-full text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-xl text-sm text-purple-700 font-medium transition-all"
                >
                  💡 Why is this the answer?
                </button>
                <button
                  onClick={() => setInput("Can you explain it step by step?")}
                  className="block w-full text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-xl text-sm text-blue-700 font-medium transition-all"
                >
                  📝 Explain step by step
                </button>
                <button
                  onClick={() => setInput("Give me a similar example")}
                  className="block w-full text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-xl text-sm text-green-700 font-medium transition-all"
                >
                  🎯 Give me a similar example
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <p className="text-sm text-gray-600">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-3xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !loading && handleAsk()}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-sm"
              disabled={loading}
            />
            <button
              onClick={handleAsk}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-xl font-medium transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
