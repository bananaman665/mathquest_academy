# Testing Power-Ups Guide

## 🎮 How to Test on Your iPhone

Once Vercel finishes deploying (check https://vercel.com for deployment status), follow these steps:

### 1. **Get Some XP First**
- Complete a few lessons to earn XP
- You need at least 50 XP to buy Extra Hearts
- You need 150 XP to buy XP Boost

### 2. **Buy Power-Ups**
```
1. Open the app on your iPhone
2. Tap "SHOP" in the bottom navigation
3. You'll see items:
   - Extra Hearts (50 XP) - Refills hearts
   - XP Boost (150 XP) - 2x XP for 1 hour
   - Streak Freeze (100 XP) - Protects streak
   - Hint Pack (75 XP) - 5 hints
   - Golden Trophy (500 XP) - Cosmetic
   - Rainbow Theme (300 XP) - Cosmetic

4. Tap "Buy Item" on Extra Hearts or XP Boost
5. You'll see "Purchased!" confirmation
```

### 3. **View Your Items**
```
1. After purchasing, tap "My Items →" in the shop header
   OR tap "INVENTORY" from any page's bottom nav
2. You'll see all your purchased items
3. Each card shows:
   - Item name and icon
   - Quantity remaining
   - "Use Item" button for power-ups
   - Active status (for time-based items)
```

### 4. **Activate XP Boost**
```
1. Go to Inventory (/inventory)
2. Find the "XP Boost" card
3. Tap "Use Item"
4. You'll see the quantity decrease from 1 to 0
5. The item will show as "Active" with expiration time
```

### 5. **Test XP Boost in Lesson**
```
1. While XP Boost is active, start any lesson
2. At the top of the lesson screen, you'll see:
   - Yellow badge that says "2x XP"
   - Zap icon (lightning bolt)
3. Answer a question correctly
4. In the feedback, you'll see:
   - "+20 XP (2x)" instead of "+10 XP"
   - The multiplier is working!
5. Complete the lesson and see doubled XP in your total
```

### 6. **Test Extra Hearts**
```
1. Start a lesson
2. Intentionally get questions wrong until hearts drop to 2 or below
3. A pink "Refill" button will appear next to your hearts
4. Tap "Refill"
5. Hearts instantly refill to 5
6. Extra Hearts quantity decreases by 1
7. Continue the lesson with full hearts!
```

## 📱 What to Look For

### Extra Hearts
- ✅ Button only appears when hearts ≤ 2
- ✅ Button only appears if you own Extra Hearts
- ✅ Clicking refills hearts to 5 immediately
- ✅ Success sound plays
- ✅ Inventory updates (quantity decreases)

### XP Boost
- ✅ Yellow "2x XP" badge shows in lesson header
- ✅ All earned XP is doubled
- ✅ Shows "(2x)" next to XP rewards
- ✅ Badge disappears after 1 hour
- ✅ Can't activate multiple XP Boosts (only one active at a time)

### Inventory Page
- ✅ Shows all purchased items
- ✅ Displays quantities correctly
- ✅ Shows "Active" status for time-based items
- ✅ Shows expiration time for active items
- ✅ "Use Item" button works
- ✅ Real-time updates after using items

### Shop Page
- ✅ "My Items →" link in header works
- ✅ Can buy items when you have enough XP
- ✅ XP balance updates after purchase
- ✅ "Purchased!" message shows
- ✅ Can buy same item multiple times (stacks quantity)

## 🐛 Known Edge Cases

1. **Using Extra Hearts when hearts are full (5)**
   - Button won't appear (only shows when hearts ≤ 2)
   - This is intentional to prevent waste

2. **Activating XP Boost when not in a lesson**
   - You can activate it from inventory anytime
   - Effect will apply to next lessons for 1 hour

3. **XP Boost expires during lesson**
   - Badge will disappear mid-lesson
   - Questions answered after expiration won't get 2x multiplier

4. **Buying same item multiple times**
   - Quantity increases (Extra Hearts: 1 → 2 → 3)
   - Each use decrements quantity

## 🧪 Test Scenarios

### Scenario 1: First-Time User Flow
```
1. Start fresh account
2. Complete 3 lessons (earn ~60 XP)
3. Go to Shop
4. Buy Extra Hearts (50 XP)
5. Go to Inventory (tap "My Items")
6. See Extra Hearts with quantity = 1
7. Start a lesson
8. Get 3 questions wrong (hearts = 2)
9. See "Refill" button appear
10. Tap Refill → Hearts = 5
11. Complete lesson successfully
```

### Scenario 2: Power User Flow
```
1. Have 500+ XP
2. Buy XP Boost (150 XP)
3. Buy Extra Hearts x3 (50 XP each = 150 XP)
4. Go to Inventory
5. Use XP Boost (activates 2x multiplier)
6. Start lesson
7. See "2x XP" badge
8. Intentionally fail to test hearts
9. Use Extra Hearts when needed
10. Complete lesson with doubled XP
```

### Scenario 3: Multiple Item Management
```
1. Buy all 6 shop items
2. Go to Inventory
3. See all items displayed
4. Use XP Boost
5. Use Streak Freeze
6. See both active with different expiration times
7. Equip Golden Trophy (cosmetic)
8. Unequip Golden Trophy
9. Use Extra Hearts in lesson
10. Verify all items work independently
```

## 📊 Expected Results

After following the test scenarios, you should see:

### In Lessons
- XP rewards doubled when boost is active
- Hearts refillable when low
- Visual feedback (badges, buttons, sounds)

### In Inventory
- Clear display of all owned items
- Quantities decrease on use
- Active status shows for time-based items
- Expiration times visible

### In Shop
- Items purchasable with XP
- Balance updates correctly
- Link to inventory works
- Can re-purchase items

## 💡 Tips

1. **Earn XP quickly**: Complete level 1 (basic counting) repeatedly
2. **Test XP Boost first**: It's the most visible effect
3. **Save Extra Hearts**: Only use when hearts are low (optimal strategy)
4. **Check expiration times**: See how long power-ups last
5. **Try cosmetics**: They're fun even if purely visual!

## 🚀 Next Features to Test (Coming Soon)

- **Streak Freeze**: Will protect your streak automatically
- **Hints**: Will appear during tough questions
- **Cosmetics**: Golden Trophy and Rainbow Theme visual effects

---

**Need help?** All power-up logic is in these files:
- `/src/app/learn/level/[levelId]/LessonClient.tsx` - Lesson integration
- `/src/components/InventoryClient.tsx` - Inventory UI
- `/src/hooks/useInventory.ts` - Inventory state management
- `/src/app/api/inventory/use/route.ts` - Item activation logic
