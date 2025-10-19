# Clerk Authentication Setup Guide

This guide will walk you through setting up Clerk authentication for MathQuest Academy with Google Sign-In.

## Why Clerk?

- ✅ **5-minute setup** - Much simpler than Google Cloud Console
- ✅ **Beautiful pre-built UI** - Sign-in components included
- ✅ **Free tier**: 10,000 monthly active users
- ✅ **Multiple providers**: Google, GitHub, Email, Phone, and more
- ✅ **User management dashboard** - No need to build admin panel

## Step 1: Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com)
2. Click "Start Building for Free"
3. Sign up with your email or GitHub account

## Step 2: Create a New Application

1. After signing up, you'll be prompted to create an application
2. Enter your application name: **MathQuest Academy**
3. Select how you want users to sign in:
   - ✅ **Google** (enable this)
   - ✅ **Email** (recommended as backup)
   - You can add more later
4. Click "Create Application"

## Step 3: Get Your API Keys

1. You'll be taken to the Quickstart page
2. Copy your **Publishable Key** and **Secret Key**
3. You'll see something like:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```

## Step 4: Update Environment Variables

1. Open your `.env.local` file in the project root
2. **Replace all existing auth variables** with these Clerk keys:

```env
# Clerk Keys (replace with your actual keys from dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key-here
CLERK_SECRET_KEY=sk_test_your-secret-here

# Database (keep this as is)
DATABASE_URL="postgresql://username:password@localhost:5432/mathquest?schema=public"
```

## Step 5: Set Up Database

You have two options:

### Option A: SQLite (Quick Start - Recommended for Development)

1. Update `prisma/schema.prisma` - change the datasource:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. Push the schema to the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Option B: PostgreSQL (Production-Ready)

1. Set up a PostgreSQL database:
   - **Cloud (Recommended)**: Use [Supabase](https://supabase.com/) (free tier)
   - **Local**: Install PostgreSQL on your machine

2. Get your database connection string

3. Update `.env.local`:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   ```

4. Push the schema to the database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

## Step 6: Configure Google OAuth (In Clerk Dashboard)

1. In your Clerk Dashboard, go to "User & Authentication" > "Social Connections"
2. Find **Google** and click "Configure"
3. Toggle it to **Enabled**
4. Click "Save"

That's it! Clerk handles all the Google OAuth complexity for you - no Google Cloud Console needed! 🎉

## Step 7: Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` and test the authentication!

## Testing the Authentication

1. Navigate to `http://localhost:3000`
2. Click "Get Started" or "Sign In"
3. You'll see Clerk's beautiful sign-in modal
4. Click "Continue with Google"
5. Sign in with your Google account
6. You'll be automatically redirected back to the dashboard

## Clerk Dashboard Features

Access your dashboard at [https://dashboard.clerk.com](https://dashboard.clerk.com):

- **Users**: View all registered users
- **Sessions**: Monitor active sessions
- **Social Connections**: Add more providers (GitHub, Facebook, etc.)
- **Customization**: Customize sign-in modal appearance
- **Webhooks**: Get notified of user events
- **Analytics**: Track sign-ups and activity

## Troubleshooting

### "Invalid Publishable Key"
- Verify you copied the full key from Clerk Dashboard
- Make sure it starts with `pk_test_` (for test environment)
- Restart the development server after updating `.env.local`

### Google Sign-In Not Showing
- Check that Google is enabled in Clerk Dashboard > Social Connections
- Verify your Clerk keys are correct in `.env.local`

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Make sure you ran `npx prisma db push`
- Run `npx prisma studio` to verify the database is accessible

### Users Not Saving to Database
- This is normal with Clerk - users are managed by Clerk
- You'll sync users to your database when they start learning (create progress records)
- You can use Clerk webhooks to automatically sync users if needed

## Production Deployment

When deploying to production (e.g., Vercel):

1. In Clerk Dashboard, add your production domain:
   - Go to "Domains"
   - Add your production URL (e.g., `mathquest.academy`)

2. Update your hosting platform's environment variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-production-key
   CLERK_SECRET_KEY=sk_live_your-production-secret
   DATABASE_URL=your-production-database-url
   ```

3. Clerk will automatically handle HTTPS and production domains

## Customizing Clerk (Optional)

### Change Sign-In Appearance
1. Go to Clerk Dashboard > "Customization"
2. Choose theme (light/dark)
3. Upload your logo
4. Customize colors to match your brand

### Add More Sign-In Methods
1. Go to "Social Connections"
2. Enable GitHub, Discord, Microsoft, etc.
3. Configure and save

### Add Email Verification
1. Go to "Email, Phone, Username"
2. Enable "Email address"
3. Toggle "Require" for verification

## Pricing

- **Free Tier**: 10,000 monthly active users (MAU)
- **Pro Tier**: $25/month + $0.02 per MAU over 10k
- For your launch, the free tier should be more than enough!

## Next Steps

Once authentication is working:
- Start building the learning features
- Create user progress tracking (XP, levels, streaks)
- Build the question/answer system
- Add achievements and gamification

## Clerk vs Manual Setup Comparison

| Feature | Clerk | NextAuth + Google Cloud |
|---------|-------|-------------------------|
| Setup Time | 5 minutes | 30+ minutes |
| Google OAuth Setup | ✅ Built-in | ❌ Manual in Google Cloud Console |
| User Management UI | ✅ Included | ❌ Build yourself |
| Profile Pictures | ✅ Automatic | ⚠️ Manual handling |
| Session Management | ✅ Automatic | ⚠️ Manual configuration |
| Cost | Free up to 10k users | Free unlimited |

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Next.js Quickstart](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk Dashboard](https://dashboard.clerk.com)
