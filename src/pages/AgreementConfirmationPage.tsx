import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CheckCircle, Mail, FileText } from 'lucide-react';
import { trackConversion } from '../utils/tracking';
import { loadStripe } from '@stripe/stripe-js';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function AgreementConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

      if (paymentIntentClientSecret) {
        setIsVerifying(true);
        try {
          const stripe = await stripePromise;
          if (!stripe) {
            throw new Error('Stripe failed to load');
          }

          const { paymentIntent, error } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);

          if (error) {
            console.error('Error retrieving payment intent:', error);
            setVerificationError('There was an issue verifying your payment. Please contact support.');
          } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            console.log('Payment verified successfully');
            trackConversion('ads_conversion_Purchase_1');
          } else {
            console.warn('Payment intent status:', paymentIntent?.status);
            setVerificationError(`Payment status: ${paymentIntent?.status}. Please contact support if you have questions.`);
          }
        } catch (err) {
          console.error('Error verifying payment:', err);
          setVerificationError('Failed to verify payment. Please contact support.');
        } finally {
          setIsVerifying(false);
        }
      } else {
        trackConversion('ads_conversion_Purchase_1');
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-xl text-slate-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {verificationError && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <p className="text-amber-900">{verificationError}</p>
          </div>
        )}

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {verificationError ? 'Payment Processing' : 'Agreement Signed Successfully!'}
          </h1>
          <p className="text-xl text-slate-600">
            Thank you for choosing Marq Legal Services. We're excited to help protect your brand.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-6">What Happens Next?</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-500 rounded-full p-2 flex-shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">1. Confirmation Email</h3>
                <p className="text-slate-300">
                  You'll receive a confirmation email with a copy of your signed agreement and next steps within the next few minutes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500 rounded-full p-2 flex-shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">2. Attorney Assignment</h3>
                <p className="text-slate-300">
                  One of our experienced trademark attorneys will be assigned to your case within 24 hours and will reach out to schedule your initial consultation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-500 rounded-full p-2 flex-shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">3. Begin Your Trademark Journey</h3>
                <p className="text-slate-300">
                  We'll start working on your comprehensive trademark search and guide you through every step of the registration process.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-6 mb-8 border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-3">Need Help?</h3>
          <p className="text-slate-600 mb-4">
            If you have any questions or need immediate assistance, please don't hesitate to contact us.
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-slate-700">
              <span className="font-semibold">Email:</span> contact@marqtrademarks.com
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Phone:</span> +1-555-TRADEMARK
            </p>
            <p className="text-slate-700">
              <span className="font-semibold">Address:</span> 980 N. Michigan, Ste 1090, Chicago, Illinois 60611
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
}
