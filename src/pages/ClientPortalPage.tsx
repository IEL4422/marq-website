import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Mail, Send, BookOpen, AlertCircle, LogOut, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cases as casesApi, matters as mattersApi } from '../lib/api';
import type { ClientCase, TrademarkMatter, CaseMessage, Todo } from '../lib/api';
import AmazonBrandRegistryGuide from '../components/AmazonBrandRegistryGuide';

const STATUS_STEPS = [
  {
    key: 'Trademark Search',
    label: 'Trademark Search',
    description: 'Our team conducts a comprehensive search of federal and state trademark databases to identify potential conflicts with your proposed trademark.',
    timeline: 'Typically completed within 3-5 business days'
  },
  {
    key: 'Trademark Registration',
    label: 'Trademark Registration',
    description: 'Your application has been prepared and filed with the United States Patent and Trademark Office (USPTO).',
    timeline: 'Application filing typically completed within 1-2 business days'
  },
  {
    key: 'USPTO Processing & Review',
    label: 'USPTO Processing & Review',
    description: 'The USPTO is reviewing your application. A USPTO examining attorney will review your application for compliance with trademark laws and search for conflicting marks. If approved, it will be published for opposition before final registration.',
    timeline: 'USPTO processing typically takes 8-12 months from filing to registration'
  },
  {
    key: 'Successfully Registered',
    label: 'Successfully Registered',
    description: 'Congratulations! Your trademark is now officially registered with the USPTO.',
    timeline: 'Registration complete'
  }
];

export default function ClientPortalPage() {
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [trademarkMatter, setTrademarkMatter] = useState<TrademarkMatter | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [messages, setMessages] = useState<CaseMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState<'status' | 'messages' | 'learning'>('status');
  const [expandedStage, setExpandedStage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchClientCase();
      fetchTrademarkMatter();
    }
  }, [user]);

  const fetchTrademarkMatter = async () => {
    try {
      const myMatters = await mattersApi.myMatters();
      if (myMatters && myMatters.length > 0) {
        const sorted = [...myMatters].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTrademarkMatter(sorted[0]);
        setTodos(sorted[0].todos || []);
      }
    } catch (err) {
      console.error('Error fetching trademark matter:', err);
    }
  };

  const fetchClientCase = async () => {
    try {
      setLoading(true);
      setError('');
      const myCases = await casesApi.myCases();
      if (myCases && myCases.length > 0) {
        const sorted = [...myCases].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setClientCase(sorted[0]);
        setMessages(sorted[0].messages || []);
      } else {
        setError('No case found for your account.');
      }
    } catch (err) {
      setError('Failed to load case information. Please try again.');
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);
      if (authError) {
        setError(authError.message || 'Authentication failed. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    setClientCase(null);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientCase || !user) return;

    setSendingMessage(true);
    try {
      await casesApi.sendMessage(clientCase._id, newMessage.trim());
      setNewMessage('');
      // Reload case to get updated messages
      const myCases = await casesApi.myCases();
      if (myCases && myCases.length > 0) {
        const updated = myCases.find(c => c._id === clientCase._id) || myCases[0];
        setMessages(updated.messages || []);
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const getCurrentStatusIndex = () => {
    if (!clientCase) return 0;
    return STATUS_STEPS.findIndex(step => step.key === clientCase.status);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mx-auto mb-4">
              <span className="text-amber-400 font-bold text-lg">M</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">
              {isSignUp ? 'Create Your Account' : 'Client Portal Login'}
            </h1>
            <p className="text-slate-500 mb-6 text-center text-sm">
              {isSignUp
                ? 'Create an account to access your case information'
                : 'Sign in to access your case information'}
            </p>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-2">
                <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-amber-900">
                  <p className="font-medium mb-1">Important</p>
                  <p>Please use the same email address you used when purchasing our services. This ensures your case information is correctly linked to your account.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                  placeholder="your.email@example.com"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  disabled={loading}
                />
                {isSignUp && (
                  <p className="mt-1 text-xs text-slate-500">Password must be at least 6 characters</p>
                )}
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your case...</p>
        </div>
      </div>
    );
  }

  if (!clientCase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
            <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-900">
              {error || 'No case found for your account. Please contact support if you believe this is an error.'}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();
  const unreadCount = messages.filter(m => m.isStaff && !m.read).length;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                  <p className="text-amber-400 text-sm font-medium uppercase tracking-wide">Client Portal</p>
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome, {clientCase.clientName}</h1>
                <p className="text-slate-300">Trademark: <span className="text-amber-300 font-medium">{clientCase.trademarkName}</span></p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors text-sm font-medium border border-white/20"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>

          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('status')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'status'
                    ? 'text-slate-900 border-b-2 border-amber-500 bg-amber-50/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Status Tracking
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'messages'
                    ? 'text-slate-900 border-b-2 border-amber-500 bg-amber-50/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Messages
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'learning'
                    ? 'text-slate-900 border-b-2 border-amber-500 bg-amber-50/50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Learning Center
              </button>
            </div>
          </div>

          <div className="p-8">
            {activeTab === 'status' && (
              <div className="space-y-8">
                {trademarkMatter && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Matter Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Docket Number</p>
                        <p className="text-base font-semibold text-slate-900">{trademarkMatter.docketNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Current Stage</p>
                        <p className="text-base font-semibold text-slate-900">{trademarkMatter.stage}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Progress</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-2">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all"
                              style={{ width: `${trademarkMatter.progress}%` }}
                            />
                          </div>
                          <span className="text-base font-semibold text-slate-900">{trademarkMatter.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {todos.length > 0 && (
                  <div className="border border-slate-200 rounded-2xl p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Items</h2>
                    <div className="space-y-3">
                      {todos.map((todo, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 p-4 rounded-xl ${
                            todo.completed
                              ? 'bg-green-50 border border-green-200'
                              : todo.dueDate && new Date(todo.dueDate) < new Date()
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-slate-50 border border-slate-200'
                          }`}
                        >
                          {todo.completed ? (
                            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                          ) : (
                            <Circle className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
                          )}
                          <div className="flex-1">
                            <h3 className={`font-semibold ${todo.completed ? 'text-green-900' : 'text-slate-900'}`}>
                              {todo.title}
                            </h3>
                            <p className="text-xs text-slate-500 mt-2">
                              {todo.completed ? (
                                <>Completed</>
                              ) : (
                                <>Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : 'N/A'}</>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clientCase.status === 'Successfully Registered' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <CheckCircle2 className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Congratulations!
                    </h2>
                    <p className="text-green-800 text-lg">
                      Your trademark <span className="font-semibold">{clientCase.trademarkName}</span> is now officially registered with the USPTO.
                    </p>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Registration Progress</h2>
                  <div className="space-y-4">
                    {STATUS_STEPS.map((step, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isExpanded = expandedStage === step.key;

                      return (
                        <div key={step.key} className="border border-slate-200 rounded-2xl overflow-hidden">
                          <div className="flex items-start gap-4 p-4 bg-white">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="text-green-600" size={28} />
                              ) : isCurrent ? (
                                <div className="relative">
                                  <Circle className="text-amber-500" size={28} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                                  </div>
                                </div>
                              ) : (
                                <Circle className="text-slate-300" size={28} />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex items-center justify-between">
                                <h3 className={`font-semibold ${
                                  isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                                }`}>
                                  {step.label}
                                </h3>
                                {(isCurrent || isCompleted) && (
                                  <button
                                    onClick={() => setExpandedStage(isExpanded ? null : step.key)}
                                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                                  >
                                    {isExpanded ? 'Hide Details' : 'Learn More'}
                                  </button>
                                )}
                              </div>
                              {isCurrent && !isExpanded && (
                                <p className="text-sm text-slate-500 mt-1">Currently in progress</p>
                              )}
                            </div>
                          </div>

                          {isExpanded && (isCurrent || isCompleted) && (
                            <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-3">
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-1">About This Stage</p>
                                <p className="text-sm text-slate-600">{step.description}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-700 mb-1">Typical Timeline</p>
                                <p className="text-sm text-slate-600">{step.timeline}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4">
                  {clientCase.estimatedCompletion && clientCase.status !== 'Successfully Registered' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                      <p className="text-sm font-medium text-amber-900 mb-1">Estimated Completion Date</p>
                      <p className="text-lg font-semibold text-amber-900">
                        {new Date(clientCase.estimatedCompletion).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-amber-700 mt-1">
                        This is an estimate and may vary based on USPTO processing times
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-2xl p-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">Case Opened:</span>{' '}
                      {new Date(clientCase.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Mail className="text-slate-700" size={24} />
                  <h2 className="text-xl font-bold text-slate-900">Messages</h2>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 max-h-96 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No messages yet. Start a conversation below.</p>
                  ) : (
                    messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl ${
                          message.isStaff
                            ? 'bg-slate-900/5 border border-slate-200 ml-8'
                            : 'bg-white border border-slate-200 mr-8'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-slate-900">{message.sender}</p>
                          <span className="text-xs text-slate-400">
                            {new Date(message.sentAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-slate-700 whitespace-pre-wrap">{message.message}</p>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Send a message to your attorney
                    </label>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none transition"
                      rows={4}
                      placeholder="Type your message here..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={18} />
                    {sendingMessage ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'learning' && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-slate-700" size={24} />
                  <h2 className="text-xl font-bold text-slate-900">Learning Center</h2>
                </div>

                {clientCase.trademarkName?.toLowerCase().includes('amazon brand registry') && (
                  <div className="mb-8">
                    <AmazonBrandRegistryGuide />
                    <div className="border-t-2 border-slate-200 my-8"></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Additional Trademark Resources</h3>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="border border-slate-200 rounded-2xl p-6 hover:border-amber-200 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">What is a Trademark?</h3>
                    <p className="text-slate-600 mb-4">
                      A trademark is a recognizable sign, design, or expression that identifies products or services from a particular source and distinguishes them from others. It can be a word, phrase, symbol, design, or a combination of these elements.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 hover:border-amber-200 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">The Trademark Registration Process</h3>
                    <p className="text-slate-600 mb-4">
                      The trademark registration process involves several key steps:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-slate-600">
                      <li>Comprehensive trademark search to ensure availability</li>
                      <li>Preparing and filing the application with the USPTO</li>
                      <li>USPTO examination (typically 3-4 months)</li>
                      <li>Publication for opposition (30 days)</li>
                      <li>Registration and certificate issuance</li>
                    </ol>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 hover:border-amber-200 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">Understanding Trademark Classes</h3>
                    <p className="text-slate-600 mb-4">
                      Trademarks are registered in specific classes of goods or services. There are 45 international classes - 34 for goods and 11 for services. Choosing the right class is crucial for proper protection of your brand.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 hover:border-amber-200 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">Maintaining Your Trademark</h3>
                    <p className="text-slate-600 mb-4">
                      After registration, you must maintain your trademark by:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                      <li>Filing a Declaration of Use between years 5-6</li>
                      <li>Renewing every 10 years</li>
                      <li>Actively using the trademark in commerce</li>
                      <li>Monitoring and enforcing your trademark rights</li>
                    </ul>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-6 hover:border-amber-200 hover:shadow-sm transition-all">
                    <h3 className="font-bold text-slate-900 mb-2">Common Trademark Mistakes to Avoid</h3>
                    <p className="text-slate-600 mb-4">
                      Avoid these common pitfalls:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-slate-600">
                      <li>Not conducting a thorough trademark search</li>
                      <li>Choosing a descriptive or generic mark</li>
                      <li>Filing in the wrong class of goods or services</li>
                      <li>Failing to respond to USPTO office actions on time</li>
                      <li>Not monitoring for potential infringement</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
