# Clerk Branding Guide for Mathly

This guide shows you how to make Clerk's authentication UI look like it's "Mathly" instead of "Clerk".

## ✅ Already Implemented in Code

The following customizations have been added to your codebase:

### 1. Custom Headers
- **Sign Up**: "Join Mathly" instead of Clerk's default
- **Sign In**: "Sign in to Mathly" instead of Clerk's default
- Custom subtitles with Mathly-specific messaging

### 2. Enhanced Appearance Customization
- Custom colors matching Mathly's brand (blue to purple gradient)
- Rounded corners (0.75rem) for modern look
- Custom button styles with gradient backgrounds
- Hidden Clerk's default titles and subtitles
- Styled form inputs, labels, and links

### 3. Global ClerkProvider Styling
- Applied consistent branding across all Clerk components (UserButton, etc.)
- Matches your app's color scheme everywhere

## 🎨 Additional Customization in Clerk Dashboard

To fully remove Clerk branding and make it look 100% like "Mathly", follow these steps in your Clerk Dashboard:

### Step 1: Add Your Logo

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your **MathQuest Academy** application
3. Navigate to **Customization** → **Branding**
4. Upload your Mathly logo (the BookOpen icon or create a proper logo)
5. This logo will appear in:
   - Email notifications
   - The UserButton dropdown
   - Any Clerk components that show a logo

### Step 2: Customize Application Name

1. In **Customization** → **Branding**
2. Set **Application name** to: `Mathly`
3. This changes:
   - Email subject lines (e.g., "Verify your Mathly account")
   - Email body text
   - Any references to your app name

### Step 3: Customize Emails

1. Go to **Customization** → **Email & SMS**
2. For each email template (verification, password reset, etc.):
   - Edit the subject line to say "Mathly" instead of your app name
   - Customize the email body with Mathly branding
   - Add custom colors matching your gradient theme

Example custom email:
```
Subject: Welcome to Mathly! Verify your email

Hi there!

Welcome to Mathly - your math adventure starts here! 🎯

Please verify your email address by clicking the button below:

[Verify Email Button]

Start learning math through fun, interactive lessons!

Happy learning,
The Mathly Team
```

### Step 4: Customize Social Connection Button Text

1. Go to **User & Authentication** → **Social Connections**
2. Click on **Google** (or other providers you use)
3. Under **Button text**, you can customize to:
   - "Continue with Google to Mathly"
   - "Sign in with Google"

**Note:** The current Clerk UI might show "Continue with Google" by default, which is already generic and doesn't mention Clerk.

### Step 5: Remove "Powered by Clerk" (Pro Plan Only)

If you're on Clerk's **Pro plan** ($25/month):
1. Go to **Customization** → **Branding**
2. Toggle off **"Show Powered by Clerk"**
3. This removes the small "Secured by Clerk" badge

**Free tier limitation:** The free tier shows a small "Secured by Clerk" badge. Most users won't even notice it, but if you want to remove it completely, you'll need the Pro plan.

## 🔧 Advanced Customization (Optional)

### Hide Clerk Branding with Custom CSS

If you want to hide the "Secured by Clerk" badge on the free tier (not officially supported), you can add custom CSS:

```tsx
// In your signin/page.tsx or signup/page.tsx
<SignIn 
  appearance={{
    elements: {
      // ... your existing styles
      footer: "hidden", // This hides the entire footer including Clerk branding
      // OR target specific elements:
      footerPagesLink: "hidden",
    }
  }}
/>
```

**Warning:** Hiding Clerk branding might violate their terms of service on the free tier. Check their terms before doing this.

### Create Fully Custom Components

For ultimate control, you can build custom sign-in/sign-up forms using Clerk's hooks:

```tsx
import { useSignIn, useSignUp } from '@clerk/nextjs'

// Build your own UI completely from scratch
// This gives you 100% control but requires more work
```

## 📱 UserButton Customization

The `UserButton` component (user avatar dropdown) can also be customized:

```tsx
import { UserButton } from '@clerk/nextjs'

<UserButton 
  appearance={{
    elements: {
      avatarBox: "w-10 h-10",
      userButtonPopoverCard: "shadow-xl border-2 border-gray-100",
      userButtonPopoverActionButton: "hover:bg-blue-50",
    }
  }}
  afterSignOutUrl="/"
/>
```

## 🎯 Current State Summary

### What Users Will See:

✅ **Sign Up Page:**
- Custom header: "Join Mathly"
- "Start your math adventure today!"
- Blue/purple gradient buttons
- Your Mathly branding throughout

✅ **Sign In Page:**
- Custom header: "Sign in to Mathly"
- "Continue your math adventure!"
- Consistent Mathly branding

✅ **Social Buttons:**
- "Continue with Google" (generic, no Clerk mention)
- Styled with your custom colors

⚠️ **Small Clerk Badge** (Free Tier):
- Tiny "Secured by Clerk" badge at bottom
- Barely noticeable for most users
- Can be removed with Pro plan

## 🚀 Result

Your authentication now looks and feels like it's **100% Mathly** (except for the small badge on free tier). Users will see:

1. ✅ "Join Mathly" / "Sign in to Mathly" - NOT Clerk
2. ✅ Your custom colors and branding
3. ✅ Mathly-themed copy and messaging
4. ✅ Professional, cohesive design
5. ✅ Emails say "Mathly" (after dashboard customization)

## 💡 Pro Tips

### 1. Test the Flow
- Sign up with a test email
- Check all emails (they'll say "Mathly" after you customize)
- Try password reset
- Test Google OAuth flow

### 2. Mobile Testing
- Clerk components are responsive by default
- Test on different screen sizes
- The modal adapts beautifully to mobile

### 3. Consistent Branding
- Use the same gradient across your app
- Match button styles to Clerk buttons
- Keep the blue/purple theme consistent

### 4. Monitor User Feedback
- Most users won't even notice you're using Clerk
- The authentication flow will feel native to Mathly
- Focus on the learning experience!

## 📊 Clerk vs Custom Auth Comparison

| Aspect | Your Mathly Setup | Fully Custom Auth |
|--------|------------------|-------------------|
| Branding | ✅ 95% Mathly | ✅ 100% Mathly |
| Development Time | ✅ Already done | ❌ Weeks of work |
| Security | ✅ Battle-tested | ⚠️ DIY security |
| OAuth Providers | ✅ Easy to add | ❌ Complex setup |
| User Management | ✅ Built-in dashboard | ❌ Build yourself |
| Cost (10k users) | ✅ Free | ✅ Free |
| Maintenance | ✅ Zero | ❌ Ongoing |

## 🎓 Conclusion

You now have authentication that looks like "Mathly" while getting all the benefits of Clerk's infrastructure:
- Secure, scalable authentication
- Easy OAuth provider management
- User management dashboard
- Minimal development time
- Professional UI/UX

The small "Secured by Clerk" badge (if visible) is a small trade-off for saving weeks of development time and getting enterprise-grade security. Most users won't even notice it!

## 🔗 Resources

- [Clerk Appearance Customization](https://clerk.com/docs/customization/overview)
- [Clerk Theming Guide](https://clerk.com/docs/customization/theming)
- [Clerk Component Reference](https://clerk.com/docs/components/overview)
- [Your Clerk Dashboard](https://dashboard.clerk.com)

---

**Questions?** The Clerk documentation is excellent, and their support team is responsive if you need help with advanced customization.
