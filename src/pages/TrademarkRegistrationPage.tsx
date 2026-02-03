import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Shield, CheckCircle, FileSearch, FileText, Send, Award } from 'lucide-react';
import SchemaMarkup, { serviceSchema, howToSchema, breadcrumbSchema } from '../components/SchemaMarkup';
import FAQSection, { trademarkFAQs } from '../components/FAQSection';
import { updatePageSEO, pageSEO } from '../utils/seo';

export default function TrademarkRegistrationPage() {
  const navigate = useNavigate();

  useEffect(() => {
    updatePageSEO(pageSEO['trademark-registration']);
  }, []);
  const processSteps = [
    {
      icon: FileSearch,
      title: 'Initial Consultation',
      description: 'We discuss your brand and determine the best protection strategy for your trademark.'
    },
    {
      icon: FileText,
      title: 'Comprehensive Search',
      description: 'Our team conducts a thorough search of existing trademarks to identify potential conflicts.'
    },
    {
      icon: Send,
      title: 'Application Filing',
      description: 'We prepare and file your trademark application with the USPTO, ensuring accuracy and completeness.'
    },
    {
      icon: Award,
      title: 'Registration & Protection',
      description: 'Once approved, you receive your official trademark registration certificate and nationwide protection.'
    }
  ];

  const benefits = [
    'Exclusive nationwide rights to use your mark',
    'Legal presumption of ownership',
    'Public notice of your claim to the mark',
    'Ability to use the ® symbol',
    'Federal court jurisdiction for enforcement',
    'Basis for international trademark registration',
    'Protection against domain name cybersquatting',
    'Enhanced brand value and credibility'
  ];

  const serviceSchemaData = serviceSchema({
    name: "Federal Trademark Registration Service",
    description: "Complete trademark registration service including comprehensive search, application preparation, USPTO filing, and monitoring. Expert attorneys guide you through every step of the federal trademark registration process. Packages start at $499 plus USPTO filing fees.",
    price: "499",
    url: "https://marqtrademarks.com/trademark-registration"
  });

  const processSchemaData = howToSchema({
    name: "How to Register a Federal Trademark",
    description: "Complete process for registering your trademark with the United States Patent and Trademark Office (USPTO).",
    steps: processSteps.map(step => ({
      name: step.title,
      text: step.description
    })),
    totalTime: "P8M"
  });

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://marqtrademarks.com" },
    { name: "Services", url: "https://marqtrademarks.com/services" },
    { name: "Trademark Registration", url: "https://marqtrademarks.com/trademark-registration" }
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[serviceSchemaData, processSchemaData, breadcrumbs]} />
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6">
              <Shield size={16} className="text-amber-400" />
              <span className="text-sm font-medium text-amber-400">Professional Service</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Trademark Registration Services
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Secure federal protection for your brand with our comprehensive trademark registration service.
              Our experienced attorneys handle every aspect of the registration process from start to finish.
            </p>
            <button onClick={() => navigate('/get-started')} className="bg-amber-500 text-slate-900 px-8 py-4 rounded-lg font-semibold hover:bg-amber-400 transition-all hover:scale-105 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What is Trademark Registration?</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Trademark registration is the process of securing legal protection for your brand name, logo,
              slogan, or other distinctive marks that identify your goods or services in the marketplace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="bg-slate-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Why Register Your Trademark?</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                Federal trademark registration with the USPTO provides the strongest legal protection for your
                brand. Without registration, your rights are limited to the geographic areas where you actually
                use the mark, and enforcement can be difficult and costly.
              </p>
              <p className="text-slate-600 leading-relaxed">
                A registered trademark gives you exclusive nationwide rights, making it easier to stop
                infringement and protect your brand as your business grows.
              </p>
            </div>

            <div className="bg-amber-50 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">What Can Be Trademarked?</h3>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span>Business names and product names</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span>Logos, symbols, and designs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span>Slogans and taglines</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span>Colors and sounds (in specific contexts)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  <span>Package designs and trade dress</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Registration Process</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We make trademark registration simple and straightforward with our proven four-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="bg-gradient-to-br from-slate-800 to-slate-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="text-amber-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-8 md:p-12">
            <div className="max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Benefits of Federal Registration</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                Registering your trademark with the USPTO provides powerful legal benefits and protections
                that are essential for growing businesses.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={trademarkFAQs} />

      <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Register Your Trademark?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Protect your brand with professional trademark registration services.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Get Started
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Transparent pricing • Expert attorneys • Comprehensive support
          </p>
        </div>
      </section>
    </div>
  );
}
