'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBusinessStore } from '@/store/business';
import { Sparkles, ArrowRight, Hospital, Home, Wrench } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setActiveBusiness } = useBusinessStore();
  const [email, setEmail] = useState('demo@hospital.care');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  const handleQuickDemo = (bizId: string) => {
    setActiveBusiness(bizId);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md bg-[#0e121c] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Welcome to <span className="text-gradient-crimson">EstateCall AI</span>
        </h2>
        <p className="text-xs text-slate-400">
          Sign in to manage your AI receptionist and multi-tenant voice lines
        </p>
      </div>

      {/* 1-Click Instant Demo Access */}
      <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
        <div className="text-[10px] uppercase font-bold text-rose-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Instant 1-Click Demo Sandbox:</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo('biz_healthcare_01')}
            className="p-2.5 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/5 text-white rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <Hospital className="w-4 h-4 text-rose-400" />
            <span>Clinic Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('biz_realestate_02')}
            className="p-2.5 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/5 text-white rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>Real Estate</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo('biz_auto_03')}
            className="p-2.5 bg-white/5 hover:bg-rose-500/20 hover:border-rose-500/40 border border-white/5 text-white rounded-xl text-[11px] font-semibold flex flex-col items-center gap-1 transition-all"
          >
            <Wrench className="w-4 h-4 text-rose-400" />
            <span>Auto Shop</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-300">Password</label>
            <span className="text-[11px] text-rose-400 hover:underline cursor-pointer">
              Forgot?
            </span>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-sm"
        >
          <span>Sign In to Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Don't have an organization account?{' '}
        <Link href="/signup" className="text-rose-400 hover:underline font-semibold">
          Create one free
        </Link>
      </div>
    </div>
  );
}
