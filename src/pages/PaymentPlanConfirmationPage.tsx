import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Mail, AlertCircle } from 'lucide-react';

export default function PaymentPlanConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const clientEmail = location.state?.clientEmail;
  const totalAmount = location.state?.totalAmount;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Payment Plan Request Submitted!
          </h1>
          <p className="text-xl text-slate-600">
            Your payment plan request has been received and is being processed.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-amber-500 rounded-full p-3 flex-shrink-0">
              <Mail className="text-white" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Check Your Email</h2>
              <p className="text-slate-700 text-lg">
                You will receive an email at <span className="font-semibold text-slate-900">{clientEmail}</span> with instructions to sign up for your payment plan.
              </p>
            </div>
          </div>

          {totalAmount && (
            <div className="bg-white rounded-lg p-4 mb-6 border border-amber-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">Payment Plan Total:</span>
                <span className="text-2xl font-bold text-slate-900">${totalAmount}</span>
              </div>
              <p className="text-sm text-slate-600 mt-2">Includes 5% convenience fee</p>
            </div>
          )}

          <div className="bg-amber-100 border border-amber-300 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-700 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-amber-900 font-semibold mb-1">Don't see the email?</p>
                <p className="text-amber-800 text-sm">
                  Please check your spam or junk folder. The email should arrive within the next few minutes.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-8 mb-8 border border-slate-200">
          <h3 className="text-xl font-bold text-slate-900 mb-4">What Happens Next?</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Email Sent</h4>
                <p className="text-slate-600 text-sm">
                  You'll receive an email with a secure link to set up your payment plan.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Complete Sign-Up</h4>
                <p className="text-slate-600 text-sm">
                  Follow the instructions in the email to complete your payment plan enrollment.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">Start Your Service</h4>
                <p className="text-slate-600 text-sm">
                  Once your payment plan is confirmed, we'll begin working on your trademark immediately.
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
