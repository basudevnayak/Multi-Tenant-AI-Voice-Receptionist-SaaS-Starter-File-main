'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import { SupportTicket } from '@/types';
import {
  HelpCircle,
  MessageSquare,
  Paperclip,
  Send,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Shield,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export default function SupportDeskPage() {
  const {
    getActiveBusiness,
    getActiveSupportTickets,
    addSupportTicket,
    replyToTicket,
    updateTicketStatus,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const tickets = getActiveSupportTickets();

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(tickets[0] || null);
  const [replyMessage, setReplyMessage] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New ticket state
  const [subject, setSubject] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    replyToTicket(selectedTicket.id, {
      id: `rep_${Date.now()}`,
      sender: 'business',
      senderName: business?.name || 'Support Desk',
      message: replyMessage.trim(),
      attachmentUrl: attachmentUrl.trim() || undefined,
      createdAt: new Date().toISOString(),
    });

    setReplyMessage('');
    setAttachmentUrl('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: `tick_${Date.now()}`,
      businessId: business.id,
      customerName: customerName || 'Valued Client',
      customerEmail: customerEmail || 'client@example.com',
      subject,
      message,
      status: 'open',
      priority,
      attachmentUrl: attachmentUrl.trim() || undefined,
      replies: [],
      createdAt: new Date().toISOString(),
    };

    addSupportTicket(newTicket);
    setSelectedTicket(newTicket);
    setShowNewTicketModal(false);
    setSubject('');
    setMessage('');
  };

  const openTickets = tickets.filter((t) => t.status === 'open').length;
  const inProgressTickets = tickets.filter((t) => t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-rose-500" />
            <span>Support & Customer Desk</span>
          </h1>
          <p className="text-sm text-slate-400">
            Communicate in realtime with clients, attach documentation, and manage service requests.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="btn-primary flex items-center gap-2 text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Support Thread</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Total Tickets</div>
          <div className="text-2xl font-black text-white mt-1">{tickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">All customer threads</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Open & Urgent</div>
          <div className="text-2xl font-black text-amber-400 mt-1">{openTickets}</div>
          <div className="text-[11px] text-amber-500/80 mt-0.5">Awaiting first response</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">In Progress</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{inProgressTickets}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Active conversation</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Resolved</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{resolvedTickets}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Closed successfully</div>
        </div>
      </div>

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          {tickets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
              No support tickets found. Tickets submitted from the Client Portal or generated by AI will appear here.
            </div>
          ) : (
            tickets.map((ticket) => {
              const isSelected = selectedTicket?.id === ticket.id;

              return (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.06] border-rose-500/50 shadow-lg'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        ticket.status === 'resolved'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : ticket.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-sm mt-2 line-clamp-1">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {ticket.message}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{ticket.customerName}</span>
                    </span>
                    <span className="text-rose-400 font-semibold">
                      {ticket.replies.length} replies
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Ticket Thread Panel */}
        <div className="lg:col-span-2">
          {selectedTicket ? (
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6 flex flex-col h-full">
              {/* Thread Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-white text-base">{selectedTicket.subject}</h2>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300">
                      {selectedTicket.priority} Priority
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    From: <strong className="text-white">{selectedTicket.customerName}</strong> ({selectedTicket.customerEmail})
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e: any) =>
                      updateTicketStatus(selectedTicket.id, e.target.value)
                    }
                    className="bg-black/50 border border-white/10 rounded-xl text-xs font-semibold px-3 py-1.5 text-slate-200"
                  >
                    <option value="open">Status: Open</option>
                    <option value="in_progress">Status: In Progress</option>
                    <option value="resolved">Status: Resolved</option>
                  </select>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {/* Initial customer message */}
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rose-400">{selectedTicket.customerName}</span>
                    <span className="text-slate-500">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.message}
                  </p>

                  {selectedTicket.attachmentUrl && (
                    <div className="pt-2">
                      <a
                        href={selectedTicket.attachmentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-slate-300 transition-colors"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-rose-400" />
                        <span>View Attached File / Image</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Replies */}
                {selectedTicket.replies.map((reply) => {
                  const isBusiness = reply.sender === 'business' || reply.sender === 'admin';

                  return (
                    <div
                      key={reply.id}
                      className={`p-4 rounded-2xl border space-y-2 ${
                        isBusiness
                          ? 'bg-rose-950/20 border-rose-500/20 ml-6'
                          : 'bg-white/[0.03] border-white/5 mr-6'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${isBusiness ? 'text-rose-300' : 'text-slate-300'}`}>
                          {reply.senderName} {isBusiness && '✓ (Staff)'}
                        </span>
                        <span className="text-slate-500">{new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {reply.message}
                      </p>

                      {reply.attachmentUrl && (
                        <div className="pt-2">
                          <a
                            href={reply.attachmentUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-rose-400" />
                            <span>Attachment</span>
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-white/10 space-y-3">
                <textarea
                  rows={3}
                  required
                  placeholder="Write your response to the customer..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="input-field w-full text-xs"
                />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-80">
                    <Paperclip className="w-4 h-4 text-slate-500" />
                    <input
                      type="url"
                      placeholder="Attach image or doc URL..."
                      value={attachmentUrl}
                      onChange={(e) => setAttachmentUrl(e.target.value)}
                      className="input-field text-[11px] py-1 px-2.5 w-full"
                    />
                  </div>

                  <button type="submit" className="btn-primary flex items-center justify-center gap-2 text-xs w-full sm:w-auto">
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
              Select a ticket on the left to view the thread.
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-rose-500" />
                <span>Create Support Thread</span>
              </h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Warranty coverage inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Client Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dalat Hussein"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Client Email</label>
                  <input
                    type="email"
                    required
                    placeholder="client@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Initial Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe the issue or inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Create Thread
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
