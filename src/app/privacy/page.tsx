import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacyPolicy() {
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

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last Updated: October 31, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Mathly (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and the privacy of children who use our educational app. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and website.
            </p>
            <p className="text-gray-700 leading-relaxed">
              By using Mathly, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Username and password (if using password authentication)</li>
              <li>Email address (for account recovery and notifications)</li>
              <li>Authentication data (if using Google or other OAuth providers)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Learning Data</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              To provide our educational services, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Progress through lessons and levels</li>
              <li>Quiz and exercise responses</li>
              <li>Time spent on activities</li>
              <li>Achievement and reward data</li>
              <li>Experience points (XP) and game statistics</li>
              <li>In-app purchases and virtual currency (gems, hearts)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3 mt-6">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Device information (type, operating system)</li>
              <li>App usage statistics</li>
              <li>IP address and general location (country/region level only)</li>
              <li>Error logs and crash reports</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Provide and maintain our educational services</li>
              <li>Personalize learning experiences and track progress</li>
              <li>Process in-app purchases and manage virtual currency</li>
              <li>Send important updates about your account and our services</li>
              <li>Improve our app&apos;s functionality and user experience</li>
              <li>Ensure the safety and security of our users</li>
              <li>Comply with legal obligations</li>
              <li>Detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly is designed for children and complies with the Children&apos;s Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under 13 without parental consent.
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>We do not require children to provide more information than necessary to use the app</li>
              <li>We do not share children&apos;s personal information with third parties for marketing purposes</li>
              <li>Parents can request to review, delete, or stop the collection of their child&apos;s information</li>
              <li>We use industry-standard security measures to protect children&apos;s data</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              If you are a parent or guardian and believe your child has provided us with personal information without your consent, please contact us at <a href="mailto:privacy@mathly.app" className="text-blue-600 hover:underline">privacy@mathly.app</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Service Providers:</strong> We use third-party services (Clerk for authentication, Vercel for hosting, PostgreSQL for data storage) that process data on our behalf under strict privacy agreements</li>
              <li><strong>Legal Requirements:</strong> If required by law or to protect our rights and safety</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you explicitly authorize us to share your information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. This includes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>Encrypted data transmission (HTTPS/SSL)</li>
              <li>Secure password hashing</li>
              <li>Regular security audits</li>
              <li>Limited employee access to personal data</li>
              <li>Secure cloud infrastructure</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct your information through your profile settings</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, please contact us at <a href="mailto:privacy@mathly.app" className="text-blue-600 hover:underline">privacy@mathly.app</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information only as long as necessary to provide our services and fulfill the purposes outlined in this policy. When you delete your account, we will delete or anonymize your personal information within 30 days, except where we are required to retain it for legal purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Mathly uses the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li><strong>Clerk:</strong> Authentication and user management (<a href="https://clerk.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Vercel:</strong> Web hosting and deployment (<a href="https://vercel.com/legal/privacy-policy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
              <li><strong>Google OAuth:</strong> Social login option (<a href="https://policies.google.com/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy Policy</a>)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              These services have their own privacy policies, and we encourage you to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and maintained on servers located outside of your country. By using Mathly, you consent to the transfer of your information to countries that may have different data protection laws than your country of residence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last Updated&quot; date. Significant changes will be communicated via email or in-app notification.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:privacy@mathly.app" className="text-blue-600 hover:underline">privacy@mathly.app</a></p>
              <p className="text-gray-700 mt-2"><strong>Support:</strong> <a href="mailto:support@mathly.app" className="text-blue-600 hover:underline">support@mathly.app</a></p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">California Privacy Rights</h2>
            <p className="text-gray-700 leading-relaxed">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA), including the right to know what personal information we collect and how we use it, the right to delete your personal information, and the right to opt-out of the sale of your personal information (we do not sell personal information).
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
