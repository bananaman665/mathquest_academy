# Vercel Environment Variables Setup

## ⚠️ CRITICAL: Vercel Deployment Failing Due to Missing Environment Variables

Your app is failing to deploy because Vercel doesn't have access to your `.env.local` file (which is gitignored for security).

## Steps to Fix:

### 1. Go to Vercel Dashboard
Visit: https://vercel.com/bananaman665/mathquest-academy/settings/environment-variables

### 2. Add These Environment Variables:

#### Clerk Authentication (REQUIRED)
```
Name: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
Value: pk_test_YWN0dWFsLW1vb3NlLTM1LmNsZXJrLmFjY291bnRzLmRldiQ
Environment: Production, Preview, Development
```

```
Name: CLERK_SECRET_KEY
Value: sk_test_xzbapKjS1GZwTguOW2Ugkyf1DFYrTZNuktf6CW3Lum
Environment: Production, Preview, Development
```

#### Database (REQUIRED)
```
Name: mathquest_PRISMA_DATABASE_URL
Value: prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19BaFFWTlZlVUtmYUVCcEJqWFREcmQiLCJhcGlfa2V5IjoiMDFLN1laMkU2RDIzVjZFQ1NURlIyR0pDNUsiLCJ0ZW5hbnRfaWQiOiI2NzVmNWMwYjIzOWI1ZDAxNWYwY2Q2NjBmODYxOWMxNDg0MTNlZDRmMjY1NjUyNDY2OWFiOWJiMTIzNmIyMWZiIiwiaW50ZXJuYWxfc2VjcmV0IjoiY2Y3NDUyODctY2Q0Mi00ZWUwLWExYzEtMmZlODUzZDMxMGNmIn0.lr_wK7AQN8n4YNCTDPaeWiFdimGUvXkrfUkLvVFZKa0
Environment: Production, Preview, Development
```

```
Name: mathquest_DATABASE_URL
Value: postgres://675f5c0b239b5d015f0cd660f8619c148413ed4f2656524669ab9bb1236b21fb:sk_AhQVNVeUKfaEBpBjXTDrd@db.prisma.io:5432/postgres?sslmode=require
Environment: Production, Preview, Development
```

### 3. Redeploy
After adding all environment variables:
1. Click "Save" for each variable
2. Go to Deployments tab: https://vercel.com/bananaman665/mathquest-academy/deployments
3. Click the three dots (...) on the latest deployment
4. Click "Redeploy"
5. Select "Use existing Build Cache" and click "Redeploy"

### 4. Verify Deployment
- Wait 1-2 minutes for deployment to complete
- Check that status shows "Ready" ✅
- Visit your app: https://mathquest-academy-bhfd.vercel.app

## Common Issues:

### Issue: "Missing publishableKey"
**Solution:** Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is added to Vercel (note the `NEXT_PUBLIC_` prefix)

### Issue: "Database connection error"
**Solution:** Make sure both database URLs are added correctly (copy-paste to avoid typos)

### Issue: "Environment variable not found"
**Solution:** After adding variables, you MUST redeploy for them to take effect

## Alternative: Use Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Add environment variables from .env.local
vercel env pull

# Or add them one by one
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
vercel env add mathquest_PRISMA_DATABASE_URL
vercel env add mathquest_DATABASE_URL
```

## Security Note:
✅ Never commit `.env.local` to GitHub
✅ These keys are already in Vercel's secure environment variable storage
✅ Only `NEXT_PUBLIC_*` variables are exposed to the browser
