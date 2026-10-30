'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import { StoreOrder, CustomerInquiry } from '@/types';
import {
  ShoppingBag,
  Package,
  MessageSquare,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  DollarSign,
  Send,
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  Filter,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function StorefrontOrdersPage() {
  const {
    getActiveBusiness,
    getActiveOrders,
    getActiveInquiries,
    getActiveCatalogItems,
    updateOrderStatus,
    replyToInquiry,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const orders = getActiveOrders();
  const inquiries = getActiveInquiries();
  const catalogItems = getActiveCatalogItems();

  const [activeTab, setActiveTab] = useState<'orders' | 'inquiries'>('orders');
  const [selectedOrder, setSelectedOrder] = useState<StoreOrder | null>(orders[0] || null);
  const [selectedInquiry, setSelectedInquiry] = useState<CustomerInquiry | null>(inquiries[0] || null);

  // Tracking Event modal
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState('Parts Dispatched');
  const [eventLocation, setEventLocation] = useState('Central Hub');

  // Inquiry reply
  const [replyText, setReplyText] = useState('');

  const totalRevenue = orders.reduce((acc, curr) => acc + curr.paidAmount, 0);
  const completedOrders = orders.filter((o) => o.orderStatus === 'completed').length;
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;

  const handleAddTrackingEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrderStatus(selectedOrder.id, selectedOrder.orderStatus, {
      title: eventTitle,
      location: eventLocation,
      timestamp: new Date().toISOString(),
    });

    setShowEventModal(false);
  };

  const handleSendInquiryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry || !replyText.trim()) return;

    replyToInquiry(selectedInquiry.id, replyText.trim());
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-rose-500" />
            <span>Storefront & Orders Hub</span>
          </h1>
          <p className="text-sm text-slate-400">
            Monitor incoming customer purchases, deposit payments, delivery tracking events, and reply to inquiries.
          </p>
        </div>

        {business?.slug && (
          <Link
            href={`/sites/${business.slug}`}
            target="_blank"
            className="btn-primary flex items-center gap-2 text-xs"
          >
            <span>Open Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Store Revenue</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">${totalRevenue}</div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Direct & Deposits</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Total Orders</div>
          <div className="text-2xl font-black text-white mt-1">{orders.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{completedOrders} Completed</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Customer Inquiries</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{inquiries.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{pendingInquiries} Awaiting Reply</div>
        </div>
        <div className="stat-card">
          <div className="text-xs text-slate-400 font-medium">Online Offerings</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {catalogItems.filter((i) => i.isStorefrontEnabled).length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Purchasable products</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            activeTab === 'inquiries'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Product Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders Table / List */}
          <div className="lg:col-span-2 space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                No orders received yet. Orders placed through your storefront or AI will appear here.
              </div>
            ) : (
              orders.map((order) => {
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06] border-rose-500/50 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white font-bold text-xs">
                          #{order.id.slice(-3)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{order.customerName}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{order.customerEmail}</span>
                            <span>•</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-black text-white text-sm">${order.paidAmount}</div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            order.orderStatus === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <div>{order.items.map((i) => i.title).join(', ')}</div>
                      <div className="text-slate-500 text-[11px] capitalize">{order.paymentMethod} Payment</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Selected Order Detail Panel */}
          {selectedOrder && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-rose-500" />
                  <span>Order #{selectedOrder.id}</span>
                </h3>

                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e: any) =>
                    updateOrderStatus(selectedOrder.id, e.target.value)
                  }
                  className="bg-black/50 border border-white/10 rounded-lg text-xs font-semibold px-2 py-1 text-slate-200"
                >
                  <option value="new">New</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Contact */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold">Customer Details</div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedOrder.customerEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedOrder.customerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 text-xs">
                <div className="text-slate-400 font-semibold">Purchased Items</div>
                <div className="space-y-1.5">
                  {selectedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/5"
                    >
                      <span className="text-slate-200 font-medium">{item.title}</span>
                      <span className="text-white font-bold">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Events Timeline */}
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-semibold">Tracking Timeline</span>
                  <button
                    onClick={() => setShowEventModal(true)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Event</span>
                  </button>
                </div>

                <div className="space-y-2 relative pl-4 border-l border-white/10 ml-2">
                  {(selectedOrder.trackingEvents || []).map((ev, i) => (
                    <div key={i} className="relative group">
                      <div className="w-2 h-2 rounded-full bg-rose-500 absolute -left-[21px] top-1" />
                      <div className="font-semibold text-white text-xs">{ev.title}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{ev.location}</span>
                        <span>•</span>
                        <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {inquiries.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
                No customer inquiries yet.
              </div>
            ) : (
              inquiries.map((inq) => {
                const isSelected = selectedInquiry?.id === inq.id;

                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/[0.06] border-rose-500/50 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-white text-sm">{inq.customerName}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          inq.status === 'answered'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>

                    <div className="text-xs text-rose-400 font-medium mt-1">
                      Re: {inq.catalogItemTitle || 'General Product Question'}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2">
                      "{inq.query}"
                    </p>

                    {inq.response && (
                      <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                        <strong>Reply sent:</strong> {inq.response}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Inquiry Reply Panel */}
          {selectedInquiry && (
            <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-3">
                <MessageSquare className="w-4 h-4 text-rose-500" />
                <span>Customer Query</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="text-slate-400">Customer: <strong className="text-white">{selectedInquiry.customerName}</strong> ({selectedInquiry.customerEmail})</div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-slate-200 leading-relaxed">
                  "{selectedInquiry.query}"
                </div>
              </div>

              <form onSubmit={handleSendInquiryReply} className="space-y-3 text-xs">
                <label className="text-slate-300 font-semibold block">Send Business Reply</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type your response to the customer..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="input-field w-full text-xs"
                />
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-xs">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply Email</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Add Tracking Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f121a] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Truck className="w-5 h-5 text-rose-500" />
              <span>Add Order Tracking Step</span>
            </h3>

            <form onSubmit={handleAddTrackingEvent} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Location / Bay / City</label>
                <input
                  type="text"
                  required
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="input-field w-full text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
