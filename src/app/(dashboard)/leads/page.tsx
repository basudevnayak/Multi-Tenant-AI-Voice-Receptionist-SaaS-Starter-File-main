'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { Lead, LeadStatus } from '@/types';
import {
  Search,
  Plus,
  PhoneCall,
  Sparkles,
  DollarSign,
} from 'lucide-react';

export default function LeadsPage() {
  const { getActiveBusiness, getActiveLeads, addLead, updateLead } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const leads = getActiveLeads();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);

  // Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [budget, setBudget] = useState('');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [score, setScore] = useState(75);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.interest && lead.interest.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      businessId: business.id,
      name,
      phone,
      email,
      interest,
      budget,
      status,
      score,
      source: 'Admin CRM Portal',
      aiSummary: `Captured via CRM. Interested in ${interest || 'services'}.`,
      lastContactAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addLead(newLead);
    setName('');
    setPhone('');
    setEmail('');
    setInterest('');
    setBudget('');
    setShowModal(false);
  };

  const getStatusBadge = (st: LeadStatus) => {
    switch (st) {
      case 'qualified':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30';
      case 'tour_scheduled':
        return 'bg-blue-950/50 text-blue-300 border-blue-500/30';
      case 'follow_up':
        return 'bg-amber-950/50 text-amber-300 border-amber-500/30';
      case 'converted':
        return 'bg-purple-950/50 text-purple-300 border-purple-500/30';
      case 'lost':
        return 'bg-rose-950/50 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="CRM Leads & Caller Pipeline"
        subtitle={`Qualified prospects and automated follow-ups for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card-surface p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search leads by name, phone, or interest..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="input-field w-auto capitalize"
            >
              <option value="all">All Stages</option>
              <option value="new">New</option>
              <option value="qualified">Qualified</option>
              <option value="tour_scheduled">Tour / Visit Scheduled</option>
              <option value="follow_up">Follow Up Needed</option>
              <option value="converted">Converted / Won</option>
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Leads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLeads.length === 0 ? (
            <div className="col-span-full text-center py-16 card-surface text-xs text-slate-500">
              No CRM leads match your criteria.
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                className="card-surface p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                        {lead.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {lead.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          {lead.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`badge uppercase ${getStatusBadge(
                          lead.status
                        )}`}
                      >
                        {lead.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400">
                        Score: {lead.score}/100
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#141926] space-y-2 text-xs">
                    {lead.interest && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Interest:
                        </span>
                        <span className="font-bold text-rose-400">
                          {lead.interest}
                        </span>
                      </div>
                    )}

                    {lead.budget && (
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                        <span>Budget: <strong>{lead.budget}</strong></span>
                      </div>
                    )}

                    {lead.aiSummary && (
                      <div className="pt-2 border-t border-white/5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-0.5">
                          <Sparkles className="w-3 h-3 text-rose-400" />
                          AI Conversation Notes:
                        </span>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          {lead.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openCallModal(undefined, business?.id)}
                    className="btn-primary flex-1 py-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>AI Outbound Call</span>
                  </button>

                  <select
                    value={lead.status}
                    onChange={(e) =>
                      updateLead(lead.id, { status: e.target.value as LeadStatus })
                    }
                    className="px-2.5 py-2 bg-[#07090e] border border-white/10 rounded-xl text-[11px] font-bold text-slate-200 capitalize"
                  >
                    <option value="new">New</option>
                    <option value="qualified">Qualified</option>
                    <option value="tour_scheduled">Tour Scheduled</option>
                    <option value="follow_up">Follow Up</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add Lead Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">
                Add New Prospect / Lead
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Record a lead into {business?.name}&apos;s CRM pipeline.
              </p>

              <form onSubmit={handleCreateLead} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Prospect Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alice Cooper"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-9988"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alice@mail.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Interest / Target Service
                  </label>
                  <input
                    type="text"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    placeholder="e.g. Bel Air Luxury Villa, Annual Checkup"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Pipeline Stage
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as LeadStatus)}
                      className="input-field capitalize"
                    >
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="tour_scheduled">Tour Scheduled</option>
                      <option value="follow_up">Follow Up</option>
                      <option value="converted">Converted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Lead Score (1-100)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value) || 50)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2.5"
                  >
                    Save Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
