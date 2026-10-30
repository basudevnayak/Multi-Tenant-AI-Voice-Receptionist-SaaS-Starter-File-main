'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import {
  ShieldCheck,
  Building,
  Users,
  CreditCard,
  PhoneCall,
  Calendar,
  Layers,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Settings,
  Sparkles,
  Bot,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  FileText,
  ExternalLink,
  ShieldAlert,
  ArrowRight,
  Eye,
  Lock,
  Unlock,
} from 'lucide-react';
import Link from 'next/link';

export default function SuperAdminDashboard() {
  const {
    businesses,
    agents,
    calls,
    appointments,
    appeals,
    suspendedBusinessIds,
    updateBusiness,
    suspendBusiness,
    reactivateBusiness,
    resolveAppeal,
  } = useBusinessStore();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'businesses'
    | 'users'
    | 'appeals'
    | 'subscriptions'
    | 'agents'
    | 'calls'
    | 'appointments'
    | 'system'
  >('overview');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Suspension Modal State
  const [suspensionTargetId, setSuspensionTargetId] = useState<string | null>(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [suspensionMessage, setSuspensionMessage] = useState('');

  // Appeal Action Modal
  const [selectedAppeal, setSelectedAppeal] = useState<any | null>(null);
  const [appealAdminNotes, setAppealAdminNotes] = useState('');

  // SaaS Global Metrics
  const totalBusinesses = businesses.length;
  const totalCalls = calls.length;
  const totalAppointments = appointments.length;
  const totalAgents = agents.length;
  const activeSubs = businesses.filter((b) => b.plan !== 'starter').length;
  const totalMRR =
    businesses.reduce((acc, curr) => {
      if (curr.plan === 'enterprise') return acc + 199;
      if (curr.plan === 'pro') return acc + 49;
      return acc;
    }, 0) + (businesses.length * 29); // include website subscriptions

  const handleConfirmSuspension = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspensionTargetId) return;

    suspendBusiness(suspensionTargetId, suspensionReason || 'Terms violation / rate limit exceeded');
    setSuspensionTargetId(null);
    setSuspensionReason('');
    setSuspensionMessage('');
    alert('Business account has been suspended. Client access is restricted to Appeal submission.');
  };

  const handleApproveAppeal = (appealId: string) => {
    resolveAppeal(appealId, 'approved', appealAdminNotes || 'Appeal approved by super admin');
    alert('Appeal approved! Business account has been restored to active status.');
    setSelectedAppeal(null);
  };

  const handleRejectAppeal = (appealId: string) => {
    resolveAppeal(appealId, 'rejected', appealAdminNotes || 'Appeal rejected');
    alert('Appeal rejected.');
    setSelectedAppeal(null);
  };

  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white">
      {/* Super Admin Top Header */}
      <header className="h-16 bg-[#0a0e14]/90 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center font-bold text-sm shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight flex items-center gap-2">
                <span>CallFlow AI Super Admin</span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 font-semibold border border-red-500/30">
                  Global SaaS Provider
                </span>
              </div>
              <div className="text-[11px] text-slate-400">thechaincoders@gmail.com (Master Access)</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              <Building className="w-3.5 h-3.5 text-rose-400" />
              <span>Tenant View</span>
            </Link>
            <Link
              href="/portal"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Client Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-6">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="stat-card">
            <div className="text-xs text-slate-400 font-medium">Monthly Recurring (MRR)</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">${totalMRR}</div>
            <div className="text-[11px] text-emerald-500/80 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+24% this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="text-xs text-slate-400 font-medium">Registered Businesses</div>
            <div className="text-2xl font-black text-white mt-1">{totalBusinesses}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{activeSubs} Paid Subscriptions</div>
          </div>

          <div className="stat-card">
            <div className="text-xs text-slate-400 font-medium">Active AI Voice Agents</div>
            <div className="text-2xl font-black text-rose-400 mt-1">{totalAgents}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Across all tenants</div>
          </div>

          <div className="stat-card">
            <div className="text-xs text-slate-400 font-medium">Global AI Calls</div>
            <div className="text-2xl font-black text-blue-400 mt-1">{totalCalls}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">100% Speech recognition</div>
          </div>

          <div className="stat-card">
            <div className="text-xs text-slate-400 font-medium">Total Bookings</div>
            <div className="text-2xl font-black text-purple-400 mt-1">{totalAppointments}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Scheduled appointments</div>
          </div>
        </div>

        {/* Super Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-white/10 pb-3">
          {[
            { id: 'overview', label: 'SaaS Overview', icon: Activity },
            { id: 'businesses', label: `Businesses (${businesses.length})`, icon: Building },
            { id: 'users', label: 'User Control & Suspend', icon: Users },
            { id: 'appeals', label: `Appeals (${appeals.filter((a) => a.status === 'pending').length})`, icon: AlertTriangle },
            { id: 'subscriptions', label: 'Subscriptions & MRR', icon: CreditCard },
            { id: 'agents', label: `Global Agents (${agents.length})`, icon: Bot },
            { id: 'calls', label: `Calls (${calls.length})`, icon: PhoneCall },
            { id: 'appointments', label: `Appointments (${appointments.length})`, icon: Calendar },
            { id: 'system', label: 'System Config', icon: Settings },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;

            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                    : 'bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tenant Table */}
              <div className="lg:col-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Building className="w-5 h-5 text-rose-500" />
                  <span>Recent Business Onboardings</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-slate-400">
                        <th className="pb-3 font-semibold">Business Name</th>
                        <th className="pb-3 font-semibold">Industry</th>
                        <th className="pb-3 font-semibold">Plan</th>
                        <th className="pb-3 font-semibold">Minutes</th>
                        <th className="pb-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {businesses.map((b) => {
                        const isSuspended = suspendedBusinessIds.includes(b.id);

                        return (
                          <tr key={b.id} className="hover:bg-white/[0.02]">
                            <td className="py-3 font-bold text-white">
                              <div>{b.name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">/{b.slug}</div>
                            </td>
                            <td className="py-3 capitalize text-slate-300">{b.industry.replace('_', ' ')}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 rounded uppercase font-bold text-[10px] bg-rose-500/20 text-rose-300">
                                {b.plan}
                              </span>
                            </td>
                            <td className="py-3 text-slate-300">
                              {b.minutesUsed} / {b.minutesLimit}m
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                                  isSuspended
                                    ? 'bg-red-500/20 text-red-400'
                                    : 'bg-emerald-500/20 text-emerald-400'
                                }`}
                              >
                                {isSuspended ? 'Suspended' : 'Active'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Activity Stream */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <span>Realtime SaaS Feed</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-400">Appointment Booked</span>
                      <span className="text-[10px] text-slate-500">2m ago</span>
                    </div>
                    <div className="text-slate-300">Dalat Hussein booked Wheel Alignment at CarFix</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-400">AI Voice Call Completed</span>
                      <span className="text-[10px] text-slate-500">12m ago</span>
                    </div>
                    <div className="text-slate-300">Agent Rex answered 1m 45s caller inquiry</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-400">Website Builder Published</span>
                      <span className="text-[10px] text-slate-500">1h ago</span>
                    </div>
                    <div className="text-slate-300">St. Jude Regional Clinic updated theme to Glass</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base">All Tenant Businesses</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {businesses.map((b) => {
                const isSuspended = suspendedBusinessIds.includes(b.id);
                const bAgents = agents.filter((a) => a.businessId === b.id);

                return (
                  <div
                    key={b.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-base">{b.name}</h4>
                        <div className="text-xs text-rose-400 font-mono mt-0.5">/sites/{b.slug}</div>
                        <div className="text-xs text-slate-400 mt-1 capitalize">
                          Industry: {b.industry.replace('_', ' ')}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {isSuspended ? 'Suspended' : 'Live'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                      <div>
                        <div className="text-slate-500">Plan</div>
                        <div className="font-bold text-white uppercase">{b.plan}</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Agents</div>
                        <div className="font-bold text-rose-400">{bAgents.length} Active</div>
                      </div>
                      <div>
                        <div className="text-slate-500">Voice Usage</div>
                        <div className="font-bold text-emerald-400">{b.minutesUsed}m</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                      <select
                        value={b.plan}
                        onChange={(e: any) => updateBusiness(b.id, { plan: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg text-xs font-semibold px-2 py-1 text-slate-200"
                      >
                        <option value="starter">Starter ($0)</option>
                        <option value="pro">Pro ($49)</option>
                        <option value="enterprise">Enterprise ($199)</option>
                      </select>

                      <div className="flex items-center gap-2">
                        {isSuspended ? (
                          <button
                            onClick={() => reactivateBusiness(b.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold transition-colors flex items-center gap-1"
                          >
                            <Unlock className="w-3 h-3" />
                            <span>Reactivate</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSuspensionTargetId(b.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold transition-colors flex items-center gap-1"
                          >
                            <Lock className="w-3 h-3" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Users Control & Suspension Tab */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base">User Accounts & Access Permissions</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-400">
                    <th className="pb-3 font-semibold">User Email</th>
                    <th className="pb-3 font-semibold">Associated Business</th>
                    <th className="pb-3 font-semibold">Role</th>
                    <th className="pb-3 font-semibold">Account State</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {businesses.map((b) => {
                    const isSuspended = suspendedBusinessIds.includes(b.id);

                    return (
                      <tr key={b.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 font-semibold text-white">{b.email || 'thechaincoders@gmail.com'}</td>
                        <td className="py-3 text-slate-300">{b.name}</td>
                        <td className="py-3 text-slate-400">Tenant Owner</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                              isSuspended ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {isSuspended ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3">
                          {isSuspended ? (
                            <button
                              onClick={() => reactivateBusiness(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold"
                            >
                              Unlock User
                            </button>
                          ) : (
                            <button
                              onClick={() => setSuspensionTargetId(b.id)}
                              className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold"
                            >
                              Suspend User
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. Appeals Review Tab */}
        {activeTab === 'appeals' && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Suspension Appeals & Identity Documents</span>
            </h3>

            {appeals.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No appeals submitted.
              </div>
            ) : (
              <div className="space-y-4">
                {appeals.map((appeal) => (
                  <div
                    key={appeal.id}
                    className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-base">{appeal.businessName}</div>
                        <div className="text-xs text-slate-400">
                          Submitted by: <strong className="text-slate-200">{appeal.userEmail}</strong> •{' '}
                          {new Date(appeal.submittedAt).toLocaleString()}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${
                          appeal.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : appeal.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {appeal.status}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-slate-200 leading-relaxed">
                      <strong>Caller / Owner Statement:</strong>
                      <div className="mt-1 text-slate-300">"{appeal.reason}"</div>
                    </div>

                    {appeal.documentUrl && (
                      <div className="pt-1">
                        <a
                          href={appeal.documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-rose-400 font-semibold border border-white/10"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Verification Document</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}

                    {appeal.status === 'pending' && (
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                        <button
                          onClick={() => handleRejectAppeal(appeal.id)}
                          className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
                        >
                          Decline Appeal
                        </button>
                        <button
                          onClick={() => handleApproveAppeal(appeal.id)}
                          className="btn-primary text-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                          <span>Approve & Restore Business</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-base">SaaS Subscription Plans & Pricing Model</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="font-bold text-white text-base">Free Starter</div>
                <div className="text-2xl font-black text-white">$0 <span className="text-xs text-slate-500">/mo</span></div>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• 1 Active AI Voice Agent</li>
                  <li>• Up to 5 Appointments/mo</li>
                  <li>• Basic CRM & Analytics</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/40 to-black/40 border border-rose-500/30 space-y-3 shadow-xl">
                <div className="font-bold text-rose-400 text-base">Professional Plan</div>
                <div className="text-2xl font-black text-white">$49 <span className="text-xs text-slate-500">/mo</span></div>
                <ul className="text-xs text-slate-300 space-y-1">
                  <li>• Up to 10 AI Voice Agents</li>
                  <li>• 100 Appointments/mo</li>
                  <li>• Multilingual 60+ Languages</li>
                  <li>• Full Support Desk Access</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <div className="font-bold text-white text-base">Enterprise Agency</div>
                <div className="text-2xl font-black text-white">$199 <span className="text-xs text-slate-500">/mo</span></div>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>• Unlimited AI Agents</li>
                  <li>• Unlimited Appointments</li>
                  <li>• White-Label Website Builder Included</li>
                  <li>• Dedicated Super Support Line</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 6. System Config Tab */}
        {activeTab === 'system' && (
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Settings className="w-5 h-5 text-rose-500" />
              <span>Platform System Infrastructure</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="font-semibold text-white">OpenAI Realtime Voice API</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>WebRTC & Audio Stream Online</span>
                </div>
                <div className="text-slate-400 text-[11px]">Model: gpt-4o-realtime-preview</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="font-semibold text-white">Stripe Payment Gateway</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Test Mode Configured</span>
                </div>
                <div className="text-slate-400 text-[11px]">Auto deposit & billing active</div>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="font-semibold text-white">Resend Email Gateway</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Operational</span>
                </div>
                <div className="text-slate-400 text-[11px]">Instant booking receipts enabled</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Account Suspension Modal */}
      {suspensionTargetId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <h3 className="font-bold text-white text-base flex items-center gap-2 text-red-400">
              <ShieldAlert className="w-5 h-5" />
              <span>Suspend Business Account</span>
            </h3>

            <form onSubmit={handleConfirmSuspension} className="space-y-3">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reason for Suspension</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Excessive call volume violation"
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Notice to display to tenant</label>
                <textarea
                  rows={3}
                  placeholder="Your account has been restricted pending verification..."
                  value={suspensionMessage}
                  onChange={(e) => setSuspensionMessage(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspensionTargetId(null)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold transition-colors"
                >
                  Confirm Suspension
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
