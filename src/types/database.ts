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