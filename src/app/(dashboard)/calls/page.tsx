'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { CallLog } from '@/types';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Sparkles,
  Play,
  CheckCircle2,
  FileText,
  Volume2,
} from 'lucide-react';

export default function CallsPage() {
  const { getActiveBusiness, getActiveCalls } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const calls = getActiveCalls();

  const [selectedCall, setSelectedCall] = useState<CallLog | null>(calls[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.callerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.callerPhone.includes(searchQuery) ||
      call.aiSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSentiment =
      filterSentiment === 'all' || call.sentiment === filterSentiment;

    return matchesSearch && matchesSentiment;
  });

  const handleSimulatePlay = () => {
    setIsPlayingAudio(true);
    setTimeout(() => setIsPlayingAudio(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Call History & Live Dialog Transcripts"
        subtitle={`Inspect automated conversations, call recordings, and AI outcomes for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card-surface p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by caller, phone, or summary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterSentiment}
              onChange={(e) => setFilterSentiment(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive Sentiment</option>
              <option value="neutral">Neutral Sentiment</option>
              <option value="negative">Negative Sentiment</option>
            </select>

            <button
              onClick={() => openCallModal()}
              className="btn-primary"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Simulate Call</span>
            </button>
          </div>
        </div>

        {/* Two-Pane Layout: Call Logs Table & Transcript Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calls List */}
          <div className="lg:col-span-5 card-surface p-4 space-y-2 max-h-[650px] overflow-y-auto">
            <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Calls ({filteredCalls.length})
            </div>

            {filteredCalls.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-500">
                No matching calls found.
              </div>
            ) : (
              filteredCalls.map((call) => {
                const isSelected = selectedCall?.id === call.id;
                return (
                  <div
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-950/30 border-rose-500 shadow-md shadow-rose-950/40'
                        : 'bg-[#141926] border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {call.direction === 'inbound' ? (
                          <div className="p-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/20">
                            <PhoneIncoming className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/20">
                            <PhoneOutgoing className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div>
                          <div className="text-xs font-bold text-white">
                            {call.callerName}
                          </div>
                          <div className="text-[10px] text-slate-400">{call.callerPhone}</div>
                        </div>
                      </div>

                      <span
                        className={`badge ${
                          call.sentiment === 'positive'
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border-white/10'
                        }`}
                      >
                        {call.sentiment}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-300 line-clamp-2 mt-1">
                      {call.aiSummary}
                    </p>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[10px] text-slate-400">
                      <span>{new Date(call.createdAt).toLocaleDateString()}</span>
                      <span>Duration: {call.durationSeconds}s</span>
                      <span className="font-bold text-rose-400">
                        {call.outcome}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Transcript Inspector Pane */}
          <div className="lg:col-span-7 card-surface p-6 flex flex-col justify-between max-h-[650px] overflow-y-auto">
            {selectedCall ? (
              <div className="space-y-5">
                {/* Call Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">
                        {selectedCall.callerName}
                      </h3>
                      <span className="text-xs text-slate-400">({selectedCall.callerPhone})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Handled by: <strong className="text-rose-400">{selectedCall.agentName || 'AI Receptionist'}</strong> •{' '}
                      {new Date(selectedCall.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSimulatePlay}
                      className={`btn-secondary text-xs ${
                        isPlayingAudio
                          ? 'bg-rose-950 text-rose-300 border-rose-500'
                          : ''
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                          <span>Playing Audio...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Audio Log</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* AI Executive Summary Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-[#120a14] to-[#07090e] border border-rose-500/30">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-300 mb-1">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>AI Call Summary & Tool Actions</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {selectedCall.aiSummary}
                  </p>
                  {selectedCall.actionTaken && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{selectedCall.actionTaken}</span>
                    </div>
                  )}
                </div>

                {/* Turn-by-Turn Dialog */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-rose-400" />
                    <span>Turn-by-Turn Dialog Transcript</span>
                  </div>

                  <div className="space-y-3 bg-[#07090e] p-4 rounded-2xl border border-white/5 max-h-[300px] overflow-y-auto">
                    {selectedCall.transcript.map((entry, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 text-xs leading-relaxed ${
                          entry.speaker === 'ai' ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        {entry.speaker === 'ai' && (
                          <div className="w-6 h-6 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                            AI
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl ${
                            entry.speaker === 'ai'
                              ? 'bg-[#141926] text-slate-200 border border-white/10 shadow-sm'
                              : 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md'
                          }`}
                        >
                          <div className="text-[10px] opacity-75 font-bold mb-0.5">
                            {entry.speaker === 'ai' ? selectedCall.agentName || 'AI' : selectedCall.callerName}
                          </div>
                          <div>{entry.text}</div>
                        </div>
                        {entry.speaker === 'caller' && (
                          <div className="w-6 h-6 rounded-lg bg-white/10 text-slate-300 border border-white/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">
                            U
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-20 text-slate-500 text-xs">
                Select a call from the left to view full transcript & analysis.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
