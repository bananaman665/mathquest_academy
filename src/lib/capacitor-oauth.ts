'use client'

import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'

/**
 * Check if running in a Capacitor native app
 */
export function isCapacitorNative(): boolean {
  return Capacitor.isNativePlatform()
}

/**
 * Get the app's URL scheme for deep linking back from OAuth
 */
export function getAppScheme(): string {
  // This should match your iOS URL scheme configured in Info.plist
  return 'mathlified'
}

/**
 * Open OAuth URL in system browser (ASWebAuthenticationSession on iOS)
 * This is required because WebViews cannot handle OAuth redirects properly
 */
export async function openOAuthInBrowser(url: string): Promise<void> {
  if (!isCapacitorNative()) {
    // On web, just navigate normally
    window.location.href = url
    return
  }

  try {
    await Browser.open({
      url,
      presentationStyle: 'popover',
      windowName: '_blank'
    })
  } catch (error) {
    console.error('Failed to open OAuth browser:', error)
    // Fallback to window.open
    window.open(url, '_blank')
  }
}

/**
 * Close the OAuth browser after successful authentication
 */
export async function closeOAuthBrowser(): Promise<void> {
  if (isCapacitorNative()) {
    try {
      await Browser.close()
    } catch (error) {
      console.error('Failed to close browser:', error)
    }
  }
}

/**
 * Setup listener for OAuth completion via deep links
 * Call this in your app initialization
 */
export function setupOAuthDeepLinkListener(
  onOAuthComplete: (url: string) => void
): () => void {
  if (!isCapacitorNative()) {
    return () => {} // No-op cleanup for web
  }

  // Listen for app URL open events (deep links)
  const handleUrlOpen = (event: { url: string }) => {
    const url = event.url
    // Check if this is an OAuth callback
    if (url.includes('sso-callback') || url.includes('oauth')) {
      onOAuthComplete(url)
      closeOAuthBrowser()
    }
  }

  // Import App plugin dynamically to avoid issues on web
  import('@capacitor/app').then(({ App }) => {
    App.addListener('appUrlOpen', handleUrlOpen)
  }).catch(console.error)

  return () => {
    import('@capacitor/app').then(({ App }) => {
      App.removeAllListeners()
    }).catch(console.error)
  }
}
