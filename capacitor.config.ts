import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mathquest.academy',
  appName: 'MathQuest Academy',
  webDir: 'out',
  server: {
    url: 'https://mathquest-academy-bhfd.vercel.app',
    cleartext: true,
    // Prevent opening in external browser
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'app.mathquest.academy'
  },
  ios: {
    contentInset: 'never',
    allowsLinkPreview: false,
    scrollEnabled: true,
    preferredContentMode: 'mobile',
    // Force internal WebView handling
    overrideUserAgent: 'MathQuest-Academy-App'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;
