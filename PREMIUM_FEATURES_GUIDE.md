# Premium Features - Next Steps

## ✅ What's Done

1. **Database Schema** ✓
   - `hasPremium` field added to User model
   - `aiTutorAccess` field added to User model
   - Schema synced to production

2. **AI Tutor Component** ✓
   - Beautiful chat interface
   - Premium gate with upgrade prompt
   - Smart question suggestions
   - Mobile responsive design
   - Integrated into lesson pages

3. **API Endpoints** ✓
   - `/api/ai-tutor` - Handles AI explanations
   - `/api/user` - Returns user profile with premium status
   - Premium status checking

4. **Upgrade Page** ✓
   - Professional pricing page at `/upgrade`
   - Monthly vs Annual toggle
   - Feature list
   - Testimonials
   - FAQ section
   - Trust badges

## 🚀 What's Next

### Phase 1: Make It Work (Test Everything)

#### 1.1 Test AI Tutor Flow
```bash
# Test in browser at http://localhost:3000
1. Go to any lesson (e.g., /learn/level/1)
2. Click "AI Tutor" button (purple with sparkle icon)
3. Verify premium gate shows (since you're not premium yet)
4. Click "Start Free 7-Day Trial"
5. Should redirect to /upgrade page
```

#### 1.2 Manually Set Premium Status (for testing)
You can test the full AI Tutor experience by temporarily setting your account to premium:

**Option A: Using Database Admin**
```sql
-- In Vercel Postgres dashboard:
UPDATE "User" SET "hasPremium" = true WHERE id = 'your-clerk-user-id';
```

**Option B: Using Prisma Studio**
```bash
cd mathquest-academy
npx prisma studio
# Opens browser at localhost:5555
# Click "User" table
# Find your user
# Toggle "hasPremium" to true
# Click "Save 1 change"
```

#### 1.3 Test Premium AI Tutor
After setting premium status:
1. Refresh the lesson page
2. Click "AI Tutor" button
3. Should see chat interface (not upgrade prompt)
4. Try the suggestion buttons:
   - "Why is this the answer?"
   - "Explain step by step"
   - "Give me a similar example"
5. Type your own questions
6. Verify AI responds with relevant explanations

### Phase 2: Create Bonus Levels (Content Creation)

#### 2.1 Create Levels 51-100 Data Structure
Add to `/src/data/questions.ts` or create new file `/src/data/bonus-questions.ts`:

```typescript
export const bonusLevels = [
  {
    id: 51,
    title: "Advanced Multiplication",
    isPremium: true, // Mark as premium!
    introduction: { /* ... */ },
    questions: [
      // 10 challenging multiplication questions
    ]
  },
  {
    id: 52,
    title: "Fractions Introduction",
    isPremium: true,
    introduction: { /* ... */ },
    questions: [
      // 10 fraction questions
    ]
  },
  // ... levels 53-100
]
```

#### 2.2 Update Learn Page to Show Locked Levels
Modify `/src/app/learn/page.tsx`:
- Display levels 51-100 with lock icons 🔒
- Show "Premium" badge on locked levels
- On click, show upgrade prompt instead of starting lesson
- For premium users, unlock and allow access

#### 2.3 Bonus Level Ideas (51-100)
- **Advanced Operations**: Multi-digit multiplication, long division
- **Fractions**: Adding, subtracting, simplifying fractions
- **Decimals**: Decimal operations, place value
- **Word Problems**: Real-world math scenarios
- **Patterns & Sequences**: Advanced number patterns
- **Geometry Basics**: Shapes, perimeter, area
- **Money Math**: Making change, budgeting
- **Time**: Clock reading, elapsed time
- **Measurement**: Units, conversions
- **Pre-Algebra**: Simple equations, variables

### Phase 3: Payment Integration (Stripe)

#### 3.1 Set Up Stripe Account
1. Go to https://stripe.com
2. Create account (use your real email)
3. Get API keys:
   - Test Mode: `pk_test_...` and `sk_test_...`
   - Live Mode: `pk_live_...` and `sk_live_...`

#### 3.2 Install Stripe SDK
```bash
cd mathquest-academy
npm install stripe @stripe/stripe-js
```

#### 3.3 Add Stripe Keys to Environment
Add to `.env.local`:
```bash
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

#### 3.4 Create Stripe Products & Prices
In Stripe Dashboard:
1. Products → Create Product
   - Name: "MathQuest Academy Premium"
   - Description: "AI Tutor + Bonus Levels"
2. Add Prices:
   - Monthly: $4.99/month recurring
   - Annual: $49.99/year recurring
3. Copy Price IDs (e.g., `price_1abc123...`)

#### 3.5 Create Checkout API Route
Create `/src/app/api/stripe/create-checkout/route.ts`:
```typescript
import Stripe from 'stripe'
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const { priceId, isAnnual } = await request.json()
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_URL}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/upgrade`,
    metadata: { userId, isAnnual: String(isAnnual) }
  })
  
  return NextResponse.json({ sessionId: session.id })
}
```

#### 3.6 Create Webhook Handler
Create `/src/app/api/stripe/webhook/route.ts`:
```typescript
import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()
  
  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId
    
    // Grant premium access
    await prisma.user.update({
      where: { id: userId },
      data: { hasPremium: true, aiTutorAccess: true }
    })
  }
  
  if (event.type === 'customer.subscription.deleted') {
    // Revoke premium when subscription ends
    const subscription = event.data.object as Stripe.Subscription
    const userId = subscription.metadata?.userId
    
    await prisma.user.update({
      where: { id: userId },
      data: { hasPremium: false }
    })
  }
  
  return new Response('OK', { status: 200 })
}
```

#### 3.7 Update Upgrade Page with Stripe
Modify `/src/app/upgrade/page.tsx`:
```typescript
const handleUpgrade = async () => {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      priceId: isAnnual ? 'price_annual_id' : 'price_monthly_id',
      isAnnual 
    })
  })
  
  const { sessionId } = await response.json()
  const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  await stripe!.redirectToCheckout({ sessionId })
}
```

#### 3.8 Test Stripe Flow
1. Click "Start Free 7-Day Trial" on upgrade page
2. Should redirect to Stripe checkout
3. Use test card: `4242 4242 4242 4242`
4. Complete checkout
5. Should redirect to success page
6. Verify `hasPremium` is now `true` in database
7. Test AI Tutor and bonus levels unlock

### Phase 4: Polish & Deploy

#### 4.1 Add Premium Badge to Profile
Show "Premium" badge on user profile page

#### 4.2 Add "Manage Subscription" Page
Let users cancel/update their subscription

#### 4.3 Analytics
Track:
- AI Tutor usage (questions asked per day)
- Conversion rate (free → premium)
- Most common AI Tutor questions
- Bonus level completion rates

#### 4.4 Deploy to Vercel
```bash
git add .
git commit -m "Add premium features: AI Tutor + bonus levels"
git push origin main
# Vercel auto-deploys
```

#### 4.5 Configure Stripe Webhook in Production
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://mathquest-academy-bhfd.vercel.app/api/stripe/webhook`
3. Select events: `checkout.session.completed`, `customer.subscription.deleted`
4. Copy webhook secret to Vercel environment variables

## 📊 Success Metrics

### Track These Numbers:
1. **Conversion Rate**: % of users who see AI Tutor gate and upgrade
2. **MRR** (Monthly Recurring Revenue): Total premium subscriptions × $4.99
3. **Churn Rate**: % of users who cancel each month
4. **AI Tutor Engagement**: Average questions asked per premium user
5. **Bonus Level Completion**: % of premium users completing bonus levels

### Goals:
- **Month 1**: 10 paying users ($49.90 MRR)
- **Month 3**: 100 paying users ($499 MRR)
- **Month 6**: 500 paying users ($2,495 MRR)
- **Year 1**: 2,000 paying users ($9,980 MRR)

## 💡 Marketing Ideas

1. **Free Trial**: 7 days free to try premium (require card)
2. **Referral Program**: Get 1 month free for each friend who signs up
3. **Student Discount**: 20% off for students with .edu email
4. **Family Plan**: $9.99/month for up to 4 kids
5. **Lifetime Access**: $199 one-time payment (limited spots)

## 🎯 Current Status

**You Are Here**: ✅ AI Tutor built, ⏳ Need to test and add Stripe

**Next Immediate Step**: 
1. Test the AI Tutor by manually setting `hasPremium = true` in database
2. Once verified it works, proceed with Stripe integration
3. Then create bonus levels content

---

**Questions?** Review this file anytime you're ready for the next step!
