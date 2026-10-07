'use client';

import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import Link from 'next/link';
import {
  PhoneCall,
  CalendarDays,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Bot,
  Plus,
  Play,
  Building2,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const {
    getActiveBusiness,
    getActiveAgents,
    getActiveCalls,
    getActiveAppointments,
    getActiveLeads,
  } = useBusinessStore();

  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();
  const calls = getActiveCalls();
  const appointments = getActiveAppointments();
  const leads = getActiveLeads();

  const totalCalls = calls.length;
  const confirmedAppointments = appointments.filter((a) => a.status === 'confirmed').length;
  const qualifiedLeads = leads.filter((l) => l.status === 'qualified' || l.status === 'tour_scheduled').length;

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title={`${business?.name || 'Business'} Dashboard`}
        subtitle="Real-time multi-tenant voice receptionist analytics and autonomous calling overview"
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Banner with Glowing Crimson Theme */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#120a14] via-[#1a0c16] to-[#0e121c] text-white p-6 shadow-2xl border border-rose-500/20">
          <div className="absolute inset-0 ecg-line opacity-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-bold uppercase tracking-wider border border-rose-500/30">
                  {business?.industry?.replace('_', ' ') || 'Multi-Tenant'} Ready
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-rose-400" />
                  Direct Line: <strong className="text-white">{business?.phoneNumber}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white">
                AI Voice Receptionist Active & Standing By
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-1">
                Your AI agent <strong className="text-white">{agents[0]?.name || 'Dr. Maya'}</strong> is answering customer calls, booking appointments automatically, and qualifying CRM leads 24/7.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => openCallModal(agents[0]?.id, business?.id)}
                className="btn-primary"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Test Live AI Call</span>
              </button>

              {business?.slug && (
                <Link
                  href={`/sites/${business.slug}`}
                  target="_blank"
                  className="btn-secondary"
                >
                  <span>Public Portal</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Total Calls Handled
              </span>
              <div className="p-2 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {totalCalls}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>98.4% automated resolution</span>
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Appointments Booked
              </span>
              <div className="p-2 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20">
                <CalendarDays className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {confirmedAppointments}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <span>{appointments.length} total appointments</span>
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                CRM Leads Qualified
              </span>
              <div className="p-2 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {qualifiedLeads}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-rose-400 font-semibold mt-1">
              <span>{leads.length} active prospects</span>
            </div>
          </div>

          <div className="stat-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">
                Monthly Voice Quota
              </span>
              <div className="p-2 rounded-xl bg-rose-600/10 text-rose-400 border border-rose-500/20">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-white mt-2">
              {business?.minutesUsed || 0}{' '}
              <span className="text-xs font-normal text-slate-400">/ {business?.minutesLimit}m</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    ((business?.minutesUsed || 0) / (business?.minutesLimit || 1000)) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Call Logs & Upcoming Appointments */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Calls Feed */}
          <div className="lg:col-span-2 card-surface p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Recent AI Call Transcripts & Outcomes
                </h3>
                <p className="text-xs text-slate-400">
                  Live dialogue transcripts, sentiment tags, and auto-executed tools
                </p>
              </div>
              <Link
                href="/calls"
                className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px]">
              {calls.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No call logs yet. Click &quot;Test Live AI Call&quot; above to simulate a live call.
                </div>
              ) : (
                calls.slice(0, 5).map((call) => (
                  <div
                    key={call.id}
                    className="p-3.5 rounded-2xl bg-[#141926] border border-white/5 hover:border-rose-500/40 transition-all flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center text-xs font-bold">
                          {call.callerName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{call.callerName}</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              ({call.callerPhone})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(call.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}{' '}
                            • Duration: {call.durationSeconds}s
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`badge ${
                            call.sentiment === 'positive'
                              ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                              : 'bg-white/5 text-slate-300 border-white/10'
                          }`}
                        >
                          {call.sentiment}
                        </span>
                        <span className="badge bg-rose-950/50 text-rose-300 border-rose-500/30">
                          {call.outcome}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 bg-[#0e121c] p-2.5 rounded-xl border border-white/5">
                      {call.aiSummary}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Appointments Calendar Preview */}
          <div className="card-surface p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Upcoming Appointments
                </h3>
                <p className="text-xs text-slate-400">
                  Booked via AI Voice Receptionist
                </p>
              </div>
              <Link
                href="/appointments"
                className="text-xs font-bold text-rose-400 hover:underline"
              >
                Calendar
              </Link>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px]">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No appointments scheduled.
                </div>
              ) : (
                appointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-[#141926] border border-white/5 flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">
                        {apt.customerName}
                      </span>
                      <span className="badge bg-emerald-950/50 text-emerald-300 border-emerald-500/30 uppercase">
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-rose-400">
                      {apt.serviceName || 'Consultation'}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(apt.startTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    {apt.notes && (
                      <div className="text-[11px] text-slate-400 italic">
                        &quot;{apt.notes}&quot;
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* AI Calling Agents Grid */}
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">
                Active AI Voice Receptionists ({agents.length})
              </h3>
              <p className="text-xs text-slate-400">
                Configured autonomous voice agents and outbound dialers for {business?.name}
              </p>
            </div>
            <Link
              href="/agents"
              className="btn-secondary"
            >
              <Plus className="w-3.5 h-3.5" />
              Manage Agents
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 rounded-2xl border border-white/5 bg-[#141926] hover:border-rose-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          {agent.name}
                        </div>
                        <div className="text-[10px] text-slate-400 capitalize">
                          {agent.type} AI • Voice: {agent.voiceId}
                        </div>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 bg-[#0e121c] p-2.5 rounded-xl border border-white/5">
                    {agent.greetingMessage}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    Max: {Math.floor(agent.maxCallDurationSeconds / 60)} mins
                  </span>
                  <button
                    onClick={() => openCallModal(agent.id, business?.id)}
                    className="btn-primary"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Test Voice
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
