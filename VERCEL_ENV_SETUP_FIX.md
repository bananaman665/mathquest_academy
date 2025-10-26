# Vercel Environment Variables Setup

## Issue
The deployment is failing with `MIDDLEWARE_INVOCATION_FAILED` because the Clerk environment variables are not set on Vercel.

## Solution
You need to add environment variables to your Vercel project:

### Steps to Fix:

1. **Go to your Vercel Dashboard:**
   - Visit: https://vercel.com/andys-projects-2a9ee56b/mathquest-academy
   - Click on **Settings** tab

2. **Add Environment Variables:**
   - Click on **Environment Variables**
   - Add the following variables (copy from your `.env.local` file):

   **Production, Preview, and Development:**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YWN0dWFsLW1vb3NlLTM1LmNsZXJrLmFjY291bnRzLmRldiQ
   CLERK_SECRET_KEY=sk_test_xzbapKjS1GZwTguOW2Ugkyf1DFYrTZNuktf6CW3Lum
   ```

   **For Database (Production only):**
   ```
   DATABASE_URL=postgres://675f5c0b239b5d015f0cd660f8619c148413ed4f2656524669ab9bb1236b21fb:sk_AhQVNVeUKfaEBpBjXTDrd@db.prisma.io:5432/postgres?sslmode=require
   ```

3. **Redeploy:**
   - After adding the environment variables, click **Redeploy** on the Vercel dashboard
   - Or run locally: `vercel --prod` to redeploy

## Note
Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is marked as available in all environments (Production, Preview, Development).
