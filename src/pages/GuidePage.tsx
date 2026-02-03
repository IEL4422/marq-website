import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { supabase, EducationalGuide } from '../lib/supabase';
import { formatBlogContent } from '../utils/formatContent';
import { updatePageSEO } from '../utils/seo';
import SchemaMarkup, { articleSchema, breadcrumbSchema, organizationSchema } from '../components/SchemaMarkup';

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<EducationalGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuide();
  }, [slug]);

  useEffect(() => {
    if (guide) {
      updatePageSEO({
        title: `${guide.title} | Trademark Guide | Marq`,
        description: guide.description.slice(0, 160),
        canonical: `https://marqtrademarks.com/resources/${slug}`,
        keywords: guide.topics?.join(', '),
        author: 'Marq',
        ogType: 'article',
        publishedTime: guide.created_at,
        modifiedTime: guide.updated_at
      });
    }
  }, [guide, slug]);

  const fetchGuide = async () => {
    try {
      const { data, error } = await supabase
        .from('educational_guides')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      setGuide(data);
    } catch (error) {
      console.error('Error fetching guide:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800"></div>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Guide Not Found</h1>
          <button
            onClick={() => navigate('/resources')}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Return to Resources
          </button>
        </div>
      </div>
    );
  }

  const guideSchema = guide ? articleSchema({
    headline: guide.title,
    description: guide.description,
    author: 'Marq Legal Team',
    datePublished: guide.created_at,
    dateModified: guide.updated_at,
    url: `https://marqtrademarks.com/resources/${slug}`,
    tags: guide.topics,
    wordCount: guide.content.split(' ').length
  }) : null;

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Resources', url: 'https://marqtrademarks.com/resources' },
    { name: guide?.title || 'Guide', url: `https://marqtrademarks.com/resources/${slug}` }
  ]);

  return (
    <div className="bg-white">
      {guide && guideSchema && (
        <SchemaMarkup schema={[organizationSchema, guideSchema, breadcrumbs]} />
      )}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Resources
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 mb-3">
            <BookOpen size={18} />
            <span>Educational Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {guide.title}
          </h1>

          <p className="text-xl text-slate-600 mb-6">{guide.description}</p>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-6">
            <Clock size={18} />
            <span>{guide.reading_time} min read</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8">
            <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Topics Covered</h3>
            <ul className="space-y-2">
              {guide.topics.map((topic, index) => (
                <li key={index} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={18} />
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-none">
          <div className="text-base text-slate-800" style={{ lineHeight: '1.4' }}>
            {formatBlogContent(guide.content)}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Protect Your Trademark?</h3>
            <p className="text-slate-300 mb-6">
              Our experienced attorneys are here to guide you through every step of the trademark process.
              From comprehensive searches to registration and enforcement, we make trademark protection
              simple and affordable.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Get Started Today
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/resources')}
            className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to All Resources
          </button>
        </div>
      </article>
    </div>
  );
}
