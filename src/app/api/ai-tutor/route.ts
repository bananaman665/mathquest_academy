import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user has premium access
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user?.isPremium) {
      return NextResponse.json({ 
        error: 'Premium feature',
        message: 'AI Tutor is a premium feature. Upgrade to access!'
      }, { status: 403 })
    }

    const { question, correctAnswer, userAnswer, userQuestion } = await request.json()

    // Create a simple explanation based on the context
    // In a real app, you'd integrate with OpenAI API here
    const explanation = generateExplanation(question, correctAnswer, userAnswer, userQuestion)
    
    // Log for debugging
    console.log('Generated explanation for:', { question, correctAnswer, userAnswer })

    return NextResponse.json({ explanation })
  } catch (error) {
    console.error('AI Tutor error:', error)
    return NextResponse.json({ error: 'Failed to get explanation' }, { status: 500 })
  }
}

// Simple explanation generator (replace with OpenAI in production)
function generateExplanation(question: string, correctAnswer: string, userAnswer: string | undefined, userQuestion: string): string {
  const lowerQuestion = userQuestion.toLowerCase()

  // Check what kind of question the user is asking
  if (lowerQuestion.includes('why')) {
    return `Great question! The answer is ${correctAnswer} because that's the next number in the sequence. When counting, each number increases by 1. So after ${question.match(/\d+/)?.[0]}, we add 1 to get ${correctAnswer}!`
  } else if (lowerQuestion.includes('step') || lowerQuestion.includes('how')) {
    return `Let me break it down:\n\n1. Look at the question: "${question}"\n2. The correct answer is ${correctAnswer}\n3. ${userAnswer ? `You answered ${userAnswer}, which was ${userAnswer === correctAnswer ? 'correct! 🎉' : 'close, but the right answer is ' + correctAnswer}` : 'Try to think about what comes next in the pattern'}\n\nRemember: Practice makes perfect!`
  } else if (lowerQuestion.includes('example') || lowerQuestion.includes('similar')) {
    const num = parseInt(question.match(/\d+/)?.[0] || '5')
    return `Sure! Here's a similar question:\n\n"What comes after ${num + 2}?"\nThe answer would be ${num + 3}!\n\nSee the pattern? Each time, we're just adding 1 to find the next number in the sequence.`
  } else {
    return `The correct answer is ${correctAnswer}. ${userAnswer && userAnswer !== correctAnswer ? `You answered ${userAnswer}, which is close! ` : ''}Keep practicing and you'll get even better at math! 🌟`
  }
}
