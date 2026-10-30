'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import {
  Globe,
  Palette,
  Eye,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Image as ImageIcon,
  Bot,
  Save,
  Sliders,
  Type,
  PhoneCall,
  Calendar,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

export default function WebsiteBuilderPage() {
  const { getActiveBusiness, getActiveAgents, updateBusiness } = useBusinessStore();
  const business = getActiveBusiness();
  const agents = getActiveAgents();

  // Builder Customization State
  const [theme, setTheme] = useState<'dark' | 'light' | 'semilight'>('dark');
  const [primaryColor, setPrimaryColor] = useState('#e11d48');
  const [fontFamily, setFontFamily] = useState('Poppins');
  const [selectedAgentId, setSelectedAgentId] = useState(agents[0]?.id || '');
  const [siteHeadline, setSiteHeadline] = useState(
    business?.name ? `${business.name} - Official Service & Booking Portal` : 'Smart AI-Powered Receptionist'
  );
  const [siteSubheadline, setSiteSubheadline] = useState(
    'Book appointments, browse service packages, and talk directly with our 24/7 AI calling agent.'
  );
  const [heroImage, setHeroImage] = useState(
    'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=1200&q=80'
  );
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Subscription Modal State
  const [showPayModal, setShowPayModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    updateBusiness(business.id, {
      logoUrl,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Globe className="w-6 h-6 text-rose-500" />
            <span>AI Website & Portal Builder</span>
          </h1>
          <p className="text-sm text-slate-400">
            Publish a stunning white-label client portal for your business with real-time AI booking and calling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {business?.slug && (
            <Link
              href={`/sites/${business.slug}`}
              target="_blank"
              className="btn-secondary flex items-center gap-2 text-xs"
            >
              <Eye className="w-3.5 h-3.5 text-rose-400" />
              <span>Preview Live Site</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          )}

          <button
            onClick={handleSaveSettings}
            className="btn-primary flex items-center gap-2 text-xs"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Saved & Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save & Publish Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subscription Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-red-900/20 to-black/40 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Website Builder Subscription Active</div>
            <div className="text-xs text-slate-400">
              White-label domain <code className="text-rose-400 font-mono">/sites/{business?.slug}</code> is live on high-speed CDN.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">$29 / month</span>
          <button
            onClick={() => setShowPayModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            Manage Billing
          </button>
        </div>
      </div>

      {/* Builder Layout: Left Controls, Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
              <Palette className="w-4 h-4 text-rose-500" />
              <span>Theme & Visual Styling</span>
            </h3>

            {/* Theme Mode */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">Color Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dark', label: 'Dark Sleek' },
                  { id: 'semilight', label: 'Glass Modern' },
                  { id: 'light', label: 'Clean Light' },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id as any)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      theme === t.id
                        ? 'bg-rose-600/20 border-rose-500 text-white'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Preset */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">Primary Accent</label>
              <div className="flex items-center gap-3">
                {['#e11d48', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    className={`w-7 h-7 rounded-full transition-transform ${
                      primaryColor === c ? 'scale-125 ring-2 ring-white' : 'hover:scale-110'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5 text-xs">
              <label className="text-slate-300 font-semibold block">Typography Style</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="input-field w-full text-xs"
              >
                <option value="Poppins">Poppins (Modern Tech)</option>
                <option value="Inter">Inter (SaaS Minimal)</option>
                <option value="Outfit">Outfit (Luxury Crisp)</option>
              </select>
            </div>
          </div>

          {/* Content & Agent Selector */}
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
            <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="w-4 h-4 text-rose-500" />
              <span>Hero & AI Voice Integration</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Assigned Calling Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="input-field w-full text-xs"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.role} • Voice: {a.voiceId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Headline Text</label>
                <input
                  type="text"
                  value={siteHeadline}
                  onChange={(e) => setSiteHeadline(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Subheadline Description</label>
                <textarea
                  rows={2}
                  value={siteSubheadline}
                  onChange={(e) => setSiteSubheadline(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Hero Banner Image URL</label>
                <input
                  type="url"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Mockup Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Responsive Live View</span>
            <span className="font-mono text-slate-500">https://callflow.ai/sites/{business?.slug}</span>
          </div>

          <div
            className={`rounded-2xl border border-white/10 p-6 overflow-hidden shadow-2xl transition-all ${
              theme === 'light'
                ? 'bg-slate-50 text-slate-900'
                : theme === 'semilight'
                ? 'bg-slate-900/90 backdrop-blur-xl text-slate-100'
                : 'bg-[#07090e] text-slate-100'
            }`}
          >
            {/* Mock Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  {business?.name?.slice(0, 2).toUpperCase() || 'CF'}
                </div>
                <div>
                  <div className="font-bold text-sm leading-none">{business?.name || 'CarFix Auto'}</div>
                  <div className="text-[10px] opacity-60 capitalize mt-0.5">{business?.industry || 'Services'}</div>
                </div>
              </div>

              <button
                className="px-3 py-1.5 rounded-xl text-white font-semibold text-xs shadow-md flex items-center gap-1.5"
                style={{ backgroundColor: primaryColor }}
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call AI Receptionist</span>
              </button>
            </div>

            {/* Mock Hero Section */}
            <div className="py-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                <span>24/7 AI Receptionist Live</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black leading-tight max-w-lg">
                {siteHeadline}
              </h2>

              <p className="text-xs opacity-75 max-w-md leading-relaxed">
                {siteSubheadline}
              </p>

              <div className="flex items-center gap-3 pt-2">
                <button
                  className="px-4 py-2 rounded-xl text-white font-bold text-xs shadow-lg flex items-center gap-2"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
                <button className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 font-semibold text-xs transition-colors border border-white/10">
                  Browse Catalog
                </button>
              </div>
            </div>

            {/* Mock Hero Image Banner */}
            <div className="h-44 rounded-xl overflow-hidden relative border border-white/10 shadow-lg">
              <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs font-semibold">
                  Serving {business?.address || 'Metro Area'} • Call {business?.phoneNumber || '+1 (800) 555-0100'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manage Billing Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-rose-500" />
                <span>Website Builder Subscription</span>
              </h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-slate-300">
              Your website builder plan is currently active at <strong className="text-white">$29/month</strong>. Includes unlimited visitors, custom slug routing, and SSL certificate.
            </p>

            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1 text-[11px] text-slate-400">
              <div>Card on file: •••• •••• •••• 4242</div>
              <div>Next renewal: 1st of next month</div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="btn-primary text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
