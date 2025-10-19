# Google OAuth Setup Guide

To enable Google Sign-In for MathQuest Academy, you need to set up OAuth credentials in the Google Cloud Console.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "MathQuest Academy" (or any name you prefer)
4. Click "Create"

## Step 2: Configure OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type (for testing with anyone)
3. Click "Create"

### Fill in the required information:
- **App name**: MathQuest Academy
- **User support email**: Your email
- **Developer contact email**: Your email
- Click "Save and Continue"

### Scopes (Step 2):
- Click "Add or Remove Scopes"
- Add these scopes:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
- Click "Update" → "Save and Continue"

### Test Users (Step 3):
- Add your email address as a test user
- Click "Save and Continue"

## Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. Choose **Web application**

### Configure the OAuth Client:
- **Name**: MathQuest Academy Web Client
- **Authorized JavaScript origins**:
  - `http://localhost:3000` (for development)
  - Add your production URL later (e.g., `https://mathquest-academy.com`)
- **Authorized redirect URIs**:
  - `http://localhost:3000/api/auth/callback/google` (for development)
  - Add your production callback later (e.g., `https://mathquest-academy.com/api/auth/callback/google`)
- Click "Create"

## Step 4: Copy Your Credentials

After creating, you'll see a dialog with:
- **Client ID**: Copy this
- **Client Secret**: Copy this

⚠️ **Keep these credentials secure!**

## Step 5: Add Credentials to Your Project

1. Open `/mathquest-academy/.env.local`
2. Replace the placeholder values:

```env
GOOGLE_CLIENT_ID="your-actual-client-id-here"
GOOGLE_CLIENT_SECRET="your-actual-client-secret-here"
```

3. Save the file

## Step 6: Generate NextAuth Secret

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and add it to `.env.local`:

```env
NEXTAUTH_SECRET="paste-the-generated-secret-here"
```

## Step 7: Set Up Database (Optional for now)

For development, you can use:
- **SQLite** (easiest, no setup required)
- **PostgreSQL** (recommended for production)

### Using SQLite (Quickest):
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = "file:./dev.db"
   }
   ```

2. Update `.env.local`:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

### Using PostgreSQL (Recommended):
Install PostgreSQL locally or use a service like:
- [Supabase](https://supabase.com/) (Free tier available)
- [Railway](https://railway.app/) (Free tier available)
- [Neon](https://neon.tech/) (Free tier available)

Then update `DATABASE_URL` in `.env.local` with your connection string.

## Step 8: Initialize Database

Run these commands in your terminal:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

## Step 9: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit `http://localhost:3000`
3. Click "Sign In"
4. Click "Sign in with Google"
5. You should be redirected to Google's sign-in page
6. After signing in, you'll be redirected back to your dashboard

## Troubleshooting

### Error: "redirect_uri_mismatch"
- Make sure `http://localhost:3000/api/auth/callback/google` is added to Authorized redirect URIs in Google Cloud Console
- Make sure there are no trailing slashes

### Error: "Access blocked: This app's request is invalid"
- Check that OAuth consent screen is configured
- Make sure your email is added as a test user (if using External user type)

### Error: "Invalid credentials"
- Double-check your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Make sure there are no extra spaces or quotes

### Database connection errors:
- Make sure your `DATABASE_URL` is correct in `.env.local`
- If using PostgreSQL, ensure the database server is running
- Run `npx prisma db push` to create the tables

## For Production Deployment

When ready to deploy:

1. **Update OAuth Consent Screen**: 
   - Publish your app (may require verification for some scopes)

2. **Add Production URLs**:
   - Add your production domain to Authorized JavaScript origins
   - Add your production callback URL to Authorized redirect URIs

3. **Update Environment Variables**:
   - Set `NEXTAUTH_URL` to your production URL
   - Use a secure database (not SQLite)
   - Regenerate `NEXTAUTH_SECRET` for production

4. **Test Thoroughly**:
   - Test sign-in flow in production
   - Verify redirects work correctly

---

**Need help?** Check the [NextAuth.js documentation](https://next-auth.js.org/) or [Google OAuth documentation](https://developers.google.com/identity/protocols/oauth2).
