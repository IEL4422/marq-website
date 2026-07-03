import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';

interface StripePaymentFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePaymentForm({ onSuccess, onError }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: window.location.origin + '/confirmation' },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else if (paymentIntent?.status === 'processing') {
        onError('Your payment is being processed. Check your email for confirmation.');
      } else if (paymentIntent?.status === 'requires_payment_method') {
        onError('Your payment was declined. Please try a different payment method.');
      } else {
        onError(`Payment status: ${paymentIntent?.status}. Contact support if needed.`);
      }
    } catch {
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-5">
          <Lock size={15} className="text-navy-600" />
          <span>Your payment information is encrypted and secure</span>
        </div>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-navy-900 hover:bg-navy-800 text-white py-4 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              Processing...
            </>
          ) : 'Complete Payment'}
        </button>
      </div>
    </form>
  );
}
