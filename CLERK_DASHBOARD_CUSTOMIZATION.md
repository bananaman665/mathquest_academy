# Quick Clerk Dashboard Customization Checklist

Follow these steps in your [Clerk Dashboard](https://dashboard.clerk.com) to complete the Mathly branding:

## 🎯 5-Minute Setup Checklist

### 1. Application Name
- [ ] Go to: **Settings** → **General**
- [ ] Change **Application name** from "MathQuest Academy" to **"Mathly"**
- [ ] Save changes

**Effect:** All emails will say "Mathly" instead of your app name

---

### 2. Upload Logo (Optional)
- [ ] Go to: **Customization** → **Branding**
- [ ] Upload your Mathly logo image
- [ ] Recommended size: 512x512px PNG with transparent background

**Effect:** Logo appears in emails and user dropdown

---

### 3. Customize Email Templates
- [ ] Go to: **Customization** → **Email & SMS**

#### Verification Email
- [ ] **Subject:** "Verify your Mathly account ✨"
- [ ] **Body:** Customize to mention "Mathly" and math learning

#### Password Reset Email
- [ ] **Subject:** "Reset your Mathly password"
- [ ] **Body:** Add friendly Mathly messaging

#### Welcome Email (if enabled)
- [ ] **Subject:** "Welcome to Mathly! 🎉"
- [ ] **Body:** Mention starting their math adventure

**Effect:** All user emails feel like they're from Mathly

---

### 4. Customize Sign-In/Sign-Up Text (Optional)
- [ ] Go to: **Customization** → **Sign-in & Sign-up**
- [ ] Customize any additional text you want to change

---

### 5. Theme Customization (Already done in code, but can be enhanced)
- [ ] Go to: **Customization** → **Theme**
- [ ] Choose **Light** mode (or customize)
- [ ] Set primary color to: `#2563eb` (blue)
- [ ] Preview how it looks

---

## 📧 Example Email Customizations

### Verification Email Template

```
Subject: Verify your Mathly account ✨

Hi {{user.first_name}},

Welcome to Mathly! We're excited to have you join our community of math learners.

To get started, please verify your email address:

{{verification_link}}

Once verified, you'll be able to:
✓ Track your progress and earn XP
✓ Unlock achievements and badges
✓ Maintain your learning streak

Let's start your math adventure!

The Mathly Team
```

### Password Reset Template

```
Subject: Reset your Mathly password

Hi {{user.first_name}},

We received a request to reset your Mathly account password.

Click the button below to create a new password:

{{reset_link}}

If you didn't request this, you can safely ignore this email.

Happy learning!
The Mathly Team
```

---

## 🎨 Branding Colors

Use these in the Clerk dashboard theme settings:

- **Primary Color:** `#2563eb` (Blue)
- **Accent Color:** `#9333ea` (Purple)
- **Background:** `#ffffff` (White)
- **Text:** `#1f2937` (Gray-900)

---

## ✅ What's Already Done in Code

You don't need to configure these in the dashboard - they're already customized in your code:

- ✅ Custom "Join Mathly" and "Sign in to Mathly" headers
- ✅ Hidden Clerk's default titles
- ✅ Custom button gradients (blue to purple)
- ✅ Custom input field styling
- ✅ Rounded corners and modern design
- ✅ Social button styling
- ✅ Footer link colors

---

## 🔐 Remove "Secured by Clerk" Badge

**Free Tier:** Small badge visible (acceptable for most users)

**Pro Tier ($25/month):**
- [ ] Go to: **Customization** → **Branding**
- [ ] Toggle off: **"Show Powered by Clerk"**
- [ ] Badge completely removed

**Recommendation:** Stay on free tier unless you need this. Most users don't notice the small badge.

---

## 🚀 After Setup

Once you complete these steps:

1. Test sign-up flow with a test email
2. Check your inbox - email should say "Mathly"
3. Test sign-in flow
4. Test password reset (if needed)
5. Verify everything looks and feels like "Mathly"

---

## 🎯 Expected Results

### Before Customization:
- Emails say "MathQuest Academy" or generic text
- Generic application name everywhere
- Default Clerk styling

### After Customization:
- Emails say "Mathly" ✅
- Application name is "Mathly" everywhere ✅
- Custom Mathly branding and colors ✅
- Professional, cohesive experience ✅

---

## 💡 Pro Tips

1. **Test with real email:** Sign up with your personal email to see how it looks
2. **Mobile testing:** Check emails on mobile devices
3. **Spam folder:** Verification emails might land there initially
4. **Update regularly:** Keep your email templates fresh with seasonal messages

---

## ⏱️ Time Required

- **Application name change:** 30 seconds
- **Logo upload:** 2 minutes (if you have a logo ready)
- **Email customization:** 5-10 minutes
- **Testing:** 5 minutes

**Total:** 15-20 minutes to complete full branding

---

## 📞 Need Help?

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk Support](https://clerk.com/support)
- [Customization Guide](https://clerk.com/docs/customization/overview)

---

**Ready?** Open your [Clerk Dashboard](https://dashboard.clerk.com) and follow the checklist above! 🚀
