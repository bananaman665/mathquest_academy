import Link from 'next/link'
import { Trophy, Zap, Target, Sparkles, Star, Rocket } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Subtle Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-100 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 pt-14 sm:pt-4">
                        <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Mathlify
              </span>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/signin" 
                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:bg-gray-100"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-6 py-3 rounded-full mb-8">
            <Rocket className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm">Launch Your Math Journey</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Make Math Learning
            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mt-2">
              Epic & Fun
            </span>
          </h2>
          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The revolutionary math platform that turns practice into an adventure. 
            Level up, unlock achievements, and master math through gamified learning.
          </p>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup" 
              className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:from-purple-700 hover:via-pink-700 hover:to-blue-700 text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Learning Free
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </span>
            </Link>
            <Link 
              href="/signin" 
              className="bg-white hover:bg-gray-50 text-gray-900 px-10 py-5 rounded-2xl text-lg font-bold border-2 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white border-2 border-purple-200 hover:border-purple-400 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Earn XP & Level Up</h3>
            <p className="text-gray-600 leading-relaxed">
              Every correct answer earns experience points. Watch your math skills grow as you level up through epic challenges!
            </p>
          </div>

          <div className="group bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Unlock Achievements</h3>
            <p className="text-gray-600 leading-relaxed">
              Complete challenges, maintain streaks, and unlock special badges as you master new concepts and become a math legend!
            </p>
          </div>

          <div className="group bg-white border-2 border-pink-200 hover:border-pink-400 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:rotate-12 transition-transform duration-500">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Adaptive Learning</h3>
            <p className="text-gray-600 leading-relaxed">
              Smart difficulty adjustment ensures you&apos;re always challenged but never overwhelmed. Perfect for every skill level!
            </p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-32 bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-3xl shadow-2xl p-12">
          <div className="flex items-center justify-center gap-3 mb-12">
            <Star className="w-8 h-8 text-yellow-500" />
            <h3 className="text-3xl font-black text-center text-gray-900">
              Built for Real Learning Success
            </h3>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group">
              <div className="text-6xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
              <div className="text-gray-700 text-lg font-semibold">Progressive Levels</div>
            </div>
            <div className="group">
              <div className="text-6xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">1000+</div>
              <div className="text-gray-700 text-lg font-semibold">Practice Questions</div>
            </div>
            <div className="group">
              <div className="text-6xl font-black bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">K-8</div>
              <div className="text-gray-700 text-lg font-semibold">Grade Coverage</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-3xl p-16 shadow-2xl">
          <h3 className="text-4xl font-black text-white mb-6 leading-tight">
            Ready to Transform Math Learning?
          </h3>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who are making math their favorite subject through gamified, engaging practice.
          </p>
          <Link 
            href="/signup" 
            className="group inline-flex items-center gap-3 bg-white hover:bg-gray-50 text-purple-600 px-12 py-6 rounded-2xl text-xl font-bold shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Start Your Math Adventure
            <Rocket className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-50 border-t border-gray-200 mt-32">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Mathlify
              </span>
            </div>
            <p className="text-gray-600 mb-4">&copy; 2025 Mathlify. Making math learning epic and fun.</p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-400">·</span>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <span className="text-gray-400">·</span>
              <a href="mailto:support@mathlify.app" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
