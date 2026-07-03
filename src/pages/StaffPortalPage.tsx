import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  searchRequests as searchRequestsApi,
  payments as paymentsApi,
  agreements as agreementsApi,
  cases as casesApi,
} from '../lib/api';
import type { ClientCase, SearchRequestData, PaymentRecord, AgreementData, CaseMessage } from '../lib/api';
import {
  Mail, Package, CreditCard, FileText, CheckCircle, XCircle,
  LogOut, Lock, Users, ArrowRight, Send, AlertOctagon, BarChart3, RefreshCw
} from 'lucide-react';

// Types for data not yet available in the new API
interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  notified: boolean;
  contacted: boolean;
  spam: boolean;
  viewed: boolean;
}

interface QuestionnaireResponse {
  id: string;
  trademark_name: string | null;
  trademark_type: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  package_selected: string | null;
  created_at: string;
  viewed: boolean;
}

interface IncompleteForm {
  session_id: string;
  started_at: string;
  last_activity: string;
  last_screen: number;
  form_data: any;
  has_progress: boolean;
}

interface OfficeActionRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  trademark_name: string;
  service_type: string;
  logo_url: string | null;
  office_action_url: string;
  payment_id: string | null;
  viewed: boolean;
  created_at: string;
}

interface CeaseAndDesistRequest {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  trademark_name: string;
  logo_url: string | null;
  trademark_filed_date: string;
  trademark_accepted_date: string | null;
  infringer_name: string;
  infringer_contact: string | null;
  infringement_description: string;
  desired_outcome: string;
  additional_info: string | null;
  payment_id: string | null;
  viewed: boolean;
  created_at: string;
}

// Extend AgreementData with server-assigned fields
type StoredAgreement = AgreementData & { _id?: string; createdAt?: string };

export default function StaffPortalPage() {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Data state
  const [contactSubmissions] = useState<ContactSubmission[]>([]);
  const [trademarkRequests, setTrademarkRequests] = useState<SearchRequestData[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [agreements, setAgreements] = useState<StoredAgreement[]>([]);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [questionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [officeActionRequests] = useState<OfficeActionRequest[]>([]);
  const [ceaseAndDesistRequests] = useState<CeaseAndDesistRequest[]>([]);
  const [_incompleteForms] = useState<IncompleteForm[]>([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'contacts' | 'trademarks' | 'purchases' | 'cases' | 'questionnaires' | 'office-actions' | 'cease-desist'
  >('contacts');

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [analyticsStats] = useState({ diySearches: 0, formsStarted: 0, formsCompleted: 0, conversionRate: 0 });
  const [refreshingAnalytics, setRefreshingAnalytics] = useState(false);

  const [selectedCase, setSelectedCase] = useState<ClientCase | null>(null);
  const [caseMessages, setCaseMessages] = useState<CaseMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newCaseName, setNewCaseName] = useState('');
  const [newCaseEmail, setNewCaseEmail] = useState('');
  const [newCaseTrademark, setNewCaseTrademark] = useState('');
  const [creatingCase, setCreatingCase] = useState(false);
  const [showNewCaseForm, setShowNewCaseForm] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [editingEstimatedDate, setEditingEstimatedDate] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'succeeded' | 'pending' | 'failed'>('all');
  const [trademarkNotes, setTrademarkNotes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user?.isStaff) {
      fetchAllData();
    }
  }, [user]);

  useEffect(() => {
    if (!user?.isStaff) return;
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setLoginError(error.message || 'Failed to login');
      }
    } catch (error: any) {
      setLoginError(error.message || 'Failed to login');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    signOut();
    setTrademarkRequests([]);
    setPayments([]);
    setAgreements([]);
    setClientCases([]);
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [casesRes, paymentsRes, agreementsRes, searchRes] = await Promise.all([
        casesApi.list(),
        paymentsApi.list(),
        agreementsApi.list(),
        searchRequestsApi.list(),
      ]);

      const fetchedCases = casesRes.cases || [];
      setClientCases(fetchedCases);
      computeUnreadCounts(fetchedCases);

      setPayments(paymentsRes.payments || []);
      setAgreements(agreementsRes.agreements as StoredAgreement[] || []);

      const requests = searchRes.requests || [];
      setTrademarkRequests(requests);
      const notes: Record<string, string> = {};
      requests.forEach(req => {
        if (req._id && req.staffNotes) {
          notes[req._id] = req.staffNotes;
        }
      });
      setTrademarkNotes(notes);
    } catch (error: any) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const computeUnreadCounts = (casesList: ClientCase[]) => {
    const counts: Record<string, number> = {};
    casesList.forEach(c => {
      if (c.messages) {
        const unread = c.messages.filter(m => !m.isStaff && !m.read).length;
        if (unread > 0) counts[c._id] = unread;
      }
    });
    setUnreadCounts(counts);
  };

  const refreshData = async () => {
    setRefreshingAnalytics(true);
    try {
      await fetchAllData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshingAnalytics(false);
    }
  };

  const handleTrademarkStatus = async (requestId: string, status: 'conflict_found' | 'no_conflict') => {
    setUpdatingStatus(requestId);
    try {
      const notes = trademarkNotes[requestId] || '';
      await searchRequestsApi.update(requestId, { status, staffNotes: notes });
      setTrademarkRequests(prev =>
        prev.map(req =>
          req._id === requestId ? { ...req, status, staffNotes: notes } : req
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeSince = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const now = new Date();
    const created = new Date(dateString);
    if (isNaN(created.getTime())) return 'Invalid Date';
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const formatDateOnly = (dateString: string | null | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatCurrency = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amountCents / 100);
  };

  const getPaymentAgreement = (payment: PaymentRecord) => {
    return agreements.find(
      a => a.clientEmail.toLowerCase() === payment.clientEmail.toLowerCase()
    );
  };

  const getFilteredPayments = () => {
    let filtered: PaymentRecord[];
    if (paymentFilter === 'all') {
      filtered = payments;
    } else if (paymentFilter === 'pending') {
      filtered = payments.filter(p => p.status === 'processing' || p.status === 'pending');
    } else if (paymentFilter === 'failed') {
      filtered = payments.filter(p => p.status === 'failed' || p.status === 'canceled');
    } else {
      filtered = payments.filter(p => p.status === paymentFilter);
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCase(true);
    try {
      await casesApi.create({
        clientName: newCaseName,
        clientEmail: newCaseEmail,
        trademarkName: newCaseTrademark,
        status: 'Trademark Search',
      });
      setNewCaseName('');
      setNewCaseEmail('');
      setNewCaseTrademark('');
      setShowNewCaseForm(false);
      await fetchAllData();
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    } finally {
      setCreatingCase(false);
    }
  };

  const handleCaseStatusUpdate = async (caseId: string, newStatus: string) => {
    setUpdatingStatus(caseId);
    try {
      const updated = await casesApi.update(caseId, { status: newStatus });
      setClientCases(prev => prev.map(c => c._id === caseId ? updated : c));
      if (selectedCase?._id === caseId) {
        setSelectedCase(updated);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fetchCaseMessages = async (caseId: string) => {
    try {
      const res = await casesApi.list();
      const theCase = (res.cases || []).find(c => c._id === caseId);
      if (theCase?.messages) {
        setCaseMessages(theCase.messages);
        // Clear unread badge
        setUnreadCounts(prev => ({ ...prev, [caseId]: 0 }));
      } else {
        setCaseMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSelectCase = (clientCase: ClientCase) => {
    setSelectedCase(clientCase);
    setCaseMessages(clientCase.messages || []);
    setEstimatedDate(clientCase.estimatedCompletion || '');
    setEditingEstimatedDate(false);
    fetchCaseMessages(clientCase._id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCase) return;

    setSendingMessage(true);
    try {
      await casesApi.sendMessage(selectedCase._id, newMessage.trim());
      setNewMessage('');
      await fetchCaseMessages(selectedCase._id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateEstimatedDate = async () => {
    if (!selectedCase) return;
    setUpdatingStatus(selectedCase._id);
    try {
      const updated = await casesApi.update(selectedCase._id, {
        estimatedCompletion: estimatedDate || undefined,
      });
      setEditingEstimatedDate(false);
      setClientCases(prev => prev.map(c => c._id === selectedCase._id ? updated : c));
      setSelectedCase(updated);
    } catch (error) {
      console.error('Error updating estimated date:', error);
      alert('Failed to update estimated date. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const STATUS_OPTIONS = [
    'Trademark Search',
    'Trademark Registration',
    'USPTO Processing & Review',
    'Successfully Registered'
  ];

  // Loading auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Login form
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-slate-900">
              <Lock className="h-6 w-6 text-amber-400" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
              Staff Portal Login
            </h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Enter your credentials to access the staff portal
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loggingIn}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Access denied for non-staff users
  if (!user.isStaff) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="mx-auto h-14 w-14 flex items-center justify-center rounded-2xl bg-red-100 mb-4">
            <XCircle className="h-7 w-7 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-slate-500 mb-6">You don't have permission to access the staff portal.</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  // Loading data
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading staff portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-amber-400 text-xs font-medium uppercase tracking-wide">Internal</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
              <p className="mt-0.5 text-sm text-slate-400">Manage all client submissions and requests</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Analytics Dashboard */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Analytics Overview</h2>
          <button
            onClick={refreshData}
            disabled={refreshingAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${refreshingAnalytics ? 'animate-spin' : ''}`} />
            {refreshingAnalytics ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">DIY Searches</h3>
              <BarChart3 className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analyticsStats.diySearches}</p>
            <p className="text-xs text-slate-400 mt-1">Total searches completed</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Forms Started</h3>
              <BarChart3 className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analyticsStats.formsStarted}</p>
            <p className="text-xs text-slate-400 mt-1">Incomplete forms</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Forms Completed</h3>
              <BarChart3 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analyticsStats.formsCompleted}</p>
            <p className="text-xs text-slate-400 mt-1">Get Started forms submitted</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-500">Conversion Rate</h3>
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{analyticsStats.conversionRate}%</p>
            <p className="text-xs text-slate-400 mt-1">Forms started to completed</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 mb-8">
          <nav className="-mb-px flex space-x-1 overflow-x-auto">
            {[
              { key: 'contacts', icon: Mail, label: 'Contacts', count: contactSubmissions.length, badge: 0 },
              { key: 'trademarks', icon: FileText, label: 'TM Searches', count: trademarkRequests.length, badge: trademarkRequests.filter(t => t.status === 'pending').length },
              { key: 'cases', icon: Users, label: 'Client Cases', count: clientCases.length, badge: Object.values(unreadCounts).reduce((a, b) => a + b, 0) },
              { key: 'questionnaires', icon: Package, label: 'Intake Forms', count: questionnaireResponses.length, badge: 0 },
              { key: 'purchases', icon: CreditCard, label: 'Purchases', count: payments.length, badge: payments.filter(p => p.status === 'succeeded').length },
              { key: 'office-actions', icon: FileText, label: 'Office Actions', count: officeActionRequests.length, badge: 0 },
              { key: 'cease-desist', icon: AlertOctagon, label: 'Cease & Desist', count: ceaseAndDesistRequests.length, badge: 0 },
            ].map(({ key, icon: Icon, label, count, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`${
                  activeTab === key
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                } whitespace-nowrap py-4 px-3 border-b-2 font-medium text-sm flex items-center gap-1.5`}
              >
                <Icon className="w-4 h-4" />
                {label} ({count})
                {badge > 0 && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-amber-500 rounded-full">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Contacts Tab */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Contact submissions</p>
              <p className="text-sm text-slate-400 mt-1">Contact list endpoint not yet available in the new API</p>
            </div>
          </div>
        )}

        {/* Trademark Searches Tab */}
        {activeTab === 'trademarks' && (
          <div className="space-y-4">
            {trademarkRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No trademark search requests yet</p>
              </div>
            ) : (
              [...trademarkRequests]
                .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
                .map((request) => (
                  <div key={request._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{request.trademarkName}</h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'conflict_found'
                              ? 'bg-red-100 text-red-800'
                              : request.status === 'no_conflict'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {request.status === 'conflict_found' && 'Conflict Found'}
                            {request.status === 'no_conflict' && 'No Conflict'}
                            {(!request.status || request.status === 'pending') && 'Pending Review'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-400 ml-4">
                        <p>{formatDate(request.createdAt)}</p>
                        <p className="text-xs mt-1">{getTimeSince(request.createdAt)}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500 mb-1">Contact Information</p>
                        <p className="text-slate-900">{request.clientName || '—'}</p>
                        <a href={`mailto:${request.clientEmail}`} className="text-amber-600 hover:text-amber-700 text-sm">
                          {request.clientEmail}
                        </a>
                        {request.clientPhone && (
                          <p className="text-sm text-slate-500 mt-0.5">{request.clientPhone}</p>
                        )}
                      </div>
                      {request.goodsServices && (
                        <div>
                          <p className="text-sm font-medium text-slate-500 mb-1">Goods/Services</p>
                          <p className="text-slate-700 text-sm">{request.goodsServices}</p>
                        </div>
                      )}
                    </div>

                    {request.businessDescription && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-500 mb-1">Business Description</p>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{request.businessDescription}</p>
                      </div>
                    )}

                    {(!request.status || request.status === 'pending') && (
                      <div className="pt-4 border-t border-slate-100 space-y-3">
                        <div>
                          <label htmlFor={`notes-${request._id}`} className="block text-sm font-medium text-slate-700 mb-2">
                            Search Notes
                          </label>
                          <textarea
                            id={`notes-${request._id}`}
                            value={trademarkNotes[request._id || ''] || ''}
                            onChange={(e) => setTrademarkNotes(prev => ({ ...prev, [request._id || '']: e.target.value }))}
                            placeholder="Add notes about this trademark search..."
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none text-sm"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleTrademarkStatus(request._id!, 'no_conflict')}
                            disabled={updatingStatus === request._id}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {updatingStatus === request._id ? 'Processing...' : 'No Conflict Found'}
                          </button>
                          <button
                            onClick={() => handleTrademarkStatus(request._id!, 'conflict_found')}
                            disabled={updatingStatus === request._id}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                          >
                            <XCircle className="w-4 h-4" />
                            {updatingStatus === request._id ? 'Processing...' : 'Conflict Found'}
                          </button>
                        </div>
                      </div>
                    )}

                    {request.status && request.status !== 'pending' && (
                      <div className="pt-4 border-t border-slate-100">
                        <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl mb-3 ${
                          request.status === 'no_conflict'
                            ? 'bg-green-50 text-green-800'
                            : 'bg-red-50 text-red-800'
                        }`}>
                          {request.status === 'no_conflict' ? (
                            <><CheckCircle className="w-5 h-5" /><span className="font-medium">No Conflict Found</span></>
                          ) : (
                            <><XCircle className="w-5 h-5" /><span className="font-medium">Conflict Found</span></>
                          )}
                        </div>
                        {request.staffNotes && (
                          <div className="p-3 bg-slate-50 rounded-xl">
                            <p className="text-xs font-medium text-slate-500 mb-1">Staff Notes</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{request.staffNotes}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
            )}
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Client Cases</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Manage trademark registration cases and client communication.
                </p>
              </div>
              <button
                onClick={() => setShowNewCaseForm(!showNewCaseForm)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium text-sm"
              >
                {showNewCaseForm ? 'Cancel' : '+ New Case'}
              </button>
            </div>

            {showNewCaseForm && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Create New Case</h3>
                <form onSubmit={handleCreateCase} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={newCaseName}
                      onChange={(e) => setNewCaseName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Client Email</label>
                    <input
                      type="email"
                      value={newCaseEmail}
                      onChange={(e) => setNewCaseEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Trademark Name</label>
                    <input
                      type="text"
                      value={newCaseTrademark}
                      onChange={(e) => setNewCaseTrademark(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingCase}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                  >
                    {creatingCase ? 'Creating...' : 'Create Case'}
                  </button>
                </form>
              </div>
            )}

            {clientCases.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No client cases yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">All Cases</h3>
                  {[...clientCases]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((clientCase) => (
                      <div
                        key={clientCase._id}
                        onClick={() => handleSelectCase(clientCase)}
                        className={`bg-white rounded-2xl border p-4 hover:shadow-sm transition-all cursor-pointer ${
                          selectedCase?._id === clientCase._id
                            ? 'border-amber-400 ring-2 ring-amber-100'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900">{clientCase.trademarkName}</h4>
                              {(unreadCounts[clientCase._id] || 0) > 0 && (
                                <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full">
                                  {unreadCounts[clientCase._id]}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5">{clientCase.clientName}</p>
                            <p className="text-sm text-slate-400">{clientCase.clientEmail}</p>
                          </div>
                          <ArrowRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            selectedCase?._id === clientCase._id ? 'text-amber-500 translate-x-0.5' : 'text-slate-300'
                          }`} />
                        </div>
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            clientCase.status === 'Successfully Registered'
                              ? 'bg-green-100 text-green-800'
                              : clientCase.status === 'USPTO Processing & Review'
                              ? 'bg-purple-100 text-purple-800'
                              : clientCase.status === 'Trademark Registration'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {clientCase.status}
                          </span>
                          {clientCase.estimatedCompletion && clientCase.status !== 'Successfully Registered' && (
                            <span className="text-xs text-slate-400">
                              Est: {formatDateOnly(clientCase.estimatedCompletion)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <div>
                  {selectedCase ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-4">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Case Details</h3>
                        <div className="space-y-3 mb-6">
                          <div>
                            <p className="text-sm font-medium text-slate-500">Client</p>
                            <p className="text-slate-900">{selectedCase.clientName}</p>
                            <p className="text-sm text-slate-500">{selectedCase.clientEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-500">Trademark</p>
                            <p className="text-slate-900 font-medium">{selectedCase.trademarkName}</p>
                          </div>
                          {selectedCase.docketNumber && (
                            <div>
                              <p className="text-sm font-medium text-slate-500">Docket Number</p>
                              <p className="text-slate-900 font-mono text-sm">{selectedCase.docketNumber}</p>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-500">Opened</p>
                            <p className="text-slate-500 text-sm">{formatDate(selectedCase.createdAt)}</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Update Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {STATUS_OPTIONS.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleCaseStatusUpdate(selectedCase._id, status)}
                                  disabled={updatingStatus === selectedCase._id || selectedCase.status === status}
                                  className={`px-3 py-2 text-xs font-medium rounded-xl transition-colors text-left ${
                                    selectedCase.status === status
                                      ? 'bg-amber-100 text-amber-900 border-2 border-amber-400'
                                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Estimated Completion Date
                            </label>
                            {editingEstimatedDate ? (
                              <div className="space-y-2">
                                <input
                                  type="date"
                                  value={estimatedDate}
                                  onChange={(e) => setEstimatedDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none text-sm"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleUpdateEstimatedDate}
                                    disabled={updatingStatus === selectedCase._id}
                                    className="flex-1 px-3 py-1.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 text-xs font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingEstimatedDate(false);
                                      setEstimatedDate(selectedCase.estimatedCompletion || '');
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                <span className="text-sm text-slate-700">
                                  {selectedCase.estimatedCompletion ? formatDateOnly(selectedCase.estimatedCompletion) : 'Not set'}
                                </span>
                                <button
                                  onClick={() => setEditingEstimatedDate(true)}
                                  className="text-xs text-amber-600 hover:text-amber-700 font-medium"
                                >
                                  {selectedCase.estimatedCompletion ? 'Edit' : 'Set Date'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                        <h4 className="font-semibold text-slate-900 mb-4">Messages</h4>
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {caseMessages.length === 0 ? (
                            <p className="text-sm text-slate-400 text-center py-4">No messages yet</p>
                          ) : (
                            caseMessages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl text-sm ${
                                  msg.isStaff
                                    ? 'bg-slate-900/5 border border-slate-200 ml-4'
                                    : 'bg-white border border-slate-200 mr-4'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <p className="font-medium text-slate-900">{msg.sender}</p>
                                  <span className="text-xs text-slate-400">
                                    {formatDate(msg.sentAt)}
                                  </span>
                                </div>
                                <p className="text-slate-700 whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-3">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none resize-none text-sm"
                            rows={3}
                            placeholder="Type your message..."
                            required
                          />
                          <button
                            type="submit"
                            disabled={sendingMessage || !newMessage.trim()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                          >
                            <Send className="w-4 h-4" />
                            {sendingMessage ? 'Sending...' : 'Send Message'}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                      <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-400">Select a case to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Questionnaires Tab */}
        {activeTab === 'questionnaires' && (
          <div className="space-y-4">
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Intake Forms</p>
              <p className="text-sm text-slate-400 mt-1">Questionnaire responses not yet available in the new API</p>
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'All', color: 'slate' },
                  { key: 'succeeded', label: 'Successful', color: 'green' },
                  { key: 'pending', label: 'Pending', color: 'amber' },
                  { key: 'failed', label: 'Failed', color: 'red' },
                ].map(({ key, label, color }) => (
                  <button
                    key={key}
                    onClick={() => setPaymentFilter(key as any)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      paymentFilter === key
                        ? color === 'green' ? 'bg-green-600 text-white'
                          : color === 'amber' ? 'bg-amber-500 text-white'
                          : color === 'red' ? 'bg-red-600 text-white'
                          : 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {getFilteredPayments().length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <CreditCard className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No payment records found</p>
              </div>
            ) : (
              getFilteredPayments().map((payment) => {
                const agreement = getPaymentAgreement(payment);
                const statusColors: Record<string, string> = {
                  succeeded: 'bg-green-100 text-green-800 border-green-200',
                  processing: 'bg-amber-100 text-amber-800 border-amber-200',
                  pending: 'bg-amber-100 text-amber-800 border-amber-200',
                  failed: 'bg-red-100 text-red-800 border-red-200',
                  canceled: 'bg-slate-100 text-slate-600 border-slate-200'
                };
                const statusColor = statusColors[payment.status] || 'bg-slate-100 text-slate-800 border-slate-200';

                return (
                  <div
                    key={payment._id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-slate-900">
                            {formatCurrency(payment.amountCents, payment.currency)}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-500 font-medium">Client Email:</span>
                            <span className="ml-2 text-slate-900">{payment.clientEmail}</span>
                          </div>
                          {payment.clientName && (
                            <div>
                              <span className="text-slate-500 font-medium">Client Name:</span>
                              <span className="ml-2 text-slate-900">{payment.clientName}</span>
                            </div>
                          )}
                          {(payment.packageName || agreement?.packageName) && (
                            <div>
                              <span className="text-slate-500 font-medium">Package:</span>
                              <span className="ml-2 text-slate-900 font-semibold">
                                {payment.packageName || agreement?.packageName}
                              </span>
                            </div>
                          )}
                          {payment.stripePaymentIntentId && (
                            <div className="md:col-span-2">
                              <span className="text-slate-500 font-medium">Payment Intent:</span>
                              <span className="ml-2 text-slate-900 font-mono text-xs">
                                {payment.stripePaymentIntentId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-400 ml-4">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Office Actions Tab */}
        {activeTab === 'office-actions' && (
          <div className="space-y-4">
            {officeActionRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Office Action Requests</p>
                <p className="text-sm text-slate-400 mt-1">Not yet available in the new API</p>
              </div>
            ) : (
              [...officeActionRequests]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{request.full_name}</h3>
                          {!request.viewed && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              New
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium text-slate-500">Email:</span><span className="ml-2 text-slate-900">{request.email}</span></p>
                          <p><span className="font-medium text-slate-500">Trademark:</span><span className="ml-2 text-slate-900 font-semibold">{request.trademark_name}</span></p>
                          <p><span className="font-medium text-slate-500">Service:</span><span className="ml-2 text-slate-900">{request.service_type === 'procedural' ? 'Procedural ($399)' : 'Substantive ($799)'}</span></p>
                          <p>
                            <span className="font-medium text-slate-500">Document:</span>
                            <a href={request.office_action_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-amber-600 hover:underline">View Document</a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}

        {/* Cease & Desist Tab */}
        {activeTab === 'cease-desist' && (
          <div className="space-y-4">
            {ceaseAndDesistRequests.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">Cease & Desist Requests</p>
                <p className="text-sm text-slate-400 mt-1">Not yet available in the new API</p>
              </div>
            ) : (
              [...ceaseAndDesistRequests]
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((request) => (
                  <div key={request.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-slate-900">{request.full_name}</h3>
                          {!request.viewed && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              New
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium text-slate-500">Email:</span><span className="ml-2 text-slate-900">{request.email}</span></p>
                          <p><span className="font-medium text-slate-500">Trademark:</span><span className="ml-2 text-slate-900 font-semibold">{request.trademark_name}</span></p>
                          <p><span className="font-medium text-slate-500">Infringer:</span><span className="ml-2 text-slate-900">{request.infringer_name}</span></p>
                          <div>
                            <p className="font-medium text-slate-500">Infringement:</p>
                            <p className="ml-2 text-slate-900 mt-1 whitespace-pre-wrap text-xs">{request.infringement_description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
