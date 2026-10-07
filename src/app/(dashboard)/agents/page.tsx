'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { Agent, AgentType, VoiceId } from '@/types';
import {
  Bot,
  Plus,
  Play,
  Settings2,
  Trash2,
  CalendarCheck,
} from 'lucide-react';

export default function AgentsPage() {
  const { getActiveBusiness, getActiveAgents, addAgent, updateAgent, deleteAgent } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();

  const [showModal, setShowModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Front Desk AI Receptionist');
  const [type, setType] = useState<AgentType>('inbound');
  const [voiceId, setVoiceId] = useState<VoiceId>('alloy');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [forwardingPhone, setForwardingPhone] = useState('');
  const [autoBookAppointments, setAutoBookAppointments] = useState(true);
  const [collectLeadInfo, setCollectLeadInfo] = useState(true);

  const handleOpenAdd = () => {
    setEditingAgent(null);
    setName(`${business?.name || 'Business'} Receptionist`);
    setRole('Front Desk AI Receptionist');
    setType('inbound');
    setVoiceId('alloy');
    setVoiceSpeed(1.0);
    setVoicePitch(1.0);
    setGreetingMessage(
      `Thank you for calling ${business?.name || 'our office'}. My name is Maya, your AI assistant. How may I assist you today?`
    );
    setSystemPrompt(
      `You are an empathetic, articulate AI voice receptionist for ${business?.name}. You answer inquiries, book appointments, and collect customer details.`
    );
    setForwardingPhone(business?.phoneNumber || '');
    setAutoBookAppointments(true);
    setCollectLeadInfo(true);
    setShowModal(true);
  };

  const handleOpenEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setName(agent.name);
    setRole(agent.role);
    setType(agent.type);
    setVoiceId(agent.voiceId);
    setVoiceSpeed(agent.voiceSpeed);
    setVoicePitch(agent.voicePitch);
    setGreetingMessage(agent.greetingMessage);
    setSystemPrompt(agent.systemPrompt);
    setForwardingPhone(agent.forwardingPhone || '');
    setAutoBookAppointments(agent.autoBookAppointments);
    setCollectLeadInfo(agent.collectLeadInfo);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    if (editingAgent) {
      updateAgent(editingAgent.id, {
        name,
        role,
        type,
        voiceId,
        voiceSpeed,
        voicePitch,
        greetingMessage,
        systemPrompt,
        forwardingPhone,
        autoBookAppointments,
        collectLeadInfo,
      });
    } else {
      const newAgent: Agent = {
        id: `agent_${Date.now()}`,
        businessId: business.id,
        name,
        role,
        type,
        voiceId,
        voiceSpeed,
        voicePitch,
        greetingMessage,
        systemPrompt,
        status: 'active',
        forwardingPhone,
        maxCallDurationSeconds: 600,
        autoBookAppointments,
        collectLeadInfo,
        createdAt: new Date().toISOString(),
      };
      addAgent(newAgent);
    }

    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="AI Voice Agents & Calling Bots"
        subtitle={`Configure autonomous voice agents for ${business?.name || 'your business'}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 card-surface p-5">
          <div>
            <h2 className="text-base font-bold text-white">
              Tenant AI Agents ({agents.length})
            </h2>
            <p className="text-xs text-slate-400">
              Each agent has distinct voice personas, system prompts, and calling capabilities.
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            Create AI Agent
          </button>
        </div>

        {/* Agents List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="card-surface p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-slate-400">{agent.role}</p>
                    </div>
                  </div>

                  <span
                    className={`badge ${
                      agent.status === 'active'
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 border-white/10'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141926] text-slate-300">
                    <span className="text-slate-400">Direction / Type:</span>
                    <span className="font-bold capitalize text-rose-400">
                      {agent.type} Calling
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#141926] text-slate-300">
                    <span className="text-slate-400">Voice Persona:</span>
                    <span className="font-bold capitalize">{agent.voiceId} ({agent.voiceSpeed}x)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#141926] text-slate-300">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Greeting Message:
                    </span>
                    <p className="italic line-clamp-2">&quot;{agent.greetingMessage}&quot;</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Auto-Bookings Active</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                <button
                  onClick={() => openCallModal(agent.id, business?.id)}
                  className="btn-primary flex-1 py-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Test Voice Call
                </button>

                <button
                  onClick={() => handleOpenEdit(agent)}
                  className="p-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl transition-colors border border-white/5"
                  title="Edit Agent"
                >
                  <Settings2 className="w-4 h-4" />
                </button>

                {agents.length > 1 && (
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="p-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 rounded-xl transition-colors border border-rose-500/30"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Create / Edit AI Agent */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-white mb-1">
                {editingAgent ? 'Edit AI Voice Agent' : 'Create New AI Calling Agent'}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Customize persona, voice model synthesis, system knowledge prompt, and tool integration.
              </p>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Agent Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sophia Luxury Concierge"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Role Title
                    </label>
                    <input
                      type="text"
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. VIP Showing Concierge"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Call Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as AgentType)}
                      className="input-field"
                    >
                      <option value="inbound">Inbound Receptionist</option>
                      <option value="outbound">Outbound Follow-Up</option>
                      <option value="hybrid">Hybrid (Both)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Voice Persona
                    </label>
                    <select
                      value={voiceId}
                      onChange={(e) => setVoiceId(e.target.value as VoiceId)}
                      className="input-field"
                    >
                      <option value="alloy">Alloy (Warm & Professional)</option>
                      <option value="echo">Echo (Authoritative & Clear)</option>
                      <option value="fable">Fable (Friendly & Calming)</option>
                      <option value="onyx">Onyx (Deep & Confident)</option>
                      <option value="nova">Nova (Energetic & Sharp)</option>
                      <option value="shimmer">Shimmer (Upscale & Reassuring)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Voice Speed ({voiceSpeed}x)
                    </label>
                    <input
                      type="range"
                      min="0.8"
                      max="1.3"
                      step="0.05"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full mt-2 accent-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Greeting Message (Spoken when call starts)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={greetingMessage}
                    onChange={(e) => setGreetingMessage(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    System Instructions & Behavior Prompt
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="input-field font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Human Fallback Transfer Phone Number
                  </label>
                  <input
                    type="text"
                    value={forwardingPhone}
                    onChange={(e) => setForwardingPhone(e.target.value)}
                    placeholder="+1 (800) 555-0100"
                    className="input-field"
                  />
                </div>

                <div className="flex gap-4 pt-2 text-slate-300">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoBookAppointments}
                      onChange={(e) => setAutoBookAppointments(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Auto-Book Appointments to Calendar</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={collectLeadInfo}
                      onChange={(e) => setCollectLeadInfo(e.target.checked)}
                      className="rounded text-rose-600 focus:ring-rose-500"
                    />
                    <span>Capture CRM Lead Contact Info</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/5">
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
                    {editingAgent ? 'Save Changes' : 'Create Agent'}
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
