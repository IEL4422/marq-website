import { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    updatePageSEO({
      title: 'Privacy Policy | Marq Legal',
      description: 'Learn how Marq Legal collects, uses, and protects your personal information and data.',
      canonical: 'https://marqtrademarks.com/privacy-policy',
      keywords: 'privacy policy, data protection, personal information, data security, GDPR'
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Effective Date:</strong> December 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Marq Legal LLC ("we," "our," or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you
              visit our website or use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 mb-4">We may collect personal information that you provide to us, including:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Name and contact information (email, phone number, mailing address)</li>
              <li>Business information (company name, business description)</li>
              <li>Trademark information and specimens</li>
              <li>Payment information (processed securely through third-party payment processors)</li>
              <li>Communications with our firm</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Automatically Collected Information</h3>
            <p className="text-gray-700 mb-4">When you visit our website, we may automatically collect:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Location data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide trademark registration and related legal services</li>
              <li>Process payments and maintain financial records</li>
              <li>Communicate with you about your matters and our services</li>
              <li>Respond to inquiries and provide customer support</li>
              <li>Improve our website and services</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Comply with legal obligations</li>
              <li>Prevent fraud and protect our legal rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 mb-4">We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (payment processing, email delivery, data analytics)</li>
              <li><strong>Government Agencies:</strong> USPTO and other trademark offices for filing applications</li>
              <li><strong>Legal Requirements:</strong> When required by law, subpoena, or legal process</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition of our firm</li>
            </ul>
            <p className="text-gray-700 mb-4">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to improve your experience on our website.
              You can control cookie preferences through your browser settings. However, disabling cookies
              may limit your ability to use certain features of our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement appropriate technical and organizational measures to protect your personal
              information against unauthorized access, alteration, disclosure, or destruction. However,
              no method of transmission over the internet or electronic storage is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain your personal information for as long as necessary to fulfill the purposes outlined
              in this Privacy Policy, comply with legal obligations, resolve disputes, and enforce our agreements.
              Attorney-client communications and case files are retained in accordance with professional
              responsibility rules.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Privacy Rights</h2>
            <p className="text-gray-700 mb-4">Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your information (subject to legal retention requirements)</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
              <li>Restriction of processing</li>
            </ul>
            <p className="text-gray-700 mb-4">
              To exercise these rights, please contact us using the information provided below.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. California Privacy Rights</h2>
            <p className="text-gray-700 mb-4">
              If you are a California resident, you have additional rights under the California Consumer
              Privacy Act (CCPA), including the right to know what personal information we collect and
              how it is used, and the right to request deletion of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our services are not directed to individuals under the age of 18. We do not knowingly
              collect personal information from children. If we become aware that we have collected
              information from a child, we will take steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Websites</h2>
            <p className="text-gray-700 mb-4">
              Our website may contain links to third-party websites. We are not responsible for the
              privacy practices of these external sites. We encourage you to review the privacy policies
              of any third-party websites you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new policy on this page and updating the effective date. Your
              continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-2"><strong>Marq Legal LLC</strong></p>
              <p className="text-gray-700 mb-2">980 N. Michigan Ave, Suite 1090</p>
              <p className="text-gray-700 mb-2">Chicago, Illinois 60611</p>
              <p className="text-gray-700 mb-2">Phone: 877-837-5950</p>
              <p className="text-gray-700">Email: contact@marqtrademarks.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
