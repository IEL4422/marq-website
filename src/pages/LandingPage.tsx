import { Shield, CheckCircle, ArrowRight, FileSearch, Monitor, MessageCircle, Star, Clock, Award, Users, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { organizationSchema, websiteSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import ReviewCarousel from '../components/ReviewCarousel';
import FeaturedOn from '../components/FeaturedOn';
import { updatePageSEO, pageSEO } from '../utils/seo';

const STATS = [
  { value: '2,400+', label: 'Trademarks Filed', icon: Shield },
  { value: '98%', label: 'Client Satisfaction', icon: Star },
  { value: '24hr', label: 'Search Turnaround', icon: Clock },
  { value: '50', label: 'States Served', icon: Award },
];

const SERVICES = [
  {
    icon: FileSearch,
    title: 'Trademark Search',
    price: 'From $199',
    desc: 'Attorney-reviewed comprehensive search with 24-hour results. Know your registrability before you file.',
    path: '/trademark-search',
  },
  {
    icon: Shield,
    title: 'Trademark Registration',
    price: '$499 + USPTO fees',
    desc: 'Full-service trademark registration prepared and filed by an experienced USPTO attorney.',
    path: '/trademark-registration',
    featured: true,
  },
  {
    icon: Monitor,
    title: 'Trademark Monitoring',
    price: '$149/year',
    desc: 'Ongoing monitoring of your trademark with alerts when potential infringers are detected.',
    path: '/trademark-monitoring',
  },
  {
    icon: MessageCircle,
    title: 'Office Action Response',
    price: 'From $399',
    desc: 'Expert responses to USPTO office actions, protecting your application from rejection.',
    path: '/office-action',
  },
];

const PROCESS_STEPS = [
  { step: '01', title: 'Get a Free Quote', desc: 'Tell us about your brand. We\'ll assess your trademark and provide a clear flat-fee quote with no surprises.' },
  { step: '02', title: 'Attorney Search', desc: 'Our attorneys conduct a thorough federal and state trademark search and provide a detailed risk analysis.' },
  { step: '03', title: 'File Your Application', desc: 'We prepare and file your USPTO application with precision, ensuring it meets all formal requirements.' },
  { step: '04', title: 'Monitoring & Updates', desc: 'We monitor your application throughout the review process and keep you updated at every stage.' },
];

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.home);
  }, []);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, websiteSchema, offerCatalogSchema]} />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-navy-800/60 via-navy-950 to-navy-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-navy-700/30 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/20 rounded-full px-4 py-1.5">
                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-gold-400 uppercase tracking-wider">Available in All 50 States</span>
              </div>

              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
                Protect Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-300">
                  Brand &amp; IP
                </span>
                with Confidence
              </h1>

              <p className="text-xl text-slate-300 leading-relaxed max-w-xl">
                Flat-fee trademark registration by real USPTO-experienced attorneys. No hidden fees, no paralegals — just expert legal protection for your brand.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Flat-fee pricing — no surprises',
                  'Real attorneys, not paralegals',
                  '24-hour trademark search results',
                  'Support from filing to registration',
                ].map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle size={16} className="text-gold-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={() => navigate('/get-started')}
                  className="group inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-2xl shadow-gold-500/20 hover:shadow-gold-400/30 text-base"
                >
                  Start Your Trademark
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium px-8 py-4 rounded-xl transition-all text-base"
                >
                  <FileSearch size={18} />
                  Free Trademark Search
                </button>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <div className="flex -space-x-2">
                  {['#1E3A5F','#2C4A6E','#3A5F8A','#4A7098'].map((bg, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-navy-950 flex items-center justify-center text-xs font-bold text-white" style={{ background: bg }}>
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex text-gold-400 text-sm">{'★★★★★'}</div>
                  <p className="text-xs text-slate-400 mt-0.5">Trusted by 2,400+ business owners</p>
                </div>
              </div>
            </div>

            {/* Pricing card */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-br from-gold-500/30 to-navy-700/30 rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-semibold text-gold-600 uppercase tracking-widest">Most Popular</p>
                      <h3 className="text-xl font-bold text-navy-900 mt-1">Trademark Registration</h3>
                    </div>
                    <div className="w-12 h-12 bg-navy-900 rounded-xl flex items-center justify-center">
                      <Shield size={22} className="text-gold-400" />
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-navy-900">$499</span>
                      <span className="text-slate-500 text-sm">attorney fee</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">+ $350 USPTO filing fee per class</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {[
                      'Comprehensive trademark search',
                      'Professional application prep',
                      'USPTO filing & docketing',
                      'Office action monitoring',
                      'Direct attorney communication',
                      'Free preliminary consultation',
                    ].map(feature => (
                      <li key={feature} className="flex items-center gap-3 text-sm text-slate-700">
                        <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate('/get-started')}
                    className="w-full bg-navy-900 hover:bg-navy-800 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Get Started Now <ArrowRight size={16} />
                  </button>

                  <p className="text-center text-xs text-slate-400 mt-4">Payment plans available • No hidden fees</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="relative border-t border-white/10 bg-navy-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-gold-400" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{value}</div>
                    <div className="text-xs text-slate-400">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured On */}
      <section className="py-10 border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-6">As Featured In</p>
          <FeaturedOn />
        </div>
      </section>

      {/* Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">Our Services</p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Comprehensive Trademark Protection</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              From initial search to ongoing protection, we provide everything your brand needs to stay secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {SERVICES.map(({ icon: Icon, title, price, desc, path, featured }) => (
              <div
                key={title}
                className={`relative rounded-2xl p-7 border transition-all hover:-translate-y-1 hover:shadow-xl cursor-pointer group ${
                  featured
                    ? 'bg-navy-900 border-navy-800 text-white shadow-lg shadow-navy-900/20'
                    : 'bg-white border-slate-200 hover:border-navy-200'
                }`}
                onClick={() => navigate(path)}
              >
                {featured && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-gold-500 text-navy-950 text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${featured ? 'bg-navy-800' : 'bg-navy-50'}`}>
                  <Icon size={22} className={featured ? 'text-gold-400' : 'text-navy-700'} />
                </div>
                <h3 className={`text-lg font-bold mb-1 ${featured ? 'text-white' : 'text-navy-900'}`}>{title}</h3>
                <p className={`text-sm font-semibold mb-3 ${featured ? 'text-gold-400' : 'text-gold-600'}`}>{price}</p>
                <p className={`text-sm leading-relaxed mb-5 ${featured ? 'text-slate-300' : 'text-slate-600'}`}>{desc}</p>
                <button className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-all group-hover:gap-2.5 ${featured ? 'text-gold-400' : 'text-navy-700'}`}>
                  Learn more <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 text-navy-700 font-semibold hover:text-navy-900 transition-colors border border-navy-200 hover:border-navy-400 px-6 py-3 rounded-xl">
              View All Pricing <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Marq */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">Why Marq Legal</p>
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Attorney-Led Trademark Services Without Big Law Fees
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Most online trademark services use paralegals or automation. At Marq Legal, every trademark is handled directly by a licensed USPTO attorney — giving you real legal expertise at a fraction of traditional law firm costs.
              </p>
              <div className="space-y-6">
                {[
                  { icon: Award, title: 'Licensed USPTO Attorneys', desc: 'Your trademark is filed by a real attorney registered with the USPTO, not a document service or paralegal.' },
                  { icon: Zap, title: 'Flat Fees — No Hourly Billing', desc: 'We charge one clear flat fee. You always know exactly what you\'ll pay before we start work.' },
                  { icon: Users, title: 'Dedicated Client Support', desc: 'Direct access to your attorney throughout the process. Reach us by email or phone, no call centers.' },
                  { icon: TrendingUp, title: 'High Success Rate', desc: 'Our experienced attorneys consistently achieve higher USPTO approval rates than industry averages.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-navy-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon size={18} className="text-navy-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-navy-900 mb-1">{title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Process card */}
              <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-navy-900 mb-6">How It Works</h3>
                <div className="space-y-5">
                  {PROCESS_STEPS.map(({ step, title, desc }) => (
                    <div key={step} className="flex gap-4">
                      <div className="text-sm font-bold text-gold-500 w-6 flex-shrink-0 pt-0.5">{step}</div>
                      <div>
                        <h4 className="font-semibold text-navy-900 text-sm mb-1">{title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA mini */}
              <div className="bg-navy-900 rounded-2xl p-7 text-white">
                <h3 className="text-lg font-bold mb-2">Ready to protect your brand?</h3>
                <p className="text-sm text-slate-300 mb-5">Join thousands of businesses who trust Marq Legal with their trademark needs.</p>
                <button
                  onClick={() => navigate('/get-started')}
                  className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  Start Your Trademark <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">Client Reviews</p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What Our Clients Say</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="flex text-gold-500">{'★★★★★'}</div>
              <span className="text-slate-600 font-medium">4.9/5 from 200+ reviews</span>
            </div>
          </div>
          <ReviewCarousel />
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 bg-navy-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-navy-800/50 to-navy-950" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-navy-800 rounded-2xl mb-6 mx-auto">
            <Shield size={28} className="text-gold-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Your Brand Deserves Real Protection</h2>
          <p className="text-xl text-slate-300 mb-10 leading-relaxed">
            Don't risk your brand. Get expert trademark protection from licensed attorneys at a price that makes sense.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/get-started')}
              className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-xl shadow-gold-500/20 text-base"
            >
              Start Your Trademark Today <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/contact')}
              className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 hover:bg-white/5 text-white font-medium px-8 py-4 rounded-xl transition-all text-base"
            >
              Schedule a Consultation
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-6">Payment plans available • All 50 states • No hidden fees</p>
        </div>
      </section>
    </div>
  );
}
