import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Package, CreditCard, FileText, CheckCircle, XCircle, LogOut, Lock, Users, ArrowRight, Send, AlertOctagon, BarChart3, RefreshCw } from 'lucide-react';

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

interface TrademarkSearchRequest {
  id: string;
  full_name: string;
  email: string;
  trademark_name: string;
  logo_url: string | null;
  business_description: string;
  status: string;
  created_at: string;
  spam: boolean;
  viewed: boolean;
  staff_notes: string;
}

interface Payment {
  id: string;
  agreement_id: string | null;
  stripe_payment_intent_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method_type: string | null;
  client_email: string;
  error_message: string | null;
  metadata: any;
  created_at: string;
  updated_at: string;
  viewed: boolean;
}

interface ClientAgreement {
  id: string;
  client_name: string;
  client_email: string;
  client_company: string | null;
  package_name: string;
  package_price: string;
  signature_type: string;
  signature_data: string;
  signed_date: string;
  ip_address: string | null;
  created_at: string;
}

interface ClientCase {
  id: string;
  client_email: string;
  client_name: string;
  trademark_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  notes: string;
  estimated_completion_date: string | null;
}

interface CaseMessage {
  id: string;
  case_id: string;
  sender_email: string;
  sender_name: string;
  message: string;
  is_staff: boolean;
  created_at: string;
  read: boolean;
}

interface QuestionnaireResponse {
  id: string;
  user_id: string | null;
  trademark_name: string | null;
  trademark_type: string | null;
  logo_url: string | null;
  name_in_use: string | null;
  name_in_use_start_date: string | null;
  name_in_use_plan_date: string | null;
  business_type: string | null;
  brand_usage_locations: string[];
  website_url: string | null;
  social_media_accounts: string | null;
  products_services_description: string | null;
  product_service_type: string | null;
  sales_locations: string[];
  prior_trademark_filing: string | null;
  similar_business_names: string | null;
  additional_info: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  package_selected: string | null;
  created_at: string;
  viewed: boolean;
  email_sent_at: string | null;
  has_agreement?: boolean;
  has_payment?: boolean;
  agreement_signed_at?: string | null;
  payment_completed_at?: string | null;
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

export default function StaffPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([]);
  const [trademarkRequests, setTrademarkRequests] = useState<TrademarkSearchRequest[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [agreements, setAgreements] = useState<ClientAgreement[]>([]);
  const [clientCases, setClientCases] = useState<ClientCase[]>([]);
  const [questionnaireResponses, setQuestionnaireResponses] = useState<QuestionnaireResponse[]>([]);
  const [officeActionRequests, setOfficeActionRequests] = useState<OfficeActionRequest[]>([]);
  const [ceaseAndDesistRequests, setCeaseAndDesistRequests] = useState<CeaseAndDesistRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'contacts' | 'trademarks' | 'purchases' | 'cases' | 'questionnaires' | 'office-actions' | 'cease-desist'>('contacts');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updatingContact, setUpdatingContact] = useState<string | null>(null);
  const [markingSpam, setMarkingSpam] = useState<string | null>(null);
  const [markingViewed, setMarkingViewed] = useState<string | null>(null);
  const [markingContactViewed, setMarkingContactViewed] = useState<string | null>(null);
  const [markingTrademarkViewed, setMarkingTrademarkViewed] = useState<string | null>(null);
  const [markingPaymentViewed, setMarkingPaymentViewed] = useState<string | null>(null);
  const [analyticsStats, setAnalyticsStats] = useState({
    diySearches: 0,
    formsStarted: 0,
    formsCompleted: 0,
    conversionRate: 0
  });
  const [refreshingAnalytics, setRefreshingAnalytics] = useState(false);
  const [showIncompleteFormsModal, setShowIncompleteFormsModal] = useState(false);
  const [incompleteForms, setIncompleteForms] = useState<IncompleteForm[]>([]);
  const [loadingIncompleteForms, setLoadingIncompleteForms] = useState(false);
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
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState<QuestionnaireResponse | null>(null);
  const [showQuestionnaireModal, setShowQuestionnaireModal] = useState(false);
  const [sendingIntakeEmail, setSendingIntakeEmail] = useState<string | null>(null);
  const [incompleteFormEmailsSent, setIncompleteFormEmailsSent] = useState<Set<string>>(new Set());
  const [viewedIncompleteForms, setViewedIncompleteForms] = useState<Set<string>>(new Set());
  const [markingIncompleteViewed, setMarkingIncompleteViewed] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
      if (session) {
        fetchAllData();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      refreshAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        await fetchAllData();
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setIsAuthenticated(true);
      await fetchAllData();
    } catch (error: any) {
      setLoginError(error.message || 'Failed to login');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setContactSubmissions([]);
      setTrademarkRequests([]);
      setPayments([]);
      setAgreements([]);
      setQuestionnaireResponses([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [contactsRes, trademarksRes, paymentsRes, agreementsRes, casesRes, analyticsRes, questionnairesRes, incompleteEmailsRes, incompleteViewsRes, officeActionsRes, ceaseDesistRes] = await Promise.all([
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('trademark_search_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('client_agreements').select('*').order('created_at', { ascending: false }),
        supabase.from('client_cases').select('*').order('created_at', { ascending: false }),
        supabase.from('analytics_events').select('event_type, event_data, created_at'),
        supabase.from('trademark_questionnaire_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('incomplete_form_emails').select('session_id, sent_at'),
        supabase.from('incomplete_form_views').select('session_id, viewed_at'),
        supabase.from('office_action_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('cease_and_desist_requests').select('*').order('created_at', { ascending: false })
      ]);

      if (contactsRes.data) setContactSubmissions(contactsRes.data);
      if (trademarksRes.data) {
        setTrademarkRequests(trademarksRes.data);
        const notes: Record<string, string> = {};
        trademarksRes.data.forEach(req => {
          if (req.staff_notes) {
            notes[req.id] = req.staff_notes;
          }
        });
        setTrademarkNotes(notes);
      }
      if (paymentsRes.data) setPayments(paymentsRes.data);
      if (agreementsRes.data) setAgreements(agreementsRes.data);
      if (casesRes.data) {
        setClientCases(casesRes.data);
        await fetchUnreadCounts(casesRes.data);
      }
      if (questionnairesRes.data) {
        const enrichedQuestionnaires = questionnairesRes.data.map(questionnaire => {
          const agreement = agreementsRes.data?.find(a => a.client_email.toLowerCase() === questionnaire.email.toLowerCase());
          const payment = paymentsRes.data?.find(p =>
            p.client_email.toLowerCase() === questionnaire.email.toLowerCase() &&
            p.status === 'succeeded'
          );

          return {
            ...questionnaire,
            has_agreement: !!agreement,
            has_payment: !!payment,
            agreement_signed_at: agreement?.created_at || null,
            payment_completed_at: payment?.created_at || null
          };
        });
        setQuestionnaireResponses(enrichedQuestionnaires);
      }
      if (incompleteEmailsRes.data) {
        const sentSessionIds = new Set(incompleteEmailsRes.data.map(e => e.session_id));
        setIncompleteFormEmailsSent(sentSessionIds);
      }
      if (incompleteViewsRes.data) {
        const viewedSessionIds = new Set(incompleteViewsRes.data.map(v => v.session_id));
        setViewedIncompleteForms(viewedSessionIds);
      }
      if (officeActionsRes.data) setOfficeActionRequests(officeActionsRes.data);
      if (ceaseDesistRes.data) setCeaseAndDesistRequests(ceaseDesistRes.data);

      if (analyticsRes.error) {
        console.error('Error fetching analytics:', analyticsRes.error);
      }

      if (analyticsRes.data) {
        const diySearches = analyticsRes.data.filter(e => e.event_type === 'diy_search_completed').length;
        const completedSessionIds = new Set(
          analyticsRes.data
            .filter(e => e.event_type === 'get_started_form_completed')
            .map(e => e.event_data?.session_id)
        );
        const progressSessionIds = new Set(
          analyticsRes.data
            .filter(e => e.event_type === 'get_started_form_progress')
            .map(e => e.event_data?.session_id)
        );
        const startedSessions = analyticsRes.data.filter(
          e => e.event_type === 'get_started_form_started' &&
               e.event_data?.session_id &&
               !completedSessionIds.has(e.event_data.session_id) &&
               progressSessionIds.has(e.event_data.session_id)
        );

        const incompleteForms: IncompleteForm[] = [];
        const formsBySession = new Map();

        analyticsRes.data.forEach(event => {
          const sessionId = event.event_data?.session_id;
          if (!sessionId || completedSessionIds.has(sessionId)) return;

          if (event.event_type === 'get_started_form_started' && !formsBySession.has(sessionId)) {
            formsBySession.set(sessionId, {
              session_id: sessionId,
              started_at: event.created_at || '',
              last_activity: event.created_at || '',
              last_screen: 1,
              form_data: {},
              has_progress: false
            });
          } else if (event.event_type === 'get_started_form_progress') {
            const existing = formsBySession.get(sessionId);
            const screen = event.event_data?.screen || 1;
            if (existing && screen >= existing.last_screen) {
              formsBySession.set(sessionId, {
                ...existing,
                last_activity: event.created_at || existing.last_activity,
                last_screen: screen,
                form_data: event.event_data?.form_data || {},
                has_progress: true
              });
            }
          }
        });

        formsBySession.forEach(form => {
          incompleteForms.push(form);
        });

        setIncompleteForms(incompleteForms);

        const formsWithContactInfo = incompleteForms.filter(form =>
          form.form_data?.email || form.form_data?.fullName
        );
        const formsStarted = formsWithContactInfo.length;
        const getStartedCompleted = analyticsRes.data.filter(e => e.event_type === 'get_started_form_completed').length;
        const totalCompleted = getStartedCompleted +
          (questionnairesRes.data?.length || 0) +
          (officeActionsRes.data?.length || 0) +
          (ceaseDesistRes.data?.length || 0);
        const totalStarted = analyticsRes.data.filter(e => e.event_type === 'get_started_form_started').length;
        const conversionRate = totalStarted > 0 ? Math.round((getStartedCompleted / totalStarted) * 100) : 0;

        setAnalyticsStats({
          diySearches,
          formsStarted,
          formsCompleted: totalCompleted,
          conversionRate
        });
      } else {
        setAnalyticsStats({
          diySearches: 0,
          formsStarted: 0,
          formsCompleted: (questionnairesRes.data?.length || 0) +
            (officeActionsRes.data?.length || 0) +
            (ceaseDesistRes.data?.length || 0),
          conversionRate: 0
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCounts = async (cases: ClientCase[]) => {
    try {
      const counts: Record<string, number> = {};

      await Promise.all(
        cases.map(async (clientCase) => {
          const { count, error } = await supabase
            .from('case_messages')
            .select('*', { count: 'exact', head: true })
            .eq('case_id', clientCase.id)
            .eq('is_staff', false)
            .eq('read', false);

          if (!error && count) {
            counts[clientCase.id] = count;
          }
        })
      );

      setUnreadCounts(counts);
    } catch (error) {
      console.error('Error fetching unread counts:', error);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshingAnalytics(true);
    try {
      const [analyticsRes, incompleteEmailsRes, incompleteViewsRes, questionnairesRes, officeActionsRes, ceaseDesistRes, agreementsRes, paymentsRes, casesRes, contactsRes, trademarksRes] = await Promise.all([
        supabase.from('analytics_events').select('event_type, event_data, created_at'),
        supabase.from('incomplete_form_emails').select('session_id, sent_at'),
        supabase.from('incomplete_form_views').select('session_id, viewed_at'),
        supabase.from('trademark_questionnaire_responses').select('*').order('created_at', { ascending: false }),
        supabase.from('office_action_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('cease_and_desist_requests').select('*').order('created_at', { ascending: false }),
        supabase.from('client_agreements').select('*').order('created_at', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('client_cases').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_submissions').select('*').order('created_at', { ascending: false }),
        supabase.from('trademark_search_requests').select('*').order('created_at', { ascending: false })
      ]);

      if (incompleteEmailsRes.data) {
        const sentSessionIds = new Set(incompleteEmailsRes.data.map(e => e.session_id));
        setIncompleteFormEmailsSent(sentSessionIds);
      }

      if (incompleteViewsRes.data) {
        const viewedSessionIds = new Set(incompleteViewsRes.data.map(v => v.session_id));
        setViewedIncompleteForms(viewedSessionIds);
      }

      if (questionnairesRes.data) {
        const enrichedQuestionnaires = questionnairesRes.data.map(questionnaire => {
          const agreement = agreementsRes.data?.find(a => a.client_email.toLowerCase() === questionnaire.email.toLowerCase());
          const payment = paymentsRes.data?.find(p =>
            p.client_email.toLowerCase() === questionnaire.email.toLowerCase() &&
            p.status === 'succeeded'
          );

          return {
            ...questionnaire,
            has_agreement: !!agreement,
            has_payment: !!payment,
            agreement_signed_at: agreement?.created_at || null,
            payment_completed_at: payment?.created_at || null
          };
        });
        setQuestionnaireResponses(enrichedQuestionnaires);
      }

      if (officeActionsRes.data) {
        setOfficeActionRequests(officeActionsRes.data);
      }

      if (ceaseDesistRes.data) {
        setCeaseAndDesistRequests(ceaseDesistRes.data);
      }

      if (agreementsRes.data) {
        setAgreements(agreementsRes.data);
      }

      if (paymentsRes.data) {
        setPayments(paymentsRes.data);
      }

      if (casesRes.data) {
        setClientCases(casesRes.data);
        await fetchUnreadCounts(casesRes.data);
      }

      if (contactsRes.data) {
        setContactSubmissions(contactsRes.data);
      }

      if (trademarksRes.data) {
        setTrademarkRequests(trademarksRes.data);
        const notes: Record<string, string> = {};
        trademarksRes.data.forEach(req => {
          if (req.staff_notes) {
            notes[req.id] = req.staff_notes;
          }
        });
        setTrademarkNotes(notes);
      }

      if (analyticsRes.error) {
        console.error('Error refreshing analytics:', analyticsRes.error);
      }

      if (analyticsRes.data) {
        const data = analyticsRes.data;
        const diySearches = data.filter(e => e.event_type === 'diy_search_completed').length;
        const completedSessionIds = new Set(
          data
            .filter(e => e.event_type === 'get_started_form_completed')
            .map(e => e.event_data?.session_id)
        );
        const progressSessionIds = new Set(
          data
            .filter(e => e.event_type === 'get_started_form_progress')
            .map(e => e.event_data?.session_id)
        );
        const startedSessions = data.filter(
          e => e.event_type === 'get_started_form_started' &&
               e.event_data?.session_id &&
               !completedSessionIds.has(e.event_data.session_id) &&
               progressSessionIds.has(e.event_data.session_id)
        );

        const incompleteForms: IncompleteForm[] = [];
        const formsBySession = new Map();

        data.forEach(event => {
          const sessionId = event.event_data?.session_id;
          if (!sessionId || completedSessionIds.has(sessionId)) return;

          if (event.event_type === 'get_started_form_started' && !formsBySession.has(sessionId)) {
            formsBySession.set(sessionId, {
              session_id: sessionId,
              started_at: event.created_at || '',
              last_activity: event.created_at || '',
              last_screen: 1,
              form_data: {},
              has_progress: false
            });
          } else if (event.event_type === 'get_started_form_progress') {
            const existing = formsBySession.get(sessionId);
            const screen = event.event_data?.screen || 1;
            if (existing && screen >= existing.last_screen) {
              formsBySession.set(sessionId, {
                ...existing,
                last_activity: event.created_at || existing.last_activity,
                last_screen: screen,
                form_data: event.event_data?.form_data || {},
                has_progress: true
              });
            }
          }
        });

        formsBySession.forEach(form => {
          incompleteForms.push(form);
        });

        setIncompleteForms(incompleteForms);

        const formsWithContactInfo = incompleteForms.filter(form =>
          form.form_data?.email || form.form_data?.fullName
        );
        const formsStarted = formsWithContactInfo.length;
        const getStartedCompleted = data.filter(e => e.event_type === 'get_started_form_completed').length;
        const totalCompleted = getStartedCompleted +
          (questionnairesRes.data?.length || 0) +
          (officeActionsRes.data?.length || 0) +
          (ceaseDesistRes.data?.length || 0);
        const totalStarted = data.filter(e => e.event_type === 'get_started_form_started').length;
        const conversionRate = totalStarted > 0 ? Math.round((getStartedCompleted / totalStarted) * 100) : 0;

        setAnalyticsStats({
          diySearches,
          formsStarted,
          formsCompleted: totalCompleted,
          conversionRate
        });
      } else {
        setAnalyticsStats({
          diySearches: 0,
          formsStarted: 0,
          formsCompleted: (questionnairesRes.data?.length || 0) +
            (officeActionsRes.data?.length || 0) +
            (ceaseDesistRes.data?.length || 0),
          conversionRate: 0
        });
      }
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    } finally {
      setRefreshingAnalytics(false);
    }
  };

  const fetchIncompleteForms = async () => {
    setLoadingIncompleteForms(true);
    try {
      const [eventsRes, incompleteEmailsRes, incompleteViewsRes] = await Promise.all([
        supabase
          .from('analytics_events')
          .select('event_type, event_data, created_at')
          .in('event_type', ['get_started_form_started', 'get_started_form_progress', 'get_started_form_completed'])
          .order('created_at', { ascending: false }),
        supabase.from('incomplete_form_emails').select('session_id, sent_at'),
        supabase.from('incomplete_form_views').select('session_id, viewed_at')
      ]);

      if (incompleteEmailsRes.data) {
        const sentSessionIds = new Set(incompleteEmailsRes.data.map(e => e.session_id));
        setIncompleteFormEmailsSent(sentSessionIds);
      }

      if (incompleteViewsRes.data) {
        const viewedSessionIds = new Set(incompleteViewsRes.data.map(v => v.session_id));
        setViewedIncompleteForms(viewedSessionIds);
      }

      if (eventsRes.data) {
        const allEvents = eventsRes.data;
        const completedSessionIds = new Set(
          allEvents
            .filter(e => e.event_type === 'get_started_form_completed')
            .map(e => e.event_data?.session_id)
        );

        const startedSessions = allEvents.filter(
          e => e.event_type === 'get_started_form_started' &&
               e.event_data?.session_id &&
               !completedSessionIds.has(e.event_data.session_id)
        );

        const incompleteForms: IncompleteForm[] = startedSessions
          .map(startEvent => {
            const progressEvents = allEvents.filter(
              e => e.event_type === 'get_started_form_progress' &&
                   e.event_data?.session_id === startEvent.event_data.session_id
            );

            const latestProgress = progressEvents.length > 0 ? progressEvents[0] : null;

            return {
              session_id: startEvent.event_data.session_id,
              started_at: startEvent.created_at,
              last_activity: latestProgress?.created_at || startEvent.created_at,
              last_screen: latestProgress?.event_data?.screen || 1,
              form_data: latestProgress?.event_data?.form_data || {},
              has_progress: progressEvents.length > 0
            };
          });

        setIncompleteForms(incompleteForms);
      }
    } catch (error) {
      console.error('Error fetching incomplete forms:', error);
    } finally {
      setLoadingIncompleteForms(false);
    }
  };

  const handleTrademarkStatus = async (requestId: string, status: 'conflict_found' | 'no_conflict') => {
    setUpdatingStatus(requestId);
    try {
      const request = trademarkRequests.find(r => r.id === requestId);
      const notes = trademarkNotes[requestId] || '';

      const { error: updateError } = await supabase
        .from('trademark_search_requests')
        .update({ status, viewed: true, staff_notes: notes })
        .eq('id', requestId);

      if (updateError) throw updateError;

      setTrademarkRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: status, viewed: true, staff_notes: notes }
            : req
        )
      );

      if (request) {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-trademark-status-webhook`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request_id: requestId,
            status,
            staff_notes: notes,
            request_data: request
          })
        });

        if (!response.ok) {
          console.error('Webhook failed:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleMarkAsContacted = async (submissionId: string) => {
    setUpdatingContact(submissionId);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ contacted: true, viewed: true })
        .eq('id', submissionId);

      if (error) throw error;

      await fetchAllData();
    } catch (error) {
      console.error('Error marking as contacted:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingContact(null);
    }
  };

  const handleMarkContactAsSpam = async (submissionId: string) => {
    setMarkingSpam(submissionId);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ spam: true, viewed: true })
        .eq('id', submissionId);

      if (error) throw error;

      await fetchAllData();
    } catch (error) {
      console.error('Error marking as spam:', error);
      alert('Failed to mark as spam. Please try again.');
    } finally {
      setMarkingSpam(null);
    }
  };

  const handleMarkTrademarkAsSpam = async (requestId: string) => {
    setMarkingSpam(requestId);
    try {
      const { error } = await supabase
        .from('trademark_search_requests')
        .update({ spam: true, viewed: true })
        .eq('id', requestId);

      if (error) throw error;

      await fetchAllData();
    } catch (error) {
      console.error('Error marking as spam:', error);
      alert('Failed to mark as spam. Please try again.');
    } finally {
      setMarkingSpam(null);
    }
  };

  const handleMarkContactAsViewed = async (submissionId: string) => {
    setMarkingContactViewed(submissionId);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ viewed: true })
        .eq('id', submissionId);

      if (error) throw error;

      setContactSubmissions(prev =>
        prev.map(sub => sub.id === submissionId ? { ...sub, viewed: true } : sub)
      );
    } catch (error) {
      console.error('Error marking contact as viewed:', error);
      alert('Failed to mark as viewed. Please try again.');
    } finally {
      setMarkingContactViewed(null);
    }
  };

  const handleMarkTrademarkAsViewed = async (requestId: string) => {
    setMarkingTrademarkViewed(requestId);
    try {
      const { error } = await supabase
        .from('trademark_search_requests')
        .update({ viewed: true })
        .eq('id', requestId);

      if (error) throw error;

      setTrademarkRequests(prev =>
        prev.map(req => req.id === requestId ? { ...req, viewed: true } : req)
      );
    } catch (error) {
      console.error('Error marking trademark as viewed:', error);
      alert('Failed to mark as viewed. Please try again.');
    } finally {
      setMarkingTrademarkViewed(null);
    }
  };

  const handleMarkPaymentAsViewed = async (paymentId: string) => {
    setMarkingPaymentViewed(paymentId);
    try {
      const { error } = await supabase
        .from('payments')
        .update({ viewed: true })
        .eq('id', paymentId);

      if (error) throw error;

      setPayments(prev =>
        prev.map(p => p.id === paymentId ? { ...p, viewed: true } : p)
      );
    } catch (error) {
      console.error('Error marking payment as viewed:', error);
      alert('Failed to mark payment as viewed. Please try again.');
    } finally {
      setMarkingPaymentViewed(null);
    }
  };

  const handleMarkQuestionnaireAsViewed = async (questionnaireId: string) => {
    setMarkingViewed(questionnaireId);
    try {
      const { error } = await supabase
        .from('trademark_questionnaire_responses')
        .update({ viewed: true })
        .eq('id', questionnaireId);

      if (error) throw error;

      setQuestionnaireResponses(prev =>
        prev.map(q => q.id === questionnaireId ? { ...q, viewed: true } : q)
      );
    } catch (error) {
      console.error('Error marking questionnaire as viewed:', error);
      alert('Failed to mark questionnaire as viewed. Please try again.');
    } finally {
      setMarkingViewed(null);
    }
  };

  const handleSendIntakeEmail = async (response: QuestionnaireResponse) => {
    setSendingIntakeEmail(response.id);
    try {
      const nameParts = response.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-intake-email-webhook`;

      const webhookResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: response.email,
          trademarkName: response.trademark_name,
        }),
      });

      if (!webhookResponse.ok) {
        const errorData = await webhookResponse.json();
        throw new Error(errorData.error || 'Failed to send email webhook');
      }

      const { error } = await supabase
        .from('trademark_questionnaire_responses')
        .update({ email_sent_at: new Date().toISOString() })
        .eq('id', response.id);

      if (error) throw error;

      setQuestionnaireResponses(prev =>
        prev.map(q => q.id === response.id ? { ...q, email_sent_at: new Date().toISOString() } : q)
      );

      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending intake email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingIntakeEmail(null);
    }
  };

  const handleSendIncompleteFormEmail = async (form: IncompleteForm) => {
    setSendingIntakeEmail(form.session_id);
    try {
      const fullName = form.form_data?.fullName || '';
      const nameParts = fullName.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-intake-email-webhook`;

      const webhookResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email: form.form_data?.email,
          trademarkName: form.form_data?.trademarkName,
        }),
      });

      if (!webhookResponse.ok) {
        const errorData = await webhookResponse.json();
        throw new Error(errorData.error || 'Failed to send email webhook');
      }

      const { data: { user } } = await supabase.auth.getUser();
      const { error: dbError } = await supabase
        .from('incomplete_form_emails')
        .insert({
          session_id: form.session_id,
          email: form.form_data?.email,
          sent_by: user?.id
        });

      if (dbError) {
        console.error('Error saving email record:', dbError);
      }

      setIncompleteFormEmailsSent(prev => new Set(prev).add(form.session_id));

      alert('Email sent successfully!');
    } catch (error) {
      console.error('Error sending intake email:', error);
      alert('Failed to send email. Please try again.');
    } finally {
      setSendingIntakeEmail(null);
    }
  };

  const handleMarkIncompleteFormAsViewed = async (sessionId: string) => {
    setMarkingIncompleteViewed(sessionId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('incomplete_form_views')
        .insert({
          session_id: sessionId,
          viewed_by: user?.id
        });

      if (error) {
        console.error('Error saving view record:', error);
        alert('Failed to mark as viewed. Please try again.');
        return;
      }

      setViewedIncompleteForms(prev => new Set(prev).add(sessionId));
      await refreshAnalytics();
    } catch (error) {
      console.error('Error marking form as viewed:', error);
      alert('Failed to mark as viewed. Please try again.');
    } finally {
      setMarkingIncompleteViewed(null);
    }
  };

  const handleMarkAllIncompleteFormsAsViewed = async () => {
    setMarkingIncompleteViewed('all');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const unviewedForms = incompleteForms.filter(form =>
        !viewedIncompleteForms.has(form.session_id) &&
        (form.form_data?.email || form.form_data?.fullName)
      );

      if (unviewedForms.length === 0) {
        alert('No unviewed forms to mark.');
        setMarkingIncompleteViewed(null);
        return;
      }

      const viewRecords = unviewedForms.map(form => ({
        session_id: form.session_id,
        viewed_by: user?.id
      }));

      const { error } = await supabase
        .from('incomplete_form_views')
        .insert(viewRecords);

      if (error) {
        console.error('Error saving view records:', error);
        alert('Failed to mark all as viewed. Please try again.');
        return;
      }

      const newViewedSet = new Set(viewedIncompleteForms);
      unviewedForms.forEach(form => newViewedSet.add(form.session_id));
      setViewedIncompleteForms(newViewedSet);
      await refreshAnalytics();
      alert(`Successfully marked ${unviewedForms.length} form${unviewedForms.length !== 1 ? 's' : ''} as viewed.`);
    } catch (error) {
      console.error('Error marking all forms as viewed:', error);
      alert('Failed to mark all as viewed. Please try again.');
    } finally {
      setMarkingIncompleteViewed(null);
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
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(amount / 100);
  };

  const isQuestionnaireComplete = (response: QuestionnaireResponse): boolean => {
    return !!(
      response.trademark_name &&
      response.trademark_type &&
      response.name_in_use &&
      response.business_type &&
      response.products_services_description &&
      response.product_service_type &&
      response.prior_trademark_filing &&
      response.similar_business_names &&
      response.phone &&
      response.package_selected
    );
  };

  const getPaymentDetails = (payment: Payment) => {
    const agreement = agreements.find(a => a.id === payment.agreement_id);
    return agreement;
  };

  const getRelatedCase = (payment: Payment) => {
    return clientCases.find(c => c.client_email === payment.client_email);
  };

  const handleViewQuestionnaire = async (clientEmail: string) => {
    try {
      const { data, error } = await supabase
        .from('trademark_questionnaire_responses')
        .select('*')
        .eq('email', clientEmail)
        .order('created_at', { ascending: false })
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSelectedQuestionnaire(data);
        setShowQuestionnaireModal(true);
      } else {
        alert('No questionnaire response found for this client.');
      }
    } catch (error) {
      console.error('Error fetching questionnaire:', error);
      alert('Failed to fetch questionnaire. Please try again.');
    }
  };

  const getFilteredPayments = () => {
    let filtered;
    if (paymentFilter === 'all') {
      filtered = payments;
    } else if (paymentFilter === 'pending') {
      filtered = payments.filter(p => p.status === 'processing' || p.status === 'pending');
    } else if (paymentFilter === 'failed') {
      filtered = payments.filter(p => p.status === 'failed' || p.status === 'canceled');
    } else {
      filtered = payments.filter(p => p.status === paymentFilter);
    }
    return [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  };

  const handleViewCase = (clientCase: ClientCase) => {
    setActiveTab('cases');
    setSelectedCase(clientCase);
    fetchCaseMessages(clientCase.id);
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCase(true);
    try {
      const { error } = await supabase
        .from('client_cases')
        .insert({
          client_name: newCaseName,
          client_email: newCaseEmail,
          trademark_name: newCaseTrademark,
          status: 'Trademark Search'
        });

      if (error) throw error;

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
      const { error } = await supabase
        .from('client_cases')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId);

      if (error) throw error;

      await fetchAllData();
      if (selectedCase?.id === caseId) {
        setSelectedCase({ ...selectedCase, status: newStatus });
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
      const { data, error } = await supabase
        .from('case_messages')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setCaseMessages(data);

      await markCaseMessagesAsRead(caseId);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markCaseMessagesAsRead = async (caseId: string) => {
    try {
      const { error } = await supabase
        .from('case_messages')
        .update({ read: true })
        .eq('case_id', caseId)
        .eq('is_staff', false)
        .eq('read', false);

      if (error) throw error;

      setCaseMessages(prevMessages =>
        prevMessages.map(msg =>
          !msg.is_staff ? { ...msg, read: true } : msg
        )
      );

      setUnreadCounts(prev => ({
        ...prev,
        [caseId]: 0
      }));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const handleSelectCase = (clientCase: ClientCase) => {
    setSelectedCase(clientCase);
    fetchCaseMessages(clientCase.id);
    setEstimatedDate(clientCase.estimated_completion_date || '');
    setEditingEstimatedDate(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedCase) return;

    setSendingMessage(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('case_messages')
        .insert({
          case_id: selectedCase.id,
          sender_email: user.email || 'staff@marq.com',
          sender_name: 'Marq Staff',
          message: newMessage.trim(),
          is_staff: true
        });

      if (error) throw error;

      setNewMessage('');
      fetchCaseMessages(selectedCase.id);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleUpdateEstimatedDate = async () => {
    if (!selectedCase) return;

    setUpdatingStatus(selectedCase.id);
    try {
      const { error } = await supabase
        .from('client_cases')
        .update({
          estimated_completion_date: estimatedDate || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCase.id);

      if (error) throw error;

      setEditingEstimatedDate(false);
      await fetchAllData();
      if (selectedCase) {
        const updated = clientCases.find(c => c.id === selectedCase.id);
        if (updated) setSelectedCase(updated);
      }
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

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              Staff Portal Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Enter your credentials to access the staff portal
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {loginError && (
              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-sm text-red-800">{loginError}</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loggingIn ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staff portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Staff Portal</h1>
              <p className="mt-1 text-sm text-gray-500">Manage all client submissions and requests</p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Analytics Dashboard</h2>
          <button
            onClick={refreshAnalytics}
            disabled={refreshingAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshingAnalytics ? 'animate-spin' : ''}`} />
            {refreshingAnalytics ? 'Refreshing...' : 'Refresh Analytics'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">DIY Searches</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsStats.diySearches}</p>
            <p className="text-xs text-gray-500 mt-1">Total searches completed</p>
          </div>

          <button
            onClick={async () => {
              setShowIncompleteFormsModal(true);
              await fetchIncompleteForms();
            }}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:border-amber-600 hover:shadow-md transition-all text-left w-full"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Forms Started</h3>
              <BarChart3 className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsStats.formsStarted}</p>
            <p className="text-xs text-gray-500 mt-1">Incomplete forms (click to view details)</p>
          </button>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Forms Completed</h3>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsStats.formsCompleted}</p>
            <p className="text-xs text-gray-500 mt-1">Get Started forms submitted</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsStats.conversionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Forms started to completed</p>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('contacts')}
              className={`${
                activeTab === 'contacts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Mail className="w-4 h-4" />
              Contact Submissions ({contactSubmissions.length})
              {contactSubmissions.filter(c => !c.viewed && !c.spam).length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {contactSubmissions.filter(c => !c.viewed && !c.spam).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('trademarks')}
              className={`${
                activeTab === 'trademarks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <FileText className="w-4 h-4" />
              Trademark Searches ({trademarkRequests.length})
              {trademarkRequests.filter(t => !t.viewed && !t.spam).length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {trademarkRequests.filter(t => !t.viewed && !t.spam).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`${
                activeTab === 'cases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Users className="w-4 h-4" />
              Client Cases ({clientCases.length})
            </button>
            <button
              onClick={() => setActiveTab('questionnaires')}
              className={`${
                activeTab === 'questionnaires'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Package className="w-4 h-4" />
              Intake Forms ({questionnaireResponses.length + incompleteForms.filter(f => f.last_screen >= 1 && (f.form_data?.email || f.form_data?.fullName)).length})
              {(questionnaireResponses.filter(q => !q.viewed).length + incompleteForms.filter(f => f.last_screen >= 1 && (f.form_data?.email || f.form_data?.fullName) && !viewedIncompleteForms.has(f.session_id)).length) > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {questionnaireResponses.filter(q => !q.viewed).length + incompleteForms.filter(f => f.last_screen >= 1 && (f.form_data?.email || f.form_data?.fullName) && !viewedIncompleteForms.has(f.session_id)).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`${
                activeTab === 'purchases'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <CreditCard className="w-4 h-4" />
              Purchases ({payments.length})
              {payments.filter(p => p.status === 'succeeded' && !p.viewed).length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-green-500 rounded-full">
                  {payments.filter(p => p.status === 'succeeded' && !p.viewed).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('office-actions')}
              className={`${
                activeTab === 'office-actions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <FileText className="w-4 h-4" />
              Office Actions ({officeActionRequests.length})
              {officeActionRequests.filter(o => !o.viewed).length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {officeActionRequests.filter(o => !o.viewed).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('cease-desist')}
              className={`${
                activeTab === 'cease-desist'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <AlertOctagon className="w-4 h-4" />
              Cease & Desist ({ceaseAndDesistRequests.length})
              {ceaseAndDesistRequests.filter(c => !c.viewed).length > 0 && (
                <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-500 rounded-full">
                  {ceaseAndDesistRequests.filter(c => !c.viewed).length}
                </span>
              )}
            </button>
          </nav>
        </div>

        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contactSubmissions.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No contact submissions yet</p>
              </div>
            ) : (
              [...contactSubmissions].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((submission) => (
                <div key={submission.id} className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                  submission.spam ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{submission.name}</h3>
                        {submission.spam && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertOctagon className="w-3 h-3 mr-1" />
                            Spam
                          </span>
                        )}
                        {submission.contacted && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Contacted
                          </span>
                        )}
                        {submission.notified && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Notified
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${submission.email}`} className="hover:text-blue-600">
                            {submission.email}
                          </a>
                        </div>
                        <div className="mt-3">
                          <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 ml-4">
                      {formatDate(submission.created_at)}
                    </div>
                  </div>
                  {!submission.spam && (
                    <div className="pt-4 border-t border-gray-200 flex gap-3">
                      {!submission.contacted && (
                        <>
                          <button
                            onClick={() => handleMarkAsContacted(submission.id)}
                            disabled={updatingContact === submission.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {updatingContact === submission.id ? 'Updating...' : 'Mark as Contacted'}
                          </button>
                          <button
                            onClick={() => handleMarkContactAsSpam(submission.id)}
                            disabled={markingSpam === submission.id}
                            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <AlertOctagon className="w-4 h-4" />
                            {markingSpam === submission.id ? 'Marking...' : 'Mark as Spam'}
                          </button>
                        </>
                      )}
                      {!submission.viewed && (
                        <button
                          onClick={() => handleMarkContactAsViewed(submission.id)}
                          disabled={markingContactViewed === submission.id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {markingContactViewed === submission.id ? 'Marking...' : 'Mark as Read'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'trademarks' && (
          <div className="space-y-4">
            {trademarkRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No trademark search requests yet</p>
              </div>
            ) : (
              [...trademarkRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((request) => (
                <div key={request.id} className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                  request.spam ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.trademark_name}</h3>
                        {request.spam ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertOctagon className="w-3 h-3 mr-1" />
                            Marked as Spam
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            request.status === 'conflict_found'
                              ? 'bg-red-100 text-red-800'
                              : request.status === 'no_conflict'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {request.status === 'conflict_found' && 'Conflict Found'}
                            {request.status === 'no_conflict' && 'No Conflict'}
                            {request.status === 'pending' && 'Pending Review'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Contact Information</p>
                      <p className="text-gray-900">{request.full_name}</p>
                      <a href={`mailto:${request.email}`} className="text-blue-600 hover:text-blue-800 text-sm">
                        {request.email}
                      </a>
                    </div>
                    {request.logo_url && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Logo</p>
                        <a
                          href={request.logo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View Logo
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-500 mb-1">Business Description</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{request.business_description}</p>
                  </div>

                  {!request.spam && request.status === 'pending' && (
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div>
                        <label htmlFor={`notes-${request.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                          Search Notes
                        </label>
                        <textarea
                          id={`notes-${request.id}`}
                          value={trademarkNotes[request.id] || ''}
                          onChange={(e) => setTrademarkNotes(prev => ({ ...prev, [request.id]: e.target.value }))}
                          placeholder="Add notes about this trademark search..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleTrademarkStatus(request.id, 'no_conflict')}
                          disabled={updatingStatus === request.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {updatingStatus === request.id ? 'Processing...' : 'No Conflict Found'}
                        </button>
                        <button
                          onClick={() => handleTrademarkStatus(request.id, 'conflict_found')}
                          disabled={updatingStatus === request.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          {updatingStatus === request.id ? 'Processing...' : 'Conflict Found'}
                        </button>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleMarkTrademarkAsSpam(request.id)}
                          disabled={markingSpam === request.id || updatingStatus === request.id}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <AlertOctagon className="w-4 h-4" />
                          {markingSpam === request.id ? 'Marking...' : 'Mark as Spam'}
                        </button>
                        {!request.viewed && (
                          <button
                            onClick={() => handleMarkTrademarkAsViewed(request.id)}
                            disabled={markingTrademarkViewed === request.id || updatingStatus === request.id}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {markingTrademarkViewed === request.id ? 'Marking...' : 'Mark as Read'}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                  {!request.spam && request.status !== 'pending' && (
                    <div className="pt-4 border-t border-gray-200">
                      <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg mb-3 ${
                        request.status === 'no_conflict'
                          ? 'bg-green-50 text-green-800'
                          : 'bg-red-50 text-red-800'
                      }`}>
                        {request.status === 'no_conflict' ? (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">No Conflict Found</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5" />
                            <span className="font-medium">Conflict Found</span>
                          </>
                        )}
                      </div>
                      {request.staff_notes && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 mb-1">Staff Notes</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{request.staff_notes}</p>
                        </div>
                      )}
                      {!request.viewed && (
                        <button
                          onClick={() => handleMarkTrademarkAsViewed(request.id)}
                          disabled={markingTrademarkViewed === request.id}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {markingTrademarkViewed === request.id ? 'Marking...' : 'Mark as Read'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Client Cases</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Manage trademark registration cases and client communication. Cases are automatically created from successful trademark package purchases.
                </p>
              </div>
              <button
                onClick={() => setShowNewCaseForm(!showNewCaseForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
              >
                {showNewCaseForm ? 'Cancel' : '+ New Case'}
              </button>
            </div>

            {showNewCaseForm && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Case</h3>
                <form onSubmit={handleCreateCase} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={newCaseName}
                      onChange={(e) => setNewCaseName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Email
                    </label>
                    <input
                      type="email"
                      value={newCaseEmail}
                      onChange={(e) => setNewCaseEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trademark Name
                    </label>
                    <input
                      type="text"
                      value={newCaseTrademark}
                      onChange={(e) => setNewCaseTrademark(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={creatingCase}
                    className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {creatingCase ? 'Creating...' : 'Create Case'}
                  </button>
                </form>
              </div>
            )}

            {clientCases.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No client cases yet</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">All Cases</h3>
                  {[...clientCases].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((clientCase) => (
                    <div
                      key={clientCase.id}
                      onClick={() => handleSelectCase(clientCase)}
                      className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all cursor-pointer ${
                        selectedCase?.id === clientCase.id
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-gray-900">{clientCase.trademark_name}</h4>
                            {unreadCounts[clientCase.id] > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
                                {unreadCounts[clientCase.id]}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{clientCase.client_name}</p>
                          <p className="text-sm text-gray-500">{clientCase.client_email}</p>
                        </div>
                        <ArrowRight className={`w-5 h-5 flex-shrink-0 transition-transform ${
                          selectedCase?.id === clientCase.id ? 'text-blue-600 translate-x-1' : 'text-gray-400'
                        }`} />
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          clientCase.status === 'Successfully Registered'
                            ? 'bg-green-100 text-green-800'
                            : clientCase.status === 'USPTO Processing & Review'
                            ? 'bg-purple-100 text-purple-800'
                            : clientCase.status === 'Trademark Registration'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {clientCase.status}
                        </span>
                        {clientCase.estimated_completion_date && clientCase.status !== 'Successfully Registered' && (
                          <span className="text-xs text-gray-500">
                            Est: {formatDateOnly(clientCase.estimated_completion_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  {selectedCase ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
                        <div className="space-y-3 mb-6">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Client</p>
                            <p className="text-gray-900">{selectedCase.client_name}</p>
                            <p className="text-sm text-gray-600">{selectedCase.client_email}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Trademark</p>
                            <p className="text-gray-900">{selectedCase.trademark_name}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Created</p>
                            <p className="text-gray-600 text-sm">{formatDate(selectedCase.created_at)}</p>
                          </div>
                        </div>

                        <div className="space-y-4 mb-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Update Status
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                              {STATUS_OPTIONS.map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleCaseStatusUpdate(selectedCase.id, status)}
                                  disabled={updatingStatus === selectedCase.id || selectedCase.status === status}
                                  className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                                    selectedCase.status === status
                                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
                                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-300'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Estimated Completion Date
                            </label>
                            {editingEstimatedDate ? (
                              <div className="space-y-2">
                                <input
                                  type="date"
                                  value={estimatedDate}
                                  onChange={(e) => setEstimatedDate(e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={handleUpdateEstimatedDate}
                                    disabled={updatingStatus === selectedCase.id}
                                    className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => {
                                      setEditingEstimatedDate(false);
                                      setEstimatedDate(selectedCase.estimated_completion_date || '');
                                    }}
                                    className="flex-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm text-gray-700">
                                  {selectedCase.estimated_completion_date ? formatDateOnly(selectedCase.estimated_completion_date) : 'Not set'}
                                </span>
                                <button
                                  onClick={() => setEditingEstimatedDate(true)}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  {selectedCase.estimated_completion_date ? 'Edit' : 'Set Date'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Messages</h4>
                        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                          {caseMessages.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">No messages yet</p>
                          ) : (
                            caseMessages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`p-3 rounded-lg text-sm ${
                                  msg.is_staff
                                    ? 'bg-blue-50 border border-blue-200 ml-4'
                                    : 'bg-gray-50 border border-gray-200 mr-4'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <p className="font-medium text-gray-900">{msg.sender_name}</p>
                                  <span className="text-xs text-gray-500">
                                    {formatDate(msg.created_at)}
                                  </span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={handleSendMessage} className="space-y-3">
                          <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                            rows={3}
                            placeholder="Type your message..."
                            required
                          />
                          <button
                            type="submit"
                            disabled={sendingMessage || !newMessage.trim()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                          >
                            <Send className="w-4 h-4" />
                            {sendingMessage ? 'Sending...' : 'Send Message'}
                          </button>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">Select a case to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questionnaires' && (
          <div className="space-y-4">
            {(() => {
              const filteredIncompleteForms = incompleteForms.filter(form =>
                form.last_screen >= 1 &&
                (form.form_data?.email || form.form_data?.fullName)
              );
              const hasNoForms = questionnaireResponses.length === 0 && filteredIncompleteForms.length === 0;

              if (hasNoForms) {
                return (
                  <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No intake forms submitted yet</p>
                  </div>
                );
              }

              const incompleteItems = filteredIncompleteForms.map(form => ({
                type: 'incomplete' as const,
                data: form,
                date: new Date(form.last_activity || form.started_at || 0)
              }));
              const completeItems = questionnaireResponses.map(response => ({
                type: 'complete' as const,
                data: response,
                date: new Date(response.created_at || 0)
              }));
              const allItems = [...incompleteItems, ...completeItems].sort((a, b) => {
                const aTime = isNaN(a.date.getTime()) ? 0 : a.date.getTime();
                const bTime = isNaN(b.date.getTime()) ? 0 : b.date.getTime();
                return bTime - aTime;
              });

              const unviewedCount = filteredIncompleteForms.filter(form =>
                !viewedIncompleteForms.has(form.session_id)
              ).length;

              return (
                <>
                  {unviewedCount > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {unviewedCount} unviewed incomplete form{unviewedCount !== 1 ? 's' : ''}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Mark forms as viewed to clear the notification badge
                        </p>
                      </div>
                      <button
                        onClick={handleMarkAllIncompleteFormsAsViewed}
                        disabled={markingIncompleteViewed === 'all'}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {markingIncompleteViewed === 'all' ? 'Marking All...' : 'Mark All as Viewed'}
                      </button>
                    </div>
                  )}
                  {allItems.map((item, index) => {
                    if (item.type === 'incomplete') {
                      const form = item.data;
                      return (
                        <div key={`incomplete-${form.session_id}`} className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                          !viewedIncompleteForms.has(form.session_id) ? 'border-blue-300 bg-blue-50/30' : 'border-amber-300 bg-amber-50/30'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {form.form_data?.trademarkName || 'Incomplete Form - In Progress'}
                                </h3>
                                {!viewedIncompleteForms.has(form.session_id) && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white animate-pulse">
                                    New
                                  </span>
                                )}
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Started - Screen {form.last_screen}
                                </span>
                              </div>
                              {form.form_data?.email && (
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <a href={`mailto:${form.form_data.email}`} className="hover:text-blue-600">
                                      {form.form_data.email}
                                    </a>
                                  </div>
                                  {form.form_data.fullName && (
                                    <p className="text-gray-700">
                                      {form.form_data.fullName}
                                      {form.form_data.phone ? ` • ${form.form_data.phone}` : ''}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-500 ml-4">
                              {formatDate(form.last_activity)}
                              <p className="text-xs mt-1">{getTimeSince(form.last_activity)}</p>
                            </div>
                          </div>

                          <div className="mb-4 p-3 bg-amber-100 border border-amber-300 rounded-lg">
                            <p className="text-sm text-amber-900">
                              This form was started but not completed. User reached screen {form.last_screen} of 7.
                              {!form.form_data?.email && ' No contact information provided yet.'}
                            </p>
                          </div>

                          {form.form_data?.trademarkType && (
                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Trademark Type</p>
                                <p className="text-gray-900">{form.form_data.trademarkType}</p>
                              </div>
                              {form.form_data?.businessType && (
                                <div>
                                  <p className="text-sm font-medium text-gray-500 mb-1">Business Type</p>
                                  <p className="text-gray-900">{form.form_data.businessType}</p>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="pt-4 border-t border-gray-200 flex gap-3">
                            {form.form_data?.email && (
                              <>
                                {incompleteFormEmailsSent.has(form.session_id) ? (
                                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                    <CheckCircle className="w-4 h-4" />
                                    Email Sent
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleSendIncompleteFormEmail(form)}
                                    disabled={sendingIntakeEmail === form.session_id}
                                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                  >
                                    <Send className="w-4 h-4" />
                                    {sendingIntakeEmail === form.session_id ? 'Sending...' : 'Send Email'}
                                  </button>
                                )}
                              </>
                            )}
                            {!viewedIncompleteForms.has(form.session_id) && (
                              <button
                                onClick={() => handleMarkIncompleteFormAsViewed(form.session_id)}
                                disabled={markingIncompleteViewed === form.session_id}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {markingIncompleteViewed === form.session_id ? 'Marking...' : 'Mark as Viewed'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      const response = item.data;
                      const isComplete = isQuestionnaireComplete(response);
                      return (
                        <div key={`complete-${response.id}`} className={`bg-white rounded-lg border p-6 hover:shadow-md transition-shadow ${
                          !response.viewed ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
                        }`}>
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">{response.trademark_name || 'Intake Form'}</h3>
                                {!response.viewed && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-600 text-white animate-pulse">
                                    New
                                  </span>
                                )}
                                {isComplete ? (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Complete
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                    Incomplete
                                  </span>
                                )}
                                {response.package_selected && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    {response.package_selected}
                                  </span>
                                )}
                              </div>
                              <div className="mt-3 mb-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium text-gray-600">Progress</span>
                                  <span className="text-xs font-semibold text-gray-700">
                                    {[isComplete, response.has_agreement, response.has_payment].filter(Boolean).length}/3 steps
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      [isComplete, response.has_agreement, response.has_payment].filter(Boolean).length === 3
                                        ? 'bg-emerald-600'
                                        : [isComplete, response.has_agreement, response.has_payment].filter(Boolean).length >= 2
                                        ? 'bg-blue-600'
                                        : 'bg-amber-500'
                                    }`}
                                    style={{ width: `${([isComplete, response.has_agreement, response.has_payment].filter(Boolean).length / 3) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                                  isComplete ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {isComplete ? '✓' : '○'} Form Completed
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                                  response.has_agreement ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {response.has_agreement ? '✓' : '○'} Contract Signed
                                </span>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                                  response.has_payment ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'
                                }`}>
                                  {response.has_payment ? '✓' : '○'} Payment Received
                                </span>
                              </div>
                              <div className="space-y-2 text-sm mt-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                  <Mail className="w-4 h-4" />
                                  <a href={`mailto:${response.email}`} className="hover:text-blue-600">
                                    {response.email}
                                  </a>
                                </div>
                                <p className="text-gray-700">{response.full_name}{response.phone ? ` • ${response.phone}` : ''}</p>
                              </div>
                            </div>
                            <div className="text-right text-sm text-gray-500 ml-4">
                              {formatDate(response.created_at)}
                              <p className="text-xs mt-1">{getTimeSince(response.created_at)}</p>
                            </div>
                          </div>

                          {(response.has_agreement || response.has_payment) && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <p className="text-xs font-semibold text-blue-900 mb-2">Timeline</p>
                              <div className="space-y-1 text-xs text-blue-800">
                                {isComplete && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">✓ Form completed:</span>
                                    <span>{formatDate(response.created_at)}</span>
                                  </div>
                                )}
                                {response.has_agreement && response.agreement_signed_at && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">✓ Contract signed:</span>
                                    <span>{formatDate(response.agreement_signed_at)}</span>
                                  </div>
                                )}
                                {response.has_payment && response.payment_completed_at && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">✓ Payment received:</span>
                                    <span>{formatDate(response.payment_completed_at)}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {isComplete && (
                            <>
                              <div className="grid md:grid-cols-2 gap-4 mb-4">
                                {response.trademark_type && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Trademark Type</p>
                                    <p className="text-gray-900">{response.trademark_type}</p>
                                  </div>
                                )}
                                {response.business_type && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Business Type</p>
                                    <p className="text-gray-900">{response.business_type}</p>
                                  </div>
                                )}
                                {response.name_in_use && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">In Use Status</p>
                                    <p className="text-gray-900">{response.name_in_use}</p>
                                  </div>
                                )}
                                {response.product_service_type && (
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Product/Service Type</p>
                                    <p className="text-gray-900">{response.product_service_type}</p>
                                  </div>
                                )}
                              </div>

                              {response.products_services_description && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-500 mb-1">Products/Services Description</p>
                                  <p className="text-gray-700 text-sm">{response.products_services_description}</p>
                                </div>
                              )}
                            </>
                          )}

                          {!isComplete && (
                            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <p className="text-sm text-amber-800">
                                This form is incomplete. Only contact information has been provided.
                              </p>
                            </div>
                          )}

                          {response.logo_url && (
                            <div className="mb-4">
                              <p className="text-sm font-medium text-gray-500 mb-2">Logo</p>
                              <img src={response.logo_url} alt="Trademark logo" className="max-w-xs rounded-lg border border-gray-200" />
                            </div>
                          )}

                          <div className="pt-4 border-t border-gray-200 flex gap-3">
                            <button
                              onClick={() => {
                                setSelectedQuestionnaire(response);
                                setShowQuestionnaireModal(true);
                                if (!response.viewed) {
                                  handleMarkQuestionnaireAsViewed(response.id);
                                }
                              }}
                              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              View Full Details
                            </button>
                            {response.email_sent_at ? (
                              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-200">
                                <CheckCircle className="w-4 h-4" />
                                Email Sent on {formatDate(response.email_sent_at)}
                              </div>
                            ) : (
                              <button
                                onClick={() => handleSendIntakeEmail(response)}
                                disabled={sendingIntakeEmail === response.id}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              >
                                <Send className="w-4 h-4" />
                                {sendingIntakeEmail === response.id ? 'Sending...' : 'Send Email'}
                              </button>
                            )}
                            {!response.viewed && (
                              <button
                                onClick={() => handleMarkQuestionnaireAsViewed(response.id)}
                                disabled={markingViewed === response.id}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                              >
                                <CheckCircle className="w-4 h-4" />
                                {markingViewed === response.id ? 'Marking...' : 'Mark as Viewed'}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                </>
              );
            })()}
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPaymentFilter('succeeded')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'succeeded'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Successful
                </button>
                <button
                  onClick={() => setPaymentFilter('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setPaymentFilter('failed')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    paymentFilter === 'failed'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Failed
                </button>
              </div>
            </div>

            {getFilteredPayments().length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No payment records found</p>
              </div>
            ) : (
              getFilteredPayments().map((payment) => {
                const agreement = getPaymentDetails(payment);
                const statusColors = {
                  succeeded: 'bg-green-100 text-green-800 border-green-200',
                  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                  failed: 'bg-red-100 text-red-800 border-red-200',
                  canceled: 'bg-gray-100 text-gray-800 border-gray-200'
                };
                const statusColor = statusColors[payment.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200';

                return (
                  <div
                    key={payment.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {formatCurrency(payment.amount, payment.currency)}
                          </h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500 font-medium">Client Email:</span>
                            <span className="ml-2 text-gray-900">{payment.client_email}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-medium">Payment Method:</span>
                            <span className="ml-2 text-gray-900 capitalize">
                              {payment.payment_method_type || 'N/A'}
                            </span>
                          </div>
                          {agreement && (
                            <>
                              <div>
                                <span className="text-gray-500 font-medium">Package:</span>
                                <span className="ml-2 text-gray-900 font-semibold">{agreement.package_name}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 font-medium">Client Name:</span>
                                <span className="ml-2 text-gray-900">{agreement.client_name}</span>
                              </div>
                            </>
                          )}
                          {payment.stripe_payment_intent_id && (
                            <div className="md:col-span-2">
                              <span className="text-gray-500 font-medium">Payment Intent ID:</span>
                              <span className="ml-2 text-gray-900 font-mono text-xs">
                                {payment.stripe_payment_intent_id}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4">
                        {formatDate(payment.created_at)}
                      </div>
                    </div>

                    {payment.error_message && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs font-semibold text-red-700 mb-1">Error Message</p>
                        <p className="text-sm text-red-900">{payment.error_message}</p>
                      </div>
                    )}

                    {!payment.viewed && payment.status === 'succeeded' && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleMarkPaymentAsViewed(payment.id)}
                          disabled={markingPaymentViewed === payment.id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {markingPaymentViewed === payment.id ? 'Marking...' : 'Mark as Viewed'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

        {activeTab === 'office-actions' && (
          <div className="space-y-4">
            {officeActionRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No office action requests yet</p>
              </div>
            ) : (
              [...officeActionRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((request) => (
                <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.full_name}</h3>
                        {!request.viewed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Email:</span>
                          <span className="ml-2 text-gray-900">{request.email}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Phone:</span>
                          <span className="ml-2 text-gray-900">{request.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Trademark:</span>
                          <span className="ml-2 text-gray-900 font-semibold">{request.trademark_name}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Service Type:</span>
                          <span className="ml-2 text-gray-900">{request.service_type === 'procedural' ? 'Procedural ($399)' : 'Substantive ($799)'}</span>
                        </div>
                        {request.logo_url && (
                          <div>
                            <span className="font-medium text-gray-500">Logo:</span>
                            <a href={request.logo_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                              View Logo
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-500">Office Action Document:</span>
                          <a href={request.office_action_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                            View Document
                          </a>
                        </div>
                        {request.payment_id && (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Payment Received
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        Submitted {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!request.viewed && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={async () => {
                          try {
                            await supabase
                              .from('office_action_requests')
                              .update({ viewed: true })
                              .eq('id', request.id);
                            setOfficeActionRequests(prev => prev.map(r => r.id === request.id ? { ...r, viewed: true } : r));
                          } catch (error) {
                            console.error('Error marking as viewed:', error);
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Viewed
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'cease-desist' && (
          <div className="space-y-4">
            {ceaseAndDesistRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <AlertOctagon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cease and desist requests yet</p>
              </div>
            ) : (
              [...ceaseAndDesistRequests].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((request) => (
                <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{request.full_name}</h3>
                        {!request.viewed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Email:</span>
                          <span className="ml-2 text-gray-900">{request.email}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Phone:</span>
                          <span className="ml-2 text-gray-900">{request.phone}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Trademark:</span>
                          <span className="ml-2 text-gray-900 font-semibold">{request.trademark_name}</span>
                        </div>
                        {request.logo_url && (
                          <div>
                            <span className="font-medium text-gray-500">Logo:</span>
                            <a href={request.logo_url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-600 hover:underline">
                              View Logo
                            </a>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-500">Trademark Filed:</span>
                          <span className="ml-2 text-gray-900">{new Date(request.trademark_filed_date).toLocaleDateString()}</span>
                        </div>
                        {request.trademark_accepted_date && (
                          <div>
                            <span className="font-medium text-gray-500">Trademark Accepted:</span>
                            <span className="ml-2 text-gray-900">{new Date(request.trademark_accepted_date).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-500">Infringer:</span>
                          <span className="ml-2 text-gray-900">{request.infringer_name}</span>
                        </div>
                        {request.infringer_contact && (
                          <div>
                            <span className="font-medium text-gray-500">Infringer Contact:</span>
                            <span className="ml-2 text-gray-900">{request.infringer_contact}</span>
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-gray-500">Infringement Description:</span>
                          <p className="ml-2 text-gray-900 mt-1 whitespace-pre-wrap">{request.infringement_description}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Desired Outcome:</span>
                          <p className="ml-2 text-gray-900 mt-1 whitespace-pre-wrap">{request.desired_outcome}</p>
                        </div>
                        {request.additional_info && (
                          <div>
                            <span className="font-medium text-gray-500">Additional Info:</span>
                            <p className="ml-2 text-gray-900 mt-1 whitespace-pre-wrap">{request.additional_info}</p>
                          </div>
                        )}
                        {request.payment_id && (
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Payment Received
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        Submitted {new Date(request.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {!request.viewed && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={async () => {
                          try {
                            await supabase
                              .from('cease_and_desist_requests')
                              .update({ viewed: true })
                              .eq('id', request.id);
                            setCeaseAndDesistRequests(prev => prev.map(r => r.id === request.id ? { ...r, viewed: true } : r));
                          } catch (error) {
                            console.error('Error marking as viewed:', error);
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark as Viewed
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showQuestionnaireModal && selectedQuestionnaire && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowQuestionnaireModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Get Started Questionnaire</h2>
                <p className="text-purple-100 text-sm mt-1">Submitted {formatDateOnly(selectedQuestionnaire.created_at)}</p>
              </div>
              <button
                onClick={() => setShowQuestionnaireModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Application Progress</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-900">
                      {[isQuestionnaireComplete(selectedQuestionnaire), selectedQuestionnaire.has_agreement, selectedQuestionnaire.has_payment].filter(Boolean).length}/3 steps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        [isQuestionnaireComplete(selectedQuestionnaire), selectedQuestionnaire.has_agreement, selectedQuestionnaire.has_payment].filter(Boolean).length === 3
                          ? 'bg-emerald-600'
                          : [isQuestionnaireComplete(selectedQuestionnaire), selectedQuestionnaire.has_agreement, selectedQuestionnaire.has_payment].filter(Boolean).length >= 2
                          ? 'bg-blue-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${([isQuestionnaireComplete(selectedQuestionnaire), selectedQuestionnaire.has_agreement, selectedQuestionnaire.has_payment].filter(Boolean).length / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border-2 ${
                    isQuestionnaireComplete(selectedQuestionnaire) ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl mb-1 ${isQuestionnaireComplete(selectedQuestionnaire) ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {isQuestionnaireComplete(selectedQuestionnaire) ? '✓' : '○'}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">Form Completed</div>
                      {isQuestionnaireComplete(selectedQuestionnaire) && (
                        <div className="text-xs text-gray-600 mt-1">{formatDateOnly(selectedQuestionnaire.created_at)}</div>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${
                    selectedQuestionnaire.has_agreement ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl mb-1 ${selectedQuestionnaire.has_agreement ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {selectedQuestionnaire.has_agreement ? '✓' : '○'}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">Contract Signed</div>
                      {selectedQuestionnaire.has_agreement && selectedQuestionnaire.agreement_signed_at && (
                        <div className="text-xs text-gray-600 mt-1">{formatDateOnly(selectedQuestionnaire.agreement_signed_at)}</div>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border-2 ${
                    selectedQuestionnaire.has_payment ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-300'
                  }`}>
                    <div className="text-center">
                      <div className={`text-2xl mb-1 ${selectedQuestionnaire.has_payment ? 'text-emerald-600' : 'text-gray-400'}`}>
                        {selectedQuestionnaire.has_payment ? '✓' : '○'}
                      </div>
                      <div className="text-xs font-semibold text-gray-700">Payment Received</div>
                      {selectedQuestionnaire.has_payment && selectedQuestionnaire.payment_completed_at && (
                        <div className="text-xs text-gray-600 mt-1">{formatDateOnly(selectedQuestionnaire.payment_completed_at)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-slate-900 font-medium">{selectedQuestionnaire.full_name}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Email</p>
                  <p className="text-slate-900 font-medium">{selectedQuestionnaire.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-slate-900 font-medium">{selectedQuestionnaire.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Package Selected</p>
                  <p className="text-slate-900 font-medium">{selectedQuestionnaire.package_selected}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Trademark Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Trademark Name</p>
                    <p className="text-slate-900">{selectedQuestionnaire.trademark_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Trademark Type</p>
                    <p className="text-slate-900">{selectedQuestionnaire.trademark_type}</p>
                  </div>
                  {selectedQuestionnaire.logo_url && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-2">Logo</p>
                      <img src={selectedQuestionnaire.logo_url} alt="Trademark logo" className="max-w-xs rounded-lg border border-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Usage Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Name In Use</p>
                    <p className="text-slate-900">{selectedQuestionnaire.name_in_use}</p>
                  </div>
                  {selectedQuestionnaire.name_in_use_start_date && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Start Date</p>
                      <p className="text-slate-900">{formatDateOnly(selectedQuestionnaire.name_in_use_start_date)}</p>
                    </div>
                  )}
                  {selectedQuestionnaire.name_in_use_plan_date && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Planned Start Date</p>
                      <p className="text-slate-900">{formatDateOnly(selectedQuestionnaire.name_in_use_plan_date)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Business Type</p>
                    <p className="text-slate-900">{selectedQuestionnaire.business_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Brand Usage Locations</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedQuestionnaire.brand_usage_locations.map((loc, idx) => (
                        <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedQuestionnaire.website_url && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Website URL</p>
                      <a href={selectedQuestionnaire.website_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{selectedQuestionnaire.website_url}</a>
                    </div>
                  )}
                  {selectedQuestionnaire.social_media_accounts && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Social Media Accounts</p>
                      <p className="text-slate-900 whitespace-pre-wrap">{selectedQuestionnaire.social_media_accounts}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Products & Services</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Description</p>
                    <p className="text-slate-900 whitespace-pre-wrap">{selectedQuestionnaire.products_services_description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Product/Service Type</p>
                    <p className="text-slate-900">{selectedQuestionnaire.product_service_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Sales Locations</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedQuestionnaire.sales_locations.map((loc, idx) => (
                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Prior Trademark Filing</p>
                    <p className="text-slate-900">{selectedQuestionnaire.prior_trademark_filing}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-1">Similar Business Names</p>
                    <p className="text-slate-900">{selectedQuestionnaire.similar_business_names}</p>
                  </div>
                  {selectedQuestionnaire.additional_info && (
                    <div>
                      <p className="text-sm font-semibold text-slate-700 mb-1">Additional Notes</p>
                      <p className="text-slate-900 whitespace-pre-wrap">{selectedQuestionnaire.additional_info}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-6">
              <button
                onClick={() => setShowQuestionnaireModal(false)}
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showIncompleteFormsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Incomplete Forms</h2>
                <p className="text-amber-100 mt-1">Forms that were started but not completed</p>
              </div>
              <button
                onClick={() => setShowIncompleteFormsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loadingIncompleteForms ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading incomplete forms...</p>
                  </div>
                </div>
              ) : (() => {
                const filteredForms = incompleteForms.filter(form =>
                  form.last_screen >= 1 &&
                  (form.form_data?.email || form.form_data?.fullName)
                );
                if (filteredForms.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-600">No incomplete forms with contact information found</p>
                    </div>
                  );
                }

                const unviewedInModalCount = filteredForms.filter(form =>
                  !viewedIncompleteForms.has(form.session_id)
                ).length;

                return (
                  <div className="space-y-6">
                    {unviewedInModalCount > 0 && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            {unviewedInModalCount} unviewed form{unviewedInModalCount !== 1 ? 's' : ''}
                          </p>
                          <p className="text-xs text-blue-700 mt-1">
                            Mark forms as viewed to clear notifications
                          </p>
                        </div>
                        <button
                          onClick={handleMarkAllIncompleteFormsAsViewed}
                          disabled={markingIncompleteViewed === 'all'}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {markingIncompleteViewed === 'all' ? 'Marking All...' : 'Mark All as Viewed'}
                        </button>
                      </div>
                    )}
                    {filteredForms.sort((a, b) => {
                    const aTime = new Date(a.last_activity || a.started_at || 0).getTime();
                    const bTime = new Date(b.last_activity || b.started_at || 0).getTime();
                    return (isNaN(bTime) ? 0 : bTime) - (isNaN(aTime) ? 0 : aTime);
                  }).map((form, index) => (
                    <div key={form.session_id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Form #{index + 1}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Started: {formatDate(form.started_at)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last Activity: {formatDate(form.last_activity)}
                          </p>
                          <p className="text-sm text-gray-500">
                            Last Screen Reached: {form.last_screen}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                        {form.form_data.trademarkName && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Trademark Name</p>
                            <p className="text-sm text-gray-900">{form.form_data.trademarkName}</p>
                          </div>
                        )}
                        {form.form_data.trademarkType && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Trademark Type</p>
                            <p className="text-sm text-gray-900">{form.form_data.trademarkType}</p>
                          </div>
                        )}
                        {form.form_data.fullName && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Full Name</p>
                            <p className="text-sm text-gray-900">{form.form_data.fullName}</p>
                          </div>
                        )}
                        {form.form_data.email && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Email</p>
                            <p className="text-sm text-gray-900">{form.form_data.email}</p>
                          </div>
                        )}
                        {form.form_data.phone && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Phone</p>
                            <p className="text-sm text-gray-900">{form.form_data.phone}</p>
                          </div>
                        )}
                        {form.form_data.nameInUse && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Name In Use</p>
                            <p className="text-sm text-gray-900">{form.form_data.nameInUse}</p>
                          </div>
                        )}
                        {form.form_data.nameInUseStartDate && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">First Use Date</p>
                            <p className="text-sm text-gray-900">{form.form_data.nameInUseStartDate}</p>
                          </div>
                        )}
                        {form.form_data.businessType && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Business Type</p>
                            <p className="text-sm text-gray-900">{form.form_data.businessType}</p>
                          </div>
                        )}
                        {form.form_data.productServiceType && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Product/Service Type</p>
                            <p className="text-sm text-gray-900">{form.form_data.productServiceType}</p>
                          </div>
                        )}
                        {form.form_data.websiteUrl && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Website</p>
                            <p className="text-sm text-gray-900">{form.form_data.websiteUrl}</p>
                          </div>
                        )}
                        {form.form_data.brandUsageLocations && form.form_data.brandUsageLocations.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Brand Usage Locations</p>
                            <p className="text-sm text-gray-900">{form.form_data.brandUsageLocations.join(', ')}</p>
                          </div>
                        )}
                        {form.form_data.salesLocations && form.form_data.salesLocations.length > 0 && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Sales Locations</p>
                            <p className="text-sm text-gray-900">{form.form_data.salesLocations.join(', ')}</p>
                          </div>
                        )}
                        {form.form_data.productsServicesDescription && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Products/Services Description</p>
                            <p className="text-sm text-gray-900">{form.form_data.productsServicesDescription}</p>
                          </div>
                        )}
                        {form.form_data.priorTrademarkFiling && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Prior Trademark Filing</p>
                            <p className="text-sm text-gray-900">{form.form_data.priorTrademarkFiling}</p>
                          </div>
                        )}
                        {form.form_data.similarBusinessNames && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Similar Business Names</p>
                            <p className="text-sm text-gray-900">{form.form_data.similarBusinessNames}</p>
                          </div>
                        )}
                        {form.form_data.additionalInfo && (
                          <div className="md:col-span-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">Additional Info</p>
                            <p className="text-sm text-gray-900">{form.form_data.additionalInfo}</p>
                          </div>
                        )}
                        {form.form_data.selectedPackage && (
                          <div>
                            <p className="text-xs font-semibold text-gray-500 mb-1">Package Selected</p>
                            <p className="text-sm text-gray-900">{form.form_data.selectedPackage}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  </div>
                );
              })()}
            </div>

            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6">
              <button
                onClick={() => setShowIncompleteFormsModal(false)}
                className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
