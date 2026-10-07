'use client';

import React from 'react';
import Link from 'next/link';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { Phone, ExternalLink, PhoneCall } from 'lucide-react';

export default function DashboardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { getActiveBusiness, getActiveAgents } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();
  const primaryAgent = agents[0];

  return (
    <header className="h-16 px-6 bg-[#0a0d16]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-base font-bold text-white leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Dedicated Phone Line Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-medium">
          <Phone className="w-3.5 h-3.5 text-rose-400" />
          <span>{business?.phoneNumber || '+1 (800) 555-0199'}</span>
        </div>

        {/* AI Agent Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-300">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>{primaryAgent?.name ? `${primaryAgent.name} (Live)` : 'AI Agent Online'}</span>
        </div>

        {/* Test Call CTA */}
        <button
          onClick={() => openCallModal(primaryAgent?.id, business?.id)}
          className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call AI Now</span>
        </button>

        {business?.slug && (
          <Link
            href={`/sites/${business.slug}`}
            target="_blank"
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors border border-white/5"
            title="Open Public Client Page"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        )}
      </div>
    </header>
  );
}
