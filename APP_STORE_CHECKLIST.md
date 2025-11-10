# App Store Submission Checklist for Mathly

## Phase 1: Apple Developer Account (DO FIRST)
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Wait for approval (1-2 days)

## Phase 2: Prepare Assets
- [ ] App Icon 1024x1024 (you have: app-icon-1024.png - verify quality)
- [ ] Take 5-10 screenshots on iPhone 17 Pro:
  - [ ] Main learning path (showing units)
  - [ ] Question page (interactive example)
  - [ ] Progress/achievements screen
  - [ ] Shop/rewards page
  - [ ] Profile or stats page
- [ ] (Optional) Record 30-second app preview video

## Phase 3: Legal Pages
- [ ] Review and finalize Privacy Policy (/privacy page)
- [ ] Review and finalize Terms of Service (/terms page)
- [ ] Ensure both pages are accessible from deployed site

## Phase 4: App Store Listing Content
- [ ] Write compelling app description (see guide)
- [ ] Choose 10-15 keywords
- [ ] Write subtitle (30 chars): "Learn Math Through Adventure"
- [ ] Prepare "What's New" text for version 1.0
- [ ] Decide on pricing (Free recommended for launch)

## Phase 5: Technical Build
- [ ] Run: `./prepare-ios-build.sh`
- [ ] In Xcode:
  - [ ] Select Team (Apple Developer account)
  - [ ] Set Display Name: Mathly
  - [ ] Set Version: 1.0.0
  - [ ] Set Build: 1
  - [ ] Verify Bundle ID: com.mathly.app
  - [ ] Test on device (your iPhone 17 Pro)
- [ ] Create Archive (Product → Archive)
- [ ] Upload to App Store Connect

## Phase 6: App Store Connect
- [ ] Log in to appstoreconnect.apple.com
- [ ] Create new app
- [ ] Fill in all metadata (name, description, etc.)
- [ ] Upload screenshots for all device sizes
- [ ] Set categories (Education, Kids)
- [ ] Complete age rating (expect 4+)
- [ ] Add privacy policy and support URLs
- [ ] Select distribution territories

## Phase 7: Submit for Review
- [ ] Add app review information
- [ ] Provide demo account (if needed)
- [ ] Add notes for reviewer
- [ ] Submit for review
- [ ] Wait 24-48 hours (up to 7 days)

## Phase 8: Post-Launch
- [ ] Monitor reviews
- [ ] Respond to user feedback
- [ ] Track analytics
- [ ] Plan version 1.1 updates

---

## Current Status: ⬜ Not Started

**Next Action:** Enroll in Apple Developer Program
**Est. Time to Launch:** 1-2 weeks from enrollment approval

---

## Quick Commands

```bash
# Build and prepare for App Store
./prepare-ios-build.sh

# Or manually:
npm run build
npx cap sync ios
npx cap open ios
```

---

**Notes:**
- Your app is already portrait-locked ✓
- Navigation bars are iPhone-optimized ✓
- All 50 levels are functional ✓
- Gamification features working ✓

You're ready to start the submission process!
