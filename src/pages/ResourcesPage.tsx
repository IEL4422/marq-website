import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, MessageSquare, AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';
import { supabase, EducationalGuide } from '../lib/supabase';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [guides, setGuides] = useState<EducationalGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const { data, error } = await supabase
        .from('educational_guides')
        .select('*')
        .order('order_index');

      if (error) throw error;
      setGuides(data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'What can be trademarked?',
      answer: 'Trademarks can protect words, phrases, logos, symbols, designs, sounds, colors, and even scents that identify and distinguish your goods or services from others in the marketplace.'
    },
    {
      question: 'How long does trademark protection last?',
      answer: 'A federal trademark registration lasts 10 years and can be renewed indefinitely for additional 10-year periods, as long as you continue to use the mark in commerce and file the required maintenance documents.'
    },
    {
      question: 'Do I need to use the ® symbol?',
      answer: 'You can only use the ® symbol after your trademark is officially registered with the USPTO. Before registration, you can use ™ for goods or ℠ for services to indicate you\'re claiming rights in the mark.'
    },
    {
      question: 'What is trademark infringement?',
      answer: 'Trademark infringement occurs when someone uses a mark that is confusingly similar to your registered trademark in connection with related goods or services, which could cause consumer confusion about the source of products or services.'
    },
    {
      question: 'Can I trademark a domain name?',
      answer: 'A domain name itself cannot be trademarked, but the brand name used in the domain can be. You should register the brand name as a trademark, not the URL or domain extension.'
    },
    {
      question: 'What is the difference between state and federal trademark registration?',
      answer: 'State registration provides protection only within that state, while federal registration with the USPTO provides nationwide protection, presumption of ownership, and the ability to bring infringement cases in federal court.'
    },
    {
      question: 'Do I need to register in multiple classes?',
      answer: 'If you offer different types of goods or services, you may need to register in multiple classes. Each class represents a category of goods or services. Our attorneys will help determine which classes are appropriate for your business.'
    },
    {
      question: 'What happens if my trademark application is rejected?',
      answer: 'If the USPTO issues an office action rejecting your application, we will work with you to respond appropriately. Many rejections can be overcome with proper legal arguments or amendments to the application.'
    }
  ];

  const glossary = [
    {
      term: 'Abandonment',
      slug: 'abandonment',
      definition: 'When trademark rights are lost due to non-use or failure to respond to USPTO actions.'
    },
    {
      term: 'Goods and Services',
      slug: 'goods-and-services',
      definition: 'The products or services associated with your trademark, categorized into classes.'
    },
    {
      term: 'Intent to Use',
      slug: 'intent-to-use',
      definition: 'Filing basis when you plan to use the mark in commerce but haven\'t started yet.'
    },
    {
      term: 'Likelihood of Confusion',
      slug: 'likelihood-of-confusion',
      definition: 'The primary standard for determining trademark infringement—whether consumers would likely confuse the source of goods or services.'
    },
    {
      term: 'Office Action',
      slug: 'office-action',
      definition: 'Official communication from the USPTO examining attorney regarding your trademark application.'
    },
    {
      term: 'Opposition',
      slug: 'opposition',
      definition: 'A proceeding where a third party challenges your trademark application before registration.'
    },
    {
      term: 'Specimen',
      slug: 'specimen',
      definition: 'Evidence showing how you actually use your trademark in commerce with your goods or services.'
    },
    {
      term: 'TEAS',
      slug: 'teas',
      definition: 'Trademark Electronic Application System—the USPTO\'s online filing system.'
    }
  ];

  return (
    <div className="bg-white">
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="mx-auto mb-6 text-amber-400" size={48} />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Trademark Resources</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Everything you need to know about trademarks, registration, and protecting your brand.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Educational Guides</h2>
            <p className="text-xl text-slate-600">Comprehensive resources to help you understand trademarks</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => navigate(`/resources/${guide.slug}`)}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-amber-400 text-left"
                >
                  <div className="bg-gradient-to-br from-slate-900 to-slate-700 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="text-amber-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{guide.title}</h3>
                  <p className="text-slate-600 mb-4">{guide.description}</p>
                  <ul className="space-y-2">
                    {guide.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 text-amber-600 font-medium text-sm">
                    Read Full Guide →
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <HelpCircle className="mx-auto mb-4 text-slate-400" size={48} />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600">Common questions about trademarks and registration</p>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-start gap-2">
                  <MessageSquare className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
                  {faq.question}
                </h3>
                <p className="text-slate-600 ml-7">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trademark Glossary</h2>
            <p className="text-xl text-slate-600">Key terms and definitions every business owner should know</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {glossary.map((item, index) => (
              <button
                key={index}
                onClick={() => navigate(`/glossary/${item.slug}`)}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:border-amber-400 hover:shadow-md transition-all text-left group"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-amber-600 transition-colors">{item.term}</h3>
                <p className="text-slate-600 text-sm mb-3">{item.definition}</p>
                <span className="text-amber-600 text-sm font-medium">Learn more →</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AlertCircle className="text-amber-400 mb-4" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Important Considerations</h2>
              <div className="space-y-4 text-slate-300">
                <p className="leading-relaxed">
                  <strong className="text-white">Start Early:</strong> The trademark registration process takes 8-12 months.
                  Begin as soon as possible to ensure your brand is protected before launch or expansion.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Conduct a Search:</strong> Before investing in branding, conduct a comprehensive
                  trademark search to avoid conflicts with existing marks.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Choose Wisely:</strong> Select a distinctive trademark that can be protected.
                  Generic or descriptive terms are difficult or impossible to register.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Use It or Lose It:</strong> You must use your trademark in commerce to maintain
                  your rights. Abandonment can result in loss of protection.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-white">Monitor and Enforce:</strong> Actively monitor for infringement and enforce your
                  rights to maintain the strength of your trademark.
                </p>
              </div>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold mb-6">Common Trademark Mistakes</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Waiting too long to file after starting to use the mark</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Not conducting a comprehensive trademark search</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Choosing a mark that is too generic or descriptive</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Filing in the wrong class of goods or services</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Failing to respond to USPTO office actions in time</span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
                  <span className="text-slate-300">Not maintaining or renewing the registration</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-amber-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Protect Your Brand?
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            Let our experienced attorneys guide you through the trademark registration process.
          </p>
          <button onClick={() => navigate('/get-started')} className="bg-slate-800 text-white px-8 py-4 rounded-lg font-semibold hover:bg-slate-700 transition-all hover:scale-105 shadow-lg">
            Start Your Application Today
          </button>
          <p className="text-sm text-slate-500 mt-4">
            Packages start at $499 + USPTO fees • All 50 states • Expert guidance
          </p>
        </div>
      </section>
    </div>
  );
}
