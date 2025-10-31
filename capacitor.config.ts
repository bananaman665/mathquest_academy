import type { CapacitorConfig } from '@capacitor/cli';

// Use network IP for iOS to access dev server (localhost doesn't always work on device)
// Update this IP to match your machine's local network IP shown in npm run dev output
const serverUrl = process.env.CAPACITOR_SERVER_URL || 'http://10.200.1.36:3000';

const config: CapacitorConfig = {
  appId: 'com.mathlify.app',
  appName: 'Mathlify',
  webDir: 'out',
  server: {
    url: serverUrl,
    cleartext: true,
    allowNavigation: ['*']  // Allow all navigation within the app
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: true,
    // Add a proper user agent to satisfy Google's security requirements
    appendUserAgent: 'Mathlify/1.0 Safari/605.1.15'
  }
};

export default config;
