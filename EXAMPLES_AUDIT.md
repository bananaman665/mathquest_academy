# Examples Audit & Fixes

## Issue
The introduction examples in the level teach sections are not showing the correct visual dot representations.

## Fix Strategy
We need to manually verify and ensure each level's examples have:
1. Correct number of dots matching the first number
2. Correct number of dots matching the second number  
3. Correct total dots in the result
4. Consistent formatting

## Examples Format
```
{ number: "10 + 5", visual: "●●●●●●●●●● + ●●●●● = ●●●●●●●●●●●●●●●", word: "equals 15" }
```

## Levels to Fix

### Level 6 (Addition: Sums up to 15) - Lines 691-700
- 6 + 4 = 10 ✓
- 7 + 5 = 12 ✓
- 8 + 7 = 15 ✓

### Level 7 (Addition: Sums up to 20) - Lines 810-819
- 10 + 5 = 15 ✓
- 9 + 9 = 18 ✓
- 10 + 10 = 20 ✓

### Level 8 (Subtraction: From 5-10) - Lines 929-938
Need to check

### Level 9 (Subtraction: From 10s) - Lines 1048-1057
Need to check

### Level 10 (More Mixed Operations) - Lines 1167-1176
Need to check

## Next Steps
1. Audit each level's examples to count actual dots
2. Fix mismatches systematically
3. Test deployment
