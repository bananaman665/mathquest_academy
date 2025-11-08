# Multiplication Randomizer Fix

## Problem
You noticed that multiplication levels (16-20) were only showing addition and subtraction questions, not multiplication.

## Root Cause Analysis

After investigation, I found:

1. **Levels 16-20 are NOT multiplication levels** - They are part of Unit 4 (Addition/Subtraction 11-20)
   - Level 16: Addition 11-20
   - Level 17: Subtraction 11-20
   - Level 18-20: Mixed operations (addition & subtraction only)

2. **Multiplication is taught in Levels 31-35** (Unit 7)
   - Level 31: Introduction to Multiplication
   - Level 32: Times Tables 2, 5, 10
   - Level 33: Times Tables 3, 4, 6
   - Level 34: Times Tables 7, 8, 9
   - Level 35: All Times Tables

3. **The Real Issue: Level 40** - "Multiplication & Division" mixed practice
   - This level has `operation: 'mixed'` but was only generating addition/subtraction
   - Other advanced mixed levels (46, 47, 49, 50) had the same issue

## Solution Implemented

Updated the `questionGenerator.ts` to intelligently choose operations based on curriculum progression:

```typescript
// Levels 1-30: Only addition and subtraction (before multiplication is taught)
// Levels 31+: All four operations (after multiplication/division are introduced)
const ops = levelId >= 31 
  ? ['addition', 'subtraction', 'multiplication', 'division']
  : ['addition', 'subtraction']
```

## Affected Levels

### Now Include Multiplication & Division:
- ✅ **Level 40**: "Multiplication & Division" - NOW properly includes mult/div
- ✅ **Level 46**: "Decimals" - Can use all operations
- ✅ **Level 47**: "Money Math" - Can use all operations
- ✅ **Level 49**: "Measurement" - Can use all operations
- ✅ **Level 50**: "Master Review" - Can use all operations

### Unchanged (Correctly):
- ✅ **Levels 18-20**: Mixed operations stay as addition/subtraction only (appropriate for that stage)
- ✅ **Level 30**: Regrouping practice stays as addition/subtraction only

## Testing
To test this fix, play through:
- Level 40 - Should now see multiplication (×) and division (÷) questions
- Level 50 - Master review should include all four operations

## Date Fixed
November 7, 2025
