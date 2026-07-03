import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, FileCheck, Send, Award, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import SchemaMarkup, { howToSchema } from '../components/SchemaMarkup';
import FAQSection, { processFAQs } from '../components/FAQSection';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function ProcessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO['process']);
  }, []);

  const steps = [
    {
      number: '01',
      icon: Search,
      title: 'Consultation & Comprehensive Search',
      phase: 'Getting Started',
      timeline: 'Days 1–7',
      timeframe: '~1 week',
      description:
        'Before a single dollar is spent on filing fees, we conduct a thorough search to identify any conflicts that could derail your application. We combine federal, state, and common law research with an attorney-led likelihood-of-confusion analysis.',
      whatToExpect:
        'A free initial consultation to understand your brand, followed by a written search report with a clear recommendation — proceed, modify, or consider an alternative mark.',
      details: [
        'Free consultation to understand your brand and goals',
        'Full USPTO TESS federal database search',
        'State trademark registration review',
        'Common law business name and domain search',
        'Social media handle availability check',
        'Written conflict analysis and attorney opinion',
      ],
    },
    {
      number: '02',
      icon: FileCheck,
      title: 'Application Preparation & Filing',
      phase: 'Filing Your Mark',
      timeline: 'Days 7–14',
      timeframe: '~1 week',
      description:
        'Once cleared, our attorneys prepare your application with precisely drafted goods and services descriptions, the correct trademark classes, and any required specimens. Accuracy at this stage directly determines the scope of your protection.',
      whatToExpect:
        'A completed, attorney-reviewed application filed electronically with the USPTO. You receive your official serial number the same day, establishing your priority date.',
      details: [
        'Selection of the appropriate Nice Classification class(es)',
        'Precisely drafted goods and services descriptions',
        'Specimen of use preparation and review',
        'Strategic filing basis determination (use-in-commerce or intent-to-use)',
        'Electronic TEAS filing with USPTO',
        'Serial number confirmation delivered immediately',
      ],
    },
    {
      number: '03',
      icon: Send,
      title: 'USPTO Examination',
      phase: 'Federal Review',
      timeline: 'Months 3–8',
      timeframe: '3–6 months',
      description:
        'A USPTO examining attorney reviews your application for legal compliance and searches for conflicting marks. If the examiner has concerns — called an Office Action — our attorneys prepare a substantive legal response to overcome the objection.',
      whatToExpect:
        'Regular status updates from our team. If an Office Action is issued, you\'ll receive our full analysis and response strategy. Approximately 60% of applications receive at least one Office Action — we handle it.',
      details: [
        'Assignment to a USPTO examining attorney',
        'Comprehensive legal and procedural review',
        'USPTO conflict search against registered marks',
        'Assessment of distinctiveness and registrability',
        'Office Action response drafted and filed if needed (within 6-month deadline)',
        'We monitor and notify you at every stage',
      ],
      note: 'Office Actions can extend this phase by 2–3 months. Our attorneys handle all responses.',
    },
    {
      number: '04',
      icon: Award,
      title: 'Publication, Approval & Registration',
      phase: 'Final Steps',
      timeline: 'Months 8–18',
      timeframe: '1–10 months',
      description:
        'Once approved by the examiner, your mark is published in the USPTO Official Gazette for a 30-day opposition window. Assuming no opposition, the USPTO issues your official registration certificate, and your nationwide ® rights are active.',
      whatToExpect:
        'Your official federal trademark registration certificate. You\'ll also receive maintenance reminders for the required 5–6 year and 9–10 year USPTO filings to keep your registration active.',
      details: [
        'Publication in the USPTO Official Gazette',
        '30-day public opposition window',
        'Monitoring for any third-party opposition filings',
        'Statement of Use filing (for intent-to-use applications)',
        'Official registration certificate issued',
        'Maintenance schedule and renewal reminders provided',
      ],
      note: 'Opposition is rare — less than 5% of applications are opposed.',
    },
  ];

  const processSchemaData = howToSchema({
    name: 'How to Register a Trademark with USPTO',
    description:
      'Complete step-by-step guide to registering your trademark with the United States Patent and Trademark Office. Learn the entire process from consultation to registration certificate.',
    steps: steps.map((step) => ({
      name: step.title,
      text: step.description,
    })),
    totalTime: 'P8M',
    estimatedCost: '849',
  });

  return (
    <div className="bg-white min-h-screen">
      <SchemaMarkup schema={processSchemaData} />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.13),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              Step-by-Step Process
            </p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              The Trademark Registration Process
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              From your first consultation to your official ® certificate, here's exactly what happens —
              and when. USPTO registration typically takes 8–18 months total.
            </p>

            {/* Timeline stat row */}
            <div className="flex flex-wrap gap-5">
              {[
                { value: '8–18', label: 'Months to Registration' },
                { value: '3–6', label: 'Months to Examination' },
                { value: '~1', label: 'Week to File' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-center min-w-[120px]">
                  <p className="text-3xl font-bold text-gold-400">{stat.value}</p>
                  <p className="text-xs text-slate-300 mt-1 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Step-by-Step Timeline ─────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              The Full Journey
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">Four Phases to Federal Protection</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We manage every step. Here's what you can expect at each stage of the process.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical rule */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-gold-400 via-navy-300 to-navy-800 hidden md:block" />

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={index} className="relative flex flex-col md:flex-row gap-6">
                  {/* Step icon */}
                  <div className="flex-shrink-0 flex md:justify-center md:w-12">
                    <div className="w-12 h-12 rounded-full bg-navy-900 border-4 border-slate-50 flex items-center justify-center relative z-10 shadow-md">
                      <step.icon className="text-gold-400" size={20} />
                    </div>
                  </div>

                  {/* Step card */}
                  <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-7 md:p-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-1.5">
                          Phase {step.number} — {step.phase}
                        </p>
                        <h3 className="text-2xl font-bold text-navy-900">{step.title}</h3>
                      </div>
                      <div className="flex-shrink-0 bg-gold-500/10 border border-gold-200 rounded-xl px-4 py-3 text-center">
                        <p className="text-xs font-semibold text-gold-700 uppercase tracking-wide mb-0.5">
                          Timeline
                        </p>
                        <p className="text-lg font-bold text-navy-900 leading-none">{step.timeline}</p>
                        <p className="text-xs text-slate-500 mt-1">{step.timeframe}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-5">{step.description}</p>

                    {/* What to expect callout */}
                    <div className="bg-navy-900/5 border border-navy-900/10 rounded-xl p-4 mb-5">
                      <p className="text-xs font-semibold uppercase tracking-widest text-navy-700 mb-2">
                        What You Can Expect
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">{step.whatToExpect}</p>
                    </div>

                    {/* Details list */}
                    <div className="bg-slate-50 rounded-xl p-5">
                      <p className="text-xs font-bold text-navy-900 uppercase tracking-widest mb-3">
                        What Happens at This Stage
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                            <CheckCircle
                              size={15}
                              className="text-gold-600 flex-shrink-0 mt-0.5"
                            />
                            <span className="leading-snug">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Optional note */}
                    {step.note && (
                      <div className="mt-4 flex items-start gap-2.5 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl p-4">
                        <AlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
                        <span>{step.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline Overview (Featured Dark Card) ───────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-navy-900 text-white rounded-2xl p-10 md:p-14">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">
                At a Glance
              </p>
              <h2 className="text-4xl font-bold mb-3">Total Timeline Overview</h2>
              <p className="text-slate-300 max-w-xl mx-auto">
                USPTO processing times vary, but here's what most clients experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {[
                {
                  value: '8–18',
                  unit: 'Months',
                  label: 'Average time to registration',
                  note: 'For straightforward applications',
                },
                {
                  value: '3–6',
                  unit: 'Months',
                  label: 'Initial USPTO examination',
                  note: 'From filing to first action',
                },
                {
                  value: '~7',
                  unit: 'Days',
                  label: 'From consultation to filing',
                  note: 'We move efficiently',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-7 text-center"
                >
                  <p className="text-5xl font-black text-gold-400 leading-none mb-1">{stat.value}</p>
                  <p className="text-base font-semibold text-white mb-1">{stat.unit}</p>
                  <p className="text-sm font-medium text-slate-200">{stat.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.note}</p>
                </div>
              ))}
            </div>

            {/* Timeline notes */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-7">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gold-400" />
                Important Timeline Factors
              </h3>
              <ul className="space-y-4 text-sm">
                {[
                  {
                    title: 'Office Actions',
                    body: 'About 60% of applications receive at least one Office Action. Our attorneys handle the response — typically adding 2–3 months to the timeline.',
                  },
                  {
                    title: 'Opposition Proceedings',
                    body: 'Less than 5% of applications face a third-party opposition during the 30-day publication window. We monitor and respond if needed.',
                  },
                  {
                    title: 'Intent-to-Use Applications',
                    body: 'If you haven\'t yet used the mark in commerce, we file on an intent-to-use basis. A Statement of Use is required before final registration.',
                  },
                  {
                    title: 'Faster Processing',
                    body: 'Thorough preparation before filing — correct classes, precise descriptions, strong specimens — is the single best way to minimize delays.',
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Clock size={16} className="text-gold-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      <strong className="text-white">{item.title}:</strong> {item.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── What Sets Us Apart ───────────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
              Our Commitment
            </p>
            <h2 className="text-4xl font-bold text-navy-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              We combine expert legal skill with clear communication and transparent pricing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Expert Guidance at Every Step',
                body: 'A licensed trademark attorney handles your matter throughout — from initial search through final certificate. You\'re never handed off to a paralegal or left without answers.',
              },
              {
                title: 'Transparent Communication',
                body: 'We proactively update you at each milestone. No waiting, no guessing — you always know where your application stands.',
              },
              {
                title: 'Transparent Flat-Fee Pricing',
                body: 'Packages start at $499 for attorney fees plus the $350 USPTO filing fee per class. No surprise invoices, no hourly rates, no hidden charges.',
              },
              {
                title: 'High Approval Rates',
                body: 'Our thorough pre-filing preparation and experienced Office Action responses result in significantly higher approval rates than self-filed applications.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircle size={19} className="text-gold-500 flex-shrink-0 mt-0.5" />
                  <h3 className="text-lg font-bold text-navy-900">{item.title}</h3>
                </div>
                <p className="text-slate-500 leading-relaxed text-sm pl-8">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQSection faqs={processFAQs} title="Process Questions" />

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600 mb-3">
            Ready to Begin?
          </p>
          <h2 className="text-4xl font-bold text-navy-900 mb-4">
            Start Your Trademark Journey Today
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-xl mx-auto">
            Get expert trademark registration from search through certificate — all for a flat fee.
            No hourly billing. No surprises.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate('/get-started')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-gold-500/20"
            >
              Start Your Registration
            </button>
            <button
              onClick={() => navigate('/trademark-search-request')}
              className="bg-navy-900 hover:bg-navy-800 text-white font-semibold px-6 py-3 rounded-xl transition-all"
            >
              Start with a Search First
            </button>
          </div>
          <p className="text-sm text-slate-400 mt-5">
            Packages start at $499 + $350 USPTO fee · Transparent pricing · Expert attorneys
          </p>
        </div>
      </section>
    </div>
  );
}
