# Power-Ups Implementation

## ✅ Completed Features

### 1. **Extra Hearts** 
- **Effect**: Refills hearts to 5 during lessons
- **Implementation**: 
  - Shows "Refill" button in lesson header when hearts ≤ 2
  - Button only appears if user has Extra Hearts in inventory
  - Clicking consumes 1 Extra Hearts item and refills hearts to 5
  - Plays success sound on use
- **Item ID**: `extra-hearts`
- **Price**: 50 XP

### 2. **XP Boost**
- **Effect**: Doubles all XP earned during lessons
- **Implementation**:
  - Active boost shown in lesson header with "2x XP" badge
  - Multiplies earned XP by 2 for every correct answer
  - Shows multiplier in XP reward display
  - Automatically applies to all questions while active
  - Expires after 1 hour
- **Item ID**: `xp-boost`
- **Price**: 150 XP
- **Duration**: 1 hour from activation

### 3. **Streak Freeze**
- **Effect**: Protects streak for 24 hours if you miss a day
- **Implementation**: 
  - User can activate from inventory
  - Sets `isActive: true` and `expiresAt: now + 24h`
  - Decrements quantity on use
  - Backend ready (needs integration into streak calculation logic)
- **Item ID**: `streak-freeze`
- **Price**: 100 XP
- **Duration**: 24 hours from activation

### 4. **Hint Pack**
- **Effect**: Provides 5 hints for tough questions
- **Implementation**:
  - Quantity-based item (no activation needed)
  - Decrements quantity when hint is used
  - Backend ready (needs integration into question hint system)
- **Item ID**: `hint-pack`
- **Price**: 75 XP
- **Quantity**: 5 hints per pack

### 5. **Cosmetics** (Golden Trophy, Rainbow Theme)
- **Effect**: Visual customization
- **Implementation**:
  - Toggle-based (equip/unequip)
  - Sets `isActive: true/false` on toggle
  - Backend ready (needs UI integration)
- **Item IDs**: `golden-trophy`, `rainbow-theme`
- **Prices**: 500 XP, 300 XP

## Files Modified

### Core Files
1. **`/src/hooks/useInventory.ts`**
   - Added `hasActiveItem()` function to check if power-ups are active
   - Returns inventory state with active status and expiration times

2. **`/src/app/learn/level/[levelId]/LessonClient.tsx`**
   - Integrated inventory system
   - Added Extra Hearts refill button
   - Added XP Boost multiplier (2x XP)
   - Shows active power-ups in header

3. **`/src/app/inventory/page.tsx`** (NEW)
   - Full inventory display page
   - Shows all purchased items
   - Use/Equip buttons for each item
   - Displays quantities and expiration times

4. **`/src/components/InventoryClient.tsx`** (NEW)
   - Interactive inventory grid
   - Item cards with icons and descriptions
   - Use/Equip/Unequip buttons
   - Real-time updates after using items

5. **`/src/app/api/inventory/route.ts`** (NEW)
   - GET endpoint to fetch user's inventory
   - Returns items with quantities, active status, expiration times

6. **`/src/app/api/inventory/use/route.ts`** (NEW)
   - POST endpoint to use/activate items
   - Handles different item types:
     - Hearts: Marks for refill
     - Streak Freeze: Activates for 24h
     - XP Boost: Activates for 1h with 2x multiplier
     - Hints: Decrements quantity
     - Cosmetics: Toggles equipped status

## How Power-Ups Work

### Purchase Flow
1. User buys item from `/shop` page
2. XP is deducted from user balance
3. Item added to `UserInventory` table
4. Shop shows "Purchased!" message

### Activation Flow

#### Instant Use (Extra Hearts)
1. Hearts drop to ≤ 2 during lesson
2. "Refill" button appears next to hearts display
3. Click button → API call to `/api/inventory/use`
4. Hearts refilled to 5
5. Item quantity decremented
6. Success sound plays

#### Time-Based (XP Boost, Streak Freeze)
1. User clicks "Use Item" in inventory
2. API call to `/api/inventory/use`
3. Sets `isActive: true` and `expiresAt: now + duration`
4. Item quantity decremented
5. Effect applies automatically:
   - **XP Boost**: All earned XP × 2
   - **Streak Freeze**: Streak protected for 24h

#### Quantity-Based (Hints)
1. User has hints in inventory
2. Hints available during tough questions
3. Using hint decrements quantity
4. (Integration needed in question UI)

#### Toggle-Based (Cosmetics)
1. User clicks "Equip" in inventory
2. Sets `isActive: true` for that item
3. Visual changes apply
4. Can unequip anytime (sets `isActive: false`)

## Database Schema

### UserInventory Model
```prisma
model UserInventory {
  id        String    @id @default(cuid())
  userId    String
  itemId    String
  quantity  Int       @default(1)
  isActive  Boolean   @default(false)
  expiresAt DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  shopItem  ShopItem  @relation(fields: [itemId], references: [id])
  
  @@unique([userId, itemId])
}
```

### Fields Explained
- **`quantity`**: How many of this item the user has
- **`isActive`**: Whether the power-up is currently active
- **`expiresAt`**: When the power-up effect expires (null = no expiration)

## Testing Checklist

### ✅ Extra Hearts
- [x] Button appears when hearts ≤ 2
- [x] Button only shows if user has item
- [x] Hearts refill to 5 on use
- [x] Quantity decrements
- [x] Success sound plays

### ✅ XP Boost
- [x] 2x badge shows in header when active
- [x] Earned XP is doubled
- [x] Multiplier shown in reward display
- [x] Expires after 1 hour

### ⏳ Streak Freeze
- [ ] Activates from inventory
- [ ] Protects streak when missing a day
- [ ] Expires after 24 hours
- [ ] (Needs integration with streak system)

### ⏳ Hints
- [ ] Shows hint button during questions
- [ ] Decrements quantity on use
- [ ] Only available if user has hints
- [ ] (Needs UI integration)

### ⏳ Cosmetics
- [ ] Equip toggles active status
- [ ] Visual changes apply
- [ ] Can unequip anytime
- [ ] (Needs theme system integration)

## Next Steps

1. **Streak Freeze Integration**
   - Add logic to `/lib/streak.ts` to check for active streak freeze
   - Skip streak loss if protected

2. **Hints System**
   - Add hint button to question UI
   - Show AI Tutor or reveal answer options
   - Decrement hint quantity on use

3. **Cosmetics Application**
   - Create theme system
   - Apply rainbow theme colors
   - Show golden trophy on profile

4. **Mobile Testing**
   - Test on physical iPhone
   - Verify all buttons work on mobile
   - Check responsive design

## User Experience

### Shop → Purchase → Use Flow
```
1. Visit /shop
2. See all items with prices
3. Click "Buy Item" (XP deducted)
4. See "Purchased!" confirmation
5. Click "My Items →" to view inventory
6. See item in /inventory
7. Click "Use Item" to activate
8. Return to /learn to see effects
```

### In-Lesson Experience
```
1. Start lesson (/learn/level/1)
2. XP Boost active? → See "2x XP" badge
3. Get question correct → Earn 20 XP (10 base × 2)
4. Hearts drop to 2 → See "Refill" button
5. Click Refill → Hearts back to 5
6. Complete lesson → Total XP earned with multiplier
```

## API Endpoints

- **GET `/api/inventory`** - Fetch user's items
- **POST `/api/inventory/use`** - Use/activate item
- **POST `/api/shop/purchase`** - Purchase item from shop

## Known Issues
- None currently! 🎉

## Future Enhancements
- Add power-up animations
- Show expiration countdown timers
- Add notification when power-up expires
- Bundle deals (buy 3 get 1 free)
- Limited-time seasonal items
