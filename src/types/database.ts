export type IndustryType =
  | 'healthcare'
  | 'real_estate'
  | 'retail'
  | 'auto_repair'
  | 'dental'
  | 'salon'
  | 'legal'
  | 'fitness'
  | 'restaurant'
  | 'other';

export type PlanType = 'starter' | 'pro' | 'enterprise';

export interface BusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export type WeekDays = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Business {
  id: string;
  userId?: string;
  name: string;
  slug: string;
  industry: IndustryType;
  phoneNumber: string;
  email: string;
  address: string;
  timezone: string;
  businessHours: Record<WeekDays, BusinessHours>;
  logoUrl?: string;
  website?: string;
  plan: PlanType;
  minutesUsed: number;
  minutesLimit: number;
  createdAt: string;
}

export type AgentType = 'inbound' | 'outbound' | 'hybrid';
export type AgentStatus = 'active' | 'paused' | 'draft';
export type VoiceId = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

export interface Agent {
  id: string;
  businessId: string;
  name: string;
  role: string;
  type: AgentType;
  voiceId: VoiceId;
  language?: string;
  supportedLanguages?: string[];
  voiceSpeed: number;
  voicePitch: number;
  systemPrompt: string;
  greetingMessage: string;
  status: AgentStatus;
  forwardingPhone?: string;
  maxCallDurationSeconds: number;
  autoBookAppointments: boolean;
  collectLeadInfo: boolean;
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  businessId: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  category: string;
  isActive: boolean;
}

export type KnowledgeCategory = 'faq' | 'policy' | 'pricing' | 'location' | 'staff' | 'urgent_protocol';

export interface KnowledgeItem {
  id: string;
  businessId: string;
  category: KnowledgeCategory;
  question: string;
  answer: string;
  keywords: string[];
  isActive: boolean;
  createdAt: string;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'no_show';
export type BookingSource = 'ai_voice' | 'manual' | 'web_portal';

export interface Appointment {
  id: string;
  businessId: string;
  agentId?: string;
  serviceId?: string;
  serviceName?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  bookedVia: BookingSource;
  createdAt: string;
}

export type LeadStatus = 'new' | 'qualified' | 'tour_scheduled' | 'follow_up' | 'converted' | 'lost';

export interface Lead {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  status: LeadStatus;
  score: number;
  source: string;
  interest?: string;
  budget?: string;
  aiSummary?: string;
  lastContactAt: string;
  createdAt: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallStatus = 'completed' | 'missed' | 'transferred' | 'failed' | 'in_progress';
export type CallSentiment = 'positive' | 'neutral' | 'negative';

export interface TranscriptEntry {
  speaker: 'ai' | 'caller';
  text: string;
  timestamp: number;
}

export interface CallLog {
  id: string;
  businessId: string;
  agentId?: string;
  agentName?: string;
  callerName: string;
  callerPhone: string;
  direction: CallDirection;
  durationSeconds: number;
  status: CallStatus;
  sentiment: CallSentiment;
  recordingUrl?: string;
  transcript: TranscriptEntry[];
  aiSummary: string;
  outcome: string;
  actionTaken?: string;
  transferredTo?: string;
  cost: number;
  createdAt: string;
}

export type CampaignStatus = 'draft' | 'running' | 'paused' | 'completed' | 'scheduled';

export interface Campaign {
  id: string;
  businessId: string;
  agentId?: string;
  name: string;
  description: string;
  status: CampaignStatus;
  totalLeads: number;
  callsCompleted: number;
  appointmentsBooked: number;
  scheduledFor?: string;
  createdAt: string;
}

export interface CatalogItem {
  id: string;
  businessId: string;
  title: string;
  description: string;
  itemType: 'service' | 'product' | 'consultation';
  category: string;
  price: number;
  priceType: 'fixed' | 'range' | 'starting';
  depositRequired: boolean;
  depositAmount: number;
  durationMinutes?: number;
  warrantyMonths?: number;
  partsIncluded?: string;
  features: string[];
  images: string[];
  assignedAgentId?: string;
  isStorefrontEnabled: boolean;
  isAiEnabled: boolean;
  isFeatured: boolean;
  status: 'active' | 'inactive' | 'sold';
  createdAt: string;
}

export interface StoreOrder {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    catalogItemId: string;
    title: string;
    price: number;
    depositPaid?: number;
  }>;
  totalAmount: number;
  paidAmount: number;
  paymentMethod: 'card' | 'cash' | 'deposit';
  paymentStatus: 'paid' | 'pending' | 'partially_paid' | 'refunded';
  orderStatus: 'new' | 'processing' | 'shipped' | 'completed' | 'cancelled';
  trackingEvents?: Array<{
    title: string;
    location: string;
    timestamp: string;
  }>;
  createdAt: string;
}

export interface CustomerInquiry {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  catalogItemId?: string;
  catalogItemTitle?: string;
  query: string;
  response?: string;
  status: 'pending' | 'answered';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  businessId: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  replies: Array<{
    id: string;
    sender: 'customer' | 'admin' | 'business';
    senderName: string;
    message: string;
    attachmentUrl?: string;
    createdAt: string;
  }>;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  businessId?: string;
  title: string;
  description: string;
  type: 'booking' | 'order' | 'inquiry' | 'support' | 'system' | 'billing';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AccountAppeal {
  id: string;
  businessId: string;
  businessName: string;
  userEmail: string;
  reason: string;
  documentUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
}

export interface WidgetConfig {
  id: string;
  businessId: string;
  agentId?: string;
  title: string;
  subtitle: string;
  primaryColor: string;
  buttonText: string;
  greeting: string;
  position: 'bottom-right' | 'bottom-left';
  isActive: boolean;
}