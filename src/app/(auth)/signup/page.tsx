'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBusinessStore } from '@/store/business';
import { IndustryType } from '@/types';
import { ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { addBusiness } = useBusinessStore();

  const [orgName, setOrgName] = useState('');
  const [industry, setIndustry] = useState<IndustryType>('healthcare');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim()) return;

    const slug = orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBiz = {
      id: `biz_${Date.now()}`,
      name: orgName,
      slug: slug || `tenant-${Date.now().toString().slice(-4)}`,
      industry,
      phoneNumber: '+1 (800) 555-' + Math.floor(1000 + Math.random() * 9000),
      email: email || `admin@${slug}.com`,
      address: '100 Innovation Center Way',
      timezone: 'America/New_York',
      businessHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '10:00', close: '14:00', isOpen: false },
        sunday: { open: '10:00', close: '14:00', isOpen: false },
      },
      plan: 'pro' as const,
      minutesUsed: 0,
      minutesLimit: 1500,
      createdAt: new Date().toISOString(),
    };

    addBusiness(newBiz);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md bg-[#0e121c] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Create Business Tenant
        </h2>
        <p className="text-xs text-slate-400">
          Provision an AI Voice Receptionist for your clinic, agency, or shop
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            Company / Practice Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Apex Health Center"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            Industry Vertical
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value as IndustryType)}
            className="input-field"
          >
            <option value="healthcare">Hospitals & Clinics</option>
            <option value="real_estate">Real Estate & Brokerages</option>
            <option value="auto_repair">Auto Repair & Services</option>
            <option value="dental">Dental & Orthodontics</option>
            <option value="salon">Salons & Spas</option>
            <option value="legal">Law Firms</option>
            <option value="retail">Local Shops & Restaurants</option>
            <option value="fitness">Gyms & Fitness</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            Admin Email Address
          </label>
          <input
            type="email"
            required
            placeholder="admin@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full py-3 text-sm"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-400">
        Already have a tenant account?{' '}
        <Link href="/login" className="text-rose-400 hover:underline font-semibold">
          Log in here
        </Link>
      </div>
    </div>
  );
}
