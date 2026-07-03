import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, CheckCircle, FileSearch, BarChart, Shield, XCircle, AlertTriangle } from 'lucide-react';
import SchemaMarkup, { serviceSchema, breadcrumbSchema } from '../components/SchemaMarkup';
import FAQSection, { trademarkFAQs } from '../components/FAQSection';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function TrademarkSearchPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO['trademark-search']);
  }, []);

  const searchComponents = [
    {
      icon: FileSearch,
      title: 'Federal Database Search',
      description:
        'Comprehensive search of all registered and pending trademarks in the USPTO TESS database, including live and dead marks.',
    },
    {
      icon: Search,
      title: 'Common Law Search',
      description:
        'Investigation of unregistered marks through business name databases, domain registrations, and social media handles.',
    },
    {
      icon: BarChart,
      title: 'Likelihood-of-Confusion Analysis',
      description:
        'Attorney-led evaluation of any potentially conflicting marks using the DuPont factors applied by the USPTO.',
    },
    {
      icon: Shield,
      title: 'Written Opinion & Report',
      description:
        'Detailed written opinion with a clear go/no-go recommendation, risk rating, and strategic guidance.',
    },
  ];

  const searchServiceSchema = serviceSchema({
    name: 'Comprehensive Trademark Search Service',
    description:
      'Professional trademark availability search including federal database, state registrations, common law usage, and expert legal analysis to identify potential conflicts before filing.',
    price: '199',
    url: 'https://marqtrademarks.com/trademark-search',
  });

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Services', url: 'https://marqtrademarks.com/services' },
    { name: 'Trademark Search', url: 'https://marqtrademarks.com/trademark-search' },
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[searchServiceSchema, breadcrumbs]} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.13),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Trademark Availability Search
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Know Before You File.
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl">
              A professional trademark search identifies conflicts, reduces rejection risk, and gives you
              the confidence to invest in your brand — before you spend a dollar on USPTO fees.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/trademark-search-request')}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20"
              >
                Order Professional Search — $199
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why the Search Matters ────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Why It Matters
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">
              The Cost of Skipping the Search
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Filing without a proper search is the most common — and most avoidable — trademark mistake
              business owners make.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Without a search */}
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
              <XCircle className="text-red-500 mb-5" size={32} />
              <h3 className="text-xl font-bold text-navy-900 mb-4">Without a Search</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {[
                  'Application rejection and lost filing fees ($350+)',
                  'Potential trademark infringement liability',
                  'Forced rebranding — months of disruption',
                  'Cease and desist letters from competitors',
                  'Expensive litigation risk',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With a professional search */}
            <div className="bg-green-50 border border-green-100 rounded-2xl p-8">
              <CheckCircle className="text-green-600 mb-5" size={32} />
              <h3 className="text-xl font-bold text-navy-900 mb-4">With a Professional Search</h3>
              <ul className="space-y-3 text-sm text-slate-700">
                {[
                  'Identify conflicts before investing in filing',
                  'Stronger, better-prepared application',
                  'Proceed with clarity and legal confidence',
                  'Higher likelihood of USPTO approval',
                  'Reduced risk of future disputes',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our guarantee */}
            <div className="bg-navy-900 text-white rounded-2xl p-8">
              <Shield className="text-gold-400 mb-5" size={32} />
              <h3 className="text-xl font-bold mb-4">Our Guarantee</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                {[
                  'Licensed trademark attorney review',
                  'Federal, state, and common law databases',
                  'Detailed written report with legal opinion',
                  'Clear go/no-go recommendation',
                  'Full risk assessment included',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Professional vs DIY ───────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Your Options
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Professional Search vs. DIY</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Choose the right level of confidence for your brand investment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Professional search */}
            <div className="bg-navy-900 text-white rounded-2xl p-8 relative">
              <div className="absolute -top-3.5 left-8">
                <span className="bg-gold-500 text-navy-950 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                  Recommended
                </span>
              </div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-2 mt-2">
                Professional Attorney Search
              </p>
              <div className="flex items-baseline gap-2 mb-7">
                <span className="text-4xl font-bold text-white">$199</span>
                <span className="text-slate-400 text-sm">one-time fee</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  'Full USPTO TESS database search',
                  'State trademark registration review',
                  'Common law usage investigation',
                  'Domain and social media availability',
                  'Attorney likelihood-of-confusion analysis',
                  'Written legal opinion and recommendations',
                  'Clear go/no-go guidance with rationale',
                  'Fee applied toward registration if you proceed',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle size={15} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-200">{item}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/trademark-search-request')}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-6 py-4 rounded-xl transition-all"
              >
                Order Your Search
              </button>
            </div>

            {/* DIY */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
                DIY Search
              </p>
              <div className="flex items-baseline gap-2 mb-7">
                <span className="text-4xl font-bold text-navy-900">Free</span>
                <span className="text-slate-400 text-sm">but costly risks</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                {[
                  'Basic USPTO TESS surface-level search only',
                  'No state registration review',
                  'No common law usage analysis',
                  'No attorney legal analysis or opinion',
                  'No likelihood-of-confusion assessment',
                  'No written report or recommendations',
                  'High risk of missing critical conflicts',
                  'No professional accountability',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <XCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  DIY searches frequently miss confusingly similar marks — the #1 cause of registration
                  rejections and costly rebranding.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Our Search Covers ───────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              What You Get
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What Our Search Covers</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Our comprehensive search goes well beyond a basic database lookup to deliver a thorough
              attorney analysis you can act on.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {searchComponents.map((component, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-5">
                  <component.icon className="text-gold-400" size={22} />
                </div>
                <h3 className="text-lg font-bold text-navy-900 mb-2">{component.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{component.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Understanding Results (Featured Card) ────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 text-white rounded-2xl p-10 md:p-14">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                  More Than Raw Data
                </p>
                <h2 className="text-4xl font-bold mb-5 leading-tight">
                  Understanding Your Search Results
                </h2>
                <p className="text-slate-300 leading-relaxed mb-4">
                  We don't just hand you a list of marks. Our attorneys review every result and apply
                  the legal standards the USPTO uses to evaluate conflicts, giving you a clear picture
                  of your risks and options.
                </p>
                <p className="text-slate-300 leading-relaxed mb-8">
                  Every report includes a written opinion on the likelihood of successful registration
                  and specific strategies to strengthen your application or choose an alternative mark.
                </p>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Order Your Search — $199
                </button>
              </div>
              <div className="space-y-4">
                {[
                  {
                    label: 'Avoid costly application rejections',
                    detail: 'USPTO filing fees are non-refundable — a search pays for itself.',
                  },
                  {
                    label: 'Identify potential conflicts early',
                    detail: 'Catch issues when you can still pivot, not after launching.',
                  },
                  {
                    label: 'Strengthen your trademark application',
                    detail: 'Know exactly how to position your mark for maximum protection.',
                  },
                  {
                    label: 'Make informed branding decisions',
                    detail: 'Proceed with data-backed confidence, not guesswork.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                    <CheckCircle size={18} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-white text-sm">{item.label}</p>
                      <p className="text-slate-400 text-sm mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
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
            Start Today
          </p>
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            Get Your Professional Trademark Search
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
            For $199, a licensed attorney searches all relevant databases and delivers a written
            legal opinion — before you risk your filing fees.
          </p>
          <button
            onClick={() => navigate('/trademark-search-request')}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20"
          >
            Order Your Search — $199
          </button>
          <p className="text-sm text-slate-400 mt-4">
            Fee applied toward full registration if you proceed
          </p>
        </div>
      </section>
    </div>
  );
}
