import { Check, Shield, Zap, Crown, Eye, Package, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { serviceSchema, faqSchema, organizationSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import FAQSection, { pricingFAQs } from '../components/FAQSection';
import { ServicePackage } from '../lib/supabase';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function PricingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.pricing);
  }, []);

  const handleGetStarted = (pkg: ServicePackage, needsAddOns: boolean) => {
    if (pkg.name === 'Trademark Search') {
      navigate('/trademark-search-request');
    } else if (pkg.name === 'Procedural Office Action Response' || pkg.name === 'Substantive Office Action Response') {
      navigate('/office-action-request', { state: { serviceType: pkg.name } });
    } else if (pkg.name === 'Cease and Desist Letter') {
      navigate('/cease-and-desist-request');
    } else {
      navigate('/get-started', { state: { package: pkg.name } });
    }
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
      cta: 'Get Started',
      popular: true,
      color: 'amber',
      needsAddOns: true
    }
  ];

  const additionalServices = [
    {
      name: 'Trademark Monitoring',
      price: '$149/year',
      description: 'Annual monitoring service to watch for potential conflicts and protect your registered trademark from infringement',
      needsAddOns: false
    },
    {
      name: 'Cease and Desist Letter',
      price: '$499',
      description: 'Professional attorney-drafted letter to stop trademark infringement and protect your brand rights',
      needsAddOns: false
    },
    {
      name: 'Procedural Office Action Response',
      price: '$399',
      description: 'Response to technical issues like specimen problems or description clarifications',
      needsAddOns: false
    },
    {
      name: 'Substantive Office Action Response',
      price: '$799',
      description: 'Response to complex legal issues like likelihood of confusion or descriptiveness',
      needsAddOns: false
    }
  ];

  const faqs = [
    {
      question: 'What is included in the $499 Trademark Registration Package?',
      answer: 'Our comprehensive $499 package includes everything you need for professional trademark registration: comprehensive trademark search, client portal access, USPTO application preparation and filing, unlimited attorney support, application monitoring, post-approval guidance and certificate support, priority filing with expedited processing, and Amazon Brand Registry enrollment guide. The USPTO filing fee of $350 per class is separate.'
    },
    {
      question: 'Are USPTO fees included in the $499 price?',
      answer: 'No, USPTO filing fees are separate from our attorney fees. Our attorney fee is $499, which covers all legal services. The USPTO requires a $350 filing fee per class, which is paid directly to the government. Each additional class requires an additional $350 USPTO filing fee.'
    },
    {
      question: 'How many classes do I need?',
      answer: 'Most businesses start with one class covering their primary goods or services. Our package is $499 plus the required USPTO filing fee of $350 per class. Each additional class requires an additional $350 USPTO filing fee. Our attorneys will help you determine which classes apply to your business during the consultation.'
    },
    {
      question: 'How quickly will my application be filed?',
      answer: 'Your application will be filed with priority processing, typically within 2-3 business days. Note that USPTO examination times are set by the government and typically take 8-12 months regardless of filing speed.'
    },
    {
      question: 'Does this package work for Amazon Brand Registry?',
      answer: 'Yes! Our package includes an Amazon Brand Registry enrollment guide and Amazon-specific documentation support. Amazon Brand Registry accepts filed pending trademark applications, so you can start enrollment immediately after your application is submitted to the USPTO.'
    },
    {
      question: 'What if I receive an office action from the USPTO?',
      answer: 'Office actions are additional legal work required if the USPTO raises issues with your application. Procedural office action responses (technical issues) are $399. Substantive office action responses (complex legal arguments about likelihood of confusion or descriptiveness) are $799. These are only needed if the USPTO issues an office action.'
    },
    {
      question: 'Do you offer payment plans?',
      answer: 'Yes! We offer flexible payment plans for our trademark registration package. Spread your investment over time with a small 5% fee. Payment plans are available during checkout.'
    },
    {
      question: 'What is included in the Cease and Desist Letter service?',
      answer: 'Our $499 cease and desist letter service includes a professionally drafted attorney letter documenting your intellectual property rights, detailing the infringement, citing relevant legal authorities, demanding specific action, and outlining potential consequences. We handle evidence gathering, strategic drafting, delivery, and initial follow-up communication.'
    }
  ];

  const servicesSchemas = packages.map(pkg => serviceSchema({
    name: pkg.name,
    description: pkg.description,
    price: pkg.price.replace('$', '').replace(',', ''),
    url: `https://marqtrademarks.com/pricing#${pkg.name.toLowerCase()}`
  }));

  const faqSchemaData = faqSchema(faqs);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, offerCatalogSchema, ...servicesSchemas, faqSchemaData]} />
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Transparent, Flat-Fee Pricing</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Professional trademark services with clear pricing. No hourly billing, no surprises.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 max-w-4xl mx-auto">
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
                  onClick={() => handleGetStarted({ name: pkg.name, price: pkg.price, description: pkg.description }, pkg.needsAddOns)}
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
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Additional Services</h2>
            <p className="text-xl text-slate-600">À la carte options to customize your trademark protection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm hover:border-amber-400 transition-colors flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex-grow pr-3">{service.name}</h3>
                  <span className="text-2xl font-bold text-slate-900 flex-shrink-0">{service.price}</span>
                </div>
                <p className="text-slate-600 mb-4 flex-grow">{service.description}</p>
                <button
                  onClick={() => handleGetStarted({ name: service.name, price: service.price, description: service.description }, service.needsAddOns)}
                  className="w-full bg-slate-800 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all mt-auto"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQSection faqs={pricingFAQs} title="Pricing Questions" />

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Protect Your Brand?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Get started with our comprehensive trademark registration package today.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
            Start Your Application
          </button>
          <p className="text-sm text-slate-400 mt-6">
            Questions? Contact us at contact@marqtrademarks.com
          </p>
        </div>
      </section>
    </div>
  );
}
