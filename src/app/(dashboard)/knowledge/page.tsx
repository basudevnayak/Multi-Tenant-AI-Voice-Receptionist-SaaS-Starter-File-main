'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { KnowledgeItem, KnowledgeCategory, ServiceItem } from '@/types';
import {
  Plus,
  Trash2,
  Clock,
  Search,
} from 'lucide-react';

export default function KnowledgePage() {
  const {
    getActiveBusiness,
    getActiveKnowledge,
    getActiveServices,
    addKnowledgeItem,
    deleteKnowledgeItem,
    addService,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const knowledge = getActiveKnowledge();
  const services = getActiveServices();

  const [activeTab, setActiveTab] = useState<'faq' | 'services'>('faq');
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Form
  const [category, setCategory] = useState<KnowledgeCategory>('faq');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keywords, setKeywords] = useState('');

  // Service Form
  const [serviceName, setServiceName] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(95);
  const [serviceCat] = useState('General');

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const newK: KnowledgeItem = {
      id: `k_${Date.now()}`,
      businessId: business.id,
      category,
      question,
      answer,
      keywords: keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    addKnowledgeItem(newK);
    setQuestion('');
    setAnswer('');
    setKeywords('');
    setShowFaqModal(false);
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const newS: ServiceItem = {
      id: `srv_${Date.now()}`,
      businessId: business.id,
      name: serviceName,
      description: serviceDesc,
      durationMinutes: duration,
      price,
      category: serviceCat,
      isActive: true,
    };

    addService(newS);
    setServiceName('');
    setServiceDesc('');
    setShowServiceModal(false);
  };

  const filteredKnowledge = knowledge.filter(
    (k) =>
      k.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.keywords.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Business Knowledge Base & AI Training"
        subtitle={`Teach your AI receptionist about ${business?.name}'s services, FAQs, pricing, and emergency guidelines`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'faq'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              FAQs & Business Protocols ({knowledge.length})
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'services'
                  ? 'btn-primary'
                  : 'btn-secondary'
              }`}
            >
              Services & Pricing Catalog ({services.length})
            </button>
          </div>

          <div>
            {activeTab === 'faq' ? (
              <button
                onClick={() => setShowFaqModal(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add Knowledge FAQ</span>
              </button>
            ) : (
              <button
                onClick={() => setShowServiceModal(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4" />
                <span>Add Service</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab 1: Knowledge & FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search knowledge items and keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredKnowledge.map((item) => (
                <div
                  key={item.id}
                  className="card-surface p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`badge uppercase ${
                          item.category === 'urgent_protocol'
                            ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                            : item.category === 'pricing'
                            ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                            : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                      >
                        {item.category.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => deleteKnowledgeItem(item.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-2">
                      Q: {item.question}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed bg-[#141926] p-3 rounded-2xl border border-white/5">
                      {item.answer}
                    </p>
                  </div>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                      {item.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-white/5 text-rose-300 rounded-md text-[10px] font-semibold border border-white/5"
                        >
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Services Catalog */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="card-surface p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] px-2 py-0.5 bg-white/5 text-slate-400 rounded-md font-bold uppercase border border-white/5">
                      {srv.category}
                    </span>
                    <span className="text-base font-black text-rose-400">
                      {srv.price > 0 ? `$${srv.price}` : 'Free'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">
                    {srv.name}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{srv.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {srv.durationMinutes} mins
                  </span>
                  <span className="text-rose-400 font-bold">
                    Live in AI Agent
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal: Add FAQ */}
        {showFaqModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">
                Add Knowledge Item / FAQ
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Your AI Voice Receptionist will reference this answer during live customer calls.
              </p>

              <form onSubmit={handleAddFaq} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Category / Protocol
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as KnowledgeCategory)}
                    className="input-field"
                  >
                    <option value="faq">General FAQ</option>
                    <option value="pricing">Pricing & Fees</option>
                    <option value="policy">Policies & Rules</option>
                    <option value="location">Location & Directions</option>
                    <option value="staff">Staff & Team</option>
                    <option value="urgent_protocol">Urgent Escalation Protocol</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Caller Question
                  </label>
                  <input
                    type="text"
                    required
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g. Do you accept private viewings on weekends?"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    AI Response / Answer
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Provide the exact factual response the AI should give..."
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="weekend, viewings, private, hours"
                    className="input-field"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowFaqModal(false)}
                    className="btn-secondary flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2.5"
                  >
                    Save Knowledge Item
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Service */}
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">
                Add Service / Listing
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Add to {business?.name}&apos;s booking catalog.
              </p>

              <form onSubmit={handleAddService} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    placeholder="e.g. VIP Showing, Brake Diagnostics"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={serviceDesc}
                    onChange={(e) => setServiceDesc(e.target.value)}
                    placeholder="Brief description..."
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="240"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(false)}
                    className="btn-secondary flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2.5"
                  >
                    Save Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
