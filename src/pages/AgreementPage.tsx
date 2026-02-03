import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Calendar } from 'lucide-react';
import { supabase, ServicePackage } from '../lib/supabase';
import SignaturePad from '../components/SignaturePad';

export default function AgreementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage as ServicePackage | undefined;
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [signature, setSignature] = useState('');
  const [signatureType, setSignatureType] = useState<'drawn' | 'typed'>('drawn');
  const [signedDate, setSignedDate] = useState(new Date().toISOString().split('T')[0]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedPackage) {
      navigate('/get-started');
    }
  }, [selectedPackage, navigate]);

  const handleSignatureChange = (sig: string, type: 'drawn' | 'typed') => {
    setSignature(sig);
    setSignatureType(type);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!clientName.trim()) {
      setError('Please enter your full name');
      return;
    }

    if (!clientEmail.trim() || !clientEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (!signature) {
      setError('Please provide your signature');
      return;
    }

    if (!agreedToTerms) {
      setError('Please confirm that you have read and agree to the terms');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      console.log('Submitting agreement...', {
        client_name: clientName,
        client_email: clientEmail,
        package_name: selectedPackage.name
      });

      console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('Anon Key present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);

      const { data, error: insertError } = await supabase
        .from('client_agreements')
        .insert({
          client_name: clientName,
          client_email: clientEmail,
          client_company: clientCompany || null,
          package_name: selectedPackage.name,
          package_price: selectedPackage.price,
          signature_type: signatureType,
          signature_data: signature,
          signed_date: signedDate
        })
        .select()
        .maybeSingle();

      console.log('Insert completed. Result:', { data, insertError });

      if (insertError) {
        console.error('Insert error details:', insertError);
        throw new Error(insertError.message || 'Failed to save agreement');
      }

      if (!data) {
        console.error('No data returned from insert');
        throw new Error('Failed to create agreement record - no data returned');
      }

      console.log('Agreement saved successfully. ID:', data.id);
      console.log('Navigating to payment page...');

      const navigationState = {
        selectedPackage,
        agreementId: data.id,
        clientEmail,
        clientName,
        selectedAddOns: location.state?.selectedAddOns || []
      };

      console.log('Navigation state:', navigationState);

      setTimeout(() => {
        try {
          navigate('/payment-method-selection', {
            state: navigationState,
            replace: false
          });
          console.log('Navigation initiated');
        } catch (navError) {
          console.error('Navigation error:', navError);
          window.location.href = `/payment-method-selection?agreementId=${data.id}&email=${encodeURIComponent(clientEmail)}`;
        }
      }, 100);

    } catch (err) {
      console.error('Error saving agreement:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save agreement. Please try again.';
      setError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Selected Package & Cost Breakdown</h2>
          <div className="mb-4">
            <p className="text-lg font-semibold text-slate-900">{selectedPackage.name}</p>
            <p className="text-slate-600">{selectedPackage.description}</p>
          </div>
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-slate-700 text-sm">
              <span>Total Amount Due</span>
              <span className="text-2xl font-bold text-slate-900">{selectedPackage.price}</span>
            </div>
            <p className="text-xs text-slate-500 italic">
              This includes attorney services and all applicable USPTO filing fees
            </p>
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Client Service Agreement</h1>

        <div className="bg-slate-50 rounded-xl p-8 mb-8 max-h-96 overflow-y-auto border border-slate-200">
          <div className="prose prose-slate max-w-none text-sm leading-relaxed">
            <p className="font-semibold mb-4">
              This Client Service Agreement (Agreement) is entered into by and between Marq Legal LLC, a trademark law firm located at 980 N. Michigan, Ste 1090, Chicago, Illinois 60611 (Firm), and the undersigned client (Client). By purchasing a service package or remitting payment, Client agrees to the terms of this Agreement.
            </p>

            <h3 className="font-bold text-base mt-6 mb-3">1. Scope of Services; Packages</h3>
            <p className="mb-2"><strong>a. Packages.</strong> The Firm offers service packages that may include, depending on the package selected: (i) trademark search; (ii) trademark registration filing and prosecution; (iii) responses to non-substantive and substantive USPTO office actions; and (iv) trademark monitoring. The specific services included in Client's package will be described at purchase or in a confirming email and control over any general descriptions.</p>
            <p className="mb-2"><strong>b. Exclusions.</strong> Unless expressly included in the purchased package or later agreed in writing, services do not include: oppositions, cancellations, appeals to the TTAB or courts, enforcement actions, negotiations or settlements, foreign filings, specimen creation, investigative work, or third-party costs.</p>
            <p className="mb-4"><strong>c. Reliance on Information.</strong> The Firm will rely on information and documents Client provides. Client represents that all submitted information is accurate and complete and will promptly correct any inaccuracies.</p>

            <h3 className="font-bold text-base mt-6 mb-3">2. Attorney–Client Relationship; Privilege; Confidentiality</h3>
            <p className="mb-2"><strong>a. Formation.</strong> An attorney–client relationship forms only upon the Firm's receipt of payment, confirmation of no conflict of interest, and written acknowledgment of acceptance of the engagement. The relationship is limited to the services in Section 1.</p>
            <p className="mb-2"><strong>b. Privilege and Confidentiality.</strong> Communications between Client and the Firm made for the purpose of seeking or providing legal advice are intended to be protected by the attorney–client privilege and the attorney work-product doctrine to the fullest extent of applicable law. Client agrees to preserve privilege by limiting disclosure of privileged communications to those with a need to know and by avoiding sharing such communications with third parties.</p>
            <p className="mb-4"><strong>c. Limited Waivers.</strong> Client authorizes the Firm to make disclosures reasonably necessary to carry out the representation (for example, to the USPTO, vendors, or co-counsel), understanding that some disclosures may affect privilege; the Firm will seek to minimize any waiver consistent with Client's objectives.</p>

            <h3 className="font-bold text-base mt-6 mb-3">3. Fees; Costs; Billing</h3>
            <p className="mb-2"><strong>a. Flat Fees.</strong> Fees for service packages are charged on a flat-fee basis and, unless expressly stated otherwise in writing, are earned upon receipt for the availability, reservation of the Firm's time, and commencement of work. Client acknowledges that the flat fee is not a retainer to be held in trust but constitutes the Firm's property upon payment.</p>
            <p className="mb-2"><strong>b. Costs and Disbursements.</strong> Government fees (including USPTO filing fees), courier, translation, professional search vendor fees, and other third-party costs are separate from the Firm's flat fees unless explicitly stated. Client is responsible for such costs and authorizes the Firm to advance and invoice them or to require prepayment.</p>
            <p className="mb-2"><strong>c. No Refunds; Limited Credits.</strong> Because flat fees are earned upon receipt, payments are generally nonrefundable. In the Firm's sole discretion, the Firm may offer a credit for unused portions of services if Client terminates before substantial completion of the included tasks; any credit will exclude time reasonably expended and nonrefundable costs.</p>
            <p className="mb-4"><strong>d. Changes in Scope.</strong> Requests outside the purchased package will require a separate agreement or written change order and may involve additional flat fees or hourly rates as quoted at that time.</p>

            <h3 className="font-bold text-base mt-6 mb-3">4. Client Responsibilities</h3>
            <p className="mb-4">Client will provide timely, accurate information and documents; respond promptly to communications and USPTO deadlines; make decisions and approvals when requested; and maintain current contact information. The Firm is not responsible for losses caused by Client's delays or omissions.</p>

            <h3 className="font-bold text-base mt-6 mb-3">5. No Guarantee of Outcome</h3>
            <p className="mb-4">The Firm makes no promise or guarantee regarding the outcome of any matter, including availability of a mark, examination results, or registration. Opinions are expressions of professional judgment not guarantees.</p>

            <h3 className="font-bold text-base mt-6 mb-3">6. Term; Termination</h3>
            <p className="mb-4">Either party may terminate the engagement at any time, subject to applicable rules of professional conduct. Upon termination, the Firm will take reasonable steps to protect Client's interests consistent with those rules. Earned fees will not be refunded. Client will remain responsible for accrued costs and fees for additional work requested to transition the matter.</p>

            <h3 className="font-bold text-base mt-6 mb-3">7. Conflicts of Interest</h3>
            <p className="mb-4">The Firm will conduct a conflicts check based on information provided by Client. If a conflict is identified, the Firm may decline or withdraw from representation consistent with professional obligations.</p>

            <h3 className="font-bold text-base mt-6 mb-3">8. Communications; Consent to Email and Electronic Signatures</h3>
            <p className="mb-4">Client consents to the Firm communicating and transmitting documents via email to contact@marqtrademarks.com and other addresses provided by Client, as well as using secure e-signature platforms. Client acknowledges that email may be insecure and agrees the Firm may use it for efficiency unless Client instructs otherwise in writing.</p>

            <h3 className="font-bold text-base mt-6 mb-3">9. File Retention</h3>
            <p className="mb-4">The Firm may maintain files electronically. Absent legal holds, the Firm may destroy files five (5) years after matter closure, retaining essential records as required by law. Client should retain originals of important documents and may request copies before destruction.</p>

            <h3 className="font-bold text-base mt-6 mb-3">10. Ownership of Work Product; Limited License</h3>
            <p className="mb-4">Upon payment in full, Client is licensed to use deliverables created for Client's internal business purposes. The Firm retains ownership of its work product, templates, know-how, and confidential methodologies, and may reuse non-confidential, non-identifying know-how.</p>

            <h3 className="font-bold text-base mt-6 mb-3">11. Government and Third-Party Decisions; Deadlines</h3>
            <p className="mb-4">Client understands that the USPTO and other authorities control examination, deadlines, and fees, which can change without notice. Client authorizes the Firm to calendar and, where appropriate, seek routine extensions at Client's cost to protect the matter, unless Client provides contrary written instructions in time.</p>

            <h3 className="font-bold text-base mt-6 mb-3">12. Limitation of Liability</h3>
            <p className="mb-4">To the maximum extent permitted by law and rules of professional conduct, the Firm's aggregate liability arising out of this engagement is limited to the total fees paid by Client to the Firm for the matter giving rise to the claim. In no event will the Firm be liable for indirect, consequential, incidental, special, or punitive damages.</p>

            <h3 className="font-bold text-base mt-6 mb-3">13. Governing Law; Venue</h3>
            <p className="mb-4">This Agreement will be governed by the laws of the State of Illinois, without regard to conflict-of-law rules. Exclusive venue for any dispute shall lie in state or federal courts located in Cook County, Illinois, and the parties consent to personal jurisdiction there.</p>

            <h3 className="font-bold text-base mt-6 mb-3">14. Entire Agreement; Amendments; Severability</h3>
            <p className="mb-4">This Agreement constitutes the entire agreement regarding the subject matter and supersedes prior discussions. Any amendment must be in a writing signed by the Firm and Client. If any term is held unenforceable, the remainder will remain in effect and the unenforceable term will be enforced to the maximum extent permitted.</p>

            <h3 className="font-bold text-base mt-6 mb-3">15. Notices</h3>
            <p className="mb-4">Notices to the Firm shall be sent to Marq Legal LLC, 980 N. Michigan, Ste 1090, Chicago, Illinois 60611, or contact@marqtrademarks.com. Notices to Client will be sent to the contact information provided by Client.</p>

            <h3 className="font-bold text-base mt-6 mb-3">16. Acceptance</h3>
            <p>By purchasing a package, signing below, or authorizing the Firm to proceed, Client acknowledges reading, understanding, and agreeing to this Agreement.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Client Information</h2>

            <div>
              <label htmlFor="clientName" className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="clientEmail" className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="clientEmail"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="clientCompany" className="block text-sm font-semibold text-slate-700 mb-2">
                Company Name (Optional)
              </label>
              <input
                type="text"
                id="clientCompany"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                placeholder="Company Inc."
              />
            </div>

            <div>
              <label htmlFor="signedDate" className="block text-sm font-semibold text-slate-700 mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="signedDate"
                  value={signedDate}
                  onChange={(e) => setSignedDate(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800 focus:border-transparent"
                  required
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Signature <span className="text-red-500">*</span>
              </label>
              <SignaturePad onSignatureChange={handleSignatureChange} />
            </div>

            <div className="pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 text-slate-800 border-slate-300 rounded focus:ring-slate-800"
                />
                <span className="text-sm text-slate-700">
                  I confirm that I have read, understand, and agree to the terms and conditions outlined in the Client Service Agreement above.
                </span>
              </label>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Accept and Continue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
