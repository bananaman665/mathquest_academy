# App Store Publishing Guide for Mathly

## Prerequisites Checklist

### 1. Apple Developer Account
- [ ] **Enroll in Apple Developer Program** ($99/year)
  - Go to: https://developer.apple.com/programs/
  - Sign up with your Apple ID
  - Complete enrollment (takes 1-2 days for approval)

### 2. Legal & Business Information
- [ ] **Company/Individual Name** for the app listing
- [ ] **Privacy Policy URL** (required by Apple)
  - You have `/privacy` page - ensure it's comprehensive
  - Must be publicly accessible
- [ ] **Terms of Service URL** (recommended)
  - You have `/terms` page - review and finalize
- [ ] **Support URL or Email** for customer support
- [ ] **Marketing URL** (optional) - your website

### 3. App Store Assets

#### App Icons (Required)
You already have `app-icon-1024.png` - verify it meets requirements:
- [ ] **1024x1024px** PNG (no transparency)
- [ ] No rounded corners (Apple adds them)
- [ ] RGB color space
- [ ] 72 DPI minimum

#### Screenshots (Required - at least 3)
Need screenshots for different iPhone sizes:
- [ ] **6.7" Display** (iPhone 15 Pro Max, 14 Pro Max, 13 Pro Max)
  - 1290 x 2796 pixels (portrait)
  - OR 2796 x 1290 pixels (landscape)
- [ ] **6.5" Display** (iPhone 11 Pro Max, XS Max)
  - 1242 x 2688 pixels (portrait)
  - OR 2688 x 1242 pixels (landscape)
- [ ] **5.5" Display** (iPhone 8 Plus)
  - 1242 x 2208 pixels (portrait)
  - OR 2208 x 1242 pixels (landscape)

**Screenshot Content Ideas:**
1. Main learning path showing colorful units
2. Interactive question (e.g., number line, multiple choice)
3. Achievement/rewards screen
4. Progress/stats dashboard
5. Shop or gamification features

#### Optional Assets
- [ ] **App Preview Videos** (30 seconds max, highly recommended)
- [ ] **Promotional Text** (170 characters)

### 4. App Store Listing Content

#### Required Text
- [ ] **App Name** (30 characters max)
  - Current: "Mathly" ✓
  
- [ ] **Subtitle** (30 characters max)
  - Example: "Learn Math Through Adventure"
  
- [ ] **Description** (4000 characters max)
  ```
  Transform math learning into an exciting adventure! 
  
  Mathly is a gamified math learning platform designed to make mathematics 
  fun and engaging for students of all levels. Progress through 50+ carefully 
  crafted levels covering everything from basic counting to advanced geometry.
  
  KEY FEATURES:
  • 50+ Interactive Levels spanning 10 themed units
  • Multiple question types: Multiple choice, drag & drop, number lines, and more
  • Gamification with XP, streaks, and rewards
  • Visual learning with interactive components
  • Progress tracking and achievements
  • Safe, ad-free learning environment
  
  CURRICULUM COVERAGE:
  Unit 1: Number Basics (1-10)
  Unit 2: Addition Adventures
  Unit 3: Subtraction Station
  Unit 4: Bigger Numbers
  Unit 5: Place Values
  Unit 6: Multiplication Magic
  Unit 7: Division Discovery
  Unit 8: Fraction Fun
  Unit 9: Decimal Dimension
  Unit 10: Geometry Garden
  
  Perfect for elementary and middle school students looking to build 
  confidence in mathematics through engaging, bite-sized lessons.
  ```
  
- [ ] **Keywords** (100 characters max, comma-separated)
  - Example: "math,learning,education,kids,multiplication,addition,subtraction,fractions,geometry"
  
- [ ] **Category** 
  - Primary: Education
  - Secondary: Kids (optional)

### 5. Age Rating
Complete the Age Rating Questionnaire:
- [ ] No violence
- [ ] No mature/suggestive themes
- [ ] No gambling
- [ ] No unrestricted web access
- [ ] Educational content
- **Expected Rating: 4+** (suitable for all ages)

### 6. Technical Requirements

#### Build Configuration
- [ ] **Bundle Identifier**: `com.mathly.app` (from capacitor.config.ts) ✓
- [ ] **Version Number**: Start with 1.0.0
- [ ] **Build Number**: Start with 1

#### Xcode Project Setup
1. Open your iOS project:
   ```bash
   cd ios/App
   open App.xcworkspace
   ```

2. In Xcode, configure:
   - [ ] **Signing & Capabilities**
     - Select your team (Apple Developer account)
     - Ensure automatic signing is enabled
   - [ ] **General Tab**
     - Display Name: Mathly
     - Bundle Identifier: com.mathly.app
     - Version: 1.0.0
     - Build: 1
     - Deployment Target: iOS 13.0 or higher
   - [ ] **Info.plist** - Verify required keys:
     - Privacy - Camera Usage Description (for future features)
     - Privacy - Photo Library Usage Description (for future features)

#### Build the App
```bash
# 1. Build your web app
npm run build

# 2. Copy to Capacitor
npx cap copy ios

# 3. Update Capacitor
npx cap sync ios

# 4. Open in Xcode
npx cap open ios
```

### 7. App Store Connect Setup

1. **Create App Record**
   - [ ] Log in to https://appstoreconnect.apple.com
   - [ ] Click "My Apps" → "+" → "New App"
   - [ ] Fill in:
     - Platform: iOS
     - Name: Mathly
     - Primary Language: English (U.S.)
     - Bundle ID: com.mathly.app
     - SKU: mathly-ios-001 (unique identifier)

2. **App Information**
   - [ ] Upload App Icon (1024x1024)
   - [ ] Select Primary/Secondary Categories
   - [ ] Enter Privacy Policy URL
   - [ ] Enter Support URL

3. **Pricing and Availability**
   - [ ] Select territories (countries)
   - [ ] Set price (Free or paid)
   - [ ] Set availability date

4. **Version Information**
   - [ ] Upload screenshots for each device size
   - [ ] Enter description, keywords, subtitle
   - [ ] Add what's new text (for updates)
   - [ ] Select age rating

### 8. Build and Submit

#### Archive in Xcode
1. [ ] In Xcode, select "Any iOS Device" as target
2. [ ] Product → Archive
3. [ ] Wait for archive to complete
4. [ ] In Organizer, select your archive
5. [ ] Click "Distribute App"
6. [ ] Choose "App Store Connect"
7. [ ] Follow prompts to upload

#### Submit for Review
1. [ ] In App Store Connect, select your app
2. [ ] Go to "App Store" tab
3. [ ] Click version (1.0)
4. [ ] Fill in all required information
5. [ ] Click "Submit for Review"

### 9. App Review Information

Prepare answers for Apple's review team:
- [ ] **Demo Account** (if app requires login)
  - Username: demo@mathly.com
  - Password: demo123
  - Or note that no account is needed
  
- [ ] **Contact Information**
  - First Name
  - Last Name
  - Phone Number
  - Email Address
  
- [ ] **Notes for Reviewer**
  ```
  Mathly is an educational math app for students. 
  No login required to access content.
  All 50 levels are accessible for testing.
  Start by clicking any level to see interactive questions.
  ```

### 10. Testing Before Submission

- [ ] **Test on Real Device** (iPhone 17 Pro you have)
  - All 50 levels load correctly
  - Questions display properly
  - Navigation works (top/bottom bars visible)
  - Progress saves correctly
  - No crashes or freezes
  
- [ ] **TestFlight Beta** (Recommended)
  - Upload build to TestFlight first
  - Test with friends/family
  - Get feedback before public release
  
- [ ] **Check Orientation Lock** (Portrait mode working)
- [ ] **Check Safe Areas** (iPhone notch clearance)
- [ ] **Test All Question Types**
- [ ] **Test Gamification** (XP, gems, hearts, streaks)

### 11. Post-Submission

#### Review Timeline
- Typical review time: 24-48 hours
- Could be up to 7 days during busy periods
- May get rejected - Apple will provide reasons

#### Common Rejection Reasons
- Incomplete metadata
- Privacy policy issues
- App crashes or bugs
- Misleading screenshots/description
- Missing features advertised

#### After Approval
- [ ] App goes live automatically (or on scheduled date)
- [ ] Monitor reviews and ratings
- [ ] Respond to user feedback
- [ ] Plan version 1.1 with improvements

## Quick Start Commands

```bash
# Build production version
npm run build

# Sync with iOS
npx cap sync ios

# Open in Xcode
npx cap open ios

# Generate screenshots (simulator)
# Use Xcode's screenshot tool or third-party tools like fastlane snapshot
```

## Resources

- **Apple Developer Portal**: https://developer.apple.com
- **App Store Connect**: https://appstoreconnect.apple.com
- **App Store Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines**: https://developer.apple.com/design/human-interface-guidelines/
- **Capacitor iOS Documentation**: https://capacitorjs.com/docs/ios

## Estimated Timeline

- Apple Developer enrollment: 1-2 days
- Preparing assets (screenshots, etc.): 2-3 days
- Setting up App Store Connect: 1 day
- Building and uploading: 2-4 hours
- Apple review: 1-7 days

**Total: ~1-2 weeks** for first submission

## Cost

- **Apple Developer Program**: $99/year (required)
- **App Icons/Screenshots**: Free (you can create yourself) or $50-200 if outsourced
- **Total**: ~$99-299 for first year

---

## Next Immediate Steps

1. ✅ Enroll in Apple Developer Program (do this first - takes 1-2 days)
2. ✅ Create compelling screenshots of your app
3. ✅ Write final Privacy Policy and Terms of Service
4. ✅ Test thoroughly on real device (your iPhone 17 Pro)
5. ✅ Create build in Xcode and upload to TestFlight
6. ✅ Create App Store listing in App Store Connect
7. ✅ Submit for review

Good luck! 🚀
