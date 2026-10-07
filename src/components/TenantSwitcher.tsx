'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import { ChevronDown, Check, Plus, Hospital, Home, Wrench, Sparkles, Store } from 'lucide-react';
import { IndustryType } from '@/types';

export default function TenantSwitcher() {
  const { businesses, activeBusinessId, setActiveBusiness, addBusiness } = useBusinessStore();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeBusiness = businesses.find((b) => b.id === activeBusinessId) || businesses[0];

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case 'healthcare':
        return <Hospital className="w-4 h-4 text-rose-400" />;
      case 'real_estate':
        return <Home className="w-4 h-4 text-rose-400" />;
      case 'auto_repair':
        return <Wrench className="w-4 h-4 text-rose-400" />;
      case 'dental':
        return <Sparkles className="w-4 h-4 text-rose-400" />;
      default:
        return <Store className="w-4 h-4 text-rose-400" />;
    }
  };

  const [newBizName, setNewBizName] = useState('');
  const [newIndustry, setNewIndustry] = useState<IndustryType>('real_estate');

  const handleCreateBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBizName.trim()) return;

    const slug = newBizName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newBiz = {
      id: `biz_${Date.now()}`,
      name: newBizName,
      slug: slug || `biz-${Date.now().toString().slice(-4)}`,
      industry: newIndustry,
      phoneNumber: '+1 (800) 555-' + Math.floor(1000 + Math.random() * 9000),
      email: `contact@${slug || 'tenant'}.com`,
      address: '700 Innovation Way, Suite 100',
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
      minutesLimit: 1000,
      createdAt: new Date().toISOString(),
    };

    addBusiness(newBiz);
    setNewBizName('');
    setShowAddModal(false);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all w-full text-left border border-white/10"
      >
        <div className="p-1.5 rounded-lg bg-rose-600/10 text-rose-400 border border-rose-500/20">
          {getIndustryIcon(activeBusiness?.industry || 'real_estate')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold truncate leading-tight text-white">
            {activeBusiness?.name || 'Select Business'}
          </div>
          <div className="text-[10px] text-slate-400 truncate capitalize">
            {activeBusiness?.industry?.replace('_', ' ') || 'Multi-Tenant'} • {activeBusiness?.plan} plan
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-72 bg-[#0e121c] border border-white/10 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden animate-slide-up">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Business Tenants
            </div>

            <div className="max-h-60 overflow-y-auto py-1">
              {businesses.map((biz) => {
                const isSelected = biz.id === activeBusinessId;
                return (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setActiveBusiness(biz.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs text-left transition-colors ${
                      isSelected
                        ? 'bg-rose-950/40 text-rose-300 font-bold border-l-2 border-rose-500'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="p-1 rounded-md bg-white/5">
                      {getIndustryIcon(biz.industry)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-white">{biz.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">
                        {biz.industry.replace('_', ' ')}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-rose-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="p-2 border-t border-white/10">
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-colors border border-white/10"
              >
                <Plus className="w-3.5 h-3.5 text-rose-400" />
                Add New Business Tenant
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal to add new business */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Add New Business Tenant
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Provision an isolated multi-tenant environment with dedicated AI calling agents and phone line.
            </p>

            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Luxury Real Estate"
                  value={newBizName}
                  onChange={(e) => setNewBizName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Industry Vertical
                </label>
                <select
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value as IndustryType)}
                  className="input-field"
                >
                  <option value="real_estate">Real Estate & Brokerages</option>
                  <option value="healthcare">Hospitals & Medical Clinics</option>
                  <option value="auto_repair">Auto Repair & Service Shops</option>
                  <option value="dental">Dental Clinics & Orthodontics</option>
                  <option value="salon">Salons, Spas & Wellness</option>
                  <option value="legal">Law Firms & Legal Consults</option>
                  <option value="retail">Local Shops & Restaurants</option>
                  <option value="fitness">Gyms & Fitness Centers</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary flex-1 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 py-2.5"
                >
                  Create Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
