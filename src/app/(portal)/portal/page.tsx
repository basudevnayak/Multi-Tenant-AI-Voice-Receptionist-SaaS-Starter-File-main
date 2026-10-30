'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import {
  User,
  Calendar,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  Layers,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Paperclip,
  Send,
  Plus,
  CreditCard,
  Building,
  RefreshCw,
  MapPin,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export default function ClientPortalDashboard() {
  const {
    businesses,
    activeBusinessId,
    appointments,
    orders,
    inquiries,
    supportTickets,
    catalogItems,
    addAppointment,
    updateAppointmentStatus,
    addOrder,
    addInquiry,
    addSupportTicket,
    replyToTicket,
  } = useBusinessStore();

  const { openCallModal } = useVoiceStore();

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'appointments' | 'orders' | 'inquiries' | 'support' | 'catalog'
  >('appointments');

  // Customer Profile
  const customerName = 'Dalat Hussein';
  const customerEmail = 'dollat0092@gmail.com';
  const customerPhone = '+1 (555) 123-4567';

  // Reschedule Modal
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState(
    new Date(Date.now() + 48 * 3600000).toISOString().slice(0, 16)
  );

  // Pay Modal (Cash or Online)
  const [payAppointmentId, setPayAppointmentId] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState<'card' | 'cash'>('card');
  const [paySuccess, setPaySuccess] = useState(false);

  // New Support Ticket
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [supportAttachment, setSupportAttachment] = useState('');

  // Catalog Item Booking / Deposit Modal
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<any | null>(null);
  const [bookingTime, setBookingTime] = useState(
    new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16)
  );
  const [catalogBookingSuccess, setCatalogBookingSuccess] = useState(false);

  // Support thread reply
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [threadReplyText, setThreadReplyText] = useState('');

  // Industry Filter in Catalog
  const [catalogIndustry, setCatalogIndustry] = useState<string>('all');

  // Filter user records
  const myAppointments = appointments.filter(
    (a) => a.customerEmail?.toLowerCase() === customerEmail.toLowerCase() || a.customerName.includes('Dalat')
  );
  const myOrders = orders.filter(
    (o) => o.customerEmail?.toLowerCase() === customerEmail.toLowerCase() || o.customerName.includes('Dalat')
  );
  const myInquiries = inquiries.filter(
    (i) => i.customerEmail?.toLowerCase() === customerEmail.toLowerCase() || i.customerName.includes('Dalat')
  );
  const myTickets = supportTickets.filter(
    (t) => t.customerEmail?.toLowerCase() === customerEmail.toLowerCase() || t.customerName.includes('Dalat')
  );

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppointmentId) return;

    updateAppointmentStatus(rescheduleAppointmentId, 'pending');
    setRescheduleAppointmentId(null);
    alert('Appointment rescheduled successfully! A confirmation email has been sent.');
  };

  const handlePayAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAppointmentId) return;

    setPaySuccess(true);
    setTimeout(() => {
      setPaySuccess(false);
      setPayAppointmentId(null);
      alert(`Payment recorded via ${payMethod.toUpperCase()}! Receipt sent to ${customerEmail}.`);
    }, 1500);
  };

  const handleCreateSupportTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMessage.trim()) return;

    const newTicket = {
      id: `tick_${Date.now()}`,
      businessId: activeBusinessId,
      customerName,
      customerEmail,
      subject: supportSubject,
      message: supportMessage,
      attachmentUrl: supportAttachment.trim() || undefined,
      status: 'open' as const,
      priority: 'medium' as const,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    addSupportTicket(newTicket);
    setShowSupportModal(false);
    setSupportSubject('');
    setSupportMessage('');
    setSupportAttachment('');
  };

  const handleSendThreadReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedThread || !threadReplyText.trim()) return;

    replyToTicket(selectedThread.id, {
      id: `rep_${Date.now()}`,
      sender: 'customer',
      senderName: customerName,
      message: threadReplyText.trim(),
      createdAt: new Date().toISOString(),
    });

    setThreadReplyText('');
  };

  const handleBookCatalogDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogItem) return;

    const aptId = `apt_${Date.now()}`;
    addAppointment({
      id: aptId,
      businessId: selectedCatalogItem.businessId,
      serviceId: selectedCatalogItem.id,
      serviceName: selectedCatalogItem.title,
      customerName,
      customerPhone,
      customerEmail,
      startTime: new Date(bookingTime).toISOString(),
      endTime: new Date(new Date(bookingTime).getTime() + 45 * 60000).toISOString(),
      status: 'confirmed',
      notes: `Booked with $${selectedCatalogItem.depositAmount || 0} deposit paid.`,
      bookedVia: 'web_portal',
      createdAt: new Date().toISOString(),
    });

    if (selectedCatalogItem.depositAmount > 0) {
      addOrder({
        id: `ord_${Date.now()}`,
        businessId: selectedCatalogItem.businessId,
        customerName,
        customerEmail,
        customerPhone,
        items: [
          {
            catalogItemId: selectedCatalogItem.id,
            title: selectedCatalogItem.title,
            price: selectedCatalogItem.price,
            depositPaid: selectedCatalogItem.depositAmount,
          },
        ],
        totalAmount: selectedCatalogItem.price,
        paidAmount: selectedCatalogItem.depositAmount,
        paymentMethod: 'deposit',
        paymentStatus: 'paid',
        orderStatus: 'processing',
        trackingEvents: [
          {
            title: 'Deposit Received & Booking Locked',
            location: 'Client Self-Service Portal',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      });
    }

    setCatalogBookingSuccess(true);
    setTimeout(() => {
      setCatalogBookingSuccess(false);
      setSelectedCatalogItem(null);
      setActiveTab('appointments');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="h-16 bg-[#0c1017]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-rose-600/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                <span>Client Self-Service Portal</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                  Verified Client
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{customerEmail}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => openCallModal()}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Talk to AI Receptionist</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-rose-400" />
              <span>Switch to Business Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-900/20 to-black/40 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Welcome back, {customerName}</span>
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Manage your upcoming service bookings, check order tracking statuses, submit support tickets, or book directly with 24/7 AI agents.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-slate-400">Total Bookings</div>
              <div className="text-xl font-black text-white">{myAppointments.length} Active</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {[
            { id: 'appointments', label: `My Appointments (${myAppointments.length})`, icon: Calendar },
            { id: 'orders', label: `Purchases & Orders (${myOrders.length})`, icon: ShoppingBag },
            { id: 'inquiries', label: `Inquiries (${myInquiries.length})`, icon: MessageSquare },
            { id: 'support', label: `Support Tickets (${myTickets.length})`, icon: HelpCircle },
            { id: 'catalog', label: 'Browse Offerings & Book', icon: Layers },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            {myAppointments.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center space-y-3">
                <Calendar className="w-8 h-8 text-slate-500 mx-auto" />
                <div className="text-sm font-bold text-white">No active appointments</div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  You have not scheduled any appointments yet. Call our AI receptionist or browse our catalog to reserve a slot.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="btn-primary text-xs mx-auto"
                >
                  Browse Available Slots
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/30 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            apt.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : apt.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {apt.status}
                        </span>
                        <h3 className="font-bold text-white text-base mt-2">
                          {apt.serviceName || 'Service Appointment'}
                        </h3>
                      </div>

                      <div className="text-right text-xs text-slate-400">
                        <div className="font-semibold text-rose-400">
                          {new Date(apt.startTime).toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div>
                          {new Date(apt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-300 space-y-1">
                      <div className="text-slate-400 text-[11px]">Appointment Notes:</div>
                      <div>{apt.notes || 'Booked via AI Voice Receptionist'}</div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setPayAppointmentId(apt.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30 transition-colors flex items-center gap-1.5"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Pay Cash or Card</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setRescheduleAppointmentId(apt.id)}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-semibold transition-colors"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to cancel this appointment?')) {
                              updateAppointmentStatus(apt.id, 'cancelled');
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2. Purchases & Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                No orders found.
              </div>
            ) : (
              myOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-base">Order #{order.id}</div>
                      <div className="text-xs text-slate-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-black text-emerald-400 text-base">${order.paidAmount} Paid</div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-emerald-500/20 text-emerald-400">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <span className="font-semibold text-white">{item.title}</span>
                        <span className="text-slate-300 font-bold">${item.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tracking Timeline */}
                  {order.trackingEvents && order.trackingEvents.length > 0 && (
                    <div className="space-y-2 pt-2 text-xs">
                      <div className="text-slate-400 font-semibold">Delivery & Progress Timeline:</div>
                      <div className="space-y-2 pl-4 border-l border-white/10 ml-2">
                        {order.trackingEvents.map((ev, i) => (
                          <div key={i} className="relative">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 absolute -left-[21px] top-1" />
                            <div className="font-semibold text-white">{ev.title}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              <span>{ev.location}</span>
                              <span>•</span>
                              <span>{new Date(ev.timestamp).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 3. Inquiries Tab */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {myInquiries.length === 0 ? (
              <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                No inquiries submitted yet.
              </div>
            ) : (
              myInquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-rose-400">
                      Re: {inq.catalogItemTitle || 'General Product'}
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                        inq.status === 'answered'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200">"{inq.query}"</p>

                  {inq.response && (
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300">
                      <strong>Business Response:</strong> {inq.response}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* 4. Support Desk Tab */}
        {activeTab === 'support' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Your Support Tickets</h2>
              <button
                onClick={() => setShowSupportModal(true)}
                className="btn-primary flex items-center gap-2 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Open New Ticket</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Ticket list */}
              <div className="space-y-3">
                {myTickets.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                    No active support tickets.
                  </div>
                ) : (
                  myTickets.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => setSelectedThread(t)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        selectedThread?.id === t.id
                          ? 'bg-white/[0.06] border-rose-500/50 shadow-lg'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold uppercase text-slate-400">{t.priority} priority</span>
                        <span className="text-slate-500">{new Date(t.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm mt-1">{t.subject}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{t.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Thread detail */}
              <div className="lg:col-span-2">
                {selectedThread ? (
                  <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                    <div className="border-b border-white/5 pb-3">
                      <h3 className="font-bold text-white text-base">{selectedThread.subject}</h3>
                      <div className="text-xs text-slate-400 mt-1">{selectedThread.message}</div>
                    </div>

                    {/* Replies */}
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {selectedThread.replies.map((r: any) => (
                        <div
                          key={r.id}
                          className={`p-3 rounded-xl border text-xs space-y-1 ${
                            r.sender === 'customer'
                              ? 'bg-white/[0.03] border-white/5'
                              : 'bg-rose-950/20 border-rose-500/20 ml-6'
                          }`}
                        >
                          <div className="font-semibold text-rose-300">{r.senderName}</div>
                          <div className="text-slate-200">{r.message}</div>
                        </div>
                      ))}
                    </div>

                    {/* Reply box */}
                    <form onSubmit={handleSendThreadReply} className="space-y-3 pt-3 border-t border-white/5">
                      <textarea
                        rows={3}
                        required
                        placeholder="Type your message..."
                        value={threadReplyText}
                        onChange={(e) => setThreadReplyText(e.target.value)}
                        className="input-field w-full text-xs"
                      />
                      <button type="submit" className="btn-primary text-xs flex items-center gap-2">
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                    Select a support thread to view messages.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 5. Browse Catalog & Book Tab */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white">Browse Live Catalog & Reserve</h2>
                <p className="text-xs text-slate-400">
                  Select a service or product, book a slot, and lock your appointment with an instant deposit.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {['all', 'auto_repair', 'healthcare', 'real_estate'].map((ind) => (
                  <button
                    key={ind}
                    onClick={() => setCatalogIndustry(ind)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                      catalogIndustry === ind
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/5 hover:bg-white/10 text-slate-300'
                    }`}
                  >
                    {ind.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {catalogItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-rose-500/40 transition-all flex flex-col justify-between p-5 space-y-4"
                >
                  <div className="space-y-2">
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-900 relative">
                      <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white font-black text-xs">
                        ${item.price}
                      </div>
                    </div>

                    <div className="text-xs text-rose-400 font-semibold">{item.category}</div>
                    <h3 className="font-bold text-white text-base leading-snug">{item.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{item.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    {item.depositRequired && (
                      <div className="text-xs text-amber-400 font-semibold flex items-center gap-1.5">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>${item.depositAmount} Deposit Required to Lock Slot</span>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedCatalogItem(item)}
                      className="btn-primary w-full flex items-center justify-center gap-2 text-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{item.depositRequired ? `Pay $${item.depositAmount} Deposit & Book` : 'Book Appointment'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Reschedule Modal */}
      {rescheduleAppointmentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-rose-500" />
              <span>Reschedule Service Appointment</span>
            </h3>

            <form onSubmit={handleReschedule} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select New Date & Time Slot</label>
                <input
                  type="datetime-local"
                  required
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleAppointmentId(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payAppointmentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Settle Service Payment</span>
            </h3>

            <form onSubmit={handlePayAppointment} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-2">Select Payment Method</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPayMethod('card')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      payMethod === 'card'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPayMethod('cash')}
                    className={`p-3 rounded-xl border text-center font-bold transition-all ${
                      payMethod === 'cash'
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400'
                    }`}
                  >
                    Pay Cash at Shop
                  </button>
                </div>
              </div>

              {payMethod === 'card' && (
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                  <input
                    type="text"
                    placeholder="4242 •••• •••• 4242"
                    defaultValue="4242 •••• •••• 4242"
                    className="input-field w-full text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" placeholder="MM/YY" defaultValue="12/28" className="input-field text-xs" />
                    <input type="text" placeholder="CVC" defaultValue="123" className="input-field text-xs" />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayAppointmentId(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  {paySuccess ? 'Processing...' : 'Confirm & Record Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Catalog Booking Modal */}
      {selectedCatalogItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              <span>Reserve: {selectedCatalogItem.title}</span>
            </h3>

            <form onSubmit={handleBookCatalogDeposit} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Preferred Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              {selectedCatalogItem.depositRequired && (
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-300">
                  <div className="font-bold">Required Deposit: ${selectedCatalogItem.depositAmount}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Remaining balance of ${selectedCatalogItem.price - selectedCatalogItem.depositAmount} is due at service check-in.
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCatalogItem(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  {catalogBookingSuccess ? 'Booking Confirmed!' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Support Ticket Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-rose-500" />
              <span>Submit Support Ticket</span>
            </h3>

            <form onSubmit={handleCreateSupportTicket} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Question regarding billing"
                  value={supportSubject}
                  onChange={(e) => setSupportSubject(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue in detail..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Attachment URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={supportAttachment}
                  onChange={(e) => setSupportAttachment(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
