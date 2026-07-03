import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Shield, CheckCircle, FileSearch, FileText, Send, Award, XCircle } from 'lucide-react';
import SchemaMarkup, { serviceSchema, howToSchema, breadcrumbSchema } from '../components/SchemaMarkup';
import FAQSection, { trademarkFAQs } from '../components/FAQSection';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function TrademarkRegistrationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO['trademark-registration']);
  }, []);

  const included = [
    {
      title: 'Comprehensive Trademark Search',
      description:
        'Full federal USPTO database, state registrations, common law usage, and domain search to surface any conflicts before you file.',
    },
    {
      title: 'Application Preparation',
      description:
        'Expert selection of trademark classes and precise goods/services descriptions drafted by a licensed attorney to maximize protection.',
    },
    {
      title: 'USPTO Electronic Filing',
      description:
        'Your application is filed via the TEAS system with immediate confirmation and an official serial number issued the same day.',
    },
    {
      title: 'Post-Filing Monitoring',
      description:
        'We track your application at every stage and alert you promptly to any USPTO communications that require action.',
    },
    {
      title: 'Direct Attorney Support',
      description:
        'Your attorney is available throughout the process — no call centers, no handoffs, no surprise invoices.',
    },
    {
      title: 'Official Registration Certificate',
      description:
        'Once approved, your federal trademark registration certificate is delivered and your nationwide ® rights are active.',
    },
  ];

  const processSteps = [
    {
      number: '01',
      icon: FileSearch,
      title: 'Consultation & Search',
      timeline: 'Days 1–3',
      description:
        'We discuss your brand goals and run a comprehensive search across federal, state, and common law sources to identify any conflicts before you invest in filing.',
    },
    {
      number: '02',
      icon: FileText,
      title: 'Application Preparation',
      timeline: 'Days 4–7',
      description:
        'Our attorneys select the right trademark classes, craft precise goods and services descriptions, and prepare all required specimens and documentation.',
    },
    {
      number: '03',
      icon: Send,
      title: 'USPTO Filing',
      timeline: 'Day 8',
      description:
        'We electronically file your application with the USPTO via TEAS and immediately provide your official application serial number.',
    },
    {
      number: '04',
      icon: Award,
      title: 'Registration & Protection',
      timeline: 'Months 8–18',
      description:
        'After USPTO examination and publication, your official registration certificate is issued granting nationwide exclusive rights and the right to use ®.',
    },
  ];

  const benefits = [
    'Exclusive nationwide rights to use your mark',
    'Legal presumption of ownership in disputes',
    'Public constructive notice of your trademark claim',
    'Right to use the ® symbol',
    'Federal court jurisdiction for infringement cases',
    'Basis for international trademark protection',
    'Protection against domain name cybersquatting',
    'Enhanced brand credibility and enterprise value',
  ];

  const serviceSchemaData = serviceSchema({
    name: 'Federal Trademark Registration Service',
    description:
      'Complete trademark registration service including comprehensive search, application preparation, USPTO filing, and monitoring. Expert attorneys guide you through every step of the federal trademark registration process. Packages start at $499 plus USPTO filing fees.',
    price: '499',
    url: 'https://marqtrademarks.com/trademark-registration',
  });

  const processSchemaData = howToSchema({
    name: 'How to Register a Federal Trademark',
    description:
      'Complete process for registering your trademark with the United States Patent and Trademark Office (USPTO).',
    steps: processSteps.map((step) => ({
      name: step.title,
      text: step.description,
    })),
    totalTime: 'P8M',
  });

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Services', url: 'https://marqtrademarks.com/services' },
    { name: 'Trademark Registration', url: 'https://marqtrademarks.com/trademark-registration' },
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[serviceSchemaData, processSchemaData, breadcrumbs]} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.13),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Federal Trademark Registration
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Protect Your Brand.<br className="hidden sm:block" /> Register Your Trademark.
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Our flat-fee registration service covers everything — from a comprehensive search through your
              official federal certificate — handled by a licensed trademark attorney from start to finish.
            </p>

            {/* Pricing callout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10">
              <div className="bg-white/10 border border-gold-500/30 rounded-2xl px-7 py-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-1">
                  Flat-Fee Package
                </p>
                <p className="text-4xl font-bold text-white leading-none">$499</p>
                <p className="text-sm text-slate-300 mt-1.5">+ $350 USPTO filing fee</p>
              </div>
              <ul className="space-y-2 text-slate-300 text-sm">
                {[
                  'Comprehensive trademark search included',
                  'Licensed trademark attorney throughout',
                  'No hidden fees — ever',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle size={15} className="text-gold-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/get-started')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20"
            >
              Start Your Registration
            </button>
          </div>
        </div>
      </section>

      {/* ── What's Included ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Everything You Need
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What's Included in Your Package</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              One flat fee. Complete coverage. No hourly billing, no surprises — just expert trademark
              registration from consultation through certificate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {included.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                  <CheckCircle size={20} className="text-gold-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy-900 mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process Timeline ──────────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Step by Step
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">How the Process Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              USPTO registration typically takes 8–18 months. We manage the complexity at every stage so you can focus on building your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-6xl font-black text-slate-100 leading-none select-none">
                    {step.number}
                  </span>
                  <span className="text-xs font-semibold text-gold-700 bg-gold-500/10 px-3 py-1 rounded-full whitespace-nowrap">
                    {step.timeline}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center mb-4">
                  <step.icon size={20} className="text-gold-400" />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed flex-1">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits (Featured Dark Card) ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 text-white rounded-2xl p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                  Why It Matters
                </p>
                <h2 className="text-4xl font-bold mb-5 leading-tight">
                  Benefits of Federal Trademark Registration
                </h2>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Registering with the USPTO gives you the strongest legal protection available — nationwide
                  exclusivity, a legal presumption of ownership, and powerful tools to stop infringers before
                  they damage your brand.
                </p>
                <button
                  onClick={() => navigate('/get-started')}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Protect Your Mark Today
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-gold-400 flex-shrink-0 mt-0.5" size={17} />
                    <span className="text-slate-300 text-sm leading-snug">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Can Be Trademarked + DIY vs. Attorney ────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* What can be trademarked */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
                Eligible Marks
              </p>
              <h2 className="text-4xl font-bold text-navy-900 mb-5">What Can Be Trademarked?</h2>
              <p className="text-slate-500 mb-6 leading-relaxed">
                Federal trademark protection extends to a wide variety of identifiers that distinguish your
                goods or services in the marketplace.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Business names and product names',
                  'Logos, symbols, and graphic designs',
                  'Slogans and taglines',
                  'Distinctive colors and sounds (in specific contexts)',
                  'Product packaging and trade dress',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-gold-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-navy-900 text-white rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Shield size={18} className="text-gold-400" />
                  <span className="font-semibold text-sm">Why Register?</span>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Without federal registration, your rights are limited to the geographic area where you
                  actively use the mark. Nationwide exclusivity — and the tools to enforce it — only come
                  with USPTO registration.
                </p>
              </div>
            </div>

            {/* DIY vs Attorney */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
                DIY vs. Professional Filing
              </p>
              <h3 className="text-2xl font-bold text-navy-900 mb-6">
                Why Attorney-Filed Applications Succeed More Often
              </h3>
              <div className="space-y-4 text-sm">
                <div className="bg-red-50 border border-red-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={16} className="text-red-500" />
                    <span className="font-semibold text-red-800">Common DIY Pitfalls</span>
                  </div>
                  <ul className="space-y-1.5 text-red-700">
                    <li>• Incorrect class selection leads to rejection</li>
                    <li>• Missed conflicts result in costly rebranding</li>
                    <li>• Imprecise descriptions limit protection scope</li>
                    <li>• Office actions without legal guidance</li>
                  </ul>
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="font-semibold text-green-800">The Professional Advantage</span>
                  </div>
                  <ul className="space-y-1.5 text-green-700">
                    <li>• Thorough conflict search before a dollar is spent</li>
                    <li>• Correct classes and descriptions from the start</li>
                    <li>• Attorney-managed office action responses</li>
                    <li>• Significantly higher USPTO approval rates</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={() => navigate('/get-started')}
                className="mt-6 w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-center"
              >
                Get Started — $499 + USPTO Fee
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQSection faqs={trademarkFAQs} />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
            Get Protected
          </p>
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            Ready to Register Your Trademark?
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
            Secure your brand with our flat-fee package — $499 attorney fees plus the $350 USPTO filing fee. No hidden costs, ever.
          </p>
          <button
            onClick={() => navigate('/get-started')}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20"
          >
            Start Your Registration
          </button>
          <p className="text-sm text-slate-400 mt-4">
            Transparent pricing · Licensed attorneys · No hourly billing
          </p>
        </div>
      </section>
    </div>
  );
}
