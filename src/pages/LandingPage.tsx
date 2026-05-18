import {
  Shield, CheckCircle, ArrowRight, FileSearch, Star, Award,
  Clock, Users, TrendingUp, Lock, Zap, BarChart2, ChevronDown,
  Check, X as XIcon, BadgeCheck, Globe, RefreshCw
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import SchemaMarkup, { organizationSchema, websiteSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import ReviewCarousel from '../components/ReviewCarousel';
import { updatePageSEO, pageSEO } from '../utils/seo';

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatCounter({ value, suffix, label, start }: { value: number; suffix: string; label: string; start: boolean }) {
  const count = useCountUp(value, 1800, start);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold font-display text-white">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-300 mt-2 text-sm font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

const publications = [
  { name: 'Bloomberg', logo: <img src="https://i.imgur.com/TTpICyq.png" alt="Bloomberg" className="h-7 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" /> },
  { name: 'Forbes', logo: <img src="https://logodownload.org/wp-content/uploads/2017/04/forbes-logo-0.png" alt="Forbes" className="h-9 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" /> },
  { name: 'Entrepreneur', logo: <img src="https://help.entrepreneur.com/hubfs/Knowledge%20Base%20Import/assets.entrepreneur.comstatic1413842518-entrepreneur-logo.jpg" alt="Entrepreneur" className="h-7 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" /> },
  {
    name: 'Fortune', logo: (
      <svg className="h-8 opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 200 50">
        <text x="0" y="38" style={{ fontFamily: '"Times New Roman", serif', fontSize: '38px', fill: '#000', fontWeight: '700', letterSpacing: '-0.02em' }}>FORTUNE</text>
      </svg>
    )
  },
  { name: 'Business Insider', logo: <img src="https://www.vistaprint.com/news/wp-content/uploads/sites/14/2020/04/Business-Insider-Logo-for-slider.png" alt="Business Insider" className="h-8 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" /> },
];

const processSteps = [
  { icon: FileSearch, step: '01', title: 'Submit Your Info', description: 'Tell us about your brand and what you want to protect. Takes less than 10 minutes.' },
  { icon: Shield, step: '02', title: 'Comprehensive Search', description: 'Our attorneys conduct a thorough search of USPTO databases, common law, and state registrations.' },
  { icon: BadgeCheck, step: '03', title: 'Expert Filing', description: 'A real attorney prepares and files your application with the USPTO using the correct classes and descriptions.' },
  { icon: BarChart2, step: '04', title: 'Monitor & Protect', description: 'We track your application and keep you informed at every stage until you receive your registration certificate.' },
];

const comparisonData = [
  { feature: 'Real USPTO Attorney', marq: true, diy: false, others: 'Sometimes' },
  { feature: 'Flat-Fee Pricing', marq: true, diy: false, others: false },
  { feature: 'Comprehensive Search', marq: true, diy: false, others: 'Basic only' },
  { feature: 'Unlimited Attorney Support', marq: true, diy: false, others: false },
  { feature: 'Client Portal (24/7 tracking)', marq: true, diy: false, others: false },
  { feature: 'Amazon Brand Registry Guide', marq: true, diy: false, others: false },
  { feature: 'No Hidden Fees', marq: true, diy: false, others: false },
  { feature: 'Post-Approval Support', marq: true, diy: false, others: false },
];

function ComparisonCell({ value }: { value: boolean | string }) {
  if (value === true) return <CheckCircle size={20} className="text-emerald-500 mx-auto" />;
  if (value === false) return <XIcon size={20} className="text-slate-300 mx-auto" />;
  return <span className="text-xs text-slate-500 font-medium">{value}</span>;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    updatePageSEO(pageSEO.home);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsStarted(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: 'How much does trademark registration cost?',
      a: 'Our flat-fee trademark registration package is $499 (attorney fee) plus the USPTO filing fee of $350 per class. There are no hidden charges, hourly rates, or surprise add-ons.'
    },
    {
      q: 'How long does trademark registration take?',
      a: 'The typical USPTO review period is 8–12 months from filing. We file your application right away and keep you updated throughout. For Amazon Brand Registry, your pending application number qualifies you to enroll immediately.'
    },
    {
      q: 'Do I need a trademark attorney to file?',
      a: 'You are not legally required to use an attorney, but having an experienced USPTO attorney dramatically reduces the risk of rejection, office actions, and costly mistakes. Our attorneys catch issues before they become problems.'
    },
    {
      q: 'What does a comprehensive trademark search include?',
      a: 'Our search covers USPTO federal databases, state trademark registrations, common law uses, domain names, and social media handles. We analyze the results and provide an attorney opinion on potential conflicts.'
    },
    {
      q: 'What if I receive an Office Action from the USPTO?',
      a: 'We monitor your application and alert you immediately. Office Action responses are available as a separate service starting at $399 for procedural issues and $799 for substantive matters such as likelihood of confusion.'
    },
  ];

  return (
    <div className="bg-white font-sans">
      <SchemaMarkup schema={[organizationSchema, websiteSchema, offerCatalogSchema]} />

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white min-h-[92vh] flex items-center overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-10 w-60 h-60 bg-blue-500/6 rounded-full blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,0.6)_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-amber-400 tracking-wide">
                  Serving All 50 States · Real USPTO Attorneys
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight">
                <span className="text-white">Protect Your</span>
                <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent font-display">
                  Brand
                </span>
                <span className="text-white"> With</span>
                <br />
                <span className="text-white">Expert Attorneys</span>
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Professional trademark registration with flat-fee pricing, real attorneys with USPTO experience, and full support from search to certificate.
              </p>

              <ul className="space-y-3">
                {[
                  'Flat $499 fee — no hourly billing, ever',
                  'Work directly with USPTO-experienced attorneys',
                  'Comprehensive search + unlimited attorney support',
                  'Client portal for 24/7 case tracking',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-emerald-400" strokeWidth={3} />
                    </div>
                    <span className="text-base">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate('/get-started')}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/30 hover:shadow-amber-400/40 hover:scale-[1.02]"
                >
                  Start Registration — $499
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="group flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/15 transition-all border border-white/20 hover:border-white/40"
                >
                  <FileSearch size={20} />
                  Free Trademark Search
                </button>
              </div>

              <p className="text-xs text-slate-500 flex items-center gap-2">
                <Lock size={12} />
                Secure checkout · Attorney-client privilege · No spam
              </p>
            </div>

            {/* Right: card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 to-emerald-500/15 rounded-3xl blur-2xl" />
                <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Shield size={22} className="text-amber-400" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">Trademark Registration</div>
                      <div className="text-slate-400 text-sm">Complete package</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {[
                      'Comprehensive trademark search',
                      'USPTO application preparation & filing',
                      'Unlimited attorney support',
                      'Application monitoring',
                      'Priority filing (expedited processing)',
                      'Amazon Brand Registry guide',
                      'Client portal access',
                      'Post-approval certificate support',
                    ].map(f => (
                      <div key={f} className="flex items-center gap-3">
                        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{f}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Attorney fee</div>
                        <div className="text-4xl font-bold text-white">$499</div>
                        <div className="text-slate-500 text-xs mt-1">+ $350 USPTO filing fee per class</div>
                      </div>
                      <button
                        onClick={() => navigate('/get-started')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500 animate-bounce">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="bg-gradient-to-r from-slate-900 to-slate-800 py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/10">
            <StatCounter value={5000} suffix="+" label="Trademarks Filed" start={statsStarted} />
            <StatCounter value={98} suffix="%" label="Success Rate" start={statsStarted} />
            <StatCounter value={50} suffix="" label="States Served" start={statsStarted} />
            <StatCounter value={5} suffix="★" label="Average Rating" start={statsStarted} />
          </div>
        </div>
      </section>

      {/* ── FEATURED IN ── */}
      <section className="py-12 border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            As Featured In
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
            {publications.map(p => (
              <div key={p.name} className="flex items-center justify-center">
                {p.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY MARQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Why Choose Marq
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-4">
              Trademark protection done right
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              We combine real legal expertise with an easy, modern experience — so you get the protection you need without the confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Shield, color: 'amber',
                title: 'Real USPTO Attorneys',
                desc: 'Every application is handled by a licensed attorney with real USPTO trademark experience — not a paralegal, not AI, not a form filler.'
              },
              {
                icon: Lock, color: 'emerald',
                title: 'Flat-Fee Guarantee',
                desc: 'One transparent price covers everything: search, preparation, filing, monitoring, and unlimited attorney support. No hourly surprises.'
              },
              {
                icon: Zap, color: 'blue',
                title: 'Priority Filing',
                desc: 'We file your application quickly and accurately. Faster filing means an earlier priority date, which is critical for protecting your rights.'
              },
              {
                icon: Globe, color: 'purple',
                title: 'Amazon Brand Registry',
                desc: 'Get enrolled in Amazon Brand Registry with your pending trademark application and immediately gain tools to stop listing hijackers.'
              },
              {
                icon: BarChart2, color: 'rose',
                title: 'Full Case Tracking',
                desc: 'Monitor your trademark\'s progress in real-time through your client portal. We send updates at every major milestone automatically.'
              },
              {
                icon: RefreshCw, color: 'teal',
                title: 'Office Action Support',
                desc: 'If the USPTO sends an office action, we have you covered with expert attorney responses — at a flat add-on fee, not hourly rates.'
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div
                key={title}
                className={`group p-8 rounded-2xl border border-slate-100 hover:border-${color}-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white`}
              >
                <div className={`w-14 h-14 rounded-2xl bg-${color}-50 border border-${color}-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon size={26} className={`text-${color}-600`} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-4">
              From idea to registered trademark
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              A clear, guided process with expert attorneys handling the complexity for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map(({ icon: Icon, step, title, description }, i) => (
              <div key={step} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gradient-to-r from-amber-200 to-amber-100" />
                )}
                <div className="bg-white rounded-2xl border border-slate-100 p-7 shadow-sm hover:shadow-md transition-shadow text-center relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon size={28} className="text-amber-600" />
                  </div>
                  <div className="text-xs font-black text-amber-500 uppercase tracking-widest mb-2">Step {step}</div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/process"
              className="inline-flex items-center gap-2 text-amber-600 font-semibold hover:text-amber-700 transition-colors text-sm"
            >
              See full process details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              Compare Your Options
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-4">
              Why Marq beats the alternatives
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Filing alone risks rejection. Large legal platforms charge by the hour. Marq gives you full attorney service at a fixed price.
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-5 text-slate-700 font-semibold text-sm w-1/2">Feature</th>
                  <th className="px-4 py-5 text-center">
                    <div className="bg-amber-500 text-slate-900 rounded-xl px-4 py-2 text-sm font-bold inline-block shadow-md">
                      Marq Legal
                    </div>
                  </th>
                  <th className="px-4 py-5 text-center text-slate-500 text-sm font-semibold">DIY Filing</th>
                  <th className="px-4 py-5 text-center text-slate-500 text-sm font-semibold">Other Services</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-6 py-4 text-slate-700 text-sm font-medium">{row.feature}</td>
                    <td className="px-4 py-4 text-center"><ComparisonCell value={row.marq} /></td>
                    <td className="px-4 py-4 text-center"><ComparisonCell value={row.diy} /></td>
                    <td className="px-4 py-4 text-center"><ComparisonCell value={row.others} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/30 hover:scale-[1.02]"
            >
              Get Started with Marq
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── AMAZON BANNER ── */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,88,12,0.15),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-full px-4 py-2 text-orange-400 text-sm font-semibold">
                <TrendingUp size={16} />
                Amazon Seller Services
              </div>
              <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                Stop Hijackers.<br />
                Protect Your<br />
                Amazon Brand.
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                A federal trademark unlocks Amazon Brand Registry — giving you powerful tools to remove counterfeit listings, control your brand, and grow with confidence.
              </p>
              <ul className="space-y-3">
                {[
                  'Enroll in Brand Registry with a pending application',
                  'Remove unauthorized sellers and counterfeits',
                  'Access A+ Content, Sponsored Brands, and more',
                  'Attorney-filed for maximum credibility',
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-slate-200">
                    <CheckCircle size={18} className="text-orange-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate('/amazon')}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl"
                >
                  Learn About Amazon Services
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/get-started')}
                  className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/15 transition-all"
                >
                  Get Started — $499
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-orange-500/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-3xl p-8">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Shield, label: 'Brand Protection', val: 'Full coverage' },
                      { icon: Users, label: 'Hijacker Removal', val: 'Amazon tools' },
                      { icon: Award, label: 'Brand Registry', val: 'Immediate access' },
                      { icon: Clock, label: 'Filing Time', val: 'Expedited' },
                    ].map(({ icon: Icon, label, val }) => (
                      <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                        <Icon size={24} className="text-orange-400 mx-auto mb-2" />
                        <div className="text-white text-sm font-bold">{val}</div>
                        <div className="text-slate-400 text-xs mt-0.5">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={24} className="text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
              5-Star Rated
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display mb-4">
              Trusted by business owners nationwide
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Hundreds of entrepreneurs, Amazon sellers, and brand builders have protected their brands with Marq.
            </p>
          </div>

          <ReviewCarousel />

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-xl shadow-amber-500/25 hover:scale-[1.02]"
            >
              Protect Your Brand Today
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* ── ATTORNEY SPOTLIGHT ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                Meet Your Attorney
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-display leading-tight">
                Led by Mary Liberty,<br />Owner & Lead Attorney
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Mary Liberty founded Marq Legal with a simple mission: make professional trademark protection accessible to every business owner, not just Fortune 500 companies.
              </p>
              <p className="text-slate-500 leading-relaxed">
                With years of USPTO trademark experience, Mary and her team have successfully filed thousands of trademarks across every industry — from e-commerce brands to software companies, restaurants, and creative firms.
              </p>
              <ul className="space-y-3">
                {[
                  'Licensed and USPTO-registered trademark attorney',
                  'Thousands of successful trademark registrations',
                  'Expertise in office actions, appeals, and enforcement',
                  'Personal attention — you work with real attorneys, not bots',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate('/about')}
                  className="flex items-center gap-2 border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-amber-400 hover:text-amber-700 transition-all text-sm"
                >
                  Learn More About Our Team
                </button>
                <button
                  onClick={() => navigate('/get-started')}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-3 rounded-xl font-bold hover:from-amber-400 hover:to-amber-500 transition-all text-sm shadow-lg"
                >
                  Work with Mary's Team
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-100 to-emerald-100 rounded-3xl blur-xl opacity-60" />
                <div className="relative">
                  <img
                    src="https://i.imgur.com/eXHYjog.png"
                    alt="Mary Liberty, Lead Attorney at Marq Legal"
                    className="w-80 h-auto rounded-3xl shadow-2xl object-cover relative z-10"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 z-20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Award size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Mary Liberty</div>
                        <div className="text-xs text-slate-500">Owner & Lead Attorney</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENT PORTAL PREVIEW ── */}
      <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(245,158,11,0.08),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-block bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full">
                24/7 Client Portal
              </span>
              <h2 className="text-4xl md:text-5xl font-bold font-display leading-tight">
                Track your trademark in real time
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Your exclusive client portal gives you complete visibility — from initial search to registration certificate — with direct messaging to your attorney.
              </p>
              {[
                { icon: BarChart2, title: 'Live Status Updates', desc: 'See exactly where your trademark stands at every stage of the USPTO review process.' },
                { icon: Users, title: 'Direct Attorney Messaging', desc: 'Send questions directly to your attorney and get personalized, prompt responses.' },
                { icon: Clock, title: 'Milestone Notifications', desc: 'Automatic email alerts at every major milestone so you\'re never left wondering.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-1">{title}</div>
                    <div className="text-slate-400 text-sm leading-relaxed">{desc}</div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => navigate('/client-portal')}
                className="flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/15 transition-all text-sm"
              >
                Access Client Portal
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Portal mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-amber-500/10 rounded-3xl blur-2xl" />
              <div className="relative bg-white/[0.04] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-slate-800/80 px-5 py-3.5 flex items-center gap-2 border-b border-white/10">
                  <div className="w-3 h-3 rounded-full bg-red-400/70" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
                  <div className="flex-1 text-center text-xs text-slate-400 font-medium">Client Portal — Marq Legal</div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-5">
                    <div className="text-xs text-slate-400 uppercase tracking-wide mb-1">Welcome back,</div>
                    <div className="text-white font-bold text-lg">Jane Doe</div>
                    <div className="text-amber-400 text-sm font-medium">Trademark: TechFlow™</div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { done: true, title: 'Trademark Search Complete', sub: 'No conflicts found' },
                      { done: true, title: 'Application Filed with USPTO', sub: 'Serial #88/123456' },
                      { done: false, active: true, title: 'Under USPTO Review', sub: 'Est. 6–8 months' },
                      { done: false, active: false, title: 'Registration Approved', sub: 'Pending' },
                    ].map(({ done, active, title, sub }) => (
                      <div key={title} className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : active ? 'bg-amber-500' : 'bg-white/10'}`}>
                          {done ? <Check size={14} className="text-white" strokeWidth={3} /> : <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-white animate-pulse' : 'bg-white/30'}`} />}
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${done || active ? 'text-white' : 'text-slate-500'}`}>{title}</div>
                          <div className="text-xs text-slate-500">{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="text-xs text-amber-400 font-semibold mb-1">New message from your attorney</div>
                    <div className="text-sm text-slate-300">"Your application is progressing smoothly. I'll keep you updated as we move through review."</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">FAQ</span>
            <h2 className="text-4xl font-bold text-slate-900 font-display mb-4">Common questions</h2>
            <p className="text-slate-500">
              Have more questions?{' '}
              <Link to="/contact" className="text-amber-600 font-semibold hover:text-amber-700 transition-colors">
                Contact our team
              </Link>
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-amber-200 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-slate-900 pr-4">{q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180 text-amber-500' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.08),transparent_65%)]" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-4 py-2 mb-6">
            <Shield size={16} className="text-amber-400" />
            <span className="text-amber-400 text-sm font-semibold">Your brand deserves real protection</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-extrabold font-display mb-6 leading-tight">
            Ready to secure your<br />trademark?
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Start today with real USPTO-experienced attorneys, a comprehensive search, and a flat $499 fee — no surprises, no hourly rates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-5 rounded-xl font-bold text-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-2xl shadow-amber-500/30 hover:scale-[1.02]"
            >
              Start Registration — $499
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/trademark-search-request')}
              className="flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white/15 transition-all"
            >
              <FileSearch size={20} />
              Start with Free Search
            </button>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><Lock size={12} />Secure checkout</span>
            <span className="flex items-center gap-1.5"><Shield size={12} />Attorney-client privilege</span>
            <span className="flex items-center gap-1.5"><CheckCircle size={12} />No hidden fees</span>
          </div>
        </div>
      </section>
    </div>
  );
}
