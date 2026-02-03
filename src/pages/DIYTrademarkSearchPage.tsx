import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CheckCircle, XCircle, AlertTriangle, ArrowLeft, Loader2, Info, ExternalLink } from 'lucide-react';
import { trackAnalyticsEvent } from '../utils/tracking';

interface TrademarkResult {
  keyword: string;
  serialNumber: string;
  registrationNumber?: string;
  markIdentification: string;
  status: string;
  statusLabel?: string;
  statusCode?: string;
  statusDate: string;
  statusDefinition?: string;
  filingDate: string;
  registrationDate?: string;
  abandonmentDate?: string;
  expirationDate?: string;
  logo?: string;
  description?: string;
  owner: string;
  goodsServices?: string;
}

export default function DIYTrademarkSearchPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<TrademarkResult[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a trademark name to search');
      return;
    }

    setSearching(true);
    setSearched(false);
    setError('');
    setResults([]);

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/search-uspto-trademarks`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          status: 'all'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (data.unavailable) {
        setError('api_unavailable');
        setSearched(true);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to search trademarks');
      }

      if (data.trademarks && Array.isArray(data.trademarks)) {
        const formattedResults: TrademarkResult[] = data.trademarks.map((tm: any) => ({
          keyword: tm.keyword || searchTerm,
          serialNumber: tm.serialNumber || 'N/A',
          registrationNumber: tm.registrationNumber,
          markIdentification: tm.markIdentification || searchTerm,
          status: tm.status || 'Unknown',
          statusLabel: tm.statusLabel,
          statusCode: tm.statusCode,
          statusDate: tm.statusDate || '',
          statusDefinition: tm.statusDefinition,
          filingDate: tm.filingDate || '',
          registrationDate: tm.registrationDate,
          abandonmentDate: tm.abandonmentDate,
          expirationDate: tm.expirationDate,
          logo: tm.logo,
          description: tm.description,
          owner: tm.owner || 'Not Available',
          goodsServices: tm.goodsServices
        }));
        setResults(formattedResults);

        trackAnalyticsEvent('diy_search_completed', {
          search_term: searchTerm,
          results_count: formattedResults.length,
          has_conflicts: formattedResults.some(r => {
            const status = r.status.toLowerCase();
            return !status.includes('abandoned') && !status.includes('cancelled') && !status.includes('dead');
          })
        });
      } else {
        setResults([]);
        trackAnalyticsEvent('diy_search_completed', {
          search_term: searchTerm,
          results_count: 0,
          has_conflicts: false
        });
      }

      setSearched(true);
    } catch (err) {
      console.error('Search error:', err);
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Search timed out. The trademark database may be slow to respond. Please try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Unable to search: ${errorMessage}. Please try again or contact support.`);
      }
    } finally {
      setSearching(false);
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('registered') || statusLower.includes('live')) {
      return 'red';
    }
    if (statusLower.includes('pending') || statusLower.includes('published')) {
      return 'orange';
    }
    if (statusLower.includes('abandoned') || statusLower.includes('cancelled') || statusLower.includes('dead')) {
      return 'slate';
    }
    return 'slate';
  };

  const getAvailabilityStatus = () => {
    if (!searched) return null;

    const activeMarks = results.filter(r => {
      const status = r.status.toLowerCase();
      return !status.includes('abandoned') && !status.includes('cancelled') && !status.includes('dead');
    });

    if (activeMarks.length === 0) {
      return {
        available: true,
        icon: CheckCircle,
        color: 'green',
        title: 'Likely Available',
        message: 'We found no active trademarks matching your search. This is a good sign!'
      };
    }

    if (activeMarks.length === 1) {
      return {
        available: false,
        icon: XCircle,
        color: 'red',
        title: 'Conflict Found',
        message: '1 active trademark found that may conflict with your desired name.'
      };
    }

    return {
      available: false,
      icon: XCircle,
      color: 'red',
      title: 'Multiple Conflicts',
      message: `${activeMarks.length} active trademarks found that may conflict with your desired name.`
    };
  };

  const availability = getAvailabilityStatus();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/trademark-search')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 font-medium transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Search Options
          </button>

          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              DIY Trademark Search
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Search the USPTO database to check if your trademark name is available
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <Info className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold text-slate-900 mb-2">Important Notice</h3>
                <p className="text-slate-700 mb-2">
                  This free tool searches the federal USPTO trademark database only. A comprehensive trademark search should also include:
                </p>
                <ul className="list-disc pl-5 text-slate-700 space-y-1">
                  <li>State trademark registrations</li>
                  <li>Common law uses (unregistered trademarks)</li>
                  <li>Phonetically similar marks</li>
                  <li>Foreign language equivalents</li>
                  <li>Business name databases</li>
                </ul>
                <p className="text-slate-700 mt-3">
                  For a thorough professional search before filing, consider requesting an{' '}
                  <button
                    onClick={() => navigate('/trademark-search-request')}
                    className="text-blue-600 hover:text-blue-700 font-semibold underline"
                  >
                    attorney-conducted search ($49)
                  </button>.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-slate-700">
                <span className="font-bold">Note: This search does not include pending applications.</span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Enter Your Trademark Name
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="e.g., ACME INNOVATIONS"
                className="flex-1 px-4 py-3 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 text-lg"
                disabled={searching}
              />
              <button
                onClick={handleSearch}
                disabled={searching}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                {searching ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search
                  </>
                )}
              </button>
            </div>
            {error && error === 'api_unavailable' && (
              <div className="mt-6 bg-amber-50 border-2 border-amber-400 rounded-lg p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-slate-900 mb-2">DIY Search Unavailable</h3>
                    <p className="text-slate-700 mb-3">
                      Unfortunately, the USPTO does not provide a free public API for trademark keyword searches. Their free API only allows retrieval of specific trademark details by serial number.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-slate-900">Your Options:</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">1.</span>
                      <div>
                        <p className="text-slate-700">
                          <strong>Manual USPTO Search:</strong> Use the USPTO's free{' '}
                          <a
                            href="https://tmsearch.uspto.gov/search/search-information"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
                          >
                            TESS System <ExternalLink size={14} />
                          </a>
                          {' '}to search manually (requires learning complex search syntax)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">2.</span>
                      <div>
                        <p className="text-slate-700 mb-2">
                          <strong>Professional Search (Recommended - $49):</strong> Let our attorney conduct a comprehensive search including federal, state, and common law trademarks
                        </p>
                        <button
                          onClick={() => navigate('/trademark-search-request')}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        >
                          Request Professional Search ($49)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && error !== 'api_unavailable' && (
              <div className="mt-3 text-red-600 flex items-center gap-2">
                <AlertTriangle size={18} />
                {error}
              </div>
            )}
          </div>

          {availability && (
            <div className={`bg-${availability.color}-50 border-2 border-${availability.color}-500 rounded-2xl p-8 mb-8 shadow-lg`}>
              <div className="flex items-start gap-4">
                <div className={`bg-${availability.color}-500 p-3 rounded-full`}>
                  <availability.icon size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className={`text-2xl font-bold text-${availability.color}-900 mb-2`}>
                    {availability.title}
                  </h2>
                  <p className="text-lg text-slate-700 mb-4">
                    {availability.message}
                  </p>
                  {availability.available && (
                    <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                      <p className="text-slate-700 mb-3">
                        <span className="font-semibold">Next Step:</span> While no exact matches were found, we recommend a comprehensive attorney search before filing to check for similar marks, phonetic matches, and common law uses.
                      </p>
                      <button
                        onClick={() => navigate('/trademark-search-request')}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 px-6 py-2 rounded-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all"
                      >
                        Request Professional Search ($49)
                      </button>
                    </div>
                  )}
                  {!availability.available && (
                    <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                      <p className="text-slate-700 mb-3">
                        <span className="font-semibold">What This Means:</span> These existing trademarks may prevent your application from being approved. Review the conflicts below and consider choosing a different name or consulting with an attorney.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {searched && results.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Search Results ({results.length} found)
              </h3>
              {results.map((result, index) => {
                const color = getStatusColor(result.status);
                const isActive = !result.status.toLowerCase().includes('abandoned') &&
                                !result.status.toLowerCase().includes('cancelled') &&
                                !result.status.toLowerCase().includes('dead');

                return (
                  <div
                    key={index}
                    className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${
                      isActive ? 'border-red-500' : 'border-slate-400'
                    } hover:shadow-lg transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 flex items-start gap-4">
                        {result.logo && (
                          <img
                            src={result.logo}
                            alt={result.markIdentification}
                            className="w-20 h-20 object-contain bg-slate-50 rounded-lg border border-slate-200"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-900 mb-1">
                            {result.markIdentification}
                          </h4>
                          {result.keyword && result.keyword !== result.markIdentification && (
                            <p className="text-sm text-slate-500 mb-2">Keyword: {result.keyword}</p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-${color}-100 text-${color}-800`}>
                              {isActive ? (
                                <XCircle size={14} className="mr-1" />
                              ) : (
                                <CheckCircle size={14} className="mr-1" />
                              )}
                              {result.statusLabel || result.status}
                            </span>
                            {result.statusCode && (
                              <span className="text-xs text-slate-500 font-mono">
                                Code: {result.statusCode}
                              </span>
                            )}
                            {isActive && (
                              <span className="text-sm text-red-600 font-semibold">
                                ⚠️ Active Conflict
                              </span>
                            )}
                          </div>
                          {result.statusDefinition && (
                            <p className="text-sm text-slate-600 italic mb-2">
                              {result.statusDefinition}
                            </p>
                          )}
                        </div>
                      </div>
                      <a
                        href={`https://tsdr.uspto.gov/#caseNumber=${result.serialNumber}&caseType=SERIAL_NO&searchType=statusSearch`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium flex-shrink-0"
                      >
                        View on USPTO
                        <ExternalLink size={14} />
                      </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <span className="font-semibold text-slate-700">Serial Number:</span>
                        <span className="ml-2 text-slate-600">{result.serialNumber}</span>
                      </div>
                      {result.registrationNumber && (
                        <div>
                          <span className="font-semibold text-slate-700">Registration Number:</span>
                          <span className="ml-2 text-slate-600">{result.registrationNumber}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-700">Filing Date:</span>
                        <span className="ml-2 text-slate-600">
                          {result.filingDate ? new Date(result.filingDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700">Status Date:</span>
                        <span className="ml-2 text-slate-600">
                          {result.statusDate ? new Date(result.statusDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      {result.registrationDate && (
                        <div>
                          <span className="font-semibold text-slate-700">Registration Date:</span>
                          <span className="ml-2 text-slate-600">
                            {new Date(result.registrationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {result.abandonmentDate && (
                        <div>
                          <span className="font-semibold text-slate-700">Abandonment Date:</span>
                          <span className="ml-2 text-slate-600">
                            {new Date(result.abandonmentDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      {result.expirationDate && (
                        <div>
                          <span className="font-semibold text-slate-700">Expiration Date:</span>
                          <span className="ml-2 text-slate-600">
                            {new Date(result.expirationDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                      <div className="font-semibold text-slate-700 mb-1">Owner:</div>
                      <div className="text-slate-600">{result.owner}</div>
                    </div>

                    {result.description && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="font-semibold text-slate-700 mb-1">Description:</div>
                        <div className="text-slate-600 text-sm">{result.description}</div>
                      </div>
                    )}

                    {result.goodsServices && result.goodsServices !== result.description && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="font-semibold text-slate-700 mb-1">Goods/Services:</div>
                        <div className="text-slate-600 text-sm">{result.goodsServices}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Need Help Interpreting Results?</h3>
            <p className="text-slate-300 mb-6">
              Our experienced trademark attorneys can review your search results, assess conflict risks, and provide strategic guidance on your next steps.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/trademark-search-request')}
                className="bg-amber-500 text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-amber-400 transition-colors"
              >
                Request Professional Search ($49)
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="bg-white/10 text-white border-2 border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
