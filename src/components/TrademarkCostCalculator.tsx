import { useState } from 'react';
import { Calculator, DollarSign } from 'lucide-react';

export default function TrademarkCostCalculator() {
  const [filingType, setFilingType] = useState<'teas-plus' | 'teas-standard'>('teas-plus');
  const [numClasses, setNumClasses] = useState(1);
  const [useAttorney, setUseAttorney] = useState(true);
  const [attorneyTier, setAttorneyTier] = useState<'budget' | 'mid' | 'premium'>('mid');
  const [includeSearch, setIncludeSearch] = useState(true);

  const calculateCost = () => {
    const usptoFees = filingType === 'teas-plus' ? 250 : 350;
    const totalUsptoFees = usptoFees * numClasses;

    let attorneyFees = 0;
    if (useAttorney) {
      const perClassFees = {
        budget: 600,
        mid: 1250,
        premium: 3500
      };
      attorneyFees = perClassFees[attorneyTier] * numClasses;
    }

    const searchFee = includeSearch ? 500 : 0;

    const total = totalUsptoFees + attorneyFees + searchFee;
    const min = total * 0.85;
    const max = total * 1.15;

    return {
      usptoFees: totalUsptoFees,
      attorneyFees,
      searchFee,
      total,
      min: Math.round(min),
      max: Math.round(max)
    };
  };

  const costs = calculateCost();

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 my-8 border border-amber-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-amber-500 rounded-full p-3">
          <Calculator className="text-white" size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Trademark Cost Calculator
        </h3>
      </div>

      <p className="text-slate-700 mb-6">
        Use this interactive calculator to estimate your trademark registration costs based on your specific needs.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Filing Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
                <input
                  type="radio"
                  name="filing"
                  value="teas-plus"
                  checked={filingType === 'teas-plus'}
                  onChange={(e) => setFilingType(e.target.value as 'teas-plus')}
                  className="w-4 h-4 text-amber-500"
                />
                <div>
                  <div className="font-medium text-slate-900">TEAS Plus - $250/class</div>
                  <div className="text-sm text-slate-600">Pre-approved descriptions</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
                <input
                  type="radio"
                  name="filing"
                  value="teas-standard"
                  checked={filingType === 'teas-standard'}
                  onChange={(e) => setFilingType(e.target.value as 'teas-standard')}
                  className="w-4 h-4 text-amber-500"
                />
                <div>
                  <div className="font-medium text-slate-900">TEAS Standard - $350/class</div>
                  <div className="text-sm text-slate-600">Custom descriptions</div>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Number of Classes: {numClasses}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={numClasses}
              onChange={(e) => setNumClasses(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-xs text-slate-600 mt-1">
              <span>1 class</span>
              <span>5 classes</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
              <input
                type="checkbox"
                checked={includeSearch}
                onChange={(e) => setIncludeSearch(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <div>
                <div className="font-medium text-slate-900">Include Professional Search</div>
                <div className="text-sm text-slate-600">+$500 (Highly Recommended)</div>
              </div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-3 mb-3">
              <input
                type="checkbox"
                checked={useAttorney}
                onChange={(e) => setUseAttorney(e.target.checked)}
                className="w-4 h-4 text-amber-500 rounded"
              />
              <span className="text-sm font-semibold text-slate-900">Hire Attorney (Recommended)</span>
            </label>

            {useAttorney && (
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="radio"
                    name="attorney"
                    value="budget"
                    checked={attorneyTier === 'budget'}
                    onChange={(e) => setAttorneyTier(e.target.value as 'budget')}
                    className="w-4 h-4 text-amber-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Budget - $600/class</div>
                    <div className="text-sm text-slate-600">Basic services</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="radio"
                    name="attorney"
                    value="mid"
                    checked={attorneyTier === 'mid'}
                    onChange={(e) => setAttorneyTier(e.target.value as 'mid')}
                    className="w-4 h-4 text-amber-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Mid-Tier - $1,250/class</div>
                    <div className="text-sm text-slate-600">Full service (Recommended)</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-slate-200 cursor-pointer hover:border-amber-400 transition-colors">
                  <input
                    type="radio"
                    name="attorney"
                    value="premium"
                    checked={attorneyTier === 'premium'}
                    onChange={(e) => setAttorneyTier(e.target.value as 'premium')}
                    className="w-4 h-4 text-amber-500"
                  />
                  <div>
                    <div className="font-medium text-slate-900">Premium - $3,500/class</div>
                    <div className="text-sm text-slate-600">Comprehensive IP services</div>
                  </div>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border-2 border-amber-300 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="text-amber-600" size={24} />
          <h4 className="text-lg font-bold text-slate-900">Estimated Total Cost</h4>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600">USPTO Filing Fees ({numClasses} {numClasses === 1 ? 'class' : 'classes'}):</span>
            <span className="font-semibold text-slate-900">${costs.usptoFees.toLocaleString()}</span>
          </div>
          {useAttorney && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Attorney Fees:</span>
              <span className="font-semibold text-slate-900">${costs.attorneyFees.toLocaleString()}</span>
            </div>
          )}
          {includeSearch && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Professional Search:</span>
              <span className="font-semibold text-slate-900">${costs.searchFee.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-slate-200 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-900">Estimated Range:</span>
            <span className="text-2xl font-bold text-amber-600">
              ${costs.min.toLocaleString()} - ${costs.max.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            * This estimate doesn't include potential office action responses ($500-$1,500) or other additional fees.
          </p>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-700 mb-3">
          Ready to protect your trademark? Get started with a professional trademark attorney today.
        </p>
        <button
          onClick={() => window.location.href = '/get-started'}
          className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors inline-flex items-center gap-2"
        >
          Get Started Now
        </button>
      </div>
    </div>
  );
}
