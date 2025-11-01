'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Check, ArrowLeft, Zap, Star, Trophy, Brain } from 'lucide-react'

export default function UpgradePage() {
  const [isAnnual, setIsAnnual] = useState(false)

  const monthlyPrice = 4.99
  const annualPrice = 49.99
  const annualMonthly = (annualPrice / 12).toFixed(2)
  const savings = ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12) * 100).toFixed(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4 pb-24">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/learn" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 font-medium">
          <ArrowLeft className="w-5 h-5" />
          Back to Learning
        </Link>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
            Unlock Your Full Potential
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant AI help, bonus challenges, and exclusive features to accelerate your math mastery!
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className={`font-semibold ${!isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-8 rounded-full transition-colors ${isAnnual ? 'bg-purple-600' : 'bg-gray-300'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
          </button>
          <span className={`font-semibold ${isAnnual ? 'text-purple-600' : 'text-gray-500'}`}>
            Annual <span className="text-sm text-green-600 font-bold">(Save {savings}%)</span>
          </span>
        </div>

        {/* Pricing Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8 border-4 border-purple-200">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-5xl md:text-6xl font-black text-purple-600">
                ${isAnnual ? annualMonthly : monthlyPrice.toFixed(2)}
              </span>
              <span className="text-2xl text-gray-600 font-semibold">/month</span>
            </div>
            {isAnnual && (
              <p className="text-gray-600">Billed annually at ${annualPrice}/year</p>
            )}
          </div>

          {/* Features List */}
          <div className="space-y-4 mb-8">
            <FeatureItem icon={<Sparkles />} color="purple">
              <strong>AI Math Tutor</strong> - Get instant explanations for any question
            </FeatureItem>
            <FeatureItem icon={<Zap />} color="yellow">
              <strong>50 Bonus Levels</strong> - Unlock levels 51-100 with challenging problems
            </FeatureItem>
            <FeatureItem icon={<Trophy />} color="blue">
              <strong>Exclusive Badges</strong> - Show off your premium achievements
            </FeatureItem>
            <FeatureItem icon={<Star />} color="pink">
              <strong>Priority Support</strong> - Get help faster when you need it
            </FeatureItem>
            <FeatureItem icon={<Brain />} color="green">
              <strong>Personalized Practice</strong> - AI generates custom problems for you
            </FeatureItem>
            <FeatureItem icon={<Check />} color="purple">
              <strong>No Ads</strong> - Distraction-free learning experience
            </FeatureItem>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg py-5 rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
            <Sparkles className="w-6 h-6" />
            Start Free 7-Day Trial
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Cancel anytime. No commitment required.
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <TestimonialCard
            name="Sarah, Age 11"
            text="The helpful hints make math so much easier! I went from struggling to loving math."
            rating={5}
          />
          <TestimonialCard
            name="Mike, Age 10"
            text="The bonus levels are so fun! I can't wait to unlock more and beat my friends' high scores."
            rating={5}
          />
          <TestimonialCard
            name="Emma, Age 12"
            text="I love using the hints for homework help. They explain things better than my textbook!"
            rating={5}
          />
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes! You can cancel your subscription anytime with no penalties. You'll keep access until the end of your billing period."
            />
            <FAQItem
              question="Will I lose my progress if I cancel?"
              answer="Nope! Your progress, XP, and achievements are saved forever. You can always upgrade again later."
            />
            <FAQItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards through Stripe, one of the most secure payment processors in the world."
            />
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Trusted by thousands of young math learners</p>
          <div className="flex items-center justify-center gap-8 text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Money-Back Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, color, children }: { icon: React.ReactNode; color: string; children: React.ReactNode }) {
  const colorClasses: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    pink: 'bg-pink-100 text-pink-600',
    green: 'bg-green-100 text-green-600',
  }

  return (
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-gray-700 pt-2">{children}</p>
    </div>
  )
}

function TestimonialCard({ name, text, rating }: { name: string; text: string; rating: number }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex gap-1 mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      <p className="text-gray-700 mb-4 italic">&ldquo;{text}&rdquo;</p>
      <p className="font-semibold text-gray-900">{name}</p>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div>
      <h3 className="font-bold text-lg text-gray-900 mb-2">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  )
}
