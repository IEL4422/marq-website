import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { blog, BlogPost } from '../lib/api';
import { formatBlogContent } from '../utils/formatContent';
import SchemaMarkup, { articleSchema, breadcrumbSchema } from '../components/SchemaMarkup';
import { updatePageSEO } from '../utils/seo';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    blog.get(slug)
      .then(setPost)
      .catch(err => console.error('Error fetching post:', err))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (post) {
      updatePageSEO({
        title: `${post.title} | Marq Legal Blog`,
        description: post.excerpt || '',
        canonical: `https://marqtrademarks.com/blog/${post.slug}`,
        ogType: 'article',
        keywords: post.tags.join(', ')
      });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-900" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy-900 mb-4">Article Not Found</h1>
          <button onClick={() => navigate('/blog')} className="text-gold-600 hover:text-gold-700 font-medium">
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  const articleSchemaData = articleSchema({
    headline: post.title,
    description: post.excerpt || '',
    author: post.author,
    datePublished: post.publishedDate,
    dateModified: post.publishedDate,
    url: `https://marqtrademarks.com/blog/${post.slug}`,
    tags: post.tags,
  });

  const breadcrumbs = breadcrumbSchema([
    { name: 'Home', url: 'https://marqtrademarks.com' },
    { name: 'Blog', url: 'https://marqtrademarks.com/blog' },
    { name: post.title, url: `https://marqtrademarks.com/blog/${post.slug}` },
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[articleSchemaData, breadcrumbs]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 mb-8 font-medium text-sm transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </button>

        <div className="mb-8">
          <div className="text-xs font-semibold text-gold-600 uppercase tracking-widest mb-3">{post.category}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-navy-900 mb-6 leading-tight">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mb-6">
            <div className="flex items-center gap-1.5">
              <Calendar size={15} />
              <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={15} />
              <span>{post.readingTime} min read</span>
            </div>
            <span>By {post.author}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-navy-50 text-navy-700 rounded-full text-xs font-medium">
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div>
          {post.excerpt && (
            <div className="text-lg text-slate-700 mb-8 leading-relaxed border-l-4 border-gold-400 pl-6 italic">
              {post.excerpt}
            </div>
          )}
          <div
            className="prose prose-slate max-w-none text-base text-slate-800"
            style={{ lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: formatBlogContent(post.content || '') }}
          />
        </div>

        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="bg-navy-950 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-3">Need Help with Your Trademark?</h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              Our experienced attorneys are here to guide you through every step of the trademark process — from search to registration and enforcement.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Get Started Today
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/blog')}
            className="text-navy-700 hover:text-navy-900 font-medium inline-flex items-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Back to All Articles
          </button>
        </div>
      </article>
    </div>
  );
}
