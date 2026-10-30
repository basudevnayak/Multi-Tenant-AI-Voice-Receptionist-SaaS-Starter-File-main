'use client';

import React, { useState } from 'react';
import { useBusinessStore } from '@/store/business';
import {
  Bell,
  CheckCircle2,
  Calendar,
  ShoppingBag,
  MessageSquare,
  HelpCircle,
  Clock,
  Trash2,
  Check,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function NotificationsPage() {
  const {
    getActiveNotifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useBusinessStore();

  const notifications = getActiveNotifications();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredNotifs = notifications.filter((n) => {
    if (filterType === 'all') return true;
    if (filterType === 'unread') return !n.isRead;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-rose-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'support':
        return <HelpCircle className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-rose-500" />
            <span>Activity Notifications</span>
          </h1>
          <p className="text-sm text-slate-400">
            Realtime alerts for service bookings, upfront deposits, customer questions, and support tickets.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="btn-secondary flex items-center gap-2 text-xs"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/5">
        {[
          { id: 'all', label: `All (${notifications.length})` },
          { id: 'unread', label: `Unread (${unreadCount})` },
          { id: 'booking', label: 'Bookings' },
          { id: 'order', label: 'Store Orders' },
          { id: 'inquiry', label: 'Inquiries' },
          { id: 'support', label: 'Support' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-rose-600 text-white'
                : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-slate-400 text-xs">
            No notifications in this category.
          </div>
        ) : (
          filteredNotifs.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                !notif.isRead
                  ? 'bg-white/[0.04] border-rose-500/30'
                  : 'bg-white/[0.01] border-white/5 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-300">{notif.description}</p>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(notif.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {notif.link && (
                  <Link
                    href={notif.link}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs transition-colors flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationRead(notif.id)}
                    className="p-2 rounded-xl hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Mark Read"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
