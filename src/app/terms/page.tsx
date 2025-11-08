import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
        <p className="text-gray-600 mb-8">Last Updated: October 31, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Mathly! These Terms of Service (&quot;Terms&quot;) govern your access to and use of the Mathly mobile application and website (collectively, the &quot;Service&quot;). By accessing or using our Service, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              If you do not agree to these Terms, please do not use our Service. If you are under 18 years of age, you must have your parent or guardian&apos;s permission to use Mathly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description of Service</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly is an educational platform that provides interactive math learning experiences for students. Our Service includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Interactive math lessons and exercises</li>
              <li>Progress tracking and achievement systems</li>
              <li>Gamified learning features (XP, gems, hearts, streaks)</li>
              <li>AI-powered tutoring assistance</li>
              <li>Virtual shop and inventory system</li>
              <li>Leaderboards and community features</li>
              <li>Premium subscription options (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Account Creation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To use certain features of Mathly, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Maintain the security of your password</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Account Termination</h3>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent, abusive, or illegal activity.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You agree to use Mathly only for lawful purposes and in accordance with these Terms. You agree NOT to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Use the Service in any way that violates applicable laws or regulations</li>
              <li>Impersonate another user or provide false information</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload viruses, malware, or malicious code</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Scrape, data mine, or extract data from the Service</li>
              <li>Use automated systems (bots) to access the Service</li>
              <li>Reverse engineer or decompile our software</li>
              <li>Remove copyright or proprietary notices</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Virtual Currency and In-App Purchases</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Virtual Items</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly includes virtual currency (gems) and virtual items (power-ups, shop items) that can be earned through gameplay or purchased with real money. You understand that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Virtual currency and items have no real-world value</li>
              <li>Virtual items are non-transferable and non-refundable</li>
              <li>We may modify, suspend, or discontinue virtual items at any time</li>
              <li>Virtual items are lost if your account is terminated</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Purchases</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              All purchases are processed through the Apple App Store or Google Play Store and are subject to their terms and refund policies. We do not process payments directly.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Parents should enable parental controls to prevent unauthorized purchases by children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Subscriptions</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly offers optional premium subscriptions with additional features. Subscriptions:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Auto-renew unless cancelled at least 24 hours before the end of the period</li>
              <li>Can be managed through your App Store account settings</li>
              <li>Are billed through your Apple or Google account</li>
              <li>Provide access to premium features for the duration of the subscription</li>
              <li>Are non-transferable between accounts</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Refunds for subscriptions are handled according to Apple App Store and Google Play Store policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Our Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service and its original content, features, and functionality are owned by Mathly and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may not copy, modify, distribute, sell, or lease any part of our Service or software without our explicit written permission.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">User-Generated Content</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you submit feedback, suggestions, or other content to us, you grant us a worldwide, royalty-free, perpetual license to use that content for any purpose.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Educational Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly is designed to supplement, not replace, traditional education. While we strive for accuracy in our educational content:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>We do not guarantee specific learning outcomes</li>
              <li>Content should not be considered professional educational advice</li>
              <li>Parents and teachers should supervise children&apos;s learning</li>
              <li>We are not responsible for academic performance or test results</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy and Data Protection</h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of Mathly is also governed by our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>. Please review it to understand how we collect, use, and protect your information, especially regarding children&apos;s privacy and COPPA compliance.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Service &quot;As Is&quot;</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              The Service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not guarantee that:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>The Service will be uninterrupted, secure, or error-free</li>
              <li>Results or information obtained will be accurate or reliable</li>
              <li>Defects will be corrected</li>
              <li>The Service will meet your specific requirements</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Limitation of Liability</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law, Mathly shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Indirect, incidental, special, consequential, or punitive damages</li>
              <li>Loss of profits, data, use, or other intangible losses</li>
              <li>Damages resulting from unauthorized access to your account</li>
              <li>Damages resulting from interruption or cessation of the Service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Indemnification</h2>
            <p className="text-gray-700 leading-relaxed">
              You agree to indemnify and hold harmless Mathly, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the Service or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Service</h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We may also update content, features, and functionality. We are not liable for any modification, suspension, or discontinuation of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may revise these Terms at any time by updating this page. Changes are effective immediately upon posting. Your continued use of the Service after changes constitutes acceptance of the new Terms.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Material changes will be communicated via email or in-app notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Governing Law and Jurisdiction</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts located in the United States.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Severability</h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Entire Agreement</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and Mathly regarding the use of the Service and supersede any prior agreements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:legal@mathlify.app" className="text-blue-600 hover:underline">legal@mathlify.app</a></p>
              <p className="text-gray-700 mt-2"><strong>Support:</strong> <a href="mailto:support@mathlify.app" className="text-blue-600 hover:underline">support@mathlify.app</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Acknowledgment</h2>
            <p className="text-gray-700 leading-relaxed">
              By using Mathly, you acknowledge that you have read these Terms of Service and agree to be bound by them.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
