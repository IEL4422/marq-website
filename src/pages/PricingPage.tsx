import { Check, Shield, DollarSign, Eye, FileText, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { serviceSchema, faqSchema, organizationSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import FAQSection, { pricingFAQs } from '../components/FAQSection';
import { updatePageSEO, pageSEO } from '../utils/seo';

interface ServicePackage {
  name: string;
  price: string;
  description: string;
}

export default function PricingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.pricing);
  }, []);

  const handleGetStarted = (pkg: ServicePackage, _needsAddOns: boolean) => {
    if (pkg.name === 'Trademark Search') {
      navigate('/trademark-search-request');
    } else if (
      pkg.name === 'Procedural Office Action Response' ||
      pkg.name === 'Substantive Office Action Response'
    ) {
      navigate('/office-action-request', { state: { serviceType: pkg.name } });
    } else if (pkg.name === 'Cease and Desist Letter') {
      navigate('/cease-and-desist-request');
    } else {
      navigate('/get-started', { state: { package: pkg.name } });
    }
  };

  const registrationFeatures = [
    'Comprehensive trademark search',
    'Client Portal Access',
    'USPTO application preparation & filing',
    'Unlimited attorney support',
    'Application monitoring',
    'Post-approval guidance & certificate support',
    'Priority filing — expedited processing',
    'Amazon Brand Registry enrollment guide',
  ];

  const additionalServices = [
    {
      icon: Eye,
      name: 'Trademark Search',
      price: 'Contact for Pricing',
      priceSub: 'DIY search — Free',
      description:
        'Attorney-reviewed comprehensive search before you file, or use our free DIY search tool to get started.',
      cta: 'Request Search',
      needsAddOns: false,
    },
    {
      icon: FileText,
      name: 'Procedural Office Action Response',
      price: '$399',
      priceSub: 'One-time fee',
      description:
        'Response to technical issues such as specimen problems, identification clarifications, or drawing amendments.',
      cta: 'Get Help',
      needsAddOns: false,
    },
    {
      icon: FileText,
      name: 'Substantive Office Action Response',
      price: '$799',
      priceSub: 'One-time fee',
      description:
        'Response to complex legal rejections like likelihood of confusion or descriptiveness arguments.',
      cta: 'Get Help',
      needsAddOns: false,
    },
    {
      icon: Shield,
      name: 'Cease and Desist Letter',
      price: '$499',
      priceSub: 'One-time fee',
      description:
        'Professional attorney-drafted letter to stop trademark infringement and enforce your brand rights.',
      cta: 'Get Started',
      needsAddOns: false,
    },
    {
      icon: Clock,
      name: 'Trademark Monitoring',
      price: '$149',
      priceSub: 'per year',
      description:
        'Annual monitoring to watch for potential conflicts and protect your registered trademark from infringement.',
      cta: 'Add Monitoring',
      needsAddOns: false,
    },
  ];

  const faqs = [
    {
      question: 'What is included in the $499 Trademark Registration Package?',
      answer:
        'Our comprehensive $499 package includes everything you need: comprehensive trademark search, client portal access, USPTO application preparation and filing, unlimited attorney support, application monitoring, post-approval guidance, priority filing, and Amazon Brand Registry enrollment guide. The USPTO filing fee of $350 per class is separate.',
    },
    {
      question: 'Are USPTO fees included in the $499 price?',
      answer:
        'No, USPTO filing fees are separate from our attorney fees. Our attorney fee is $499, which covers all legal services. The USPTO requires a $350 filing fee per class, paid directly to the government.',
    },
    {
      question: 'How many classes do I need?',
      answer:
        'Most businesses start with one class covering their primary goods or services. Each additional class requires an additional $350 USPTO filing fee. Our attorneys will help you determine which classes apply during the consultation.',
    },
    {
      question: 'How quickly will my application be filed?',
      answer:
        'Your application will be filed with priority processing, typically within 2-3 business days. USPTO examination times are set by the government and typically take 8-12 months.',
    },
    {
      question: 'Does this package work for Amazon Brand Registry?',
      answer:
        'Yes! Our package includes an Amazon Brand Registry enrollment guide. Amazon accepts filed pending trademark applications, so you can start enrollment immediately after your application is submitted.',
    },
    {
      question: 'What if I receive an office action from the USPTO?',
      answer:
        'Office actions are additional legal work if the USPTO raises issues. Procedural responses (technical issues) are $399. Substantive responses (likelihood of confusion or descriptiveness) are $799. These are only needed if the USPTO issues an office action.',
    },
    {
      question: 'Do you offer payment plans?',
      answer:
        'Yes! We offer flexible payment plans for our trademark registration package. Spread your investment over time with a small 5% fee. Payment plans are available during checkout.',
    },
    {
      question: 'What is included in the Cease and Desist Letter service?',
      answer:
        'Our $499 cease and desist service includes a professionally drafted attorney letter documenting your IP rights, detailing the infringement, citing legal authorities, demanding specific action, and outlining consequences. We handle evidence gathering, strategic drafting, delivery, and initial follow-up.',
    },
  ];

  const servicesSchemas = [
    serviceSchema({
      name: 'Trademark Registration Package',
      description: 'Complete trademark registration with comprehensive support',
      price: '499',
      url: 'https://marqtrademarks.com/pricing#trademark-registration',
    }),
  ];

  const faqSchemaData = faqSchema(faqs);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, offerCatalogSchema, ...servicesSchemas, faqSchemaData]} />

      {/* Hero */}
      <section className="bg-navy-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
            Transparent · Flat-Fee · Attorney-Led
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Know Exactly What You'll Pay
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Professional trademark services with clear, upfront pricing. No hourly billing, no hidden
            fees, no surprises.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <Check className="text-gold-500" size={16} />
              No hourly billing
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-gold-500" size={16} />
              Licensed attorneys
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-gold-500" size={16} />
              All 50 states
            </span>
            <span className="flex items-center gap-2">
              <Check className="text-gold-500" size={16} />
              Federal protection
            </span>
          </div>
        </div>
      </section>

      {/* Featured Registration Package */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Most Popular
            </p>
            <h2 className="text-4xl font-bold text-navy-900">Trademark Registration Package</h2>
          </div>

          <div className="bg-navy-900 text-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Gold header stripe */}
            <div className="bg-gold-500 text-navy-950 text-center py-2.5 text-xs font-bold uppercase tracking-widest">
              Professional Package — All-Inclusive Attorney Service
            </div>

            <div className="p-8 md:p-12">
              {/* Price block */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-5">
                  <div className="bg-gold-500/20 rounded-xl p-4">
                    <Shield className="text-gold-500" size={36} />
                  </div>
                  <div>
                    <div className="text-5xl font-bold text-white leading-none">$499</div>
                    <div className="text-slate-400 text-sm mt-1">attorney fee</div>
                  </div>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-center sm:text-right">
                  <div className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1">
                    Plus USPTO Filing Fee
                  </div>
                  <div className="text-gold-400 font-bold text-2xl">$350 / class</div>
                  <div className="text-slate-500 text-xs mt-1">paid directly to government</div>
                </div>
              </div>

              {/* Features grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-10">
                {registrationFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-gold-500/25 flex items-center justify-center">
                      <Check className="text-gold-400" size={11} />
                    </div>
                    <span className="text-slate-200 text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  handleGetStarted(
                    {
                      name: 'Trademark Registration Package',
                      price: '$499',
                      description: 'Complete trademark registration with comprehensive support',
                    },
                    true
                  )
                }
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg"
              >
                Get Started — $499 Attorney Fee
              </button>

              <p className="text-slate-500 text-sm text-center mt-4">
                Available in all 50 states · Federal trademark protection · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Plan Banner */}
      <section className="py-8 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-50 border border-navy-200 rounded-2xl p-6 flex items-center gap-5">
            <div className="bg-navy-900 rounded-xl p-3 flex-shrink-0">
              <DollarSign className="text-gold-500" size={24} />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-navy-900 text-lg mb-1">
                Flexible Payment Plans Available
              </h3>
              <p className="text-slate-600 text-sm">
                Spread your investment over time with a small 5% fee. Available for all trademark
                registration packages at checkout.
              </p>
            </div>
            <span className="hidden sm:inline-block flex-shrink-0 bg-navy-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
              Only 5% Fee
            </span>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              À La Carte
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Additional Services</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Customize your trademark protection with these specialized legal services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalServices.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-navy-50 rounded-xl p-3">
                    <service.icon className="text-navy-700" size={22} />
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-navy-900 leading-tight">
                      {service.price}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{service.priceSub}</div>
                  </div>
                </div>
                <h3 className="text-base font-bold text-navy-900 mb-2">{service.name}</h3>
                <p className="text-slate-600 text-sm flex-grow mb-5">{service.description}</p>
                <button
                  onClick={() =>
                    handleGetStarted(
                      {
                        name: service.name,
                        price: service.price,
                        description: service.description,
                      },
                      service.needsAddOns
                    )
                  }
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all"
                >
                  {service.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQSection faqs={pricingFAQs} title="Pricing Questions" />

      {/* CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
            Get Started Today
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Protect Your Brand?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-xl mx-auto">
            Join thousands of businesses who trust Marq Legal to secure their trademarks.
          </p>
          <button
            onClick={() => navigate('/get-started')}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg inline-flex items-center gap-2"
          >
            Start Your Application
            <ArrowRight size={20} />
          </button>
          <p className="text-slate-400 text-sm mt-6">
            Questions? Contact us at contact@marqtrademarks.com
          </p>
        </div>
      </section>
    </div>
  );
}
