import { Check, Shield, Crown, Package, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ServicePackage } from '../lib/supabase';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function PackageSelectionPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.pricing);
  }, []);

  const handleSelectPackage = (pkg: ServicePackage) => {
    navigate('/add-ons', { state: { selectedPackage: pkg } });
  };

  const packages = [
    {
      name: 'Trademark Registration Package',
      price: '$499',
      icon: Shield,
      description: 'Complete trademark registration with comprehensive support',
      features: [
        'Comprehensive trademark search',
        'Client Portal Access',
        'USPTO application preparation & filing',
        'Unlimited attorney support',
        'Application monitoring',
        'Post-approval guidance & certificate support',
        'Priority filing - expedited processing',
        'Amazon Brand Registry enrollment guide'
      ],
      cta: 'Select Package',
      popular: true,
      color: 'amber'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Select Your Package</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the trademark registration package that best fits your needs
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center px-4">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border-2 border-amber-500 relative p-6 sm:p-8 md:p-10 flex flex-col max-w-xl w-full"
              >
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-2">
                  <span className="bg-amber-500 text-white px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap">
                    Professional Package
                  </span>
                </div>
                <div className="mb-6 sm:mb-8 text-center">
                  <pkg.icon className="text-amber-600 mb-4 sm:mb-6 mx-auto" size={48} />
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-3 sm:mb-4 whitespace-nowrap">Trademark Registration</h3>
                  <div className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 sm:mb-3">
                    {pkg.price}
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base">{pkg.description}</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">Plus USPTO filing fee ($350 per class)</p>
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 flex-grow">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                      <Check className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-slate-700 text-sm sm:text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPackage({ name: pkg.name, price: pkg.price, description: pkg.description })}
                  className="w-full py-3 sm:py-4 rounded-lg font-semibold transition-all text-base sm:text-lg bg-amber-500 text-white hover:bg-amber-600 shadow-md hover:shadow-xl"
                >
                  {pkg.cta}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">
              Available in all 50 states • Federal trademark protection • Expert legal team
            </p>
            <p className="text-sm text-slate-500">
              Plus required USPTO filing fee of $350 per class • Add-on: Additional Classes ($350 USPTO fee per class)
            </p>
          </div>

          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="bg-amber-500 rounded-xl p-3 flex-shrink-0">
                  <DollarSign className="text-white" size={28} />
                </div>
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">We Proudly Offer Payment Plans</h3>
                  <p className="text-slate-700 text-lg leading-relaxed mb-4">
                    Make trademark protection more accessible with our flexible payment plan options. Spread your investment over time with a small 5% fee.
                  </p>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Check className="text-green-600 flex-shrink-0" size={20} />
                    <span className="font-medium">Available for all trademark registration packages</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Questions About Pricing?</h2>
          <p className="text-xl text-slate-300 mb-8">
            View our full pricing page for detailed information about all available services
          </p>
          <button onClick={() => navigate('/pricing')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
            View Full Pricing
          </button>
          <p className="text-sm text-slate-400 mt-6">
            Questions? Contact us at contact@marqtrademarks.com
          </p>
        </div>
      </section>
    </div>
  );
}
