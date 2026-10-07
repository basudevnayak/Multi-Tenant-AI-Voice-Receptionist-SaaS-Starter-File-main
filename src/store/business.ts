import { create } from 'zustand';
import {
  Business,
  Agent,
  ServiceItem,
  KnowledgeItem,
  Appointment,
  Lead,
  CallLog,
  Campaign,
  WidgetConfig,
} from '@/types';
import {
  INITIAL_BUSINESSES,
  INITIAL_AGENTS,
  INITIAL_SERVICES,
  INITIAL_KNOWLEDGE,
  INITIAL_APPOINTMENTS,
  INITIAL_LEADS,
  INITIAL_CALLS,
  INITIAL_CAMPAIGNS,
  INITIAL_WIDGET_CONFIGS,
} from '@/constants';

interface BusinessState {
  businesses: Business[];
  activeBusinessId: string;
  agents: Agent[];
  services: ServiceItem[];
  knowledge: KnowledgeItem[];
  appointments: Appointment[];
  leads: Lead[];
  calls: CallLog[];
  campaigns: Campaign[];
  widgetConfigs: Record<string, WidgetConfig>;

  // Actions
  setActiveBusiness: (id: string) => void;
  getActiveBusiness: () => Business | undefined;
  getActiveAgents: () => Agent[];
  getActiveServices: () => ServiceItem[];
  getActiveKnowledge: () => KnowledgeItem[];
  getActiveAppointments: () => Appointment[];
  getActiveLeads: () => Lead[];
  getActiveCalls: () => CallLog[];
  getActiveCampaigns: () => Campaign[];
  getActiveWidgetConfig: () => WidgetConfig | undefined;

  // Add / Update Entities
  addBusiness: (business: Business) => void;
  updateBusiness: (id: string, partial: Partial<Business>) => void;

  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, partial: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;

  addAppointment: (appointment: Appointment) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  addLead: (lead: Lead) => void;
  updateLead: (id: string, partial: Partial<Lead>) => void;

  addCallLog: (call: CallLog) => void;
  addKnowledgeItem: (item: KnowledgeItem) => void;
  deleteKnowledgeItem: (id: string) => void;

  addService: (service: ServiceItem) => void;
  updateWidgetConfig: (businessId: string, config: Partial<WidgetConfig>) => void;

  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (id: string, partial: Partial<Campaign>) => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: INITIAL_BUSINESSES,
  activeBusinessId: INITIAL_BUSINESSES[0].id,
  agents: INITIAL_AGENTS,
  services: INITIAL_SERVICES,
  knowledge: INITIAL_KNOWLEDGE,
  appointments: INITIAL_APPOINTMENTS,
  leads: INITIAL_LEADS,
  calls: INITIAL_CALLS,
  campaigns: INITIAL_CAMPAIGNS,
  widgetConfigs: INITIAL_WIDGET_CONFIGS,

  setActiveBusiness: (id: string) => set({ activeBusinessId: id }),

  getActiveBusiness: () => {
    const { businesses, activeBusinessId } = get();
    return businesses.find((b) => b.id === activeBusinessId) || businesses[0];
  },

  getActiveAgents: () => {
    const { agents, activeBusinessId } = get();
    return agents.filter((a) => a.businessId === activeBusinessId);
  },

  getActiveServices: () => {
    const { services, activeBusinessId } = get();
    return services.filter((s) => s.businessId === activeBusinessId);
  },

  getActiveKnowledge: () => {
    const { knowledge, activeBusinessId } = get();
    return knowledge.filter((k) => k.businessId === activeBusinessId);
  },

  getActiveAppointments: () => {
    const { appointments, activeBusinessId } = get();
    return appointments.filter((a) => a.businessId === activeBusinessId);
  },

  getActiveLeads: () => {
    const { leads, activeBusinessId } = get();
    return leads.filter((l) => l.businessId === activeBusinessId);
  },

  getActiveCalls: () => {
    const { calls, activeBusinessId } = get();
    return calls.filter((c) => c.businessId === activeBusinessId);
  },

  getActiveCampaigns: () => {
    const { campaigns, activeBusinessId } = get();
    return campaigns.filter((c) => c.businessId === activeBusinessId);
  },

  getActiveWidgetConfig: () => {
    const { widgetConfigs, activeBusinessId } = get();
    return (
      widgetConfigs[activeBusinessId] || {
        id: `w_${activeBusinessId}`,
        businessId: activeBusinessId,
        title: 'AI Voice Receptionist',
        subtitle: '24/7 Intelligent Customer Care',
        primaryColor: '#1e4db7',
        buttonText: 'Talk to AI Assistant',
        greeting: 'Hello! How can I help you today?',
        position: 'bottom-right',
        isActive: true,
      }
    );
  },

  addBusiness: (business) =>
    set((state) => ({
      businesses: [business, ...state.businesses],
      activeBusinessId: business.id,
    })),

  updateBusiness: (id, partial) =>
    set((state) => ({
      businesses: state.businesses.map((b) => (b.id === id ? { ...b, ...partial } : b)),
    })),

  addAgent: (agent) =>
    set((state) => ({
      agents: [agent, ...state.agents],
    })),

  updateAgent: (id, partial) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? { ...a, ...partial } : a)),
    })),

  deleteAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((a) => a.id !== id),
    })),

  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),

  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((a) => (a.id === id ? { ...a, status } : a)),
    })),

  addLead: (lead) =>
    set((state) => ({
      leads: [lead, ...state.leads],
    })),

  updateLead: (id, partial) =>
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...partial } : l)),
    })),

  addCallLog: (call) =>
    set((state) => ({
      calls: [call, ...state.calls],
    })),

  addKnowledgeItem: (item) =>
    set((state) => ({
      knowledge: [item, ...state.knowledge],
    })),

  deleteKnowledgeItem: (id) =>
    set((state) => ({
      knowledge: state.knowledge.filter((k) => k.id !== id),
    })),

  addService: (service) =>
    set((state) => ({
      services: [service, ...state.services],
    })),

  updateWidgetConfig: (businessId, config) =>
    set((state) => {
      const current = state.widgetConfigs[businessId] || {
        id: `w_${businessId}`,
        businessId,
        title: 'AI Voice Receptionist',
        subtitle: '24/7 Support',
        primaryColor: '#1e4db7',
        buttonText: 'Talk with AI Assistant',
        greeting: 'Hello! How can I help you today?',
        position: 'bottom-right',
        isActive: true,
      };
      return {
        widgetConfigs: {
          ...state.widgetConfigs,
          [businessId]: { ...current, ...config },
        },
      };
    }),

  addCampaign: (campaign) =>
    set((state) => ({
      campaigns: [campaign, ...state.campaigns],
    })),

  updateCampaign: (id, partial) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) => (c.id === id ? { ...c, ...partial } : c)),
    })),
}));