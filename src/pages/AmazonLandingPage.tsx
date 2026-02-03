import { Shield, CheckCircle, ArrowRight, FileSearch, Package, Lock, Star, TrendingUp, Zap, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SchemaMarkup, { organizationSchema, websiteSchema, offerCatalogSchema } from '../components/SchemaMarkup';
import ReviewCarousel from '../components/ReviewCarousel';
import { updatePageSEO } from '../utils/seo';

export default function AmazonLandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO({
      title: 'Amazon Brand Registry Trademark Registration | Fast Federal Trademark for Sellers | Marq Legal',
      description: 'File your federal trademark and start Amazon Brand Registry enrollment immediately with your pending application. Protect your brand, stop hijackers, and access Brand Registry tools. Expert trademark registration starting at $499 with priority filing for Amazon sellers.',
      keywords: 'amazon brand registry, amazon trademark, amazon seller trademark, federal trademark amazon, brand registry trademark, amazon brand protection, trademark for amazon sellers, pending trademark application',
      ogTitle: 'Amazon Brand Registry Trademark Registration | Fast Federal Trademark',
      ogDescription: 'Start Amazon Brand Registry enrollment with your pending trademark application. Protect your brand, stop hijackers, and access Brand Registry protection immediately after filing. Expert service for Amazon sellers.',
      canonical: 'https://marqtrademarks.com/amazon'
    });
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
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 backdrop-blur-sm">
                <Package size={16} className="text-orange-400" />
                <span className="text-sm font-medium text-orange-400">Amazon Brand Registry Specialists</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Get Amazon Brand Registry
                </span>
                <br />
                <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                  Protection Fast
                </span>
              </h1>
              <p className="text-2xl text-slate-300 leading-relaxed">
                Federal trademark application for Amazon sellers. Start Brand Registry enrollment with your pending application immediately after filing.
              </p>
              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Enroll in Brand Registry with pending application</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Expert guidance through USPTO process</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={24} />
                  <span className="text-lg text-slate-200">Fast turnaround for sellers ready to launch</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/get-started', { state: { package: 'Amazon Brand Registry Package' } })}
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 text-lg"
                >
                  Get Started
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="group bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40 inline-flex items-center justify-center gap-2 text-lg hover:shadow-xl"
                >
                  <FileSearch size={20} className="group-hover:scale-110 transition-transform" />
                  Attorney Search ($49)
                </button>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/30 to-blue-500/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-white/95 backdrop-blur-sm rounded-3xl p-12 shadow-2xl hover:shadow-orange-500/20 transition-all duration-500 border border-white/20">
                  <div className="text-center">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform group-hover:scale-110 transition-transform duration-500">
                      <Package className="text-white" size={48} strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">
                      Amazon Brand Registry Package
                    </h2>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Comprehensive trademark search</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">USPTO application & filing</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Brand Registry enrollment guide</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Priority filing - expedited processing</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Amazon-specific documentation</span>
                      </div>
                      <div className="flex items-start gap-3 text-left">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">Client portal access</span>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200">
                      <div className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2">$499</div>
                      <div className="text-sm text-slate-500 mb-3">+ USPTO filing fees</div>
                      <div className="text-slate-600 font-medium">Amazon Brand Registry Package</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-orange-50 to-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full px-5 py-2 mb-6 shadow-sm">
              <AlertCircle className="text-orange-600" size={18} />
              <span className="text-sm font-semibold text-orange-900">Pending Application Accepted</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Amazon Sellers Need a Federal Trademark Application
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Amazon Brand Registry accepts filed pending applications. Start enrollment as soon as your application is submitted to the USPTO.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-orange-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Lock className="text-orange-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Brand Protection</h3>
              <p className="text-slate-600 leading-relaxed">
                Stop counterfeiters and hijackers from selling on your listings. Amazon gives Brand Registry members powerful tools to remove unauthorized sellers.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-100 to-blue-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Star className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Listing Control</h3>
              <p className="text-slate-600 leading-relaxed">
                Maintain complete control over your product listings. Brand Registry gives you authority to edit and manage your branded content.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-violet-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-violet-100 to-violet-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Package className="text-violet-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Amazon Stores</h3>
              <p className="text-slate-600 leading-relaxed">
                Create your own multi-page Amazon Store. Showcase your full product line and tell your brand story.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-amber-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-amber-100 to-amber-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="text-amber-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Brand Authority</h3>
              <p className="text-slate-600 leading-relaxed">
                Established brand recognition and trademark protection signal credibility and authenticity to Amazon customers.
              </p>
            </div>

            <div className="group bg-white p-8 rounded-2xl shadow-lg border border-slate-100 hover:shadow-2xl hover:border-rose-200 transition-all duration-300 hover:-translate-y-2">
              <div className="bg-gradient-to-br from-rose-100 to-rose-200 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="text-rose-600" size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Proactive Brand Protection</h3>
              <p className="text-slate-600 leading-relaxed">
                Amazon's automated protections catch potential infringements before they appear on your listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              How It Works for Amazon Sellers
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We've streamlined the trademark process specifically for Amazon sellers who need to enroll in Brand Registry quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-orange-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  1
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Trademark Search</h3>
                  <p className="text-slate-600 leading-relaxed">
                    We'll search the USPTO database to ensure your brand name is available for registration. Choose from our free DIY search or $49 attorney search.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  2
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">File Your Application</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Our attorneys prepare and file your trademark application with the USPTO with proper classification for your products.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-emerald-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  3
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">USPTO Processing</h3>
                  <p className="text-slate-600 leading-relaxed">
                    The USPTO reviews your application. We monitor the process and handle any office actions that arise.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-violet-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                <div className="absolute -top-4 -left-4 bg-gradient-to-br from-violet-500 to-violet-600 text-white w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                  4
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Enroll in Brand Registry</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Start Brand Registry enrollment with your pending application immediately after filing. No need to wait for registration approval.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 bg-gradient-to-r from-orange-50 to-blue-50 border-2 border-orange-200 rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="bg-orange-500 rounded-xl p-3 flex-shrink-0">
                <Package className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">Amazon Brand Registry Package - $499 + USPTO Fees</h3>
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  Our specialized package for Amazon sellers includes everything you need for federal trademark registration plus expert guidance through the Brand Registry enrollment process with priority filing and expedited processing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Comprehensive trademark search</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-slate-700">USPTO filing & monitoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Brand Registry enrollment help</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-emerald-600 flex-shrink-0" size={20} />
                    <span className="text-slate-700">Amazon-specific support</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/get-started', { state: { package: 'Amazon Brand Registry Package' } })}
                  className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                >
                  View Full Pricing Details
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full px-5 py-2 mb-6 shadow-sm">
              <Star className="text-amber-600" size={18} fill="currentColor" />
              <span className="text-sm font-semibold text-amber-900">5-Star Rated Service</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Trusted by Amazon Sellers Nationwide
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join hundreds of successful Amazon sellers who have protected their brands and grown their businesses with our trademark services.
            </p>
          </div>

          <ReviewCarousel />

          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 rounded-full px-8 py-4 shadow-lg hover:shadow-xl transition-shadow">
              <CheckCircle className="text-emerald-600" size={24} />
              <span className="text-slate-800 font-bold text-lg">500+ Successful Trademark Registrations</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-3 w-20 h-20 flex items-center justify-center mx-auto mb-8">
            <Package className="text-orange-400" size={40} />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Unlock Amazon Brand Registry?
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
            File your federal trademark application and start Brand Registry enrollment immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/get-started', { state: { package: 'Amazon Brand Registry Package' } })}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 text-white px-10 py-5 rounded-xl font-bold hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 hover:scale-105 text-lg inline-flex items-center justify-center gap-2"
            >
              Get Started Now
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/trademark-search-request')}
              className="bg-white/10 backdrop-blur-sm text-white px-10 py-5 rounded-xl font-bold hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 text-lg hover:shadow-xl inline-flex items-center justify-center gap-2"
            >
              <FileSearch size={22} />
              Trademark Search
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
