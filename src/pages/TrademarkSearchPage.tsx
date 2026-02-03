import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Search, AlertTriangle, CheckCircle, FileSearch, BarChart, Shield } from 'lucide-react';
import SchemaMarkup, { serviceSchema, breadcrumbSchema } from '../components/SchemaMarkup';
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
      description: 'Comprehensive search of all registered and pending trademarks in the USPTO database.'
    },
    {
      icon: Search,
      title: 'Common Law Search',
      description: 'Investigation of unregistered trademarks, business names, and domain registrations.'
    },
    {
      icon: BarChart,
      title: 'Likelihood Analysis',
      description: 'Expert evaluation of potential conflicts and likelihood of successful registration.'
    },
    {
      icon: Shield,
      title: 'Detailed Report',
      description: 'Comprehensive written report with recommendations and risk assessment.'
    }
  ];

  const benefits = [
    'Avoid costly application rejections',
    'Identify potential conflicts early',
    'Save time and money in the long run',
    'Strengthen your trademark application',
    'Make informed branding decisions',
    'Reduce risk of infringement disputes'
  ];

  const searchServiceSchema = serviceSchema({
    name: "Comprehensive Trademark Search Service",
    description: "Professional trademark availability search including federal database, state registrations, common law usage, and expert legal analysis to identify potential conflicts before filing.",
    price: "49",
    url: "https://marqtrademarks.com/trademark-search"
  });

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://marqtrademarks.com" },
    { name: "Services", url: "https://marqtrademarks.com/services" },
    { name: "Trademark Search", url: "https://marqtrademarks.com/trademark-search" }
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[searchServiceSchema, breadcrumbs]} />
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Search size={16} className="text-blue-400" />
              <span className="text-sm font-medium text-blue-400">Professional Search Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Comprehensive Trademark Search
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Before filing your trademark application, a thorough search is essential to identify
              potential conflicts and ensure your mark is available for registration.
            </p>
            <button onClick={() => navigate('/trademark-search-request')} className="bg-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-400 transition-all hover:scale-105 shadow-lg">
              Start Trademark Search
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why a Trademark Search is Critical</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A comprehensive trademark search helps you avoid expensive mistakes and strengthens
              your application by identifying potential obstacles before you file.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-200">
              <AlertTriangle className="text-red-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Without a Search</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Risk of application rejection</li>
                <li>• Wasted filing fees ($350+)</li>
                <li>• Potential infringement liability</li>
                <li>• Delays in brand launch</li>
                <li>• Costly rebranding needed</li>
              </ul>
            </div>

            <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
              <CheckCircle className="text-green-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">With a Search</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Identify conflicts early</li>
                <li>• Strengthen your application</li>
                <li>• Avoid infringement issues</li>
                <li>• Proceed with confidence</li>
                <li>• Higher success rate</li>
              </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
              <Shield className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-bold text-slate-900 mb-3">Our Guarantee</h3>
              <ul className="space-y-2 text-slate-700">
                <li>• Professional attorney review</li>
                <li>• Comprehensive databases</li>
                <li>• Detailed written report</li>
                <li>• Clear recommendations</li>
                <li>• Risk assessment included</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Search Includes</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Our comprehensive trademark search goes beyond basic database queries to provide
              thorough analysis and professional recommendations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {searchComponents.map((component, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <component.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{component.title}</h3>
                <p className="text-slate-600">{component.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Understanding Search Results</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Our trademark search report provides a comprehensive analysis of your proposed mark,
                including detailed information about any potentially conflicting marks we discover.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                We don't just provide raw data - our experienced attorneys review the results and
                provide clear recommendations about whether to proceed, modify your mark, or consider
                alternative options.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Every search includes a written opinion on the likelihood of successful registration
                and strategies to strengthen your application.
              </p>
            </div>
            <div className="bg-slate-900 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white mb-6">Benefits of Our Search Service</h3>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
