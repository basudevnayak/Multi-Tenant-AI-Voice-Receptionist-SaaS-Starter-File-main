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
  CatalogItem,
  StoreOrder,
  CustomerInquiry,
  SupportTicket,
  AppNotification,
  AccountAppeal,
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
  INITIAL_CATALOG_ITEMS,
  INITIAL_STORE_ORDERS,
  INITIAL_INQUIRIES,
  INITIAL_SUPPORT_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_APPEALS,
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
  catalogItems: CatalogItem[];
  orders: StoreOrder[];
  inquiries: CustomerInquiry[];
  supportTickets: SupportTicket[];
  notifications: AppNotification[];
  appeals: AccountAppeal[];
  suspendedBusinessIds: string[];

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
  getActiveCatalogItems: () => CatalogItem[];
  getActiveOrders: () => StoreOrder[];
  getActiveInquiries: () => CustomerInquiry[];
  getActiveSupportTickets: () => SupportTicket[];
  getActiveNotifications: () => AppNotification[];

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

  // Catalog Actions
  addCatalogItem: (item: CatalogItem) => void;
  updateCatalogItem: (id: string, partial: Partial<CatalogItem>) => void;
  deleteCatalogItem: (id: string) => void;

  // Order Actions
  addOrder: (order: StoreOrder) => void;
  updateOrderStatus: (id: string, orderStatus: StoreOrder['orderStatus'], trackingEvent?: { title: string; location: string; timestamp: string }) => void;

  // Inquiry Actions
  addInquiry: (inquiry: CustomerInquiry) => void;
  replyToInquiry: (id: string, response: string) => void;

  // Support Ticket Actions
  addSupportTicket: (ticket: SupportTicket) => void;
  replyToTicket: (ticketId: string, reply: SupportTicket['replies'][0]) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Notification Actions
  addNotification: (notification: AppNotification) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Admin Suspension & Appeals
  suspendBusiness: (id: string, reason: string) => void;
  reactivateBusiness: (id: string) => void;
  submitAppeal: (appeal: AccountAppeal) => void;
  resolveAppeal: (appealId: string, status: 'approved' | 'rejected', adminNotes?: string) => void;
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
  catalogItems: INITIAL_CATALOG_ITEMS,
  orders: INITIAL_STORE_ORDERS,
  inquiries: INITIAL_INQUIRIES,
  supportTickets: INITIAL_SUPPORT_TICKETS,
  notifications: INITIAL_NOTIFICATIONS,
  appeals: INITIAL_APPEALS,
  suspendedBusinessIds: [],

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
        primaryColor: '#e11d48',
        buttonText: 'Talk to AI Assistant',
        greeting: 'Hello! How can I help you today?',
        position: 'bottom-right',
        isActive: true,
      }
    );
  },

  getActiveCatalogItems: () => {
    const { catalogItems, activeBusinessId } = get();
    return catalogItems.filter((item) => item.businessId === activeBusinessId);
  },

  getActiveOrders: () => {
    const { orders, activeBusinessId } = get();
    return orders.filter((order) => order.businessId === activeBusinessId);
  },

  getActiveInquiries: () => {
    const { inquiries, activeBusinessId } = get();
    return inquiries.filter((inq) => inq.businessId === activeBusinessId);
  },

  getActiveSupportTickets: () => {
    const { supportTickets, activeBusinessId } = get();
    return supportTickets.filter((ticket) => ticket.businessId === activeBusinessId);
  },

  getActiveNotifications: () => {
    const { notifications, activeBusinessId } = get();
    return notifications.filter((notif) => !notif.businessId || notif.businessId === activeBusinessId);
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
        primaryColor: '#e11d48',
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

  addCatalogItem: (item) =>
    set((state) => ({
      catalogItems: [item, ...state.catalogItems],
    })),

  updateCatalogItem: (id, partial) =>
    set((state) => ({
      catalogItems: state.catalogItems.map((item) => (item.id === id ? { ...item, ...partial } : item)),
    })),

  deleteCatalogItem: (id) =>
    set((state) => ({
      catalogItems: state.catalogItems.filter((item) => item.id !== id),
    })),

  addOrder: (order) =>
    set((state) => ({
      orders: [order, ...state.orders],
    })),

  updateOrderStatus: (id, orderStatus, trackingEvent) =>
    set((state) => ({
      orders: state.orders.map((o) => {
        if (o.id !== id) return o;
        const newEvents = trackingEvent ? [...(o.trackingEvents || []), trackingEvent] : o.trackingEvents;
        return { ...o, orderStatus, trackingEvents: newEvents };
      }),
    })),

  addInquiry: (inquiry) =>
    set((state) => ({
      inquiries: [inquiry, ...state.inquiries],
    })),

  replyToInquiry: (id, response) =>
    set((state) => ({
      inquiries: state.inquiries.map((inq) => (inq.id === id ? { ...inq, response, status: 'answered' } : inq)),
    })),

  addSupportTicket: (ticket) =>
    set((state) => ({
      supportTickets: [ticket, ...state.supportTickets],
    })),

  replyToTicket: (ticketId, reply) =>
    set((state) => ({
      supportTickets: state.supportTickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              status: 'in_progress',
              replies: [...ticket.replies, reply],
            }
          : ticket
      ),
    })),

  updateTicketStatus: (ticketId, status) =>
    set((state) => ({
      supportTickets: state.supportTickets.map((t) => (t.id === ticketId ? { ...t, status } : t)),
    })),

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    })),

  markAllNotificationsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),

  suspendBusiness: (id, reason) =>
    set((state) => ({
      suspendedBusinessIds: [...new Set([...state.suspendedBusinessIds, id])],
    })),

  reactivateBusiness: (id) =>
    set((state) => ({
      suspendedBusinessIds: state.suspendedBusinessIds.filter((bid) => bid !== id),
    })),

  submitAppeal: (appeal) =>
    set((state) => ({
      appeals: [appeal, ...state.appeals],
    })),

  resolveAppeal: (appealId, status, adminNotes) =>
    set((state) => {
      const appeal = state.appeals.find((a) => a.id === appealId);
      const newSuspended =
        status === 'approved' && appeal
          ? state.suspendedBusinessIds.filter((id) => id !== appeal.businessId)
          : state.suspendedBusinessIds;

      return {
        appeals: state.appeals.map((a) =>
          a.id === appealId ? { ...a, status, reviewedAt: new Date().toISOString(), adminNotes } : a
        ),
        suspendedBusinessIds: newSuspended,
      };
    }),
}));