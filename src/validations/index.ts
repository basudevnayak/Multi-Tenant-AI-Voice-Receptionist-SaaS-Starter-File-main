import { z } from 'zod';

export const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase letters, numbers, and hyphens'),
  industry: z.enum([
    'healthcare',
    'real_estate',
    'retail',
    'auto_repair',
    'dental',
    'salon',
    'legal',
    'fitness',
    'restaurant',
    'other',
  ]),
  phoneNumber: z.string().min(7, 'Valid phone number is required'),
  email: z.string().email('Valid email is required'),
  address: z.string().min(5, 'Address is required'),
  timezone: z.string().default('America/New_York'),
  plan: z.enum(['starter', 'pro', 'enterprise']).default('pro'),
});

export const agentSchema = z.object({
  name: z.string().min(2, 'Agent name is required'),
  role: z.string().min(2, 'Role description is required'),
  type: z.enum(['inbound', 'outbound', 'hybrid']).default('inbound'),
  voiceId: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']).default('alloy'),
  voiceSpeed: z.number().min(0.5).max(2.0).default(1.0),
  voicePitch: z.number().min(0.5).max(2.0).default(1.0),
  systemPrompt: z.string().min(10, 'System prompt must be at least 10 characters'),
  greetingMessage: z.string().min(5, 'Greeting message is required'),
  status: z.enum(['active', 'paused', 'draft']).default('active'),
  forwardingPhone: z.string().optional(),
  maxCallDurationSeconds: z.number().min(60).max(3600).default(600),
  autoBookAppointments: z.boolean().default(true),
  collectLeadInfo: z.boolean().default(true),
});

export const appointmentSchema = z.object({
  customerName: z.string().min(2, 'Customer name is required'),
  customerPhone: z.string().min(7, 'Customer phone number is required'),
  customerEmail: z.string().email('Valid email required').optional().or(z.literal('')),
  serviceId: z.string().min(1, 'Service is required'),
  startTime: z.string().min(5, 'Start date/time is required'),
  notes: z.string().optional(),
});

export const leadSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Phone number is required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  status: z.enum(['new', 'qualified', 'tour_scheduled', 'follow_up', 'converted', 'lost']),
  score: z.number().min(1).max(100).default(70),
  interest: z.string().optional(),
  budget: z.string().optional(),
  aiSummary: z.string().optional(),
});

export const knowledgeItemSchema = z.object({
  category: z.enum(['faq', 'policy', 'pricing', 'location', 'staff', 'urgent_protocol']),
  question: z.string().min(5, 'Question must be at least 5 characters'),
  answer: z.string().min(5, 'Answer must be at least 5 characters'),
  keywords: z.string().optional(),
});

export const campaignSchema = z.object({
  name: z.string().min(2, 'Campaign name is required'),
  description: z.string().optional(),
  agentId: z.string().min(1, 'Agent selection is required'),
  scheduledFor: z.string().optional(),
});

export const widgetConfigSchema = z.object({
  title: z.string().min(2, 'Widget title is required'),
  subtitle: z.string().optional(),
  primaryColor: z.string().min(4, 'Color code required'),
  buttonText: z.string().min(2, 'Button label is required'),
  greeting: z.string().min(2, 'Greeting message is required'),
  position: z.enum(['bottom-right', 'bottom-left']).default('bottom-right'),
  isActive: z.boolean().default(true),
});