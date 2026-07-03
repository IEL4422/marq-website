const BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api';

function getToken(): string | null {
  return localStorage.getItem('marq_token');
}

export function setToken(token: string) {
  localStorage.setItem('marq_token', token);
}

export function clearToken() {
  localStorage.removeItem('marq_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Auth
export const auth = {
  login: (email: string, password: string) =>
    request<{ token: string; user: AppUser }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (email: string, password: string, fullName?: string) =>
    request<{ token: string; user: AppUser }>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, fullName }) }),
  me: () => request<AppUser>('/auth/me'),
};

// Contact
export const contact = {
  submit: (data: { name?: string; fullName?: string; email: string; phone?: string; message: string; [key: string]: any }) =>
    request<{ success: boolean }>('/contact', { method: 'POST', body: JSON.stringify(data) }),
};

// Blog
export const blog = {
  list: (params?: { page?: number; limit?: number; category?: string; featured?: boolean }) => {
    const qs = new URLSearchParams(Object.entries(params || {}).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]));
    return request<{ posts: BlogPost[]; total: number; pages: number }>(`/blog?${qs}`);
  },
  get: (slug: string) => request<BlogPost>(`/blog/${slug}`),
};

// Agreements
export const agreements = {
  create: (data: AgreementData) =>
    request<{ success: boolean; id: string }>('/agreements', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request<{ agreements: AgreementData[] }>('/agreements'),
};

// Payments
export const payments = {
  createIntent: (data: { amount: number; clientEmail: string; clientName?: string; packageName?: string }) =>
    request<{ clientSecret: string }>('/payments/create-intent', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request<{ payments: PaymentRecord[] }>('/payments'),
};

// Search requests
export const searchRequests = {
  create: (data: SearchRequestData) =>
    request<{ success: boolean; id: string }>('/search-requests', { method: 'POST', body: JSON.stringify(data) }),
  list: () => request<{ requests: SearchRequestData[] }>('/search-requests'),
  update: (id: string, data: Partial<SearchRequestData>) =>
    request<SearchRequestData>(`/search-requests/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Cases
export const cases = {
  myCases: () => request<ClientCase[]>('/cases/my'),
  list: () => request<{ cases: ClientCase[] }>('/cases'),
  create: (data: Partial<ClientCase>) => request<ClientCase>('/cases', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<ClientCase>) =>
    request<ClientCase>(`/cases/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  sendMessage: (id: string, message: string) =>
    request<{ success: boolean }>(`/cases/${id}/messages`, { method: 'POST', body: JSON.stringify({ message }) }),
  getIntakeResponses: (matterId: string) =>
    request<any[]>(`/matters/${matterId}/intake`),
  upsertIntakeField: (data: { matterId: string; section: string; fieldName: string; value: any }) =>
    request<{ success: boolean }>(`/matters/${data.matterId}/intake`, { method: 'POST', body: JSON.stringify(data) }),
  updateMatter: (id: string, data: Record<string, any>) =>
    request<any>(`/matters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  completeTodo: (data: { matter_id: string; title: string }) =>
    request<{ success: boolean }>(`/matters/${data.matter_id}/todos/complete`, { method: 'POST', body: JSON.stringify(data) }),
};

// Matters (docket)
export const matters = {
  myMatters: () => request<TrademarkMatter[]>('/matters/my'),
  list: () => request<{ matters: TrademarkMatter[] }>('/matters'),
  create: (data: Partial<TrademarkMatter>) => request<TrademarkMatter>('/matters', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: Partial<TrademarkMatter>) =>
    request<TrademarkMatter>(`/matters/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
};

// Guides
export const guides = {
  list: () => request<EducationalGuide[]>('/guides'),
  get: (slug: string) => request<EducationalGuide>(`/guides/${slug}`),
};

// Types
export interface AppUser {
  _id: string;
  email: string;
  fullName?: string;
  isStaff: boolean;
  createdAt: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  author: string;
  category?: string;
  tags: string[];
  publishedDate: string;
  readingTime: number;
  featured: boolean;
}

export interface AgreementData {
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  packageName: string;
  packagePrice: string;
  signatureType: 'drawn' | 'typed';
  signatureData: string;
  addOns?: string[];
  totalAmount?: number;
}

export interface PaymentRecord {
  _id: string;
  stripePaymentIntentId: string;
  clientEmail: string;
  clientName?: string;
  amountCents: number;
  currency: string;
  status: string;
  packageName?: string;
  createdAt: string;
}

export interface SearchRequestData {
  _id?: string;
  trademarkName: string;
  clientEmail: string;
  clientName?: string;
  clientPhone?: string;
  businessDescription?: string;
  goodsServices?: string;
  status?: string;
  staffNotes?: string;
  createdAt?: string;
}

export interface ClientCase {
  _id: string;
  clientEmail: string;
  clientName: string;
  trademarkName: string;
  status: string;
  progress: number;
  notes?: string;
  estimatedCompletion?: string;
  docketNumber?: string;
  messages?: CaseMessage[];
  createdAt: string;
}

export interface CaseMessage {
  sender: string;
  message: string;
  isStaff: boolean;
  read: boolean;
  sentAt: string;
}

export interface TrademarkMatter {
  _id: string;
  docketNumber: string;
  clientEmail: string;
  clientName: string;
  trademarkName: string;
  stage: string;
  progress: number;
  packageName?: string;
  filingDate?: string;
  registrationNumber?: string;
  todos?: Todo[];
  createdAt: string;
}

export interface EducationalGuide {
  _id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  topics: string[];
  metaTitle?: string;
  metaDescription?: string;
  readingTime: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Todo {
  title: string;
  dueDate?: string;
  completed: boolean;
}
