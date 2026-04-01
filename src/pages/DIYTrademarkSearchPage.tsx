import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft, Loader2, Info, ExternalLink, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { trackAnalyticsEvent } from '../utils/tracking';

export default function DIYTrademarkSearchPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    trademarkName: '',
    contactName: '',
    email: '',
    phone: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.trademarkName.trim() || !formData.contactName.trim() || !formData.email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('trademark_search_requests')
        .insert({
          trademark_name: formData.trademarkName.trim(),
          contact_name: formData.contactName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          description: formData.description.trim() || null,
          status: 'pending'
        });

      if (insertError) throw insertError;

      trackAnalyticsEvent('free_search_request_submitted', {
        trademark_name: formData.trademarkName,
        source: 'diy_page'
      });

      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting search request:', err);
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                Search Request Submitted Successfully!
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                Thank you for requesting a trademark search. Our attorney will review your request and conduct a comprehensive search of federal, state, and common law trademarks.
              </p>
              <p className="text-slate-600 mb-8">
                We'll contact you at <span className="font-semibold">{formData.email}</span> with the results and next steps.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={() => navigate('/')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                >
                  Return to Home
                </button>
                <button
                  onClick={() => navigate('/trademark-search-request')}
                  className="bg-slate-200 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-all"
                >
                  Request Professional Search ($49)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/trademark-search')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Search Options
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Request Free Trademark Search
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Submit your trademark name and our attorney will conduct a comprehensive search
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">What's Included</h3>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  <li>Search of federal USPTO trademark database</li>
                  <li>Review for exact and similar matches</li>
                  <li>Basic conflict assessment</li>
                  <li>Results delivered via email</li>
                </ul>
                <p className="text-slate-700 mt-3">
                  For a more comprehensive search including state registrations, common law uses, and detailed legal analysis,{' '}
                  <button
                    onClick={() => navigate('/trademark-search-request')}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    request our professional search service ($49)
                  </button>.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Trademark Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.trademarkName}
                  onChange={(e) => setFormData({ ...formData, trademarkName: e.target.value })}
                  placeholder="e.g., ACME INNOVATIONS"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={submitting}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Your Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Email <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell us about your business, industry, or any specific concerns..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                  disabled={submitting}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md text-lg"
              >
                {submitting ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Search size={24} />
                    Submit Search Request
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need More Comprehensive Results?</h3>
            <p className="text-slate-300 mb-6">
              Our professional search service includes state registrations, common law uses, phonetically similar marks, foreign language equivalents, and a detailed legal analysis with recommendations.
            </p>
            <button
              onClick={() => navigate('/trademark-search-request')}
              className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
            >
              Upgrade to Professional Search ($49)
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Or search manually using USPTO's{' '}
              <a
                href="https://tmsearch.uspto.gov/search/search-information"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
              >
                TESS System <ExternalLink size={14} />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
