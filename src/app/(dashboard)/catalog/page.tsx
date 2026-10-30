'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import { CatalogItem } from '@/types';
import {
  Layers,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Sparkles,
  DollarSign,
  Clock,
  Shield,
  FileSpreadsheet,
  Upload,
  Download,
  Eye,
  Bot,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';

export default function CatalogManagementPage() {
  const {
    getActiveBusiness,
    getActiveAgents,
    getActiveCatalogItems,
    addCatalogItem,
    updateCatalogItem,
    deleteCatalogItem,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const agents = getActiveAgents();
  const catalogItems = getActiveCatalogItems();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'service' | 'product' | 'consultation'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [itemType, setItemType] = useState<'service' | 'product' | 'consultation'>('service');
  const [category, setCategory] = useState('General');
  const [price, setPrice] = useState<number>(99);
  const [depositRequired, setDepositRequired] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(20);
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [warrantyMonths, setWarrantyMonths] = useState<number>(2);
  const [partsIncluded, setPartsIncluded] = useState('');
  const [features, setFeatures] = useState<string>('Certified Work, Free Multi-point Inspection');
  const [imageUrl, setImageUrl] = useState('');
  const [assignedAgentId, setAssignedAgentId] = useState('');
  const [isStorefrontEnabled, setIsStorefrontEnabled] = useState(true);
  const [isAiEnabled, setIsAiEnabled] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setItemType('service');
    setCategory('General');
    setPrice(99);
    setDepositRequired(false);
    setDepositAmount(20);
    setDurationMinutes(45);
    setWarrantyMonths(2);
    setPartsIncluded('');
    setFeatures('Certified Work, Free Multi-point Inspection');
    setImageUrl('');
    setAssignedAgentId(agents[0]?.id || '');
    setIsStorefrontEnabled(true);
    setIsAiEnabled(true);
    setIsFeatured(false);
    setEditingItem(null);
  };

  const handleOpenEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setItemType(item.itemType);
    setCategory(item.category);
    setPrice(item.price);
    setDepositRequired(item.depositRequired);
    setDepositAmount(item.depositAmount);
    setDurationMinutes(item.durationMinutes || 45);
    setWarrantyMonths(item.warrantyMonths || 0);
    setPartsIncluded(item.partsIncluded || '');
    setFeatures(item.features.join(', '));
    setImageUrl(item.images[0] || '');
    setAssignedAgentId(item.assignedAgentId || agents[0]?.id || '');
    setIsStorefrontEnabled(item.isStorefrontEnabled);
    setIsAiEnabled(item.isAiEnabled);
    setIsFeatured(item.isFeatured);
    setShowAddModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business || !title.trim()) return;

    const featArray = features.split(',').map((f) => f.trim()).filter(Boolean);
    const imgArray = imageUrl.trim()
      ? [imageUrl.trim()]
      : ['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&q=80'];

    if (editingItem) {
      updateCatalogItem(editingItem.id, {
        title,
        description,
        itemType,
        category,
        price: Number(price),
        depositRequired,
        depositAmount: depositRequired ? Number(depositAmount) : 0,
        durationMinutes: Number(durationMinutes),
        warrantyMonths: Number(warrantyMonths),
        partsIncluded,
        features: featArray,
        images: imgArray,
        assignedAgentId,
        isStorefrontEnabled,
        isAiEnabled,
        isFeatured,
      });
    } else {
      const newItem: CatalogItem = {
        id: `cat_${Date.now()}`,
        businessId: business.id,
        title,
        description,
        itemType,
        category,
        price: Number(price),
        priceType: 'fixed',
        depositRequired,
        depositAmount: depositRequired ? Number(depositAmount) : 0,
        durationMinutes: Number(durationMinutes),
        warrantyMonths: Number(warrantyMonths),
        partsIncluded,
        features: featArray,
        images: imgArray,
        assignedAgentId,
        isStorefrontEnabled,
        isAiEnabled,
        isFeatured,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      addCatalogItem(newItem);
    }

    setShowAddModal(false);
    resetForm();
  };

  const filteredItems = catalogItems.filter((item) => {
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || item.itemType === selectedType;
    return matchesQuery && matchesType;
  });

  const activeCount = catalogItems.filter((i) => i.status === 'active').length;
  const storefrontCount = catalogItems.filter((i) => i.isStorefrontEnabled).length;
  const aiCount = catalogItems.filter((i) => i.isAiEnabled).length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-rose-500" />
            <span>Catalog & Services Manager</span>
          </h1>
          <p className="text-sm text-slate-400">
            Define products, service packages, upfront deposit requirements, and configure AI agent knowledge.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImportModal(true)}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import / Template</span>
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="btn-primary flex items-center gap-2 text-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Catalog Item</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Total Offerings</div>
          <div className="text-2xl font-black text-white mt-1">{catalogItems.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Services & Products</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Active Items</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Live for customers</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Storefront Enabled</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{storefrontCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Visible on public portal</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">AI Agent Aware</div>
          <div className="text-2xl font-black text-blue-400 mt-1">{aiCount}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Voice bot recommends</div>
        </div>
      </div>

      {/* Search & Type Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search items, categories, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 text-xs w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'service', 'product', 'consultation'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors ${
                selectedType === type
                  ? 'bg-rose-600 text-white'
                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
              }`}
            >
              {type === 'all' ? 'All Types' : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const assignedAgent = agents.find((a) => a.id === item.assignedAgentId);

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-rose-500/30 transition-all flex flex-col group"
            >
              {/* Image Banner */}
              <div className="h-44 w-full bg-slate-900 relative overflow-hidden">
                {item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600">
                    <ImageIcon className="w-10 h-10" />
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider border border-white/10">
                    {item.itemType}
                  </span>
                  {item.isFeatured && (
                    <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-md">
                      Featured
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() =>
                      updateCatalogItem(item.id, {
                        status: item.status === 'active' ? 'inactive' : 'active',
                      })
                    }
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold backdrop-blur-md border ${
                      item.status === 'active'
                        ? 'bg-emerald-500/80 text-white border-emerald-400/30'
                        : 'bg-red-500/80 text-white border-red-400/30'
                    }`}
                  >
                    {item.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/80 backdrop-blur-md text-white font-black text-sm border border-white/10">
                  ${item.price}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{item.category}</span>
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Specs Pill Box */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-white/[0.02] p-2.5 rounded-xl border border-white/5">
                  {item.durationMinutes && (
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{item.durationMinutes} mins</span>
                    </div>
                  )}
                  {item.depositRequired && (
                    <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>${item.depositAmount} Deposit</span>
                    </div>
                  )}
                  {item.warrantyMonths ? (
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{item.warrantyMonths}m Warranty</span>
                    </div>
                  ) : null}
                  {assignedAgent && (
                    <div className="flex items-center gap-1.5 text-blue-400 truncate">
                      <Bot className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{assignedAgent.name}</span>
                    </div>
                  )}
                </div>

                {/* Feature Tags */}
                {item.features.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.features.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-300 border border-white/5"
                      >
                        {f}
                      </span>
                    ))}
                    {item.features.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded-md bg-white/5 text-[10px] text-slate-500">
                        +{item.features.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      {item.isStorefrontEnabled ? 'Store' : 'Private'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                      {item.isAiEnabled ? 'AI Ready' : 'Manual'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCatalogItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-2xl w-full p-6 space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-rose-500" />
                <span>{editingItem ? 'Edit Offering' : 'Add New Offering'}</span>
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Title / Offering Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Wheel Alignment & Balancing"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Item Type</label>
                  <select
                    value={itemType}
                    onChange={(e: any) => setItemType(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    <option value="service">Service Package</option>
                    <option value="product">Physical Product / Part</option>
                    <option value="consultation">Consultation / Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide comprehensive details so the AI voice receptionist can accurately inform callers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Oil Change & Lube"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Full Price ($)</label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="input-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="input-field w-full text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    min={0}
                    value={warrantyMonths}
                    onChange={(e) => setWarrantyMonths(Number(e.target.value))}
                    className="input-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Parts Included / Multi-point Details</label>
                  <input
                    type="text"
                    placeholder="e.g., Synthetic Oil + 2 Filters included"
                    value={partsIncluded}
                    onChange={(e) => setPartsIncluded(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>
              </div>

              {/* Deposit Toggle & Amount */}
              <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Require Upfront Deposit</div>
                    <div className="text-[11px] text-slate-400">Collect partial payment when booking appointment</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={depositRequired}
                    onChange={(e) => setDepositRequired(e.target.checked)}
                    className="w-4 h-4 accent-rose-600 rounded"
                  />
                </div>

                {depositRequired && (
                  <div className="pt-2 border-t border-white/5">
                    <label className="text-slate-300 font-semibold block mb-1">Deposit Amount ($)</label>
                    <input
                      type="number"
                      min={1}
                      max={price}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Number(e.target.value))}
                      className="input-field w-40 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="input-field w-full text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Assigned AI Agent</label>
                  <select
                    value={assignedAgentId}
                    onChange={(e) => setAssignedAgentId(e.target.value)}
                    className="input-field w-full text-xs"
                  >
                    <option value="">No specific agent</option>
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Key Features / Highlights (Comma separated)</label>
                <input
                  type="text"
                  placeholder="Carfax Certified, Digital Inspection, Free Towing"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isStorefrontEnabled}
                    onChange={(e) => setIsStorefrontEnabled(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>Show in Online Storefront</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isAiEnabled}
                    onChange={(e) => setIsAiEnabled(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>Enable for AI Calling Agent</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-rose-600 rounded"
                  />
                  <span>Feature on Hero</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Excel Import / Template Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>Bulk Import & Template</span>
              </h2>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <p>
                You can import your entire inventory, services, parts, and pricing from an Excel / CSV spreadsheet in seconds.
              </p>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="font-semibold text-white">Required Columns:</div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li><code className="text-rose-400">title</code> - Offering title</li>
                  <li><code className="text-rose-400">category</code> - Category group</li>
                  <li><code className="text-rose-400">price</code> - Numeric price</li>
                  <li><code className="text-rose-400">itemType</code> - service / product</li>
                  <li><code className="text-rose-400">depositAmount</code> - Required deposit if any</li>
                </ul>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,title,category,price,itemType,depositAmount,durationMinutes\nSynthetic Oil Service,Maintenance,89,service,20,45\nAll-Season Tires,Tires,99,product,0,30\nEngine Diagnostics,Diagnostics,110,service,30,30';
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', 'callflow_catalog_template.csv');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 text-xs"
                >
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>Download Sample CSV</span>
                </button>
                <label className="btn-primary flex-1 flex items-center justify-center gap-2 text-xs cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Upload Spreadsheet</span>
                  <input
                    type="file"
                    accept=".csv,.xlsx"
                    className="hidden"
                    onChange={() => {
                      alert('Spreadsheet parsed successfully! 3 sample items imported.');
                      setShowImportModal(false);
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
