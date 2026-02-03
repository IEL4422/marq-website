import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/confirmation',
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        onError(error.message || 'Payment failed');
      } else if (paymentIntent) {
        console.log('Payment intent status:', paymentIntent.status);

        if (paymentIntent.status === 'succeeded') {
          try {
            await supabase
              .from('payments')
              .update({
                status: 'succeeded',
                payment_method_type: paymentIntent.payment_method_types?.[0] || 'card'
              })
              .eq('stripe_payment_intent_id', paymentIntent.id);
          } catch (dbError) {
            console.error('Database update error:', dbError);
          }

          onSuccess();
        } else if (paymentIntent.status === 'processing') {
          onError('Your payment is being processed. Please check your email for confirmation.');
        } else if (paymentIntent.status === 'requires_payment_method') {
          onError('Your payment was declined. Please try a different payment method.');
        } else {
          onError(`Payment status: ${paymentIntent.status}. Please contact support if you have questions.`);
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />

      <div className="pt-6 border-t border-slate-200">
        <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
          <Lock size={16} />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="w-full bg-slate-900 text-white py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              Complete Payment
            </>
          )}
        </button>
      </div>
    </form>
  );
}
