import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, BookOpen, CheckCircle } from 'lucide-react';
import { guides, EducationalGuide } from '../lib/api';
import { formatBlogContent } from '../utils/formatContent';
import { updatePageSEO } from '../utils/seo';
import SchemaMarkup, { articleSchema, breadcrumbSchema, organizationSchema } from '../components/SchemaMarkup';

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [guide, setGuide] = useState<EducationalGuide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    guides.get(slug)
      .then(setGuide)
      .catch(err => console.error('Error fetching guide:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (guide) {
      updatePageSEO({
        title: `${guide.title} | Trademark Guide | Marq`,
        description: guide.description.slice(0, 160),
        canonical: `https://marqtrademarks.com/resources/${slug}`,
        keywords: guide.topics?.join(', '),
        author: 'Marq Legal',
        ogType: 'article',
        publishedTime: guide.createdAt,
        modifiedTime: guide.updatedAt,
      });
    }
  }, [guide, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900" />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">Guide Not Found</h1>
          <button onClick={() => navigate('/resources')} className="text-gold-600 hover:text-gold-700 font-medium">
            Return to Resources
          </button>
        </div>
      </div>
    );
  }

  const guideSchema = articleSchema({
    headline: guide.title,
    description: guide.description,
    author: 'Marq Legal Team',
    datePublished: guide.createdAt,
    dateModified: guide.updatedAt,
    url: `https://marqtrademarks.com/resources/${slug}`,
    tags: guide.topics,
    wordCount: guide.content.split(' ').length,
  });

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Resources', url: 'https://marqtrademarks.com/resources' },
    { name: guide.title, url: `https://marqtrademarks.com/resources/${slug}` },
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[organizationSchema, guideSchema, breadcrumbs]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/resources')}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 mb-8 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Resources
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-gold-600 uppercase tracking-widest mb-3">
            <BookOpen size={15} />
            <span>Educational Guide</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-5 leading-tight">{guide.title}</h1>
          <p className="text-xl text-slate-600 mb-5 leading-relaxed">{guide.description}</p>

          <div className="flex items-center gap-2 text-sm text-slate-500 mb-7">
            <Clock size={15} />
            <span>{guide.readingTime} min read</span>
          </div>

          {guide.topics.length > 0 && (
            <div className="bg-navy-50 border border-navy-100 rounded-xl p-5 mb-8">
              <h3 className="text-xs font-bold text-navy-900 mb-3 uppercase tracking-widest">Topics Covered</h3>
              <ul className="space-y-2">
                {guide.topics.map((topic, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle className="text-emerald-500 flex-shrink-0 mt-0.5" size={16} />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div
          className="prose prose-slate max-w-none text-base text-slate-800"
          style={{ lineHeight: '1.8' }}
          dangerouslySetInnerHTML={{ __html: formatBlogContent(guide.content) }}
        />

        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="bg-navy-950 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Ready to Protect Your Trademark?</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Our experienced attorneys are here to guide you through every step of the trademark process — simple, affordable, and effective.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Get Started Today
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
