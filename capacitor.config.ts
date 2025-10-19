import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mathquest.academy',
  appName: 'MathQuest Academy',
  webDir: 'out',
  server: {
    url: 'https://mathquest-academy-bhfd.vercel.app',
    cleartext: true
  }
};

export default config;
