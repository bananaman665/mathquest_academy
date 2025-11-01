/**
 * TEST QUESTION GENERATOR
 * 
 * This script tests the new question generator system to ensure:
 * 1. Questions are generated correctly for each level
 * 2. Addition questions only add (never subtract)
 * 3. Subtraction questions never produce negative answers
 * 4. Multiplication and division work correctly
 * 5. Questions are deterministic (same seed = same questions)
 */

import { getQuestionsForLevel } from './questionGenerator'
import { levelConfigs } from './questionGenerator'

// ANSI color codes for pretty console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function testLevel(levelId: number) {
  const config = levelConfigs[levelId]
  if (!config) {
    log(`❌ No config for level ${levelId}`, colors.red)
    return
  }

  log(`\n${'='.repeat(60)}`, colors.cyan)
  log(`📚 Testing Level ${levelId}: ${config.unit}`, colors.bold)
  log(`Operation: ${config.operation} | Range: ${config.numberRange.min}-${config.numberRange.max}`, colors.blue)
  log('='.repeat(60), colors.cyan)

  try {
    // Generate questions
    const questions = getQuestionsForLevel(levelId, 'test-user-123')
    
    log(`\n✅ Generated ${questions.length} questions`, colors.green)

    // Check each question
    questions.forEach((q, idx) => {
      log(`\n📝 Question ${idx + 1}: ${q.question}`, colors.yellow)
      log(`   Type: ${q.type}`, colors.blue)
      log(`   Answer: ${q.correctAnswer}`, colors.green)
      
      if (q.hints) {
        log(`   Hints: ${q.hints.join(' | ')}`, colors.cyan)
      }

      // Validate based on operation
      if (config.operation === 'addition') {
        // Extract numbers from question like "5 + 3 = ?"
        const match = q.question.match(/(\d+)\s*\+\s*(\d+)/)
        if (match) {
          const num1 = parseInt(match[1])
          const num2 = parseInt(match[2])
          const expected = num1 + num2
          const actual = parseInt(q.correctAnswer || '0')
          
          if (expected !== actual) {
            log(`   ⚠️ WARNING: ${num1} + ${num2} should be ${expected}, got ${actual}`, colors.red)
          } else {
            log(`   ✓ Validated: ${num1} + ${num2} = ${actual}`, colors.green)
          }
        }
      }

      if (config.operation === 'subtraction') {
        const match = q.question.match(/(\d+)\s*[−-]\s*(\d+)/)
        if (match) {
          const num1 = parseInt(match[1])
          const num2 = parseInt(match[2])
          const expected = num1 - num2
          const actual = parseInt(q.correctAnswer || '0')
          
          if (expected !== actual) {
            log(`   ⚠️ WARNING: ${num1} − ${num2} should be ${expected}, got ${actual}`, colors.red)
          } else if (expected < 0 && !config.allowNegatives) {
            log(`   ⚠️ WARNING: Negative answer ${expected} when negatives not allowed!`, colors.red)
          } else {
            log(`   ✓ Validated: ${num1} − ${num2} = ${actual}`, colors.green)
          }
        }
      }

      if (config.operation === 'multiplication') {
        const match = q.question.match(/(\d+)\s*[×x]\s*(\d+)/)
        if (match) {
          const num1 = parseInt(match[1])
          const num2 = parseInt(match[2])
          const expected = num1 * num2
          const actual = parseInt(q.correctAnswer || '0')
          
          if (expected !== actual) {
            log(`   ⚠️ WARNING: ${num1} × ${num2} should be ${expected}, got ${actual}`, colors.red)
          } else {
            log(`   ✓ Validated: ${num1} × ${num2} = ${actual}`, colors.green)
          }
        }
      }

      if (config.operation === 'division') {
        const match = q.question.match(/(\d+)\s*[÷/]\s*(\d+)/)
        if (match) {
          const num1 = parseInt(match[1])
          const num2 = parseInt(match[2])
          const expected = Math.floor(num1 / num2)
          const actual = parseInt(q.correctAnswer || '0')
          
          if (!config.allowRemainders && num1 % num2 !== 0) {
            log(`   ⚠️ WARNING: ${num1} ÷ ${num2} has remainder when not allowed!`, colors.red)
          } else if (expected !== actual) {
            log(`   ⚠️ WARNING: ${num1} ÷ ${num2} should be ${expected}, got ${actual}`, colors.red)
          } else {
            log(`   ✓ Validated: ${num1} ÷ ${num2} = ${actual}`, colors.green)
          }
        }
      }
    })

    // Test determinism - same seed should give same questions
    const questions2 = getQuestionsForLevel(levelId, 'test-user-123')
    if (questions[0].question === questions2[0].question) {
      log(`\n✅ Determinism check passed: Same seed produces same questions`, colors.green)
    } else {
      log(`\n❌ Determinism check FAILED: Different questions with same seed!`, colors.red)
    }

    // Test variety - different seed should give different questions
    const questions3 = getQuestionsForLevel(levelId, 'different-user-456')
    if (questions[0].question !== questions3[0].question) {
      log(`✅ Variety check passed: Different seeds produce different questions`, colors.green)
    } else {
      log(`⚠️ Variety check: Same questions (might be coincidence)`, colors.yellow)
    }

  } catch (error) {
    log(`\n❌ ERROR: ${error}`, colors.red)
  }
}

// Test a selection of levels across different operations
log(`\n${'='.repeat(60)}`, colors.bold)
log('🧪 QUESTION GENERATOR TEST SUITE', colors.bold)
log('='.repeat(60), colors.bold)

// Test counting (Level 1-2)
testLevel(1)
testLevel(2)

// Test addition (Level 6-7)
testLevel(6)
testLevel(7)

// Test subtraction (Level 11-12)
testLevel(11)
testLevel(12)

// Test mixed operations (Level 18)
testLevel(18)

// Test multiplication (Level 31-32)
testLevel(31)
testLevel(32)

// Test division (Level 36-37)
testLevel(36)
testLevel(37)

// Test advanced (Level 50)
testLevel(50)

log(`\n${'='.repeat(60)}`, colors.bold)
log('✅ TEST SUITE COMPLETE', colors.bold)
log('='.repeat(60), colors.bold)
