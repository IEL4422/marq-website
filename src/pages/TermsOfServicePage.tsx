import { useEffect } from 'react';
import { updatePageSEO } from '../utils/seo';

export default function TermsOfServicePage() {
  useEffect(() => {
    updatePageSEO({
      title: 'Terms of Service | Marq Legal',
      description: 'Review the terms and conditions for using Marq Legal\'s trademark registration and legal services.',
      canonical: 'https://marqtrademarks.com/terms-of-service',
      keywords: 'terms of service, legal terms, user agreement, trademark services agreement'
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Effective Date:</strong> December 16, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using Marq Legal LLC's services, you agree to be bound by these Terms of Service
              and all applicable laws and regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
            <p className="text-gray-700 mb-4">
              Marq Legal LLC provides trademark registration, trademark search, office action response,
              trademark monitoring, and related legal services. Our services are subject to availability
              and may be modified, suspended, or discontinued at any time without notice.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Attorney-Client Relationship</h2>
            <p className="text-gray-700 mb-4">
              An attorney-client relationship is formed only upon execution of a formal engagement
              agreement and payment of required fees. Information provided through our website or
              initial consultations does not constitute legal advice and does not create an
              attorney-client relationship.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-700 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
              <li>Provide accurate, complete, and current information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Cooperate in providing necessary information for trademark applications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Fees and Payment</h2>
            <p className="text-gray-700 mb-4">
              All fees are due upon execution of the engagement agreement unless otherwise specified.
              Fees are non-refundable except as required by law or professional conduct rules.
              Government filing fees are separate from our service fees and are not refundable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. No Guarantee of Results</h2>
            <p className="text-gray-700 mb-4">
              While we strive to provide excellent service, we cannot guarantee any specific outcome
              regarding trademark applications or other legal matters. Trademark registration is subject
              to USPTO review and approval, which is beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the maximum extent permitted by law, Marq Legal LLC shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of or related to your
              use of our services. Our total liability shall not exceed the amount paid by you for the
              specific service giving rise to the claim.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All content on this website, including text, graphics, logos, and software, is the property
              of Marq Legal LLC or its licensors and is protected by copyright, trademark, and other
              intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to terminate or suspend access to our services immediately, without
              prior notice or liability, for any reason, including breach of these Terms of Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700 mb-4">
              Any disputes arising out of or related to these Terms of Service shall be resolved through
              binding arbitration in accordance with the rules of the American Arbitration Association.
              The arbitration shall take place in Chicago, Illinois.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-700 mb-4">
              These Terms of Service shall be governed by and construed in accordance with the laws of
              the State of Illinois, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms of Service at any time. We will notify users of
              any material changes by posting the new terms on this page. Your continued use of our
              services after such modifications constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
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
