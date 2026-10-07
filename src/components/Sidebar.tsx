'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import TenantSwitcher from './TenantSwitcher';
import { useVoiceStore } from '@/store/voice';
import { useBusinessStore } from '@/store/business';
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  CalendarDays,
  Users,
  Megaphone,
  BookOpen,
  Code2,
  Settings,
  CreditCard,
  Home,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { openCallModal } = useVoiceStore();
  const { getActiveBusiness, getActiveAgents, getActiveCalls, getActiveAppointments, getActiveLeads } =
    useBusinessStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();
  const calls = getActiveCalls();
  const appointments = getActiveAppointments();
  const leads = getActiveLeads();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Voice Agents', href: '/agents', icon: Bot, badge: agents.length.toString() },
    { name: 'Call History', href: '/calls', icon: PhoneCall, badge: calls.length.toString() },
    { name: 'Appointments', href: '/appointments', icon: CalendarDays, badge: appointments.length.toString() },
    { name: 'CRM Leads', href: '/leads', icon: Users, badge: leads.length.toString() },
    { name: 'Outbound Campaigns', href: '/campaigns', icon: Megaphone },
    { name: 'Knowledge Base', href: '/knowledge', icon: BookOpen },
    { name: 'Voice Widget', href: '/widget', icon: Code2 },
    { name: 'Settings & Numbers', href: '/settings', icon: Settings },
    { name: 'Billing & Plans', href: '/billing', icon: CreditCard },
  ];

  return (
    <aside className="w-64 gradient-sidebar text-white flex flex-col h-screen sticky top-0 border-r border-white/5 z-30 select-none shadow-2xl">
      {/* Brand Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <Home className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-white flex items-center gap-1">
              <span>EstateCall</span>
              <span className="text-rose-500 font-extrabold">AI</span>
            </div>
            <div className="text-[10px] text-rose-300 font-medium tracking-wide">
              Multi-Tenant SaaS
            </div>
          </div>
        </Link>
      </div>

      {/* Tenant Switcher */}
      <div className="p-3 border-b border-white/5 bg-black/20">
        <TenantSwitcher />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <div className="section-label px-3 pb-1 text-slate-500">
          Management
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? 'sidebar-link-active' : 'sidebar-link'}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive ? 'bg-rose-600 text-white' : 'bg-white/5 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Live AI Test Button */}
      <div className="p-3 border-t border-white/5 bg-black/20 space-y-2">
        <button
          onClick={() => openCallModal()}
          className="w-full py-2.5 px-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-xl text-xs font-black shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
          <span>Test AI Voice Live</span>
        </button>

        {business?.slug && (
          <Link
            href={`/sites/${business.slug}`}
            target="_blank"
            className="w-full py-1.5 px-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-white/5"
          >
            <span>Preview Client Portal</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>
        )}
      </div>

      {/* Bottom Tenant Usage Progress */}
      <div className="px-4 py-3 bg-black/40 text-slate-400 text-[11px] border-t border-white/5 flex items-center justify-between">
        <div>
          <span className="font-bold text-white">
            {business?.minutesUsed || 0}
          </span>
          <span className="text-slate-500"> / {business?.minutesLimit || 1000} mins</span>
        </div>
        <div className="w-16 bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(
                100,
                ((business?.minutesUsed || 0) / (business?.minutesLimit || 1000)) * 100
              )}%`,
            }}
          />
        </div>
      </div>
    </aside>
  );
}
