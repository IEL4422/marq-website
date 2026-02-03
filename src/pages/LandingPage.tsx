import { Shield, CheckCircle, ArrowRight, FileSearch, Monitor, MessageCircle, BookOpen, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { organizationSchema, websiteSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import ReviewCarousel from '../components/ReviewCarousel';
import FeaturedOn from '../components/FeaturedOn';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO.home);
  }, []);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[
        organizationSchema,
        websiteSchema,
        offerCatalogSchema
      ]} />

      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 backdrop-blur-sm animate-pulse">
                <Shield size={16} className="text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Available in All 50 States</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Protect Your Brand
              </h1>
              <p className="text-2xl text-slate-300 leading-relaxed">
                Professional trademark registration with transparent pricing and expert attorney guidance. Your trademark is filed by a real attorney with real USPTO experience.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Fixed pricing - no hidden fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Work directly with real attorneys with USPTO experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Comprehensive support from start to finish</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/get-started')}
                  className="group bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 text-lg"
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 inline-flex items-center justify-center gap-2 text-lg hover:shadow-xl"
                >
                  <FileSearch size={20} className="group-hover:scale-110 transition-transform" />
                  Request Trademark Search
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-emerald-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 border border-white/20">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                      <Shield className="text-amber-400" size={48} strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                      Trademark Registration
                    </h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Comprehensive trademark search</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Professional application preparation</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">USPTO filing and monitoring</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Expert legal support throughout</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200">
                      <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider">Professional Package</div>
                      <div className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">$499</div>
                      <div className="text-slate-600 font-medium">Complete Trademark Registration</div>
                      <div className="text-sm text-slate-500 mt-1">Plus USPTO filing fee of $350 per class</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedOn />

      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Why Choose Marq
          </h2>
          <p className="text-xl text-slate-600 mb-16 max-w-3xl mx-auto">
            We make trademark protection simple, transparent, and affordable for businesses of all sizes.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="text-amber-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Expert Legal Team</h3>
              <p className="text-slate-600 leading-relaxed">
                Work with our team of real trademark attorneys with USPTO experience, led by Mary Liberty, owner and lead attorney. Personal attention for every case.
              </p>
            </div>
            <div className="group bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-emerald-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <CheckCircle className="text-emerald-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Transparent Pricing</h3>
              <p className="text-slate-600 leading-relaxed">
                Clear, upfront pricing with no hidden fees. You'll know exactly what you're paying for.
              </p>
            </div>
            <div className="group bg-white p-10 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FileSearch className="text-blue-600" size={36} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Professional Search</h3>
              <p className="text-slate-600 leading-relaxed">
                Get a professional trademark search with expert attorney analysis. Fast turnaround and detailed results.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-orange-300/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 rounded-3xl shadow-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-12 md:p-16">
              <div className="text-white space-y-6">
                <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm rounded-full px-5 py-2">
                  <Shield size={20} className="text-orange-400" />
                  <span className="text-sm font-bold text-orange-400">Amazon Seller Services</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                  Get Amazon Brand Registry Today
                </h2>
                <p className="text-xl text-slate-200 leading-relaxed">
                  Federal trademark registration unlocks Amazon Brand Registry, giving you brand protection tools and the power to stop hijackers. Your trademark is filed by a real attorney with USPTO experience.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-orange-300 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg">Brand Registry Enrollment Guide</div>
                      <div className="text-slate-300">Complete guide for Amazon Brand Registry enrollment</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-orange-300 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg">Priority Filing</div>
                      <div className="text-slate-300">Expedited processing for faster trademark registration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="text-orange-300 flex-shrink-0 mt-1" size={24} />
                    <div>
                      <div className="font-bold text-lg">Stop Listing Hijackers</div>
                      <div className="text-slate-300">Protect your brand from unauthorized sellers</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => navigate('/amazon')}
                    className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-xl font-bold hover:from-orange-400 hover:to-orange-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
                  >
                    Learn About Amazon Services
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate('/get-started')}
                    className="group bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 text-lg inline-flex items-center justify-center gap-2"
                  >
                    Get Started
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                  <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl hover:shadow-orange-500/30 transition-all duration-500">
                    <div className="text-center">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-28 h-28 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                        <Shield className="text-white" size={56} strokeWidth={2} />
                      </div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-4">
                        Amazon Brand Registry Package
                      </h3>
                      <div className="space-y-3 mb-8 text-left">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={18} />
                          <span className="text-slate-700 text-sm">Federal trademark filing</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={18} />
                          <span className="text-slate-700 text-sm">Brand Registry enrollment guide</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={18} />
                          <span className="text-slate-700 text-sm">Priority filing - expedited</span>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-slate-200">
                        <div className="text-sm text-slate-500 mb-2 uppercase tracking-wider">Starting at</div>
                        <div className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">$499</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full px-5 py-2 mb-6 shadow-sm">
              <Star className="text-amber-600" size={18} fill="currentColor" />
              <span className="text-sm font-semibold text-amber-900">5-Star Rated Service</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Hundreds of Business Owners
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our clients love the transparency, expertise, and personal attention they receive throughout the trademark process.
            </p>
          </div>

          <ReviewCarousel />

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="text-emerald-600" size={24} />
              <span className="text-slate-800 font-bold text-lg">500+ Successful Trademark Registrations</span>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-5 rounded-xl font-bold hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
            >
              Get Started
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-5 py-2 backdrop-blur-sm">
                <Monitor size={18} className="text-amber-400" />
                <span className="text-sm font-semibold text-amber-400">24/7 Access</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Track Your Trademark Progress in Real-Time
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Our exclusive client portal gives you complete visibility into your trademark registration journey, from initial search to successful registration.
              </p>
              <div className="space-y-6">
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <Monitor className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Live Status Updates</h3>
                    <p className="text-slate-400 leading-relaxed">See exactly where your trademark stands at every stage of the registration process.</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="text-blue-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Direct Attorney Messaging</h3>
                    <p className="text-slate-400 leading-relaxed">Send messages directly to your attorney and get prompt, personalized responses.</p>
                  </div>
                </div>
                <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-all duration-300">
                  <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl p-3 flex-shrink-0 group-hover:scale-110 transition-transform">
                    <BookOpen className="text-amber-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Learning Center</h3>
                    <p className="text-slate-400 leading-relaxed">Access educational resources to understand trademarks and the registration process.</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate('/client-portal')}
                className="group bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
              >
                <User size={20} className="group-hover:scale-110 transition-transform" />
                Access Client Portal
              </button>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/30 to-emerald-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-amber-500/20 transition-all duration-500">
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 px-6 py-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-lg"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-lg"></div>
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-lg"></div>
                  </div>
                  <div className="text-slate-200 text-sm font-semibold tracking-wide">Client Portal</div>
                </div>

                <div className="p-8">
                  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 text-white rounded-2xl p-6 mb-8 shadow-xl">
                    <div className="text-sm text-slate-400 mb-2 uppercase tracking-wider">Welcome back,</div>
                    <div className="text-2xl font-bold mb-1">Jane Doe</div>
                    <div className="text-slate-300 font-medium">Trademark: TechFlow</div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">Trademark Search Complete</div>
                        <div className="text-sm text-slate-500">No conflicts found</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="text-white" size={16} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">Registration Submitted</div>
                        <div className="text-sm text-slate-500">Filed with USPTO</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900">Processing with USPTO</div>
                        <div className="text-sm text-slate-500">Currently in progress</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-slate-500">Successfully Registered</div>
                        <div className="text-sm text-slate-400">Pending</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="text-slate-600" size={16} />
                      <div className="text-sm font-medium text-slate-900">New Message from Attorney</div>
                    </div>
                    <div className="text-sm text-slate-600">Your application is progressing smoothly. I'll keep you updated...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
            Start your trademark registration today with expert legal support and transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/get-started')}
              className="group bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-10 py-5 rounded-xl font-bold hover:shadow-2xl hover:shadow-amber-500/50 transition-all duration-300 hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
            >
              View Pricing
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/home')}
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 text-lg hover:shadow-xl"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
