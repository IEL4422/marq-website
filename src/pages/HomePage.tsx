import { Shield, CheckCircle, FileSearch, FileText, Send, Award, MapPin, DollarSign, UserCheck, Monitor, MessageCircle, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { organizationSchema, websiteSchema, howToSchema, serviceSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import FAQSection, { trademarkFAQs } from '../components/FAQSection';
import ReviewCarousel from '../components/ReviewCarousel';
import FeaturedOn from '../components/FeaturedOn';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.home);
  }, []);
  const processSteps = [
    {
      icon: FileSearch,
      title: 'Comprehensive Search',
      description: 'We conduct a thorough trademark search to ensure your mark is available for registration.'
    },
    {
      icon: FileText,
      title: 'Application Preparation',
      description: 'Real attorneys with USPTO trademark experience prepare and file your application with the USPTO.'
    },
    {
      icon: Send,
      title: 'Filing & Monitoring',
      description: 'We file your application and monitor its progress through the entire registration process.'
    },
    {
      icon: Award,
      title: 'Registration Complete',
      description: 'Receive your official trademark registration certificate and ongoing support.'
    }
  ];

  const benefits = [
    'Protection against unauthorized use of your brand',
    'Exclusive rights to use your mark nationwide',
    'Legal presumption of ownership',
    'Ability to use the ® symbol',
    'Enhanced brand value and credibility',
    'Foundation for international trademark protection'
  ];

  const processSchemaData = howToSchema({
    name: "How to Register a Trademark",
    description: "Complete guide to registering your trademark with the USPTO. Our streamlined process makes trademark protection simple and affordable.",
    steps: processSteps.map(step => ({
      name: step.title,
      text: step.description
    })),
    totalTime: "P8M"
  });

  const trademarkServiceSchema = serviceSchema({
    name: "Trademark Registration Service",
    description: "Professional trademark registration with comprehensive search, application preparation, USPTO filing, and monitoring. Expert attorneys handle everything from start to finish. Complete package at $499 plus required USPTO filing fee of $350 per class.",
    price: "499",
    url: "https://marqtrademarks.com/trademark-registration"
  });

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[
        organizationSchema,
        websiteSchema,
        offerCatalogSchema,
        processSchemaData,
        trademarkServiceSchema
      ]} />
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        <div className="absolute right-0 top-1/4 w-96 h-96 opacity-20">
          <div className="relative w-full h-full animate-float">
            <Shield size={384} className="text-amber-500 animate-pulse-slow" strokeWidth={0.5} />
          </div>
        </div>

        <div className="absolute left-10 bottom-10 w-32 h-32 opacity-10 animate-float-delayed">
          <Shield size={128} className="text-amber-400" strokeWidth={1} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <Shield size={16} className="text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Available in All 50 States</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Protect Your Brand with Professional Trademark Registration
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Secure your business identity with our professional trademark registration service. Your trademark is filed by a real attorney with real USPTO experience. Expert guidance, transparent pricing, and comprehensive support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
                Get Started
              </button>
              <button onClick={() => navigate('/resources')} className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/20">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      <FeaturedOn />

      <section className="py-16 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Shield size={18} className="text-white" />
                  <span className="text-sm font-semibold">Professional Attorney Search</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Get Your Professional Trademark Search Today
                </h2>
                <p className="text-emerald-50 text-lg mb-6 leading-relaxed">
                  Comprehensive analysis by licensed attorneys. Results delivered in 24 hours.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-emerald-200 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">Attorney Review</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-emerald-200 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">24 Hour Results</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="bg-white text-emerald-700 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
                >
                  <FileSearch size={20} />
                  Request Trademark Search
                </button>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full animate-pulse"></div>
                  <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <FileSearch size={120} className="text-emerald-600 mx-auto mb-4" strokeWidth={1.5} />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-2">Professional Search</div>
                      <div className="text-slate-600 font-semibold">Attorney Analysis Included</div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-sm text-slate-500 mb-2">Delivered in</div>
                        <div className="text-2xl font-bold text-emerald-600">24 Hours</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Transparent Pricing</h3>
              <p className="text-slate-600">Clear, upfront pricing with no hidden fees. Comprehensive search, attorney services, and monitoring included.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Nationwide Service</h3>
              <p className="text-slate-600">Available in all 50 states with federal trademark protection.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Award className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Expert Legal Team</h3>
              <p className="text-slate-600">Experienced trademark attorneys handling every application with personalized attention.</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/get-started')} className="bg-slate-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8 md:p-12">
              <div className="text-white">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                  <Shield size={18} className="text-orange-400" />
                  <span className="text-sm font-semibold">Amazon Seller Specialists</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Selling on Amazon? Get Brand Registry Protection
                </h2>
                <p className="text-slate-200 text-lg mb-6 leading-relaxed">
                  Start Amazon Brand Registry enrollment with your pending trademark application. Filed by real attorneys with USPTO trademark experience. Get enhanced brand protection, A+ Content access, and stop unauthorized sellers immediately after filing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-orange-300 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">Fast Turnaround</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-orange-300 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">Brand Registry Ready</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-orange-300 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">Expert Guidance</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <CheckCircle className="text-orange-300 flex-shrink-0" size={24} />
                    <span className="text-sm font-medium">Stop Hijackers</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/amazon')}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center justify-center gap-2"
                  >
                    <Shield size={20} />
                    Amazon Brand Registry Services
                  </button>
                  <button
                    onClick={() => navigate('/get-started', { state: { package: 'Amazon Brand Registry Package' } })}
                    className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 inline-flex items-center justify-center gap-2"
                  >
                    Get Started
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/20 backdrop-blur-sm rounded-full animate-pulse"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
                    <Shield size={120} className="text-orange-600 mx-auto mb-4" strokeWidth={1.5} />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 mb-2">Amazon Sellers</div>
                      <div className="text-slate-600 font-semibold">Protect Your Brand</div>
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="text-sm text-slate-500 mb-2">Starting at</div>
                        <div className="text-2xl font-bold text-orange-600">$499</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-4 w-fit">
                  <UserCheck size={18} className="text-amber-700" />
                  <span className="text-sm font-semibold text-amber-900">Personal Attorney Support</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Work with Our Expert Legal Team
                </h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  Unlike automated services, you'll work with our experienced team of trademark attorneys led by Mary Liberty, our firm owner and lead attorney. Each case receives personalized attention from qualified legal professionals. No bots, no templates—just expert guidance tailored to your unique business needs.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Direct communication with our legal team via email and phone</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Personalized strategy based on your business goals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Ongoing support throughout the registration process</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-700">Expert guidance on complex trademark issues</span>
                  </li>
                </ul>
                <div className="flex gap-4">
                  <button onClick={() => navigate('/contact')} className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-all">
                    Contact Our Team
                  </button>
                  <button onClick={() => navigate('/about')} className="bg-slate-100 text-slate-800 px-6 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-all">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-8 md:p-12 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="relative w-32 h-32 mx-auto mb-6">
                    <img
                      src="https://i.imgur.com/eXHYjog.png"
                      alt="Mary Liberty, Owner and Lead Attorney"
                      className="w-full h-full object-cover rounded-full shadow-2xl border-4 border-amber-400"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Mary Liberty</h3>
                  <p className="text-amber-400 font-semibold mb-4">Owner & Lead Attorney</p>
                  <p className="text-slate-300 text-lg leading-relaxed">
                    Leading a dedicated team of trademark attorneys with a proven track record of protecting brands nationwide. Every client receives personalized attention and expert legal guidance from our qualified legal professionals.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
              Get Started Today
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Trademark Registration Process</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple, streamlined, and efficient. We handle everything from start to finish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="text-amber-400" size={28} strokeWidth={2} />
                  </div>
                  <div className="absolute top-8 left-1/2 w-full h-0.5 bg-slate-200 -z-10 hidden lg:block"
                       style={{ display: index === processSteps.length - 1 ? 'none' : 'block' }}></div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Understanding Trademark Protection</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">
                A trademark is a word, phrase, symbol, design, or combination that identifies and distinguishes
                the source of goods or services. Federal trademark registration with the United States Patent and
                Trademark Office (USPTO) provides nationwide protection and numerous legal benefits.
              </p>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Registering your trademark is crucial for protecting your brand identity, preventing competitors
                from using similar marks, and establishing your rights in federal court. The registration process
                typically takes 8-12 months, and we guide you through every step.
              </p>
              <p className="text-slate-300 leading-relaxed">
                Whether you're launching a new business, introducing a product line, or expanding your brand,
                trademark registration is an essential investment in your company's future. Our transparent pricing
                makes professional trademark protection affordable and accessible for businesses of all sizes.
              </p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Benefits of Federal Registration</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 rounded-full px-4 py-2 mb-4">
              <Monitor size={18} className="text-blue-700" />
              <span className="text-sm font-semibold text-blue-900">Track Your Case 24/7</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Stay Connected with Our Client Portal</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              After purchasing your trademark package, access our secure client portal to track your case progress, communicate with your attorney, and manage your documents all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-sm border border-blue-100">
              <div className="bg-blue-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Monitor className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-Time Status Updates</h3>
              <p className="text-slate-600 leading-relaxed">
                Track your trademark application status with detailed milestones. See exactly where your case stands in the registration process at any time.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl shadow-sm border border-emerald-100">
              <div className="bg-emerald-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Direct Messaging</h3>
              <p className="text-slate-600 leading-relaxed">
                Communicate directly with our legal team through the portal. Ask questions, receive updates, and get expert guidance throughout the process.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-2xl shadow-sm border border-amber-100">
              <div className="bg-amber-500 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                <Bell className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Instant Notifications</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive immediate updates when there's activity on your case. Never miss important deadlines or USPTO communications.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 md:p-12 border border-slate-200">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Package Details at a Glance</h3>
              <p className="text-slate-600 leading-relaxed">
                Once you purchase a trademark registration package, your client portal automatically displays all your package information, including services included, pricing, and purchase date. Everything you need is organized and accessible in one secure location.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Businesses Nationwide</h2>
            <p className="text-xl text-slate-600">
              See what our clients have to say about their trademark registration experience
            </p>
          </div>

          <ReviewCarousel />

          <div className="mt-12 text-center">
            <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <FAQSection faqs={trademarkFAQs} />

      <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Start your trademark registration today with expert legal support and transparent pricing.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started Today
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Available in all 50 states • Expert attorneys • Transparent pricing
          </p>
        </div>
      </section>
    </div>
  );
}
