import {
  Check, Shield, ArrowRight, Star, ChevronDown,
  Clock, BadgeCheck, BarChart2, Lock, Zap, AlertCircle
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SchemaMarkup, { serviceSchema, faqSchema, organizationSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import { ServicePackage } from '../lib/supabase';
import { updatePageSEO, pageSEO } from '../utils/seo';

const registrationFeatures = [
  'Comprehensive trademark search (federal, state & common law)',
  'USPTO application preparation by licensed attorney',
  'Priority filing with expedited processing',
  'Unlimited attorney support throughout the process',
  'Application status monitoring & milestone alerts',
  'Client portal — 24/7 case tracking',
  'Post-approval guidance & certificate support',
  'Amazon Brand Registry enrollment guide',
];

const additionalServices = [
  {
    name: 'Professional Trademark Search',
    price: '$49',
    note: 'One-time fee',
    icon: BarChart2,
    color: 'blue',
    description: 'Comprehensive search with attorney analysis — federal, state, common law, domains, and social handles.',
    route: '/trademark-search-request',
    routeLabel: 'Request Search',
  },
  {
    name: 'Trademark Monitoring',
    price: '$149',
    note: 'Per year',
    icon: Shield,
    color: 'emerald',
    description: 'Annual watch service alerting you to potential conflicts with newly filed marks that could threaten your brand.',
    route: null,
    routeLabel: 'Add to Package',
    pkg: 'Trademark Monitoring',
  },
  {
    name: 'Cease & Desist Letter',
    price: '$499',
    note: 'Flat fee',
    icon: BadgeCheck,
    color: 'rose',
    description: 'Attorney-drafted letter documenting your rights, detailing infringement, and demanding corrective action.',
    route: '/cease-and-desist-request',
    routeLabel: 'Get Started',
  },
  {
    name: 'Procedural Office Action',
    price: '$399',
    note: 'Flat fee',
    icon: AlertCircle,
    color: 'amber',
    description: 'Expert response to technical USPTO rejections — specimen issues, identification clarifications, etc.',
    route: '/office-action-request',
    routeLabel: 'Get Started',
    routeState: { serviceType: 'Procedural Office Action Response' },
  },
  {
    name: 'Substantive Office Action',
    price: '$799',
    note: 'Flat fee',
    icon: Zap,
    color: 'purple',
    description: 'In-depth legal argument responding to likelihood of confusion, descriptiveness, or other substantive refusals.',
    route: '/office-action-request',
    routeLabel: 'Get Started',
    routeState: { serviceType: 'Substantive Office Action Response' },
  },
];

const faqs = [
  {
    question: 'What is included in the $499 trademark registration fee?',
    answer: 'Everything: comprehensive trademark search (federal, state & common law), USPTO application preparation by a licensed attorney, priority filing, unlimited attorney support, application monitoring, client portal access, post-approval guidance, and an Amazon Brand Registry enrollment guide. The only separate cost is the required USPTO government filing fee of $350 per class.'
  },
  {
    question: 'Are USPTO fees included in the $499 price?',
    answer: 'No — the USPTO government filing fee of $350 per class is paid directly to the USPTO and is separate from our $499 attorney fee. Most brands register in one class, so the typical total is $849 (attorney fee + one class). Our attorneys will help you determine which classes apply.'
  },
  {
    question: 'How many trademark classes do I need?',
    answer: 'Most small businesses need just one class covering their primary goods or services. Each additional class costs $350 in additional USPTO filing fees. Our attorneys will advise you on the right classes before filing.'
  },
  {
    question: 'How long does trademark registration take?',
    answer: 'We file within 2–3 business days of receiving your information. USPTO examination typically takes 8–12 months. For Amazon Brand Registry, you can enroll as soon as your application is pending — your filing number is all you need.'
  },
  {
    question: 'What if the USPTO sends an Office Action?',
    answer: 'We monitor your application and alert you immediately. Office Action responses are available separately: $399 for procedural issues and $799 for substantive legal arguments. These are only required if the USPTO raises an issue.'
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes. We offer payment plans with a small 5% fee. You can select a payment plan during checkout when you get started.'
  },
  {
    question: 'Is there a money-back guarantee?',
    answer: 'We stand behind our work. If there is an error on our part in the preparation or filing of your application, we will correct it at no additional charge. Please contact us within 30 days if you have any concerns.'
  },
];

export default function PricingPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    updatePageSEO(pageSEO.pricing);
  }, []);

  const handleGetStarted = (name: string, routeState?: object) => {
    if (name === 'Professional Trademark Search') {
      navigate('/trademark-search-request');
    } else if (name.includes('Office Action')) {
      navigate('/office-action-request', { state: routeState });
    } else if (name === 'Cease and Desist Letter') {
      navigate('/cease-and-desist-request');
    } else {
      navigate('/get-started', { state: { package: name } });
    }
  };

  const servicesSchemas = [
    serviceSchema({ name: 'Trademark Registration Package', description: 'Complete professional trademark registration', price: '499', url: 'https://marqtrademarks.com/pricing' }),
  ];
  const faqSchemaData = faqSchema(faqs.map(f => ({ question: f.question, answer: f.answer })));

  return (
    <div className="bg-white font-sans">
      <SchemaMarkup schema={[organizationSchema, offerCatalogSchema, ...servicesSchemas, faqSchemaData]} />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.07),transparent_65%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-6">
            Transparent Pricing
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 font-display leading-tight">
            Flat-fee trademark protection.<br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text text-transparent">
              No surprises. Ever.
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            One clear price covers real attorney service from search to registration. Compare us to anyone — our value wins.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            {['Real USPTO attorneys', 'No hourly billing', 'All 50 states', '5-star rated'].map(t => (
              <div key={t} className="flex items-center gap-2">
                <Check size={14} className="text-emerald-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN PACKAGE ── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            {/* Package card */}
            <div className="lg:col-span-3 relative">
              <div className="absolute -inset-1 bg-gradient-to-br from-amber-400/30 to-amber-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-white rounded-2xl border-2 border-amber-400 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 flex items-center justify-between">
                  <span className="text-slate-900 font-bold text-sm uppercase tracking-wide">Most Popular</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-slate-900 fill-slate-900" />)}
                  </div>
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center">
                      <Shield size={28} className="text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Trademark Registration</h2>
                      <p className="text-slate-500 text-sm">Complete package by real attorneys</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="flex items-end gap-2 mb-1">
                      <span className="text-6xl font-black text-slate-900">$499</span>
                      <span className="text-slate-500 mb-2 text-sm">attorney fee</span>
                    </div>
                    <p className="text-slate-500 text-sm">+ $350 USPTO government filing fee per class</p>
                  </div>

                  <ul className="space-y-3.5 mb-8">
                    {registrationFeatures.map(f => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={11} className="text-emerald-600" strokeWidth={3} />
                        </div>
                        <span className="text-slate-700 text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/get-started')}
                    className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-300/50 hover:scale-[1.01]"
                  >
                    Get Started — $499
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-xs text-slate-400 text-center mt-3">
                    Payment plans available · Secure checkout
                  </p>
                </div>
              </div>
            </div>

            {/* Side info */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-amber-500" />
                  Timeline
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    { label: 'Filing within', val: '2–3 business days' },
                    { label: 'USPTO review', val: '8–12 months' },
                    { label: 'Amazon Brand Registry', val: 'Immediately upon filing' },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-slate-500">{label}</span>
                      <span className="font-semibold text-slate-800">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Lock size={18} className="text-emerald-500" />
                  Payment Plans Available
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Split your payment over time with our flexible plan option. A small 5% plan fee applies. Select during checkout.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h3 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <BadgeCheck size={18} className="text-amber-600" />
                  Amazon Sellers
                </h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  Your pending application qualifies you for Amazon Brand Registry immediately — no waiting for approval.
                </p>
                <Link to="/amazon" className="text-amber-700 text-xs font-semibold mt-2 inline-flex items-center gap-1 hover:text-amber-800 transition-colors">
                  Learn more <ArrowRight size={12} />
                </Link>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                  "Mary and her team filed my trademark quickly and kept me informed every step of the way. Worth every penny."
                </p>
                <div className="text-xs text-emerald-700 mt-2 font-semibold">— Sarah M., Business Owner</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ADDITIONAL SERVICES ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              À La Carte Services
            </span>
            <h2 className="text-4xl font-bold text-slate-900 font-display mb-4">
              Additional protection options
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Customize your trademark protection with standalone services, or add them to your registration package.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map(({ name, price, note, icon: Icon, color, description, route, routeLabel, routeState, pkg }) => (
              <div
                key={name}
                className={`group bg-white rounded-2xl border border-slate-200 hover:border-${color}-300 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col`}
              >
                <div className={`w-12 h-12 bg-${color}-50 border border-${color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className={`text-${color}-600`} />
                </div>
                <div className="flex items-end justify-between mb-3">
                  <h3 className="font-bold text-slate-900 text-base leading-tight pr-2">{name}</h3>
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-black text-slate-900">{price}</div>
                    <div className="text-xs text-slate-400">{note}</div>
                  </div>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed flex-grow mb-5">{description}</p>
                <button
                  onClick={() => {
                    if (route) {
                      navigate(route, routeState ? { state: routeState } : undefined);
                    } else {
                      navigate('/get-started', { state: { package: pkg } });
                    }
                  }}
                  className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all border-2 border-${color}-200 text-${color}-700 hover:bg-${color}-50 hover:border-${color}-400`}
                >
                  {routeLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOTAL COST BREAKDOWN ── */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display text-center mb-10">
            What you'll actually pay
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {[
              { label: 'Attorney fee (registration package)', amount: '$499', note: 'Everything listed above' },
              { label: 'USPTO filing fee — 1 class', amount: '$350', note: 'Paid to U.S. government' },
              { label: 'Each additional class', amount: '$350', note: 'Per extra class, if applicable' },
            ].map((row, i) => (
              <div key={row.label} className={`flex items-center justify-between px-6 py-5 ${i < 2 ? 'border-b border-slate-100' : ''}`}>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{row.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{row.note}</div>
                </div>
                <div className="text-xl font-bold text-slate-900">{row.amount}</div>
              </div>
            ))}
            <div className="bg-amber-50 border-t-2 border-amber-200 flex items-center justify-between px-6 py-5">
              <div>
                <div className="font-bold text-slate-900">Typical total (1 class)</div>
                <div className="text-xs text-slate-500 mt-0.5">Attorney fee + USPTO fee</div>
              </div>
              <div className="text-3xl font-black text-amber-700">$849</div>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">
            No hidden charges. No hourly billing. No surprises.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">FAQ</span>
            <h2 className="text-4xl font-bold text-slate-900 font-display">Pricing questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ question, answer }, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 pr-4 text-sm">{question}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-amber-500' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gradient-to-br from-slate-950 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.07),transparent_65%)]" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6">
            Ready to register your trademark?
          </h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Start today — flat $499 attorney fee, real USPTO attorneys, no hidden costs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl hover:scale-[1.02]"
            >
              Get Started — $499
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/trademark-search-request')}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-white/15 transition-all"
            >
              Start with Free Search
            </button>
          </div>
          <p className="text-slate-500 text-sm mt-6">
            Questions? <a href="mailto:contact@marqtrademarks.com" className="text-amber-400 hover:text-amber-300 transition-colors">contact@marqtrademarks.com</a>
          </p>
        </div>
      </section>
    </div>
  );
}
