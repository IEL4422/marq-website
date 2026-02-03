import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Mail, Send, BookOpen, AlertCircle, LogOut, Info, FileText, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AmazonBrandRegistryGuide from '../components/AmazonBrandRegistryGuide';

interface ClientCase {
  id: string;
  client_email: string;
  client_name: string;
  trademark_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  estimated_completion_date: string | null;
  payment_id: string | null;
  package_name: string | null;
  package_price: string | null;
  purchase_date: string | null;
}

interface TrademarkMatter {
  id: string;
  client_id: string;
  client_docket: string;
  stage: string;
  progress: number;
  intake_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

interface MatterTodo {
  id: string;
  matter_id: string;
  title: string;
  description: string | null;
  due_date: string;
  completed_at: string | null;
  created_at: string;
}

interface Message {
  id: string;
  case_id: string;
  sender_email: string;
  sender_name: string;
  message: string;
  is_staff: boolean;
  created_at: string;
  read: boolean;
}

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
  const navigate = useNavigate();
  const { user, loading: authLoading, signUp, signIn, signOut } = useAuth();
  const [clientCase, setClientCase] = useState<ClientCase | null>(null);
  const [trademarkMatter, setTrademarkMatter] = useState<TrademarkMatter | null>(null);
  const [todos, setTodos] = useState<MatterTodo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
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
    if (user?.id) {
      fetchClientCase(user.email!);
      fetchTrademarkMatter();
    }
  }, [user]);

  const fetchTrademarkMatter = async () => {
    try {
      const { data: matterData, error: matterError } = await supabase
        .from('trademark_matters')
        .select('*')
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (matterError) throw matterError;

      if (matterData) {
        setTrademarkMatter(matterData);
        fetchTodos(matterData.id);
      }
    } catch (err) {
      console.error('Error fetching trademark matter:', err);
    }
  };

  const fetchTodos = async (matterId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('matter_todos')
        .select('*')
        .eq('matter_id', matterId)
        .order('due_date', { ascending: true });

      if (fetchError) throw fetchError;
      if (data) setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'messages' && clientCase) {
      markMessagesAsRead();
    }
  }, [activeTab, clientCase]);

  const fetchClientCase = async (clientEmail: string) => {
    try {
      setLoading(true);
      setError('');

      const { data, error: fetchError } = await supabase
        .from('client_cases')
        .select('*')
        .eq('client_email', clientEmail)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (data) {
        setClientCase(data);
        fetchMessages(data.id);
      } else {
        setError('No case found for this email address.');
      }
    } catch (err) {
      setError('Failed to load case information. Please try again.');
      console.error('Error fetching case:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (caseId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from('case_messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      if (data) setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const markMessagesAsRead = async () => {
    if (!clientCase) return;

    try {
      const { error } = await supabase
        .from('case_messages')
        .update({ read: true })
        .eq('case_id', clientCase.id)
        .eq('is_staff', true)
        .eq('read', false);

      if (error) throw error;

      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.is_staff ? { ...msg, read: true } : msg
        )
      );
    } catch (err) {
      console.error('Error marking messages as read:', err);
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
        setError(authError.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setClientCase(null);
    setMessages([]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientCase || !user) return;

    setSendingMessage(true);
    try {
      const { error: insertError } = await supabase
        .from('case_messages')
        .insert({
          case_id: clientCase.id,
          sender_email: user.email,
          sender_name: clientCase.client_name,
          message: newMessage.trim(),
          is_staff: false
        });

      if (insertError) throw insertError;

      setNewMessage('');
      fetchMessages(clientCase.id);
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {isSignUp ? 'Create Your Account' : 'Client Portal Login'}
            </h1>
            <p className="text-slate-600 mb-6">
              {isSignUp
                ? 'Create an account to access your case information'
                : 'Sign in to access your case information'
              }
            </p>

            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-sm text-blue-800">
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent"
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
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Create one"
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !clientCase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading your case...</p>
          {!loading && !clientCase && (
            <div className="mt-4 max-w-md">
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800">No case found for your email. Please contact support if you believe this is an error.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">Welcome, {clientCase.client_name}</h1>
                <p className="text-slate-200">Trademark: {clientCase.trademark_name}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm font-medium"
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
                    ? 'text-slate-900 border-b-2 border-slate-800 bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Status Tracking
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'messages'
                    ? 'text-slate-900 border-b-2 border-slate-800 bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Messages
                {messages.filter(m => m.is_staff && !m.read).length > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                    {messages.filter(m => m.is_staff && !m.read).length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('learning')}
                className={`flex-1 px-6 py-4 font-medium text-sm transition-colors ${
                  activeTab === 'learning'
                    ? 'text-slate-900 border-b-2 border-slate-800 bg-slate-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Matter Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Docket Number</p>
                        <p className="text-base font-semibold text-slate-900">{trademarkMatter.client_docket}</p>
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
                  <div className="border border-slate-200 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Action Items</h2>
                    <div className="space-y-3">
                      {todos.map(todo => (
                        <div
                          key={todo.id}
                          className={`flex items-start gap-3 p-4 rounded-lg ${
                            todo.completed_at
                              ? 'bg-green-50 border border-green-200'
                              : new Date(todo.due_date) < new Date()
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-slate-50 border border-slate-200'
                          }`}
                        >
                          {todo.completed_at ? (
                            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                          ) : (
                            <Circle className="text-slate-400 flex-shrink-0 mt-0.5" size={20} />
                          )}
                          <div className="flex-1">
                            <h3 className={`font-semibold ${todo.completed_at ? 'text-green-900' : 'text-slate-900'}`}>
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-sm text-slate-600 mt-1">{todo.description}</p>
                            )}
                            <p className="text-xs text-slate-500 mt-2">
                              {todo.completed_at ? (
                                <>Completed: {new Date(todo.completed_at).toLocaleDateString()}</>
                              ) : (
                                <>Due: {new Date(todo.due_date).toLocaleDateString()}</>
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {clientCase && clientCase.package_name && clientCase.purchase_date && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">Package Summary</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Package Purchased</p>
                        <p className="text-base font-semibold text-slate-900">{clientCase.package_name}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Price</p>
                        <p className="text-base font-semibold text-slate-900">{clientCase.package_price}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Purchase Date</p>
                        <p className="text-base font-semibold text-slate-900">
                          {new Date(clientCase.purchase_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {clientCase.status === 'Successfully Registered' && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
                      <CheckCircle2 className="text-white" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-green-900 mb-2">
                      Congratulations!
                    </h2>
                    <p className="text-green-800 text-lg">
                      Your trademark <span className="font-semibold">{clientCase.trademark_name}</span> is now officially registered with the USPTO.
                    </p>
                  </div>
                )}

                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Registration Progress</h2>
                  <div className="space-y-4">
                    {STATUS_STEPS.map((step, index) => {
                      const isCompleted = index < currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isPending = index > currentStatusIndex;
                      const isExpanded = expandedStage === step.key;

                      return (
                        <div key={step.key} className="border border-slate-200 rounded-lg overflow-hidden">
                          <div className="flex items-start gap-4 p-4 bg-white">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle2 className="text-green-600" size={28} />
                              ) : isCurrent ? (
                                <div className="relative">
                                  <Circle className="text-slate-800" size={28} />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 bg-slate-800 rounded-full"></div>
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
                                    className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                                  >
                                    {isExpanded ? 'Hide Details' : 'Learn More'}
                                  </button>
                                )}
                              </div>
                              {isCurrent && !isExpanded && (
                                <p className="text-sm text-slate-600 mt-1">Currently in progress</p>
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
                  {clientCase.estimated_completion_date && clientCase.status !== 'Successfully Registered' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-blue-900 mb-1">Estimated Completion Date</p>
                      <p className="text-lg font-semibold text-blue-900">
                        {new Date(clientCase.estimated_completion_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        This is an estimate and may vary based on USPTO processing times
                      </p>
                    </div>
                  )}

                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium text-slate-900">Last Updated:</span>{' '}
                      {new Date(clientCase.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
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

                <div className="bg-slate-50 rounded-lg p-6 max-h-96 overflow-y-auto space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No messages yet. Start a conversation below.</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-4 rounded-lg ${
                          message.is_staff
                            ? 'bg-blue-50 border border-blue-200 ml-8'
                            : 'bg-white border border-slate-200 mr-8'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-slate-900">{message.sender_name}</p>
                          <span className="text-xs text-slate-500">
                            {new Date(message.created_at).toLocaleString('en-US', {
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
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-transparent resize-none"
                      rows={4}
                      placeholder="Type your message here..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sendingMessage || !newMessage.trim()}
                    className="flex items-center gap-2 bg-slate-800 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                {clientCase.package_name?.toLowerCase().includes('amazon brand registry') && (
                  <div className="mb-8">
                    <AmazonBrandRegistryGuide />
                    <div className="border-t-2 border-slate-200 my-8"></div>
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Additional Trademark Resources</h3>
                  </div>
                )}

                <div className="grid gap-6">
                  <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
                    <h3 className="font-bold text-slate-900 mb-2">What is a Trademark?</h3>
                    <p className="text-slate-600 mb-4">
                      A trademark is a recognizable sign, design, or expression that identifies products or services from a particular source and distinguishes them from others. It can be a word, phrase, symbol, design, or a combination of these elements.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
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

                  <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
                    <h3 className="font-bold text-slate-900 mb-2">Understanding Trademark Classes</h3>
                    <p className="text-slate-600 mb-4">
                      Trademarks are registered in specific classes of goods or services. There are 45 international classes - 34 for goods and 11 for services. Choosing the right class is crucial for proper protection of your brand.
                    </p>
                  </div>

                  <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
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

                  <div className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 transition-colors">
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
