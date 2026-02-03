import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Minus, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { ServicePackage } from '../lib/supabase';

export default function AddOnSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPackage = location.state?.selectedPackage as ServicePackage | undefined;

  useEffect(() => {
    if (!selectedPackage) {
      navigate('/get-started');
    }
  }, [selectedPackage, navigate]);
  const [additionalClasses, setAdditionalClasses] = useState(0);

  const CLASS_PRICE = 350; // USPTO filing fee per additional class
  const USPTO_BASE_FEE = 350; // USPTO filing fee for first class

  const basePrice = parseFloat(selectedPackage.price.replace('$', '').replace(',', ''));
  const usptoBaseFee = (selectedPackage.name === 'Base Package' || selectedPackage.name === 'Premium Package' || selectedPackage.name === 'Amazon Brand Registry Package') ? USPTO_BASE_FEE : 0;
  const classesTotal = additionalClasses * CLASS_PRICE;
  const totalPrice = basePrice + usptoBaseFee + classesTotal;

  const handleContinue = () => {
    if (!selectedPackage) return;

    const addOns = [];
    if (additionalClasses > 0) {
      addOns.push(`${additionalClasses} Additional ${additionalClasses === 1 ? 'Class' : 'Classes'} ($${additionalClasses * 350})`);
    }

    const updatedPackage: ServicePackage = {
      ...selectedPackage,
      price: `$${totalPrice.toLocaleString()}`,
      description: addOns.length > 0
        ? `${selectedPackage.description} + ${addOns.join(' + ')}`
        : selectedPackage.description
    };

    navigate('/agreement', { state: { selectedPackage: updatedPackage } });
  };

  if (!selectedPackage) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/get-started')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Pricing
        </button>

        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Customize Your Package</h1>
          <p className="text-xl text-slate-600">
            Add optional services to enhance your trademark protection
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Selected Package</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold">{selectedPackage.name}</p>
              <p className="text-slate-300">{selectedPackage.description}</p>
            </div>
            <div className="text-3xl font-bold">{selectedPackage.price}</div>
          </div>
        </div>

        {selectedPackage.name === 'Premium Package' && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Check className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Priority Filing Included</h3>
                <p className="text-slate-700">
                  Your trademark application will be prepared and filed with the USPTO within 1 business day at no additional cost. This premium service is included in your package.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6 mb-8">
          <div className="bg-white border-2 border-slate-200 rounded-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Additional Classes</h3>
              <p className="text-slate-600 mb-4">
                Each additional class of goods or services beyond the first. Most trademarks start with one class, but some businesses need multiple classes for comprehensive protection.
              </p>
              <p className="text-2xl font-bold text-slate-900">$350 per class</p>
              <p className="text-sm text-slate-500 mt-2">(USPTO filing fee per additional class)</p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdditionalClasses(Math.max(0, additionalClasses - 1))}
                disabled={additionalClasses === 0}
                className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus size={20} />
              </button>

              <div className="flex-grow text-center">
                <div className="text-3xl font-bold text-slate-900">{additionalClasses}</div>
                <div className="text-sm text-slate-600">
                  {additionalClasses === 0 ? 'No additional classes' : `${additionalClasses} additional ${additionalClasses === 1 ? 'class' : 'classes'}`}
                </div>
              </div>

              <button
                onClick={() => setAdditionalClasses(additionalClasses + 1)}
                className="bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-300">
            <span className="text-lg font-semibold text-slate-900">Attorney Services</span>
            <span className="text-xl font-bold text-slate-900">{selectedPackage.price}</span>
          </div>

          {usptoBaseFee > 0 && (
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-300">
              <span className="text-slate-700">USPTO Filing Fee (1 class)</span>
              <span className="font-semibold text-slate-900">$350</span>
            </div>
          )}

          {additionalClasses > 0 && (
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-amber-300">
              <span className="text-slate-700">USPTO Fee - {additionalClasses} Additional {additionalClasses === 1 ? 'Class' : 'Classes'}</span>
              <span className="font-semibold text-slate-900">${classesTotal.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t-2 border-amber-400">
            <span className="text-2xl font-bold text-slate-900">Total</span>
            <span className="text-3xl font-bold text-slate-900">${totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleContinue}
            className="flex-grow bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
          >
            Continue to Agreement
            <ArrowRight size={20} />
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          You can review all details before signing the agreement
        </p>
      </div>
    </div>
  );
}
