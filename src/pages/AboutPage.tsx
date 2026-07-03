import { Shield, Target, Users, Award, TrendingUp, Heart, ArrowRight, Calendar, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { organizationSchema, professionalServiceSchema } from '../components/SchemaMarkup';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.about);
  }, []);

  const stats = [
    { number: '2,400+', label: 'Trademarks Filed' },
    { number: '10+', label: 'Years Experience' },
    { number: '50', label: 'States Served' },
    { number: '98%', label: 'Satisfaction Rate' },
  ];

  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description:
        'We maintain the highest ethical standards in all our client relationships and trademark work.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description:
        'Our commitment to quality ensures every trademark application receives meticulous attention.',
    },
    {
      icon: Users,
      title: 'Client-Focused',
      description:
        'Your success is our priority. We provide personalized service and clear communication throughout.',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description:
        'Professional trademark services should be affordable and transparent for businesses of all sizes.',
    },
  ];

  const whyChooseItems = [
    {
      icon: Award,
      title: 'Experienced Legal Team',
      description:
        'Every application is reviewed by licensed trademark attorneys with deep USPTO experience.',
    },
    {
      icon: TrendingUp,
      title: 'Proven Track Record',
      description:
        '98% satisfaction rate with thousands of successfully registered trademarks nationwide.',
    },
    {
      icon: Shield,
      title: 'Transparent Pricing',
      description:
        "No hidden fees, no hourly billing. Know exactly what you'll pay upfront.",
    },
  ];

  const commitmentItems = [
    'Licensed trademark attorneys in every filing',
    'Flat-fee pricing with no hidden costs',
    'Federal protection available in all 50 states',
    'Dedicated client portal access',
    'Application monitoring throughout the process',
    'Post-registration guidance and support',
  ];

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, professionalServiceSchema]} />

      {/* Hero */}
      <section className="bg-navy-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              About Marq Legal LLC
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trademark Protection You Can Trust
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed mb-10">
              We're a modern trademark law firm dedicated to making brand protection accessible,
              affordable, and straightforward for businesses across all 50 states.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/get-started')}
                className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
              >
                Start Your Application
                <ArrowRight size={20} />
              </button>
              <button
                onClick={() => navigate('/process')}
                className="border border-white/30 hover:border-white/60 text-white font-semibold px-8 py-4 rounded-xl transition-all"
              >
                View Our Process
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-navy-950 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-gold-500 mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Attorney Bio */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Your Legal Team
            </p>
            <h2 className="text-4xl font-bold text-navy-900">Meet Your Lead Attorney</h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg overflow-hidden transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                {/* Left sidebar */}
                <div className="bg-navy-900 p-8 flex flex-col items-center justify-center text-center">
                  <div className="w-48 h-48 mb-6 rounded-2xl overflow-hidden border-4 border-gold-500 shadow-xl">
                    <img
                      src="https://i.imgur.com/eXHYjog.png"
                      alt="Mary Liberty, Owner and Lead Attorney"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Mary Liberty</h3>
                  <p className="text-gold-500 font-semibold mb-5">Owner & Lead Attorney</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-white">
                      Trademark Law
                    </span>
                    <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-white">
                      USPTO Expert
                    </span>
                    <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-xs text-white">
                      IP Strategy
                    </span>
                  </div>
                </div>

                {/* Right content */}
                <div className="lg:col-span-2 p-8 lg:p-12">
                  <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                    Mary Liberty founded Marq Legal with a clear vision: to make professional
                    trademark protection accessible to businesses of all sizes. As owner and lead
                    attorney, she has assembled a dedicated team with extensive experience in
                    intellectual property law and thousands of successful trademark registrations.
                  </p>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-navy-900 mb-0.5">Comprehensive Expertise</p>
                        <p className="text-slate-600 text-sm">
                          Our team specializes in trademark registration, USPTO procedures, and brand
                          protection strategies for businesses in every industry.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-navy-900 mb-0.5">Client-Centered Approach</p>
                        <p className="text-slate-600 text-sm">
                          Personalized attention to every case with clear communication and tailored
                          guidance at each step of the process.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="text-gold-600 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="font-semibold text-navy-900 mb-0.5">Proven Track Record</p>
                        <p className="text-slate-600 text-sm">
                          Thousands of trademarks successfully registered for businesses nationwide
                          with a 98% client satisfaction rate.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-gold-500">
                    <p className="text-slate-700 italic leading-relaxed text-sm">
                      "Every business deserves the security and confidence that comes with federal
                      trademark protection. My goal is to make that protection accessible, affordable,
                      and straightforward for entrepreneurs and established companies alike."
                    </p>
                    <p className="text-slate-500 text-sm mt-3 font-medium">
                      — Mary Liberty, Owner & Lead Attorney
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
                Our Mission
              </p>
              <h2 className="text-4xl font-bold text-navy-900 mb-6">
                Democratizing Access to Brand Protection
              </h2>
              <p className="text-lg text-slate-600 mb-5 leading-relaxed">
                At Marq Legal, we believe that every business deserves professional trademark
                protection without the complexity and uncertainty of traditional legal pricing. Our
                mission is to make intellectual property services accessible through transparent,
                flat-fee pricing and exceptional client service.
              </p>
              <p className="text-lg text-slate-600 mb-5 leading-relaxed">
                Founded by experienced trademark attorneys who witnessed firsthand the challenges
                small businesses face when protecting their brands, we set out to create a better
                way — combining cutting-edge technology with personalized legal expertise to deliver
                results efficiently and affordably.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Today, we've helped thousands of businesses across all 50 states secure federal
                trademark protection, and we're proud to be their trusted partner in brand growth.
              </p>
            </div>

            <div className="bg-navy-900 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold text-white mb-1">Why Choose Marq Legal?</h3>
              <p className="text-slate-400 text-sm mb-8">The advantages that set us apart</p>
              <div className="space-y-6">
                {whyChooseItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="bg-gold-500/20 rounded-lg p-2.5 flex-shrink-0">
                      <item.icon className="text-gold-400" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">{item.title}</p>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Our Values
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">The Principles That Guide Us</h2>
            <p className="text-lg text-slate-600">
              The foundation of every client relationship and every application we file
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all p-6 text-center"
              >
                <div className="bg-navy-900 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-gold-500" size={26} />
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Calendar className="mx-auto mb-6 text-gold-500" size={48} />
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
            Simple Process
          </p>
          <h2 className="text-4xl font-bold text-white mb-6">Our Streamlined Process</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            From initial consultation to federal registration, we guide you through every step with
            transparency and expertise. Typically completed in 8–12 months.
          </p>
          <button
            onClick={() => navigate('/process')}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg inline-flex items-center gap-2"
          >
            View Detailed Process Timeline
            <ArrowRight size={20} />
          </button>
          <p className="text-slate-400 text-sm mt-4">See exactly what happens at each step and when</p>
        </div>
      </section>

      {/* Commitment */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
                  Our Commitment
                </p>
                <h2 className="text-4xl font-bold text-navy-900 mb-6">
                  Your Partner in Brand Protection
                </h2>
                <p className="text-lg text-slate-600 mb-5 leading-relaxed">
                  When you choose Marq Legal, you're not just getting a trademark registration
                  service — you're gaining a partner invested in your brand's long-term success.
                </p>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Whether you're in California, New York, Texas, Florida, or anywhere in between,
                  our team is ready to protect your brand with federal trademark registration
                  available in all 50 states.
                </p>
                <button
                  onClick={() => navigate('/get-started')}
                  className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl transition-all inline-flex items-center gap-2"
                >
                  Start Your Trademark Application
                  <ArrowRight size={18} />
                </button>
              </div>

              <div className="space-y-3">
                {commitmentItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white rounded-xl p-4 border border-slate-200"
                  >
                    <div className="bg-gold-500/20 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="text-gold-600" size={17} />
                    </div>
                    <span className="text-navy-900 font-medium text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
