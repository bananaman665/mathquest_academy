import { withErrorHandling, apiSuccess, AuthenticationError, ValidationError } from '@/lib/errors'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import OpenAI from 'openai'

// Initialize OpenAI client lazily
let openai: OpenAI | null = null
function getOpenAIClient() {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    openai = new OpenAI({ apiKey })
  }
  return openai
}

// Type for conversation history messages
interface HistoryMessage {
  role: 'user' | 'assistant'
  content: string
}

export const POST = withErrorHandling(async (req: Request) => {
  const { userId } = await auth()

  if (!userId) {
    throw new AuthenticationError()
  }

  // Check if user has premium access
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  const body = await req.json()
  const { question, correctAnswer, userAnswer, userQuestion, history = [], isTrial = false } = body

  // Validate required fields
  if (!question || !userQuestion) {
    throw new ValidationError('Question and user question are required')
  }

  // Allow trial access for testing
  if (!user?.isPremium && !isTrial) {
    throw new ValidationError('AI Tutor is a premium feature. Upgrade to access personalized explanations!')
  }

  try {
    // Build conversation history for context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an expert math tutor for Mathlify, a gamified math learning platform. Your role is to help students understand math concepts through clear, encouraging explanations that fit our playful, supportive tone.`
      },
      // Include recent conversation history (limit to last 10 messages)
      ...history.slice(-10).map((msg: HistoryMessage) => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      })),
      // Current user question
      {
        role: 'user',
        content: userQuestion
      }
    ]

    const client = getOpenAIClient()
    const completion = await client.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use gpt-4 for premium users if you want better quality
      messages,
      max_tokens: 500,
      temperature: 0.7,
    })

    const explanation = completion.choices[0]?.message?.content?.trim()

    if (!explanation) {
      throw new Error('Failed to generate explanation')
    }

    return apiSuccess({
      explanation,
      model: 'gpt-3.5-turbo',
      tokens: completion.usage?.total_tokens || 0
    })

  } catch (error) {
    console.error('OpenAI API error:', error)

    // Fallback to simple explanation generator if OpenAI fails
    const fallbackExplanation = generateFallbackExplanation(question, correctAnswer, userAnswer, userQuestion)

    console.log('Using fallback explanation:', fallbackExplanation)

    return apiSuccess({
      explanation: fallbackExplanation,
      fallback: true,
      error: 'AI service temporarily unavailable - using basic explanation'
    })
  }
})

// Fallback explanation generator (used when OpenAI is unavailable)
function generateFallbackExplanation(question: string, correctAnswer: string, userAnswer: string | undefined, userQuestion: string): string {
  const lowerQuestion = userQuestion.toLowerCase()

  // Check what kind of question the user is asking
  if (lowerQuestion.includes('why')) {
    return `Great question! The answer is ${correctAnswer} because that's the mathematically correct result. When working through math problems, each step builds on the previous one. You're doing awesome by asking thoughtful questions! 🌟`
  } else if (lowerQuestion.includes('step') || lowerQuestion.includes('how')) {
    return `Let me break it down for you:\n\n1. Look at the question: "${question}"\n2. The correct answer is ${correctAnswer}\n3. ${userAnswer ? `You answered ${userAnswer}, which was ${userAnswer === correctAnswer ? 'spot on! 🎉' : 'close, but the right answer is ' + correctAnswer}` : 'Think about the mathematical operation needed'}\n\nRemember: Every math problem is a puzzle waiting to be solved!`
  } else if (lowerQuestion.includes('example') || lowerQuestion.includes('similar')) {
    return `Sure! Here's a similar concept:\n\nThink of it like this - if you understand this pattern, you'll see how ${correctAnswer} is the right answer for "${question}".\n\nKeep exploring math - you're building some amazing skills! 🚀`
  } else {
    return `The correct answer is ${correctAnswer}. ${userAnswer && userAnswer !== correctAnswer ? `You answered ${userAnswer}, which shows you're thinking about it! ` : ''}Math is all about practice and persistence. You're on the right track! 💪`
  }
}
