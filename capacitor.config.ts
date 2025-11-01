import type { CapacitorConfig } from '@capacitor/cli';

// Production URL - comment out for local development
const productionUrl = 'https://mathquest-academy.vercel.app';

// Development URL - use your local network IP for testing on device
const devUrl = process.env.CAPACITOR_SERVER_URL || 'http://10.200.1.36:3000';

// Use production URL by default, set CAPACITOR_DEV=true to use dev server
const serverUrl = process.env.CAPACITOR_DEV === 'true' ? devUrl : productionUrl;

const config: CapacitorConfig = {
  appId: 'com.mathlify.app',
  appName: 'Mathlify',
  webDir: 'out',
  server: {
    url: serverUrl,
    cleartext: process.env.CAPACITOR_DEV === 'true', // Only allow cleartext in dev mode
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
