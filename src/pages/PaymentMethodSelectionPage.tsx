import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Calendar, ArrowRight, DollarSign, Check } from 'lucide-react';
import { ServicePackage } from '../lib/supabase';

export default function PaymentMethodSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage as ServicePackage | undefined;
  const agreementId = location.state?.agreementId;
  const clientEmail = location.state?.clientEmail;
  const clientName = location.state?.clientName;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!selectedPackage || !agreementId || !clientEmail) {
      navigate('/get-started');
    }
  }, [selectedPackage, agreementId, clientEmail, navigate]);

  const calculateTotalAmount = () => {
    const packagePrice = parseFloat(selectedPackage?.price?.replace('$', '').replace(',', '') || '0');
    const addOns = location.state?.selectedAddOns || [];
    const addOnsTotal = addOns.reduce((sum: number, addon: any) => {
      return sum + parseFloat(addon.price.replace('$', '').replace(',', ''));
    }, 0);
    return packagePrice + addOnsTotal;
  };

  const totalAmount = calculateTotalAmount();
  const paymentPlanAmount = totalAmount * 1.05;

  const handlePayInFull = () => {
    navigate('/payment', {
      state: {
        selectedPackage,
        agreementId,
        clientEmail,
        selectedAddOns: location.state?.selectedAddOns || []
      }
    });
  };

  const handlePaymentPlan = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const nameParts = (clientName || '').split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-payment-plan-webhook`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: clientEmail,
          fullAmount: paymentPlanAmount.toFixed(2),
          agreementId,
          packageName: selectedPackage?.name
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit payment plan request');
      }

      navigate('/payment-plan-confirmation', {
        state: {
          clientEmail,
          totalAmount: paymentPlanAmount.toFixed(2)
        }
      });
    } catch (err) {
      console.error('Error submitting payment plan:', err);
      setError('Failed to submit payment plan request. Please try again or contact support.');
      setIsSubmitting(false);
    }
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Payment Method
          </h1>
          <p className="text-xl text-slate-600">
            Select how you'd like to complete your payment
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-700 font-medium">{selectedPackage.name}</span>
              <span className="text-slate-900 font-bold">{selectedPackage.price}</span>
            </div>
            {location.state?.selectedAddOns?.map((addon: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-slate-700">{addon.name}</span>
                <span className="text-slate-900 font-semibold">{addon.price}</span>
              </div>
            ))}
            <div className="border-t border-amber-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-900 font-bold text-lg">Total Amount</span>
                <span className="text-slate-900 font-bold text-2xl">${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <button
            onClick={handlePayInFull}
            disabled={isSubmitting}
            className="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-amber-500 hover:shadow-xl transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-xl p-3">
                <CreditCard className="text-white" size={32} />
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-amber-500 transition-colors" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Pay in Full</h3>
            <p className="text-slate-600 mb-4">Complete your payment now with a credit card</p>
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <div className="text-3xl font-bold text-slate-900">${totalAmount.toFixed(2)}</div>
              <div className="text-sm text-slate-600 mt-1">One-time payment</div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="text-green-600 flex-shrink-0" size={18} />
                <span className="text-sm">Instant processing</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="text-green-600 flex-shrink-0" size={18} />
                <span className="text-sm">No additional fees</span>
              </li>
            </ul>
          </button>

          <button
            onClick={handlePaymentPlan}
            disabled={isSubmitting}
            className="group bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-amber-500 hover:shadow-xl transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-3">
                <Calendar className="text-white" size={32} />
              </div>
              <ArrowRight className="text-slate-400 group-hover:text-amber-500 transition-colors" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Payment Plan</h3>
            <p className="text-slate-600 mb-4">Spread payments over time with flexible terms</p>
            <div className="bg-amber-50 rounded-lg p-4 mb-4 border border-amber-200">
              <div className="text-3xl font-bold text-slate-900">${paymentPlanAmount.toFixed(2)}</div>
              <div className="text-sm text-amber-700 mt-1 font-medium">Includes 5% convenience fee</div>
            </div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="text-green-600 flex-shrink-0" size={18} />
                <span className="text-sm">Flexible payment schedule</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <Check className="text-green-600 flex-shrink-0" size={18} />
                <span className="text-sm">Easy online setup</span>
              </li>
            </ul>
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <DollarSign className="text-amber-500 mx-auto mb-3" size={40} />
          <h3 className="font-bold text-slate-900 mb-2">Need Help Deciding?</h3>
          <p className="text-slate-600 mb-4">
            Our team is here to help you choose the best payment option for your situation.
          </p>
          <p className="text-slate-700 text-sm">
            <span className="font-semibold">Email:</span> contact@marqtrademarks.com
          </p>
        </div>
      </div>
    </div>
  );
}
