# MathQuest Academy - Codebase Architecture

## Overview
MathQuest Academy is a Next.js 15 application with TypeScript, using the App Router pattern. It's a Duolingo-style math learning platform for elementary students with interactive lessons, gamification, and progression tracking.

## Tech Stack

### Core Technologies
- **Next.js 15.5.6** - Full-stack React framework with App Router and Turbopack
- **React 19** - UI library with Server Components
- **TypeScript 5** - Static typing throughout the codebase
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - ORM for PostgreSQL database
- **Clerk** - Authentication with Google OAuth

### Supporting Libraries
- **@hello-pangea/dnd** - Drag-and-drop for interactive questions
- **Framer Motion** - Animation library
- **Lucide React** - Icon library
- **HTML5 Audio API** - Custom sound effects

## Project Structure

```
mathquest-academy/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes (achievements, inventory, shop, etc.)
│   │   ├── learn/             # Main learning interface
│   │   │   ├── page.tsx       # Units overview page
│   │   │   └── level/[levelId]/
│   │   │       ├── page.tsx              # Level page (server component)
│   │   │       ├── LevelWrapper.tsx      # Client wrapper with heart check
│   │   │       ├── LessonClient.tsx      # Main lesson UI (renders questions)
│   │   │       └── complete/
│   │   │           └── page.tsx          # Level completion page
│   │   ├── inventory/         # User inventory page
│   │   ├── shop/              # In-app shop
│   │   └── ...                # Other pages (dashboard, profile, etc.)
│   ├── components/
│   │   ├── game/              # Game-style question components
│   │   │   ├── BlockStackingQuestion.tsx  # Drag-drop blocks to build addition/subtraction
│   │   │   ├── BubblePopMath.tsx          # Pop bubbles with correct answers
│   │   │   ├── NumberLine.tsx             # Number line visualization
│   │   │   ├── NumberLinePlacement.tsx    # Place numbers on number line
│   │   │   └── TenFrame.tsx               # Display dots in 2x5 grid for counting (user types answer)
│   │   ├── interactive/       # Interactive learning components
│   │   │   ├── ArrayGridBuilder.tsx
│   │   │   ├── BalanceScale.tsx
│   │   │   ├── ClockSetter.tsx
│   │   │   ├── DivisionMachine.tsx
│   │   │   ├── FairShare.tsx
│   │   │   ├── FillTheJar.tsx
│   │   │   ├── FractionBuilder.tsx
│   │   │   ├── GraphPlotter.tsx
│   │   │   ├── GroupMaker.tsx
│   │   │   ├── MoneyCounter.tsx
│   │   │   ├── NumberLineDrag.tsx
│   │   │   ├── ShapeComposer.tsx
│   │   │   └── SkipCounter.tsx
│   │   └── ...                # Other UI components
│   ├── data/
│   │   ├── questions.ts               # Type definitions & getQuestionsForLevel()
│   │   ├── questionGenerator.ts       # Question generation engine
│   │   └── placementTest.ts          # Placement test configuration
│   ├── hooks/
│   │   └── useSoundEffects.ts        # Sound effects management
│   ├── lib/                   # Utility functions
│   ├── types/                 # TypeScript type definitions
│   └── utils/                 # Helper functions
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── dev.db               # SQLite dev database
│   ├── seed-achievements.ts  # Seed achievement data
│   └── seed-shop.ts         # Seed shop items
├── public/
│   └── sounds/              # MP3 sound effects
└── ...                      # Config files

```

## Core Systems

### 1. Question Generation System

#### Key Files
- `src/data/questionGenerator.ts` - Core generation logic
- `src/data/questions.ts` - Type definitions and exports

#### Architecture
The question generator creates math questions dynamically instead of hardcoding thousands of questions.

**Flow:**
1. **Level Configuration** (`levelConfigs` object)
   - Each of 50 levels has a config defining:
     - Operation type: `addition`, `subtraction`, `multiplication`, `division`, `counting`, `place-value`, `fractions`, `mixed`
     - Number ranges: min/max for operands and answers
     - Question types: Which interactive components to use
     - Difficulty: `easy`, `medium`, `hard`
     - Special rules: Allow negatives, remainders, decimals, etc.

2. **Seeded Random Generation** (`SeededRandom` class)
   - Uses `Math.sin(seed)` for deterministic randomness
   - Same user always sees same questions for a level (consistency)
   - Different users see different variants (variety)
   - Seed calculation: `userId.charCodeAt(0) + levelId * 1000`

3. **Question Creation Pipeline**
   ```typescript
   getQuestionsForLevel(levelId, userId)
     → generateQuestionsForLevel(levelId, seed)
       → generateQuestion(config, questionType, rng, index)
         → [Calculate num1, num2, answer based on operation]
         → generateQuestionByType(type, config, num1, num2, answer, rng, index, actualOperation)
           → [Format as multiple-choice, type-answer, drag-drop, etc.]
   ```

4. **Operation Calculation Logic**
   - **Addition**: Generate two random numbers, ensure sum is in range
   - **Subtraction**: Generate answer first, then `num1 = answer + num2` (ensures no negatives)
   - **Multiplication**: Pick two factors (capped at 12 for reasonable products)
   - **Division**: Generate answer and divisor, then `num1 = answer * num2` (ensures no remainders unless allowed)
   - **Counting**: `answer = num1 + 1` (what comes after?)
   - **Mixed/Place-Value**: Randomly pick from available operations based on curriculum level

#### Critical Bug Fix (Dec 2024)
**Problem:** Mixed/place-value operations were showing wrong operation symbols.
- Example: Question displayed as "120 + 10 = ?" but answer was 12 (should be "120 ÷ 10 = 12")
- Root cause: `randomOp` was used for calculation, but `config.operation` was used for symbol display

**Solution:**
- Added `actualOperation` variable to track the real operation used
- Pass `actualOperation` to `generateQuestionByType()` as a new parameter
- Use `actualOperation` instead of `config.operation` for `getOperationSymbol()`
- Fixed duplicate switch statements that were causing syntax errors

### 2. Question Randomization

**File:** `src/app/learn/level/[levelId]/page.tsx`

**Purpose:** Convert 10% of questions to alternate formats for variety

**Rules:**
- **Skip counting questions** - They have specific phrasing ("What comes after X?")
- 10% → `type-answer` (free text input)
- 10% → `match-equation` (drag equations to answers)

**Why:** Adds variety without changing the underlying math problems

### 3. Lesson Rendering System

**File:** `src/app/learn/level/[levelId]/LessonClient.tsx`

**Responsibilities:**
- Display questions one at a time
- Render appropriate component based on question type
- Check answers and provide feedback
- Track hearts (lives), XP, streak
- Play sound effects (correct/incorrect)
- Show hints and explanations

**Question Types → Components Mapping:**
| Question Type | Component | Description |
|--------------|-----------|-------------|
| `multiple-choice` | Radio buttons | User selects one answer from 4 options |
| `type-answer` | Text input field | User types numeric answer |
| `block-stacking` | `BlockStackingQuestion` | Drag-drop blocks to visualize addition/subtraction |
| `ten-frame` | `TenFrame` | Shows dots in 2x5 grid, user counts and types answer |
| `bubble-pop` | `BubblePopMath` | Interactive bubble popping game |
| `number-line-drag` | `NumberLineDrag` | Drag numbers onto correct positions on number line |
| `balance-scale` | `BalanceScale` | Balance equation by finding missing value |
| `fraction-builder` | `FractionBuilder` | Build visual fraction representations |
| `array-grid-builder` | `ArrayGridBuilder` | Build arrays to understand multiplication |
| `skip-counter` | `SkipCounter` | Count by 2s, 5s, 10s with interactive feedback |
| `fair-share` | `FairShare` | Divide items equally among groups |
| `array-division` | `ArrayDivision` | Visual array-based division with flashcard navigation |
| `remainder-boxes` | `RemainderBoxes` | Division with remainders using drag-drop |
| `fill-the-jar` | `FillTheJar` | Fill containers to target amounts |
| `graph-plotter` | `GraphPlotter` | Plot points on coordinate grid |
| `clock-setter` | `ClockSetter` | Set clock hands to correct time |
| `money-counter` | `MoneyCounter` | Count coins and bills |
| ... and more ||

### 4. Curriculum Structure

**File:** `src/app/learn/page.tsx`

**Units (1-10):**
1. **Number Basics** (Levels 1-5) - Counting 1-10
2. **Addition Adventures** (Levels 6-10) - Addition within 10
3. **Subtraction Station** (Levels 11-15) - Subtraction within 10
4. **Bigger Numbers** (Levels 16-20) - Addition/Subtraction within 100
5. **Place Values** (Levels 21-25) - Tens, ones, hundreds
6. **Fraction Fun** (Levels 26-30) - Basic fractions
7. **Decimal Dimension** (Levels 31-35) - Decimals and money
8. **Geometry Garden** (Levels 36-40) - Shapes, perimeter, area
9. **Measurement Mission** (Levels 41-45) - Length, weight, time
10. **Problem Solving Palace** (Levels 46-50) - Real-world applications

**Note:** The actual curriculum in `questionGenerator.ts` differs slightly:
- Levels 21-25: Place values (correct)
- Levels 26-30: Multiplication basics (restructured in Dec 2024)
- Levels 31-35: Division basics (restructured in Dec 2024)
- Levels 36-40: Advanced addition/subtraction within 20

### 5. Gamification System

#### Hearts (Lives)
- Users start with 5 hearts
- Lose 1 heart per wrong answer
- Can't play if hearts = 0
- Hearts refill over time or via shop items

#### XP & Leveling
- Earn 10-15 XP per question
- Bonus XP for streaks, speed, perfection
- XP boosts from power-ups (2x, 3x multipliers)

#### Streak System
- Track consecutive days of practice
- Lose streak if miss a day (unless streak freeze active)
- Shown with 🔥 fire icon

#### Inventory System
- **Power-ups:** XP Boost, Hint Pack, Streak Freeze, Extra Hearts
- **Cosmetics:** Golden Trophy, Rainbow Theme, Special Badges
- Equipped items affect gameplay

#### Shop System
- Buy items with gems (💎)
- Gems earned from completing levels
- Prices range from 50-500 gems

### 6. Sound Effects

**File:** `src/hooks/useSoundEffects.ts`

**Audio Files:**
- `correct.mp3` - Played on correct answer
- `incorrect.mp3` - Played on wrong answer
- `level-complete.mp3` - Played when level finished

**Implementation:** HTML5 Audio API with memoized Audio objects

### 7. Database Schema

**File:** `prisma/schema.prisma`

**Models:**
- **User** - Profile, XP, gems, hearts, streak
- **Progress** - Completed levels, scores, timestamps
- **Achievement** - Achievement definitions
- **UserAchievement** - User's earned achievements
- **InventoryItem** - Item definitions (power-ups, cosmetics)
- **UserInventory** - User's owned items

## Data Flow

### User Starts a Level
1. User clicks level on `/learn` page
2. Navigate to `/learn/level/[levelId]`
3. Server component (`page.tsx`):
   - Fetch level introduction from `questions.ts`
   - Generate questions via `getQuestionsForLevel(levelId)`
   - Apply 10% randomization to alternate formats
   - Determine game mode (normal/speed/lightning/etc.)
4. Pass data to `LevelWrapper` (client component)
5. `LevelWrapper` checks hearts, shows intro modal
6. User clicks "Start" → render `LessonClient`
7. `LessonClient` displays questions one by one
8. On each answer:
   - Check correctness
   - Update hearts/XP/streak
   - Play sound effect
   - Show explanation
   - Move to next question
9. On completion → navigate to `/learn/level/[levelId]/complete`
10. Completion page shows XP earned, next level preview

## Common Patterns

### Seeded Randomization
Used throughout for deterministic but varied content:
```typescript
const rng = new SeededRandom(userId.charCodeAt(0) + levelId * 1000)
const randomNumber = rng.nextInt(min, max)
```

### Answer Validation
Subtraction/division generate answer FIRST to avoid negatives/remainders:
```typescript
// Subtraction
answer = rng.nextInt(min, max)
num2 = rng.nextInt(min, max)
num1 = answer + num2  // Ensures num1 - num2 = answer (positive)

// Division
answer = rng.nextInt(min, max)
num2 = rng.nextInt(2, 12)
num1 = answer * num2  // Ensures num1 ÷ num2 = answer (no remainder)
```

### Component Composition
Questions use a consistent interface:
```typescript
interface QuestionComponentProps {
  question: Question
  onAnswer: (userAnswer: string, isCorrect: boolean) => void
}
```

### Interactive Question Components

#### TenFrame Component (`src/components/game/TenFrame.tsx`)
**Purpose:** Visual counting aid showing dots in a 2x5 grid (10 total boxes)

**How it works:**
1. Displays `correctPosition` number of dots pre-filled in the grid
2. Dots fill left-to-right, top row first (positions 0-4), then bottom row (5-9)
3. User observes the dots and types their count in a number input
4. Uses `onSubmitReady` callback pattern to register submit function with parent
5. Validates answer when CHECK button is clicked (not on input change)

**Key Implementation Details:**
- Uses refs to prevent auto-submit issues: `userAnswerRef`, `onAnswerRef`, `correctPositionRef`
- `handleSubmit` has NO dependencies `[]` to ensure stability and prevent recreation
- Refs are synced via `useEffect` to always have current values
- Empty answer returns `false` instead of crashing with `NaN`

**Common Bugs Fixed (Nov 2024):**
- ❌ Was allowing users to PLACE dots (wrong behavior)
- ✅ Now DISPLAYS dots for users to COUNT
- ❌ Was auto-submitting on component mount
- ✅ Now stable submit function prevents auto-submit
- ❌ Was recreating submit function on every keystroke
- ✅ Now uses refs to keep function stable

#### ArrayDivision Component
**Purpose:** Visual division using arrays with flashcard navigation

**How it works:**
- Shows division problems as arrays (e.g., 12 dots in 3 groups)
- Flashcard-style interface: one problem at a time
- Users navigate with left/right swipe or arrow buttons
- No scrolling required - mobile-friendly

#### RemainderBoxes Component  
**Purpose:** Division with remainders using drag-drop visualization

**How it works:**
- Displays total items to divide and number of boxes
- Users drag items into boxes equally
- Leftover items = remainder
- Visual learning of division with remainders concept

## Recent Changes (Dec 2024)

### Curriculum Restructure
- **Old:** Levels 22-25 had mixed multiplication and place values
- **New:** 
  - Levels 21-25: Place values only
  - Levels 26-30: Multiplication basics (moved from mixed locations)
  - Levels 31-35: Division basics (moved from mixed locations)

### Question Generator Bug Fix
- **Issue:** Mixed/place-value operations showed wrong symbols (e.g., "120 + 10 = 12")
- **Fix:** Track `actualOperation` variable, pass to display functions
- **Removed:** Duplicate switch statements causing syntax errors
- **Result:** ✅ Build passes with no TypeScript errors

### Counting Question Protection
- **Issue:** "What comes after 16?" was being converted to "16 + 0 = 17" with wrong answer
- **Fix:** Skip randomization for questions containing "comes after" or "comes before"

### UI Improvements
- Block-stacking: Circular tokens (14x14), vertical mobile layout
- Balance-scale: Fixed props structure
- Text visibility: Changed from gray-400 to gray-900
- Completion page: Added Next Level Preview feature

## Build & Deploy

### Development
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build with type checking
npm run lint         # ESLint
```

### Database
```bash
npx prisma generate  # Generate Prisma Client
npx prisma migrate   # Run migrations
npx prisma studio    # Visual database editor
```

### Deployment
- Platform: Vercel
- Environment variables: `.env.local` (Clerk keys, database URL)
- Build command: `prisma generate && next build --turbopack`

## Testing

### Manual Testing Checklist
1. ✅ Complete a level start to finish
2. ✅ Test all question types render correctly
3. ✅ Verify operation symbols match calculations
4. ✅ Check counting questions don't randomize
5. ✅ Confirm hearts decrement on wrong answers
6. ✅ Test sound effects play correctly
7. ✅ Verify XP and gems are awarded
8. ✅ Check completion page shows correctly
9. ✅ Test on mobile (iPhone) - responsive design
10. ✅ Verify no console errors

## Known Issues & Warnings

### Build Warnings (Non-blocking)
- Unused variables in various components (ESLint warnings)
- `<img>` tags should use Next.js `<Image>` component
- Some React hooks missing dependencies

These are cosmetic and don't affect functionality.

## Future Enhancements

### Planned Features
- [ ] AI Tutor integration (GPT-4o mini)
- [ ] Multiplayer challenges
- [ ] Parent dashboard with progress reports
- [ ] More interactive question types
- [ ] Achievement badges system expansion
- [ ] Social features (friend leaderboards)

### Technical Debt
- [ ] Replace `<img>` with Next.js `<Image>`
- [ ] Clean up unused variables
- [ ] Fix React hook dependencies
- [ ] Add unit tests for question generator
- [ ] Add E2E tests with Playwright

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow existing naming conventions
- Add comments for complex logic
- Use Tailwind CSS for styling
- Keep components focused (single responsibility)

### Before Committing
1. Run `npm run build` - ensure no TypeScript errors
2. Test manually on desktop and mobile
3. Check for console errors
4. Update documentation if adding features

### Git Workflow
```bash
git add .
git commit -m "Clear description of changes"
git push origin main
```

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- Clerk: https://clerk.com/docs
- Tailwind CSS: https://tailwindcss.com/docs

### Key Contacts
- Repository: github.com/bananaman665/mathquest_academy
- Owner: Andrew (@bananaman665)

---

**Last Updated:** December 2024
**Version:** 1.0 (Post Question Generator Bug Fix)
