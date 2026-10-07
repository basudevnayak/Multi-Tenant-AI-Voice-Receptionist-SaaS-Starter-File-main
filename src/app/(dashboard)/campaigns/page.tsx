'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { Campaign } from '@/types';
import {
  Plus,
  Play,
  Clock,
  PhoneCall,
  CalendarCheck,
  Bot,
} from 'lucide-react';

export default function CampaignsPage() {
  const {
    getActiveBusiness,
    getActiveCampaigns,
    getActiveAgents,
    addCampaign,
    updateCampaign,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const campaigns = getActiveCampaigns();
  const agents = getActiveAgents();

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [agentId, setAgentId] = useState(agents[0]?.id || '');
  const [totalLeads, setTotalLeads] = useState(50);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const newCamp: Campaign = {
      id: `camp_${Date.now()}`,
      businessId: business.id,
      agentId: agentId || agents[0]?.id,
      name,
      description,
      status: 'scheduled',
      totalLeads,
      callsCompleted: 0,
      appointmentsBooked: 0,
      scheduledFor: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    addCampaign(newCamp);
    setName('');
    setDescription('');
    setShowModal(false);
  };

  const handleSimulateRun = (camp: Campaign) => {
    updateCampaign(camp.id, {
      status: 'running',
      callsCompleted: Math.min(camp.totalLeads, camp.callsCompleted + 5),
      appointmentsBooked: camp.appointmentsBooked + 2,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Outbound AI Calling Campaigns"
        subtitle={`Automated follow-ups, appointment recall, and outreach bots for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-surface p-5">
          <div>
            <h2 className="text-base font-bold text-white">
              Outbound Campaigns ({campaigns.length})
            </h2>
            <p className="text-xs text-slate-400">
              Launch autonomous AI voice agents to call contact lists and book appointments.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>

        {/* Campaign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {campaigns.length === 0 ? (
            <div className="col-span-full text-center py-16 card-surface text-xs text-slate-500">
              No outbound campaigns created yet.
            </div>
          ) : (
            campaigns.map((camp) => {
              const assignedAgent = agents.find((a) => a.id === camp.agentId) || agents[0];
              const progress = Math.min(
                100,
                Math.round((camp.callsCompleted / (camp.totalLeads || 1)) * 100)
              );

              return (
                <div
                  key={camp.id}
                  className="card-surface p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">
                          {camp.name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">{camp.description}</p>
                      </div>

                      <span
                        className={`badge uppercase ${
                          camp.status === 'running'
                            ? 'bg-rose-950/50 text-rose-300 border-rose-500/40 animate-pulse'
                            : camp.status === 'completed'
                            ? 'bg-blue-950/50 text-blue-300 border-blue-500/30'
                            : 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#141926] space-y-3 text-xs my-4">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-rose-400" />
                          <span>Assigned Agent:</span>
                        </span>
                        <strong className="text-white">
                          {assignedAgent?.name || 'Dr. Maya'}
                        </strong>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="text-slate-400">Progress</span>
                          <span className="font-bold text-white">
                            {camp.callsCompleted} / {camp.totalLeads} calls ({progress}%)
                          </span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-rose-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <PhoneCall className="w-4 h-4 text-emerald-400" />
                          <div>
                            <div className="text-[10px] text-slate-400">Completed</div>
                            <div className="font-bold text-white">
                              {camp.callsCompleted}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <CalendarCheck className="w-4 h-4 text-rose-400" />
                          <div>
                            <div className="text-[10px] text-slate-400">Bookings</div>
                            <div className="font-bold text-white">
                              {camp.appointmentsBooked}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Created {new Date(camp.createdAt).toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleSimulateRun(camp)}
                      className="btn-primary py-2 text-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Next Calls</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Create Campaign */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">
                Create Outbound AI Campaign
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Schedule bulk autonomous calling for {business?.name}.
              </p>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. VIP Showing Recall, Annual Checkup"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Campaign Purpose / Description
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what the AI will call to say..."
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Assigned Agent
                    </label>
                    <select
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="input-field"
                    >
                      {agents.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.voiceId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Total Contacts
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="1000"
                      value={totalLeads}
                      onChange={(e) => setTotalLeads(parseInt(e.target.value) || 20)}
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
                    Launch Campaign
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
