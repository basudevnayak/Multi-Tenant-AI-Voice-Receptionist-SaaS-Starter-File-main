'use client';

import React, { useState } from 'react';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import {
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Clock,
  Send,
  Building2,
  PhoneCall,
  X,
  Radio,
} from 'lucide-react';

export default function VoiceCallModal() {
  const {
    voiceStore,
    activeBusiness,
    activeAgent,
    startCallSession,
    endCallSession,
    handleUserSpeech,
    liveInterimTranscript,
    startListening,
  } = useRealtimeVoice();

  const [textInput, setTextInput] = useState('');

  if (!voiceStore.isOpen) return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const samplePrompts = [
    'I would like to schedule a private property viewing tomorrow.',
    'What are your available listings and pricing details?',
    'What are your office hours and location?',
    'Can you please connect me to a senior broker or human agent?',
  ];

  const handleSubmitText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    handleUserSpeech(textInput);
    setTextInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0a0d16] border border-rose-500/30 rounded-3xl shadow-[0_0_50px_rgba(244,63,94,0.2)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-rose-950 via-[#120a14] to-[#07090e] text-white flex items-center justify-between border-b border-rose-500/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shadow-md shadow-rose-600/20">
                <Bot className="w-5 h-5" />
              </div>
              {voiceStore.isCalling && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">
                  {activeAgent?.name || 'AI Voice Receptionist'}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {activeAgent?.type || 'Inbound AI'}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-rose-400" />
                {activeBusiness?.name || 'Business Voice Line'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {voiceStore.isCalling && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-950/60 rounded-full text-xs font-bold text-rose-300 border border-rose-500/30">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                {formatDuration(voiceStore.callDuration)}
              </div>
            )}
            <button
              onClick={() => voiceStore.closeCallModal()}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visualizer & Status Section */}
        <div className="px-6 py-4 bg-[#07090e] border-b border-white/5 text-center">
          {voiceStore.isCalling ? (
            <div className="flex flex-col items-center">
              {/* Dynamic Waveform Visualizer */}
              <div className="flex items-center justify-center gap-1.5 h-12 mb-2">
                {voiceStore.audioLevels.map((level, idx) => (
                  <div
                    key={idx}
                    className="w-1.5 rounded-full transition-all duration-75"
                    style={{
                      height: `${Math.max(15, level)}%`,
                      backgroundColor:
                        voiceStore.isSpeaking
                          ? '#f43f5e'
                          : voiceStore.isListening
                          ? '#10b981'
                          : '#64748b',
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold">
                {voiceStore.isSpeaking ? (
                  <span className="text-rose-400 flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-rose-400" /> AI is speaking...
                  </span>
                ) : voiceStore.isListening ? (
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      Listening to your voice...
                    </span>
                    <button
                      onClick={() => startListening()}
                      className="px-2 py-0.5 bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-md text-[10px] font-bold uppercase transition-colors"
                    >
                      Re-trigger Mic
                    </button>
                  </div>
                ) : (
                  <span className="text-slate-400">Connected</span>
                )}
              </div>

              {/* Live Interim Speech Bubble */}
              {liveInterimTranscript && (
                <div className="mt-2 px-3.5 py-1 bg-rose-950/40 border border-rose-500/40 rounded-full text-[11px] text-rose-300 italic animate-pulse">
                  Hearing: &quot;{liveInterimTranscript}...&quot;
                </div>
              )}
            </div>
          ) : (
            <div className="py-4 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-rose-600/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-3 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                <PhoneCall className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">
                Ready to test {activeAgent?.name}
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mt-1">
                Click &quot;Start Live Voice Call&quot; to test real-time speech recognition, natural synthesis, and appointment booking.
              </p>
              <button
                onClick={() => startCallSession(activeAgent?.id, activeBusiness?.id)}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Start Live Voice Call</span>
              </button>
            </div>
          )}
        </div>

        {/* Live Conversation Transcript */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 min-h-[200px] max-h-[280px] bg-[#07090e]">
          {voiceStore.transcript.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs py-8">
              <Sparkles className="w-6 h-6 mb-2 text-slate-600" />
              <p>Conversation transcript will appear here in real time.</p>
            </div>
          ) : (
            voiceStore.transcript.map((entry, index) => (
              <div
                key={index}
                className={`flex gap-3 text-xs leading-relaxed ${
                  entry.speaker === 'ai' ? 'justify-start' : 'justify-end'
                }`}
              >
                {entry.speaker === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex-shrink-0 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl ${
                    entry.speaker === 'ai'
                      ? 'bg-[#0e121c] text-slate-100 rounded-tl-sm border border-white/10 shadow-md'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-tr-sm shadow-md'
                  }`}
                >
                  <div className="font-bold text-[10px] opacity-75 mb-0.5">
                    {entry.speaker === 'ai' ? activeAgent.name : 'You (Caller)'}
                  </div>
                  <div>{entry.text}</div>
                </div>
                {entry.speaker === 'caller' && (
                  <div className="w-7 h-7 rounded-xl bg-white/10 text-slate-300 border border-white/10 flex-shrink-0 flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Quick Prompts */}
        {voiceStore.isCalling && (
          <div className="px-5 py-2.5 bg-[#0a0d16] border-t border-white/5">
            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-rose-400" />
              <span>Or Click Any Prompt to Speak:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleUserSpeech(prompt)}
                  className="px-2.5 py-1 bg-white/5 hover:bg-rose-950/40 hover:border-rose-500/40 border border-white/10 rounded-lg text-[11px] text-slate-300 transition-colors text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Bar: Voice Controls */}
        <div className="px-5 py-3 bg-[#0a0d16] border-t border-white/5 flex flex-col gap-3">
          {voiceStore.isCalling ? (
            <div className="flex items-center justify-between gap-3">
              <form onSubmit={handleSubmitText} className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Or type what you want to say..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-[#07090e] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <div className="flex items-center gap-2">
                <button
                  onClick={voiceStore.toggleMute}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    voiceStore.isMuted
                      ? 'bg-rose-950 text-rose-400 border-rose-500'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                  title={voiceStore.isMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {voiceStore.isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <button
                  onClick={voiceStore.toggleSpeakerMute}
                  className={`p-2.5 rounded-xl border text-xs font-medium transition-colors ${
                    voiceStore.isSpeakerMuted
                      ? 'bg-rose-950 text-rose-400 border-rose-500'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
                  }`}
                  title={voiceStore.isSpeakerMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                >
                  {voiceStore.isSpeakerMuted ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={endCallSession}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  End Call
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] text-slate-400">
                Click &quot;Start Live Voice Call&quot; to activate
              </span>
              <button
                onClick={() => voiceStore.closeCallModal()}
                className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-300 font-medium"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
