import { SignIn } from '@clerk/nextjs'
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col oauth-page-wrapper">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Mathly</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Sign In Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 pt-48 mt-24">
        <div className="max-w-md w-full space-y-8">
          {/* Custom Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
                                <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-green-600 mb-2">
            Sign in to Mathly
          </h1>
          <p className="text-gray-600">Continue your math adventure!</p>
        </div>
          </div>

          {/* Clerk Sign In Component */}
          <div className="mt-8 flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-xl border-2 border-gray-100",
                  headerTitle: "hidden", // Hide Clerk's default title since we have our own
                  headerSubtitle: "hidden", // Hide default subtitle
                  socialButtonsBlockButton: 
                    "border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all",
                  socialButtonsBlockButtonText: "font-semibold",
                  formButtonPrimary: 
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                  footerActionText: "text-gray-600",
                  formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                  formFieldLabel: "text-gray-700 font-medium",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                },
                variables: {
                  colorPrimary: "#2563eb",
                  borderRadius: "0.75rem",
                },
                layout: {
                  socialButtonsPlacement: "top",
                  socialButtonsVariant: "blockButton",
                }
              }}
              routing="path"
              path="/signin"
              signUpUrl="/signup"
              forceRedirectUrl="/learn"
              afterSignInUrl="/learn"
            />
          </div>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">When you sign in, you can:</p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Track your progress and XP</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Maintain your learning streak</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Unlock achievements and badges</span>
              </div>
            </div>
          </div>

          {/* Legal Links */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
