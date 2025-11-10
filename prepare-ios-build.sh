#!/bin/bash

# Mathly iOS Build Preparation Script
# This script prepares your app for App Store submission

echo "🚀 Preparing Mathly for iOS App Store submission..."
echo ""

# Step 1: Build the web app
echo "📦 Step 1: Building web application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Web build complete!"
echo ""

# Step 2: Sync with Capacitor
echo "🔄 Step 2: Syncing with Capacitor..."
npx cap sync ios

if [ $? -ne 0 ]; then
    echo "❌ Capacitor sync failed."
    exit 1
fi

echo "✅ Capacitor sync complete!"
echo ""

# Step 3: Copy assets
echo "📋 Step 3: Verifying iOS assets..."
if [ ! -f "ios/App/App/Assets.xcassets/AppIcon.appiconset/Contents.json" ]; then
    echo "⚠️  Warning: App icon may need to be configured in Xcode"
fi

echo "✅ Assets verified!"
echo ""

# Step 4: Open Xcode
echo "🎯 Step 4: Opening Xcode..."
echo ""
echo "Next steps in Xcode:"
echo "1. Select 'Any iOS Device' as target"
echo "2. Set your Team in Signing & Capabilities"
echo "3. Verify Version (1.0.0) and Build (1)"
echo "4. Product → Archive"
echo "5. Distribute to App Store Connect"
echo ""

read -p "Press Enter to open Xcode..."
npx cap open ios

echo ""
echo "✨ Setup complete! Follow the in-Xcode steps above."
echo "📖 For detailed instructions, see APP_STORE_PUBLISHING_GUIDE.md"
