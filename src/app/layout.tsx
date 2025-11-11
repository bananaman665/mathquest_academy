import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from '@/components/ErrorBoundary'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mathly - Learn Math Through Adventure",
  description: "An interactive math learning platform with gamification",
  icons: {
    icon: '/icon.png',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_YWN0dWFsLW1vb3NlLTM1LmNsZXJrLmFjY291bnRzLmRldiQ';

  return (
    <ClerkProvider 
      publishableKey={clerkPublishableKey}
      appearance={{
        variables: {
          colorPrimary: "#2563eb",
          colorBackground: "#ffffff",
          colorText: "#1f2937",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary: 
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white",
          card: "shadow-xl",
          headerTitle: "text-gray-900 font-bold",
          headerSubtitle: "text-gray-600",
          socialButtonsBlockButton: 
            "border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all",
          footerActionLink: "text-blue-600 hover:text-blue-700",
        }
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
