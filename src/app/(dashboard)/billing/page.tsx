'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { PlanType } from '@/types';
import {
  Check,
} from 'lucide-react';

export default function BillingPage() {
  const { getActiveBusiness, updateBusiness } = useBusinessStore();
  const business = getActiveBusiness();

  const [currentPlan, setCurrentPlan] = useState<PlanType>(business?.plan || 'pro');
  const [successMsg, setSuccessMsg] = useState('');

  const plans = [
    {
      id: 'starter' as PlanType,
      name: 'Starter Tier',
      price: '$99',
      period: '/month',
      minutesLimit: 500,
      description: 'Ideal for local boutique shops, salons, and solo dental practices.',
      features: [
        '500 Monthly AI Calling Minutes',
        '1 Dedicated Business Phone Line',
        '2 AI Voice Agents (Inbound)',
        'Standard Voice Models (Alloy, Echo)',
        'Automated Appointment Booking',
        'Basic Email Support',
      ],
    },
    {
      id: 'pro' as PlanType,
      name: 'Pro Professional',
      price: '$249',
      period: '/month',
      minutesLimit: 1500,
      popular: true,
      description: 'Best for medical clinics, real estate agencies, and busy auto repair shops.',
      features: [
        '1,500 Monthly AI Calling Minutes',
        '3 Dedicated Business Phone Lines',
        'Unlimited AI Calling Agents',
        'Advanced HD Voices (Nova, Shimmer, Fable)',
        'Full Outbound Calling Campaigns',
        'Custom Business Knowledge Training',
        'Priority Phone & Slack Support',
      ],
    },
    {
      id: 'enterprise' as PlanType,
      name: 'Enterprise Scale',
      price: '$699',
      period: '/month',
      minutesLimit: 5000,
      description: 'For regional hospital networks, franchise dealerships, and enterprise chains.',
      features: [
        '5,000+ Calling Minutes Included',
        'Unlimited Dedicated Phone Lines',
        'HIPAA & SOC-2 Compliance Guarantee',
        'Custom Voice Cloning & Tone Tuning',
        'Multi-Location Routing & Trunking',
        'Custom CRM & EHR/EMR Integration',
        'Dedicated 24/7 Account Manager',
      ],
    },
  ];

  const handleSelectPlan = (planId: PlanType, limit: number) => {
    if (!business) return;
    updateBusiness(business.id, { plan: planId, minutesLimit: limit });
    setCurrentPlan(planId);
    setSuccessMsg(`Successfully updated subscription to ${planId.toUpperCase()}!`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const minutesUsed = business?.minutesUsed || 0;
  const minutesLimit = business?.minutesLimit || 1000;
  const percentage = Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Subscription Plans & Voice Quotas"
        subtitle={`Manage calling limits, phone number allocation, and billing for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Usage Quota Card */}
        <div className="card-surface p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Monthly Voice Minute Usage
              </span>
              <h3 className="text-2xl font-black text-white mt-1">
                {minutesUsed}{' '}
                <span className="text-sm font-normal text-slate-400">/ {minutesLimit} minutes</span>
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-rose-400">
                {percentage}% of allowance used
              </span>
            </div>
          </div>

          <div className="w-full bg-white/10 h-3 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 85 ? 'bg-red-500' : percentage > 60 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Plan Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`card-surface p-6 flex flex-col justify-between relative transition-all ${
                  isCurrent
                    ? 'border-2 border-rose-500 shadow-2xl shadow-rose-950/50 bg-gradient-to-b from-rose-950/20 to-[#0e121c]'
                    : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-rose-600/30">
                    Most Popular
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">
                      {plan.name}
                    </h4>
                    {isCurrent && (
                      <span className="badge bg-rose-950/60 text-rose-300 border-rose-500/40 uppercase">
                        Active Plan
                      </span>
                    )}
                  </div>

                  <div className="my-4">
                    <span className="text-4xl font-black text-white">
                      {plan.price}
                    </span>
                    <span className="text-xs text-slate-400">{plan.period}</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-5">
                    {plan.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-slate-300">
                        <Check className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5">
                  <button
                    disabled={isCurrent}
                    onClick={() => handleSelectPlan(plan.id, plan.minutesLimit)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-white/5 text-slate-500 cursor-not-allowed border border-white/5'
                        : 'btn-primary'
                    }`}
                  >
                    {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
