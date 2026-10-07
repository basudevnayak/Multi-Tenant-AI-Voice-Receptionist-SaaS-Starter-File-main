'use client';

import React from 'react';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { Bot, PhoneCall, Sparkles, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function WidgetDemoPage() {
  const { getActiveBusiness, getActiveAgents, getActiveWidgetConfig } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();
  const widgetConfig = getActiveWidgetConfig();

  return (
    <div className="min-h-screen bg-[#07090e] text-white relative flex flex-col justify-between overflow-x-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Simulation Header Notice */}
      <div className="bg-rose-950/80 border-b border-rose-500/30 text-white py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2 relative z-20">
        <Sparkles className="w-4 h-4 text-rose-400 animate-spin" />
        <span>
          External Client Website Simulation for <strong>{business?.name}</strong>
        </span>
        <Link
          href="/widget"
          className="ml-4 px-2.5 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[11px] font-bold transition-colors"
        >
          ← Back to Widget Customizer
        </Link>
      </div>

      {/* Simulated Client Website Body */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center space-y-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/40 text-rose-300 text-xs font-bold uppercase tracking-wider border border-rose-500/30">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>Premium Customer Care Experience</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          {business?.name}
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Welcome to our official website. Look at the bottom-right corner to experience our live autonomous AI Voice Receptionist ready to answer your questions and book appointments 24/7.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <div className="card-surface p-5 text-left w-64 space-y-1">
            <Star className="w-4 h-4 text-rose-400 fill-current" />
            <div className="text-xs font-bold text-white">Instant Answers</div>
            <p className="text-[11px] text-slate-400">Zero wait time on customer phone calls.</p>
          </div>
          <div className="card-surface p-5 text-left w-64 space-y-1">
            <Bot className="w-4 h-4 text-rose-400" />
            <div className="text-xs font-bold text-white">AI Scheduling</div>
            <p className="text-[11px] text-slate-400">Natural voice conversation booking.</p>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-500 border-t border-white/5 relative z-10">
        Simulated Client Domain • Powered by EstateCall AI Multi-Tenant SaaS
      </footer>

      {/* Floating Embedded AI Voice Receptionist Widget */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="w-80 bg-[#0e121c] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden shadow-rose-950/50 animate-bounce-short">
          <div
            className="p-4 text-white flex items-center justify-between"
            style={{ backgroundColor: widgetConfig?.primaryColor || '#e11d48' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="font-bold text-xs">{widgetConfig?.title || 'AI Receptionist'}</div>
                <div className="text-[10px] text-white/90">{widgetConfig?.subtitle || '24/7 Live Care'}</div>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3 bg-[#07090e]">
            <div className="p-3 bg-[#141926] rounded-2xl text-[11px] text-slate-200 border border-white/10">
              {widgetConfig?.greeting || 'Hello! How can I help you today?'}
            </div>

            <button
              onClick={() => openCallModal(agents[0]?.id, business?.id)}
              className="w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all hover:opacity-90 active:scale-95"
              style={{ backgroundColor: widgetConfig?.primaryColor || '#e11d48' }}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{widgetConfig?.buttonText || 'Talk to AI Assistant'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
