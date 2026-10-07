'use client';

import React from 'react';
import Link from 'next/link';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import {
  Phone,
  PhoneCall,
  Calendar,
  CalendarDays,
  Users,
  Building2,
  Globe,
  BarChart3,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Play,
  ArrowRight,
  Star,
  Lock,
  Headphones,
  Check,
  Hospital,
  Home,
  Wrench,
  Sparkles as SparkleIcon,
} from 'lucide-react';

export default function LandingPage() {
  const { businesses, setActiveBusiness } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const handleStartCall = (bizId?: string) => {
    if (bizId) setActiveBusiness(bizId);
    openCallModal(undefined, bizId);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white relative overflow-x-hidden font-sans">
      {/* Background Red Glow Elements */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-rose-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-[-100px] w-[500px] h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="h-20 border-b border-white/5 bg-[#07090e]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
              <Home className="w-5 h-5 fill-white/20" />
            </div>
            <div className="font-black text-xl tracking-tight text-white flex items-center gap-1">
              <span>EstateCall</span>
              <span className="text-rose-500 font-extrabold">AI</span>
            </div>
          </Link>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-rose-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-rose-400 transition-colors">
              How It Works
            </a>
            <a href="#pricing" className="hover:text-rose-400 transition-colors">
              Pricing
            </a>
            <a href="#demo" className="hover:text-rose-400 transition-colors">
              Demo
            </a>
            <Link href="/widget-demo" className="hover:text-rose-400 transition-colors">
              Widget
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95"
            >
              <span>GaaS Steady</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-[11px] font-bold tracking-wide uppercase shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>POWERED BY GPT-4O REALTIME VOICE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Your AI agent{' '}
              <span className="bg-gradient-to-r from-rose-500 via-red-400 to-rose-300 bg-clip-text text-transparent italic font-serif">
                books appointments 24/7.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
              CallFlow AI answers every inquiry, qualifies leads, and books appointments automatically — so your team focuses on closing deals, not answering phones.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/signup"
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-red-500 to-rose-600 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs shadow-xl shadow-rose-600/35 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <span>Start Free — No Card Needed</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => handleStartCall('biz_realestate_02')}
                className="px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-200 font-bold text-xs border border-white/10 flex items-center gap-2 transition-all hover:scale-105 backdrop-blur-md"
              >
                <Play className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>Watch Live Voice Demo</span>
              </button>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2 overflow-hidden">
                  <div className="inline-block h-7 w-7 rounded-full bg-gradient-to-tr from-rose-700 to-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07090e]">
                    SM
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full bg-gradient-to-tr from-red-600 to-rose-400 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07090e]">
                    JL
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full bg-gradient-to-tr from-rose-900 to-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07090e]">
                    MR
                  </div>
                  <div className="inline-block h-7 w-7 rounded-full bg-gradient-to-tr from-red-700 to-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-[#07090e]">
                    DC
                  </div>
                </div>
                <div>
                  <div className="flex items-center text-amber-400 text-xs">
                    ★★★★★
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">
                    Trusted by 500+ businesses
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium pl-4 border-l border-white/10">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>SOC 2 Type II Certified</span>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Glowing HUD Graphic */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[460px]">
            {/* Outer Orbit Rings */}
            <div className="relative w-full max-w-[440px] aspect-square rounded-full border border-rose-500/20 flex items-center justify-center bg-radial-gradient">
              {/* Inner Orbit Ring */}
              <div className="w-[300px] h-[300px] rounded-full border border-dashed border-rose-500/30 flex items-center justify-center relative">
                {/* Central Red Glowing Sphere */}
                <button
                  onClick={() => handleStartCall()}
                  className="w-28 h-28 rounded-full bg-gradient-to-tr from-rose-700 via-red-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-[0_0_50px_rgba(244,63,94,0.6)] cursor-pointer hover:scale-110 transition-transform active:scale-95 group relative z-20"
                >
                  <Phone className="w-9 h-9 fill-white mb-1 group-hover:animate-bounce" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    LIVE
                  </span>
                </button>

                {/* Orbiting Satellite Node: LISTINGS */}
                <div className="absolute -top-4 left-1/4 p-3 rounded-2xl bg-[#0f1422] border border-rose-500/40 shadow-lg shadow-rose-950/50 flex flex-col items-center gap-1 text-[10px] font-bold text-slate-200">
                  <Globe className="w-4 h-4 text-rose-400" />
                  <span>LISTINGS</span>
                </div>

                {/* Orbiting Satellite Node: BUSINESSES */}
                <div className="absolute top-2 right-6 p-3 rounded-2xl bg-[#0f1422] border border-white/10 shadow-lg flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
                  <Building2 className="w-4 h-4 text-rose-400" />
                  <span>BUSINESSES</span>
                </div>

                {/* Orbiting Satellite Node: CALLS */}
                <div className="absolute top-1/2 -right-4 -translate-y-1/2 p-3 rounded-2xl bg-[#0f1422] border border-rose-500/40 shadow-lg flex flex-col items-center gap-1 text-[10px] font-bold text-slate-200">
                  <PhoneCall className="w-4 h-4 text-rose-400" />
                  <span>CALLS</span>
                </div>

                {/* Orbiting Satellite Node: CUSTOMERS */}
                <div className="absolute bottom-6 right-8 p-3 rounded-2xl bg-[#0f1422] border border-white/10 shadow-lg flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span>CUSTOMERS</span>
                </div>

                {/* Orbiting Satellite Node: SCHEDULE */}
                <div className="absolute -bottom-4 right-1/4 p-3 rounded-2xl bg-[#0f1422] border border-white/10 shadow-lg flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>SCHEDULE</span>
                </div>

                {/* Orbiting Satellite Node: ANALYTICS */}
                <div className="absolute bottom-10 -left-4 p-3 rounded-2xl bg-[#0f1422] border border-white/10 shadow-lg flex flex-col items-center gap-1 text-[10px] font-bold text-slate-300">
                  <BarChart3 className="w-4 h-4 text-rose-400" />
                  <span>ANALYTICS</span>
                </div>
              </div>

              {/* Floating Top Right Card: Speed */}
              <div className="absolute -top-6 -right-6 p-3 rounded-2xl bg-[#0e1320]/90 backdrop-blur-md border border-rose-500/30 shadow-xl flex items-center gap-2.5 text-xs text-slate-200 z-20">
                <div className="w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white text-[11px]">Answered in &lt;2s</div>
                  <div className="text-[9px] text-slate-400">GPT-4o Realtime voice</div>
                </div>
              </div>

              {/* Floating Bottom Right Card: Appointment Confirmed */}
              <div className="absolute -bottom-10 right-0 p-3.5 rounded-2xl bg-[#071714]/90 backdrop-blur-md border border-emerald-500/40 shadow-2xl flex items-center gap-3 text-xs z-20">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-emerald-400 text-xs">Appointment Confirmed</div>
                  <div className="text-[10px] text-slate-300">Sat 2pm • Oak Street • Sarah</div>
                </div>
              </div>

              {/* Floating Bottom Audio Wave Card */}
              <div className="absolute -bottom-12 -left-6 p-3 px-4 rounded-2xl bg-[#120a14]/90 backdrop-blur-md border border-rose-500/30 shadow-2xl flex items-center gap-3 z-20">
                <div className="flex items-center gap-1 h-5">
                  <span className="w-1 bg-rose-500 h-2 rounded-full animate-bounce" />
                  <span className="w-1 bg-rose-500 h-4 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-rose-500 h-5 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-rose-500 h-3 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-rose-500 h-1 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
                <div className="text-[10px] font-bold text-rose-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                  <span>Handling call...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Feature Pill Badges */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0e121c] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Handles Calls 24/7</div>
              <div className="text-[10px] text-slate-400">Zero missed leads</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e121c] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Books Appointments</div>
              <div className="text-[10px] text-slate-400">Live calendar sync</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e121c] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Works for Any Business</div>
              <div className="text-[10px] text-slate-400">Multi-tenant ready</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0e121c] border border-white/5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-black text-sm">
              ▲
            </div>
            <div>
              <div className="text-xs font-bold text-white">Built with Next.js</div>
              <div className="text-[10px] text-slate-400">Fast & scalable SaaS</div>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Tenant Vertical Demonstrations */}
      <section id="demo" className="py-20 px-6 bg-[#0a0d16] border-y border-white/5">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
              Live Voice Interactive Demonstrations
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Try AI Receptionists Across Different Industries
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
              Click any business below to talk directly with its dedicated AI Voice agent in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.slice(0, 4).map((biz) => (
              <div
                key={biz.id}
                className="p-6 rounded-3xl bg-[#07090e] border border-white/10 hover:border-rose-500/50 shadow-xl transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-rose-600/10 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      {biz.industry === 'healthcare' && <Hospital className="w-6 h-6" />}
                      {biz.industry === 'real_estate' && <Home className="w-6 h-6" />}
                      {biz.industry === 'auto_repair' && <Wrench className="w-6 h-6" />}
                      {biz.industry === 'dental' && <SparkleIcon className="w-6 h-6" />}
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/5 text-slate-400 border border-white/5">
                      {biz.industry.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5">{biz.name}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {biz.address}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-rose-400 font-bold">
                    {biz.phoneNumber}
                  </span>
                  <button
                    onClick={() => handleStartCall(biz.id)}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/30 transition-all hover:scale-105"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Call AI</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
            Pricing Plans
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
            Transparent Pricing for Growing Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-[#0e121c] border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Starter</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-white">$99</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                For solo practitioners, local boutique shops, and single dental offices.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>500 Calling Minutes / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>1 Dedicated Business Phone Number</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>2 Inbound AI Voice Agents</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl text-xs font-bold text-center transition-colors"
            >
              Get Started
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-rose-950/40 via-[#0e121c] to-[#07090e] border-2 border-rose-500 shadow-2xl flex flex-col justify-between relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-rose-600/40">
              Most Popular
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Pro Professional</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-white">$249</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <p className="text-xs text-slate-300 mb-6">
                For medical clinics, busy real estate firms, and auto repair centers.
              </p>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>1,500 Calling Minutes / month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>3 Dedicated Phone Numbers</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>Unlimited AI Voice Agents</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>Outbound Calling Campaigns</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 py-3.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white rounded-2xl text-xs font-bold text-center shadow-lg shadow-rose-600/30 transition-all hover:scale-[1.02]"
            >
              Start Free Trial
            </Link>
          </div>

          <div className="p-8 rounded-3xl bg-[#0e121c] border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Enterprise</h3>
              <div className="my-4">
                <span className="text-4xl font-extrabold text-white">$699</span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <p className="text-xs text-slate-400 mb-6">
                For regional medical networks, hotel chains, and franchise brokerages.
              </p>
              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>5,000+ Calling Minutes Included</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>HIPAA & SOC-2 Compliance Guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-rose-400" />
                  <span>Custom EHR/EMR & CRM Integrations</span>
                </li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="mt-8 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-2xl text-xs font-bold text-center transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#04060a] border-t border-white/5 py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white">
              <Home className="w-4 h-4 fill-white/20" />
            </div>
            <div>
              <div className="font-bold text-white">EstateCall AI</div>
              <p>Autonomous AI Voice Receptionist & Calling Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="hover:text-rose-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/widget-demo" className="hover:text-rose-400 transition-colors">
              Widget Demo
            </Link>
            <Link href="/login" className="hover:text-rose-400 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-rose-400 transition-colors">
              Create Tenant
            </Link>
          </div>

          <div className="text-slate-600">
            © 2026 EstateCall AI SaaS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
