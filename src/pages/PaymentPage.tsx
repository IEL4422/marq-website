import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Lock } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { payments } from '../lib/api';

interface ServicePackage { name: string; price: string; description: string; }
import StripePaymentForm from '../components/StripePaymentForm';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);
  const agreementIdFromUrl = urlParams.get('agreementId');
  const emailFromUrl = urlParams.get('email');

  const [selectedPackage] = useState<ServicePackage | undefined>(
    location.state?.selectedPackage as ServicePackage | undefined
  );
  const [clientEmail] = useState<string | undefined>(
    location.state?.clientEmail || emailFromUrl || undefined
  );
  const [agreementId] = useState<string | undefined>(
    location.state?.agreementId || agreementIdFromUrl || undefined
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('PaymentPage loaded with state:', {
    hasSelectedPackage: !!selectedPackage,
    selectedPackage,
    clientEmail,
    agreementId,
    locationState: location.state,
    urlParams: { agreementIdFromUrl, emailFromUrl }
  });

  // Agreement data comes from navigation state; fallback redirects to start
  useEffect(() => {
    if (!selectedPackage && !agreementId) {
      navigate('/get-started');
    }
  }, [selectedPackage, agreementId, navigate]);

  useEffect(() => {
    if (!selectedPackage) {
      console.log('Waiting for package data...');
      return;
    }

    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
      console.error('VITE_STRIPE_PUBLISHABLE_KEY is not set');
      setError('Payment system is not configured. Please contact support.');
      setIsLoading(false);
      return;
    }

    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const priceString = selectedPackage.price.replace(/[^0-9.]/g, '');
        const baseAmount = parseFloat(priceString);

        if (isNaN(baseAmount) || baseAmount <= 0) {
          throw new Error('Invalid package price');
        }

        const amount = Math.round(baseAmount * 100);

        console.log('Creating payment intent with:', {
          amount,
          currency: 'usd',
          clientEmail: clientEmail || 'guest@example.com',
          agreementId: agreementId || null,
        });

        const data = await payments.createIntent({
          amount,
          clientEmail: clientEmail || 'guest@example.com',
          clientName: location.state?.clientName,
          packageName: selectedPackage.name,
        });

        if (!data.clientSecret) throw new Error('Invalid payment response - missing client secret');
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error('Error in createPaymentIntent:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [selectedPackage, clientEmail, agreementId, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      await fetch('/api/notifications/zapier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'payment_completed',
          data: { clientEmail, packageName: selectedPackage?.name, agreementId },
        }),
      });
    } catch {
      // non-critical
    }
    navigate('/confirmation');
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Complete Your Payment</h1>
          <p className="text-xl text-slate-600">
            Secure payment processing with bank-level encryption
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
                  <p className="text-slate-600">Initializing secure payment...</p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-900 mb-3">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && !error && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={{
                    clientSecret,
                    appearance: {
                      theme: 'stripe',
                      variables: {
                        colorPrimary: '#0f172a',
                        colorBackground: '#ffffff',
                        colorText: '#0f172a',
                        colorDanger: '#ef4444',
                        fontFamily: 'system-ui, sans-serif',
                        borderRadius: '8px',
                      },
                    },
                  }}
                >
                  <StripePaymentForm
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-slate-400">
              <Lock size={16} />
              <span className="text-sm">256-bit SSL encryption</span>
              <span className="text-sm">PCI DSS compliant</span>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <div className="font-semibold text-slate-900 mb-1">{selectedPackage.name}</div>
                  <div className="text-sm text-slate-600">{selectedPackage.description}</div>
                </div>
              </div>

              {(() => {
                const priceString = selectedPackage.price.replace(/[^0-9.]/g, '');
                const totalPrice = parseFloat(priceString);

                const hasAdditionalClasses = selectedPackage.description.includes('Additional Class');
                const additionalClassMatch = selectedPackage.description.match(/(\d+)\s+Additional\s+(?:Class|Classes)\s+\(\$(\d+)\)/);
                const additionalClassesCost = additionalClassMatch ? parseFloat(additionalClassMatch[2]) : 0;

                const isTrademarkRegistration = selectedPackage.name.toLowerCase().includes('trademark registration') ||
                                                selectedPackage.name.toLowerCase().includes('complete registration') ||
                                                selectedPackage.name.toLowerCase().includes('pro package');

                const basePackagePrice = totalPrice - additionalClassesCost;
                const showBreakdown = isTrademarkRegistration && basePackagePrice >= 1000;

                return (
                  <>
                    {showBreakdown && (
                      <div className="space-y-2 mb-4 pb-4 border-b border-slate-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Attorney Services</span>
                          <span className="text-slate-900 font-medium">${(basePackagePrice - 350).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">USPTO Filing Fee (1 class)</span>
                          <span className="text-slate-900 font-medium">$350.00</span>
                        </div>
                        {hasAdditionalClasses && additionalClassesCost > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">{additionalClassMatch ? `USPTO Fee - ${additionalClassMatch[1]} Additional ${parseInt(additionalClassMatch[1]) === 1 ? 'Class' : 'Classes'}` : 'Additional Classes'}</span>
                            <span className="text-slate-900 font-medium">${additionalClassesCost.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-bold text-slate-900">Total Due</span>
                      <span className="text-2xl font-bold text-slate-900">${totalPrice.toFixed(2)}</span>
                    </div>
                  </>
                );
              })()}

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <Check className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-green-900 text-sm mb-1">
                      Protected Purchase
                    </div>
                    <div className="text-xs text-green-800">
                      Your payment is secure and your service is guaranteed. Start your trademark protection today.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
