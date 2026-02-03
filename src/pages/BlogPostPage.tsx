import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowLeft, Tag } from 'lucide-react';
import { supabase, BlogPost } from '../lib/supabase';
import { formatBlogContent } from '../utils/formatContent';
import SchemaMarkup, { articleSchema, breadcrumbSchema } from '../components/SchemaMarkup';
import { updatePageSEO } from '../utils/seo';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      updatePageSEO({
        title: `${post.title} | Marq Legal Blog`,
        description: post.excerpt,
        canonical: `https://marqtrademarks.com/blog/${post.slug}`,
        ogType: 'article',
        keywords: post.tags.join(', ')
      });
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
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

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <button
            onClick={() => navigate('/blog')}
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Return to Blog
          </button>
        </div>
      </div>
    );
  }

  const articleSchemaData = articleSchema({
    headline: post.title,
    description: post.excerpt,
    author: post.author,
    datePublished: post.published_date,
    dateModified: post.updated_at || post.published_date,
    url: `https://marqtrademarks.com/blog/${post.slug}`,
    tags: post.tags
  });

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: "https://marqtrademarks.com" },
    { name: "Blog", url: "https://marqtrademarks.com/blog" },
    { name: post.title, url: `https://marqtrademarks.com/blog/${post.slug}` }
  ]);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={[articleSchemaData, breadcrumbs]} />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8 font-medium"
        >
          <ArrowLeft size={20} />
          Back to Blog
        </button>

        <div className="mb-8">
          <div className="text-sm font-semibold text-amber-600 mb-3">{post.category}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.published_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{post.reading_time} min read</span>
            </div>
            <div>By {post.author}</div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="max-w-none">
          <div className="text-lg text-slate-700 mb-6 leading-normal border-l-4 border-amber-500 pl-6 italic">
            {post.excerpt}
          </div>

          <div
            className="prose prose-slate max-w-none text-base text-slate-800"
            style={{ lineHeight: '1.7' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help with Your Trademark?</h3>
            <p className="text-slate-300 mb-6">
              Our experienced attorneys are here to guide you through every step of the trademark process.
              From comprehensive searches to registration and enforcement, we make trademark protection
              simple and affordable.
            </p>
            <button
              onClick={() => navigate('/get-started')}
              className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Explore Our Services
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/blog')}
            className="text-amber-600 hover:text-amber-700 font-medium inline-flex items-center gap-2"
          >
            <ArrowLeft size={20} />
            Back to All Articles
          </button>
        </div>
      </article>
    </div>
  );
}
