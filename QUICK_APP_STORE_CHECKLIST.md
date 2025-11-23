# Quick App Store Submission Checklist

## ✅ Already Complete
- [x] iOS app configured (com.mathly.app)
- [x] App icons (all sizes including 1024x1024)
- [x] Splash screens
- [x] Privacy Policy page
- [x] Terms of Service page
- [x] Version set (1.0.0)
- [x] Build number set (1)
- [x] Production URL configured
- [x] Build script ready

## 🔴 CRITICAL - Do Before Anything Else

1. **Apple Developer Account**
   - [ ] Verify you can log into https://developer.apple.com
   - [ ] Verify you can log into https://appstoreconnect.apple.com
   - [ ] Confirm annual membership is active ($99/year)

2. **Screenshots** (You mentioned you have these)
   - [ ] Locate your screenshot files
   - [ ] Verify minimum size: 1290 x 2796 pixels (iPhone 6.7" display)
   - [ ] Need 3-10 screenshots showing:
     - Main learning interface
     - Question examples
     - Progress/achievements
     - Shop/rewards
     - Profile/stats

## 🟡 IMPORTANT - Review Before Building

3. **Clean Up Info.plist Permissions**

   Open: [ios/App/App/Info.plist](ios/App/App/Info.plist)

   **Current permissions** - Do you actually use these?
   - [ ] Camera (line 56) - Does your app scan math problems with camera?
     - **If NO**: Remove NSCameraUsageDescription
   - [ ] Photo Library (line 58) - Does your app use photos?
     - **If NO**: Remove NSPhotoLibraryUsageDescription
   - [ ] User Tracking (line 60) - Do you track users for ads?
     - **If NO**: Remove NSUserTrackingUsageDescription

   ⚠️ **Apple rejects apps with unnecessary permissions!**

4. **Test on Your iPhone**
   ```bash
   ./prepare-ios-build.sh
   # Then test EVERYTHING on your device
   ```
   - [ ] All 50 levels work
   - [ ] Questions display correctly
   - [ ] Navigation works
   - [ ] Authentication works (Clerk)
   - [ ] No crashes
   - [ ] Progress saves

## 🟢 READY TO BUILD - Final Steps

5. **Build for App Store**
   ```bash
   # Run build script
   ./prepare-ios-build.sh

   # In Xcode:
   # 1. Select your Team in "Signing & Capabilities"
   # 2. Select "Any iOS Device" as target
   # 3. Product → Archive
   # 4. Distribute → App Store Connect → Upload
   ```

6. **App Store Connect Setup**

   Go to: https://appstoreconnect.apple.com

   - [ ] Click "My Apps" → "+" → "New App"
   - [ ] Fill in basic info:
     - Name: Mathly
     - Bundle ID: com.mathly.app
     - SKU: mathly-ios-001

   - [ ] Upload screenshots
   - [ ] Add description (see APP_STORE_PUBLISHING_GUIDE.md)
   - [ ] Add keywords: "math,learning,education,kids,multiplication"
   - [ ] Subtitle: "Learn Math Through Adventure"
   - [ ] Category: Education (Primary), Kids (Secondary)
   - [ ] Age Rating: 4+
   - [ ] Pricing: Free

   - [ ] App Review Info:
     - Your contact info
     - Demo account (if needed)
     - Notes: "Educational math app. All levels accessible."

7. **Submit for Review**
   - [ ] Double-check all fields complete
   - [ ] Click "Submit for Review"
   - [ ] Wait 1-7 days for approval

## 📸 Screenshot Recommendations

Showcase these screens (in order of importance):
1. **Main learning path** - Shows all colorful units
2. **Interactive question** - Number line, multiple choice, or drag-drop
3. **Progress/achievements** - XP, streaks, rewards
4. **Shop interface** - Gamification elements
5. **Level complete** - Success screen with rewards

## 📝 Quick Description Template

```
Transform math learning into an exciting adventure!

Mathly makes mathematics fun and engaging with 50+ interactive levels
covering everything from counting to geometry.

KEY FEATURES:
• 50+ Interactive Levels
• Multiple question types
• Gamification with XP & rewards
• Progress tracking
• Ad-free learning

CURRICULUM:
Number Basics • Addition • Subtraction • Place Values
Multiplication • Division • Fractions • Decimals • Geometry

Perfect for elementary and middle school students!
```

## 🚨 Common Rejection Reasons - Avoid These!

- Requesting permissions you don't use ← **CHECK INFO.PLIST**
- Incomplete metadata
- Missing privacy policy URL
- Crashes or bugs ← **TEST THOROUGHLY**
- Misleading screenshots

## ⏱️ Time Estimate

- Clean up permissions: 15 min
- Test on device: 2 hours
- Build & archive: 30 min
- App Store Connect setup: 2 hours
- Apple review: 1-7 days

**Total: ~5 hours of work + Apple review time**

## 🆘 Need Help?

See detailed guides:
- [APP_STORE_READINESS_REPORT.md](APP_STORE_READINESS_REPORT.md) - Full analysis
- [APP_STORE_PUBLISHING_GUIDE.md](APP_STORE_PUBLISHING_GUIDE.md) - Step by step
- [prepare-ios-build.sh](prepare-ios-build.sh) - Build automation

---

**Next Action**: Verify Apple Developer account access, then review Info.plist permissions!
