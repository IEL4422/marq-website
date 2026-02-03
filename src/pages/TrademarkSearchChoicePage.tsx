import { useNavigate } from 'react-router-dom';
import { Search, UserCheck, Sparkles, Shield, Clock, DollarSign } from 'lucide-react';

export default function TrademarkSearchChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Choose Your Trademark Search Method
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Select the option that best fits your needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div
              onClick={() => navigate('/diy-search')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-4 rounded-full">
                    <Search size={48} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">
                  Search Yourself
                </h2>
                <p className="text-center text-blue-100 text-lg">
                  Free DIY Search Tool
                </p>
              </div>

              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-blue-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">Instant Results</div>
                      <div className="text-sm text-slate-600">Get immediate feedback on availability</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <DollarSign className="text-green-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">100% Free</div>
                      <div className="text-sm text-slate-600">No cost to search the USPTO database</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">Quick & Easy</div>
                      <div className="text-sm text-slate-600">User-friendly interface in plain English</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Best for:</span> Quick preliminary checks and budget-conscious searches
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-blue-700 transition-all group-hover:scale-105 transform shadow-md">
                  Start Free Search
                </button>
              </div>
            </div>

            <div
              onClick={() => navigate('/trademark-search-form')}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-amber-500 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-white/20 p-4 rounded-full">
                    <UserCheck size={48} className="text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-center mb-2">
                  Attorney Search
                </h2>
                <p className="text-center text-slate-300 text-lg">
                  Professional Comprehensive Search - $49
                </p>
              </div>

              <div className="p-8">
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">Expert Analysis</div>
                      <div className="text-sm text-slate-600">Comprehensive review by licensed attorneys</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Search className="text-slate-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">Deep Search</div>
                      <div className="text-sm text-slate-600">Includes common law and phonetic conflicts</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Sparkles className="text-purple-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <div className="font-semibold text-slate-900">Strategic Advice</div>
                      <div className="text-sm text-slate-600">Detailed report with registration recommendations</div>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6">
                  <p className="text-sm text-slate-700">
                    <span className="font-semibold">Best for:</span> Serious brands planning to invest in trademark registration
                  </p>
                </div>

                <button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 py-4 rounded-xl font-semibold text-lg hover:from-amber-600 hover:to-amber-700 transition-all group-hover:scale-105 transform shadow-md">
                  Request Attorney Search
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-slate-100 rounded-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
              Which Option Should You Choose?
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Choose DIY Search If:</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>You want a quick preliminary check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>You're on a tight budget</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>You're comparing multiple name options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>You need results immediately</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Choose Attorney Search If:</h4>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>You're ready to file for trademark registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>You want to minimize rejection risk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>Your brand name has significant value</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">•</span>
                    <span>You need legal advice on conflicts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
