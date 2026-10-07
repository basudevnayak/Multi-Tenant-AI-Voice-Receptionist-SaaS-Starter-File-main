'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { Appointment } from '@/types';
import {
  CalendarDays,
  Clock,
  Plus,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Search,
} from 'lucide-react';

export default function AppointmentsPage() {
  const {
    getActiveBusiness,
    getActiveAppointments,
    getActiveServices,
    addAppointment,
    updateAppointmentStatus,
  } = useBusinessStore();

  const business = getActiveBusiness();
  const appointments = getActiveAppointments();
  const services = getActiveServices();

  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [startTime, setStartTime] = useState(
    new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState('');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.customerPhone.includes(searchQuery) ||
      (apt.serviceName && apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const matchedService = services.find((s) => s.id === serviceId);

    const newApt: Appointment = {
      id: `apt_${Date.now()}`,
      businessId: business.id,
      serviceId,
      serviceName: matchedService ? matchedService.name : 'General Consultation',
      customerName,
      customerPhone,
      customerEmail,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(new Date(startTime).getTime() + 30 * 60000).toISOString(),
      status: 'confirmed',
      notes,
      bookedVia: 'manual',
      createdAt: new Date().toISOString(),
    };

    addAppointment(newApt);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setNotes('');
    setShowModal(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Appointments & Scheduling Calendar"
        subtitle={`Real-time bookings captured by AI Voice Receptionist for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Controls and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 card-surface p-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field w-auto"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Appointments List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAppointments.length === 0 ? (
            <div className="col-span-full text-center py-16 card-surface text-xs text-slate-500">
              No appointments found for the selected criteria.
            </div>
          ) : (
            filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="card-surface p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold text-sm">
                        {apt.customerName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {apt.customerName}
                        </h4>
                        <span className="text-[10px] text-slate-400">
                          Booked via {apt.bookedVia === 'ai_voice' ? '🤖 AI Voice' : 'Web/Admin'}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`badge ${
                        apt.status === 'confirmed'
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
                          : apt.status === 'completed'
                          ? 'bg-blue-950/50 text-blue-300 border-blue-500/30'
                          : apt.status === 'cancelled'
                          ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                          : 'bg-amber-950/50 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#141926] space-y-2 text-xs">
                    <div className="font-bold text-rose-400">
                      {apt.serviceName || 'Consultation'}
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {new Date(apt.startTime).toLocaleString([], {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{apt.customerPhone}</span>
                    </div>

                    {apt.customerEmail && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{apt.customerEmail}</span>
                      </div>
                    )}

                    {apt.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-2 border-t border-white/5">
                        &quot;{apt.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  {apt.status !== 'completed' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                      className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete
                    </button>
                  )}

                  {apt.status !== 'cancelled' && (
                    <button
                      onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                      className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal: New Appointment */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
            <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
              <h3 className="text-base font-bold text-white mb-1">
                Schedule New Appointment
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Add an appointment to {business?.name}&apos;s calendar.
              </p>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Customer / Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Service / Consultation
                    </label>
                    <select
                      value={serviceId}
                      onChange={(e) => setServiceId(e.target.value)}
                      className="input-field"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (${s.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Notes / Symptoms / Reason for Visit
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any specific context..."
                    className="input-field"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary flex-1 py-2.5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 py-2.5"
                  >
                    Confirm Booking
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
