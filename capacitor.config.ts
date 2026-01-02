import type { CapacitorConfig } from '@capacitor/cli';

// Production URL - comment out for local development
const productionUrl = 'https://mathquest-academy.vercel.app';

// Development URL - use your local network IP for testing on device
const devUrl = process.env.CAPACITOR_SERVER_URL || 'http://10.200.1.36:3000';

// Force production URL for iOS
const serverUrl = productionUrl; // Changed from: process.env.CAPACITOR_DEV === 'true' ? devUrl : productionUrl;

const config: CapacitorConfig = {
  appId: 'com.mathlified.app',
  appName: 'Mathlified',
  webDir: 'out',
  server: {
    url: serverUrl,
    cleartext: process.env.CAPACITOR_DEV === 'true',
    hostname: 'localhost',
    allowNavigation: ['*']
  },
  ios: {
    contentInset: 'never',
    scrollEnabled: true,
    appendUserAgent: 'Mathlified/1.0 Safari/605.1.15',
    limitsNavigationsToAppBoundDomains: false,
    scheme: 'ionic',
  }
};

export default config;
