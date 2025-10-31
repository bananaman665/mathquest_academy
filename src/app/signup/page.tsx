import { SignUp } from '@clerk/nextjs'
import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">MathQuest Academy</h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Sign Up Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Custom Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
            </div>
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
              Join Mathlify
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start your math adventure and master math through fun gameplay!
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="mt-8 flex justify-center">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-xl border-2 border-gray-100",
                  headerTitle: "hidden", // Hide Clerk's default title
                  headerSubtitle: "hidden", // Hide default subtitle
                  socialButtonsBlockButton: 
                    "border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all",
                  formButtonPrimary: 
                    "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                  footerActionLink: "text-blue-600 hover:text-blue-700",
                },
                variables: {
                  colorPrimary: "#2563eb",
                  borderRadius: "0.75rem",
                }
              }}
              routing="path"
              path="/signup"
              signInUrl="/signin"
              redirectUrl="/dashboard"
            />
          </div>

          {/* Features */}
          <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              What you&apos;ll get:
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <span>Personalized learning path from elementary through middle school</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <span>Earn XP, unlock achievements, and level up your skills</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <span>Track your progress with detailed analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <span>Get started now and explore these features today!</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
