import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Calendar, ArrowRight, Search } from 'lucide-react';
import { blog, BlogPost } from '../lib/api';
import SchemaMarkup, { organizationSchema } from '../components/SchemaMarkup';

const CATEGORIES = ['All', 'Trademark Basics', 'Trademark Process', 'Trademark Strategy', 'Brand Protection'];

export default function BlogPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    blog.list({ limit: 50 })
      .then(res => setPosts(res.posts))
      .catch(err => console.error('Error fetching posts:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = posts.filter(p => p.featured).slice(0, 3);

  return (
    <div className="bg-white">
      <SchemaMarkup schema={organizationSchema} />

      {/* Hero */}
      <section className="bg-navy-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">Insights & Updates</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-5">Trademark Law Blog</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Expert insights, practical guides, and the latest on trademark law and brand protection — written by our attorneys.
            </p>
          </div>
        </div>
      </section>

      {/* Featured */}
      {featuredPosts.length > 0 && (
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-navy-900 mb-8">Featured Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map(post => (
                <button
                  key={post._id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all text-left group"
                >
                  <div className="p-6">
                    <div className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-2">{post.category}</div>
                    <h3 className="text-lg font-bold text-navy-900 mb-3 line-clamp-2 group-hover:text-navy-700 transition-colors">{post.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{post.readingTime} min read</span>
                      </div>
                      <span className="text-navy-700 font-medium flex items-center gap-1">
                        Read more <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All posts */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-navy-400 focus:ring-2 focus:ring-navy-100 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-navy-900" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg">No articles found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map(post => (
                <button
                  key={post._id}
                  onClick={() => navigate(`/blog/${post.slug}`)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all text-left group"
                >
                  <div className="p-6">
                    <div className="text-xs font-semibold text-gold-600 uppercase tracking-wide mb-2">{post.category}</div>
                    <h3 className="text-lg font-bold text-navy-900 mb-3 line-clamp-2 group-hover:text-navy-700 transition-colors">{post.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock size={13} />
                        <span>{post.readingTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={13} />
                        <span>{new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
