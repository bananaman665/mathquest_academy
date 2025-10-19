// Example of fully custom Clerk sign-in component
// Use this if you want complete control over the UI

import { SignIn } from '@clerk/nextjs'

export function CustomSignIn() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "w-full",
          card: "bg-white shadow-2xl rounded-2xl border-2 border-blue-100",
          
          // Header customization
          headerTitle: "text-3xl font-bold text-gray-900 mb-2",
          headerSubtitle: "text-gray-600 text-sm",
          
          // Form elements
          formButtonPrimary: 
            "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg",
          
          formFieldInput: 
            "border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all",
          
          // Social buttons
          socialButtonsBlockButton: 
            "border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg py-3 px-4 transition-all duration-200",
          
          socialButtonsBlockButtonText: "font-medium text-gray-700",
          
          // Footer
          footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
          
          // Divider
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500 text-sm",
        },
        variables: {
          colorPrimary: "#2563eb", // Your brand blue
          colorText: "#1f2937", // Dark gray for text
          colorBackground: "#ffffff",
          colorInputBackground: "#ffffff",
          colorInputText: "#1f2937",
          borderRadius: "0.75rem",
          fontFamily: "inherit",
        },
        layout: {
          socialButtonsPlacement: "top", // Put Google button at top
          socialButtonsVariant: "blockButton",
        }
      }}
      routing="path"
      path="/signin"
      signUpUrl="/signup"
      redirectUrl="/dashboard"
    />
  )
}

// Usage in your signin page:
// import { CustomSignIn } from '@/components/CustomSignIn'
// Then use <CustomSignIn /> instead of <SignIn />
