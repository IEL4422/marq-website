import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileCheck, Send, Eye, Gavel, CheckCircle, Clock, Calendar } from 'lucide-react';
import SchemaMarkup, { howToSchema } from '../components/SchemaMarkup';
import FAQSection, { processFAQs } from '../components/FAQSection';

export default function ProcessPage() {
  const navigate = useNavigate();
  const steps = [
    {
      icon: Search,
      title: 'Initial Consultation & Search',
      timeline: 'Day 1-3',
      duration: '2-3 days',
      description: 'We discuss your business, brand goals, and conduct a comprehensive trademark search to identify potential conflicts.',
      details: [
        'Free initial consultation to understand your needs',
        'Comprehensive federal database search',
        'Common law and state trademark searches',
        'Domain name and social media availability check',
        'Detailed conflict analysis report'
      ]
    },
    {
      icon: FileCheck,
      title: 'Application Preparation',
      timeline: 'Day 4-7',
      duration: '3-4 days',
      description: 'Our attorneys prepare your application with precise classifications, descriptions, and supporting documentation.',
      details: [
        'Selection of appropriate trademark classes',
        'Crafting precise goods/services descriptions',
        'Preparation of specimens of use',
        'Strategic filing basis determination',
        'Attorney review and quality assurance'
      ]
    },
    {
      icon: Send,
      title: 'USPTO Filing',
      timeline: 'Day 8',
      duration: '1 day',
      description: 'We electronically file your application with the USPTO and provide you with your official serial number.',
      details: [
        'Electronic filing via USPTO TEAS system',
        'Immediate confirmation and serial number',
        'Filing receipt documentation',
        'Application tracking setup',
        'Client notification and dashboard access'
      ]
    },
    {
      icon: Clock,
      title: 'USPTO Examination',
      timeline: 'Month 3-4',
      duration: '3-4 months',
      description: 'A USPTO examining attorney reviews your application for compliance and potential conflicts.',
      details: [
        'Assignment to examining attorney',
        'Comprehensive legal review',
        'Search for conflicting marks',
        'Assessment of distinctiveness',
        'Formalities and compliance check'
      ]
    },
    {
      icon: Gavel,
      title: 'Office Action Response',
      timeline: 'Month 4-6',
      duration: 'If needed, 2-3 months',
      description: 'If the USPTO raises concerns, we prepare and file a comprehensive legal response to overcome objections.',
      details: [
        'Detailed analysis of USPTO concerns',
        'Legal research and strategy development',
        'Preparation of persuasive arguments',
        'Amendment of application if beneficial',
        'Timely filing within 6-month deadline'
      ],
      optional: true
    },
    {
      icon: Eye,
      title: 'Publication for Opposition',
      timeline: 'Month 6-7',
      duration: '30 days',
      description: 'Your mark is published in the Official Gazette, allowing third parties to oppose if they believe it affects their rights.',
      details: [
        'Publication in USPTO Official Gazette',
        'Public notice of pending registration',
        '30-day opposition window',
        'Monitoring for opposition filings',
        'Extension request handling if needed'
      ]
    },
    {
      icon: CheckCircle,
      title: 'Registration & Certificate',
      timeline: 'Month 8-12',
      duration: 'Final step',
      description: 'Upon successful completion, the USPTO issues your official trademark registration certificate.',
      details: [
        'Official registration certificate issued',
        'Federal trademark protection active',
        'Right to use ® symbol',
        'Nationwide exclusive rights',
        'Maintenance reminder setup (Years 5-6, 9-10)'
      ]
    }
  ];

  const processSchemaData = howToSchema({
    name: "How to Register a Trademark with USPTO",
    description: "Complete step-by-step guide to registering your trademark with the United States Patent and Trademark Office. Learn the entire process from consultation to registration certificate.",
    steps: steps.map(step => ({
      name: step.title,
      text: step.description
    })),
    totalTime: "P8M",
    estimatedCost: "1249"
  });

  return (
    <div className="bg-white min-h-screen">
      <SchemaMarkup schema={processSchemaData} />
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/about')}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 font-medium"
          >
            <ArrowLeft size={20} />
            Back to About
          </button>
          <div className="text-center">
            <Calendar className="mx-auto mb-6 text-amber-400" size={48} />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">The Trademark Process</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              A clear, step-by-step journey from initial consultation to federal registration.
              Typically completed in 8-12 months.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-slate-300 to-green-500 hidden md:block"></div>

            <div className="space-y-12">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0 md:w-16 flex md:justify-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center relative z-10 shadow-lg ${
                          step.optional
                            ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                            : 'bg-gradient-to-br from-slate-900 to-slate-700'
                        }`}>
                          <Icon className="text-amber-400" size={28} />
                        </div>
                      </div>

                      <div className="flex-grow">
                        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow p-8 border border-slate-200">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-bold text-slate-900">{step.title}</h3>
                                {step.optional && (
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                    If Needed
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600 text-lg">{step.description}</p>
                            </div>
                            <div className="flex-shrink-0">
                              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-lg px-4 py-3 text-center">
                                <div className="text-xs font-semibold text-amber-800 uppercase tracking-wide mb-1">
                                  Timeline
                                </div>
                                <div className="text-lg font-bold text-amber-900">{step.timeline}</div>
                                <div className="text-xs text-amber-700 mt-1">{step.duration}</div>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 bg-slate-50 rounded-lg p-5">
                            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3">
                              What Happens
                            </h4>
                            <ul className="space-y-2">
                              {step.details.map((detail, detailIndex) => (
                                <li key={detailIndex} className="flex items-start gap-3 text-slate-700">
                                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                                  <span className="text-sm leading-relaxed">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-10 text-white">
            <h2 className="text-3xl font-bold mb-6 text-center">Total Timeline Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
                <div className="text-4xl font-bold text-amber-400 mb-2">8-12</div>
                <div className="text-slate-300 font-medium">Months to Registration</div>
                <div className="text-sm text-slate-400 mt-2">Average timeline for straightforward applications</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
                <div className="text-4xl font-bold text-amber-400 mb-2">3-4</div>
                <div className="text-slate-300 font-medium">Months to Examination</div>
                <div className="text-sm text-slate-400 mt-2">Initial USPTO review period</div>
              </div>
              <div className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
                <div className="text-4xl font-bold text-amber-400 mb-2">1-7</div>
                <div className="text-slate-300 font-medium">Days to File</div>
                <div className="text-sm text-slate-400 mt-2">From consultation to submission</div>
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold mb-4">Important Timeline Notes</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-start gap-3">
                  <Clock className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <span>
                    <strong className="text-white">Office Actions</strong> can extend the timeline by 2-3 months.
                    Approximately 60% of applications receive at least one office action.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <span>
                    <strong className="text-white">Opposition Proceedings</strong> are rare but can significantly
                    extend timelines. Less than 5% of applications face opposition.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <span>
                    <strong className="text-white">Intent-to-Use Applications</strong> require additional time
                    and a Statement of Use filing before registration is complete.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="text-amber-400 flex-shrink-0 mt-1" size={20} />
                  <span>
                    <strong className="text-white">Faster Processing</strong> is possible with proper preparation
                    and experienced legal representation guiding the process.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What Sets Us Apart</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Expert Guidance Every Step</h3>
              <p className="text-slate-600 leading-relaxed">
                Our experienced trademark attorneys handle every detail, from initial search through registration
                and beyond. You're never alone in the process.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Communication</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive regular updates at each milestone. Our client dashboard keeps you informed of your
                application status 24/7.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Pricing</h3>
              <p className="text-slate-600 leading-relaxed">
                Packages start at $299 for the Base Package, plus required USPTO filing fee of $350 per class. Premium Package at $699 includes express processing, procedural office action response, and monitoring. No surprise bills or hourly rates.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-3">High Success Rate</h3>
              <p className="text-slate-600 leading-relaxed">
                Our thorough preparation and experienced responses to office actions result in significantly
                higher approval rates than DIY applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={processFAQs} title="Process Questions" />

      <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Start Your Trademark Journey?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Get started with our comprehensive trademark registration service today.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Packages start at $499 + USPTO fees • Transparent pricing • Expert representation
          </p>
        </div>
      </section>
    </div>
  );
}
