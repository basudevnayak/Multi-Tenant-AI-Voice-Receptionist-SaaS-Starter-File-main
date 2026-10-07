'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import {
  Phone,
  Calendar,
  Clock,
  Home,
  Bot,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function TenantPublicSitePage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { businesses, agents, services, knowledge, addAppointment } = useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = businesses.find((b) => b.slug === slug) || businesses[0];
  const businessAgents = agents.filter((a) => a.businessId === business?.id);
  const businessServices = services.filter((s) => s.businessId === business?.id);
  const businessFaqs = knowledge.filter((k) => k.businessId === business?.id);
  const primaryAgent = businessAgents[0];

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState(businessServices[0]?.id || '');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [startTime, setStartTime] = useState(
    new Date(Date.now() + 24 * 3600000).toISOString().slice(0, 16)
  );
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const handleOnlineBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    const matchedService = businessServices.find((s) => s.id === selectedService);

    addAppointment({
      id: `apt_${Date.now()}`,
      businessId: business.id,
      serviceId: selectedService,
      serviceName: matchedService?.name || 'General Consultation',
      customerName,
      customerPhone,
      customerEmail,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(new Date(startTime).getTime() + 30 * 60000).toISOString(),
      status: 'confirmed',
      notes: 'Booked directly through public portal',
      bookedVia: 'web_portal',
      createdAt: new Date().toISOString(),
    });

    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setShowBookingModal(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-rose-600 selection:text-white relative overflow-x-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Top Bar / Header */}
      <header className="h-20 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-rose-600/30">
              <Home className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white leading-tight">
                {business?.name}
              </h1>
              <p className="text-xs text-slate-400 capitalize">
                {business?.industry.replace('_', ' ')} • Official Client Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${business?.phoneNumber}`}
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-rose-400" />
              <span>{business?.phoneNumber}</span>
            </a>

            <button
              onClick={() => openCallModal(primaryAgent?.id, business?.id)}
              className="btn-primary"
            >
              <Bot className="w-4 h-4" />
              <span>Talk to {primaryAgent?.name || 'AI Receptionist'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-spin-slow" />
            <span>24/7 AI Voice Receptionist Active</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Welcome to {business?.name}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Need to book an appointment, inquire about services, or ask questions? Our autonomous AI Voice Receptionist is standing by to assist you.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => openCallModal(primaryAgent?.id, business?.id)}
              className="btn-primary px-7 py-3.5"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call AI Receptionist Now</span>
            </button>

            <button
              onClick={() => setShowBookingModal(true)}
              className="btn-secondary px-6 py-3.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Online</span>
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-14 px-6 max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
            Available Services & Pricing
          </span>
          <h3 className="text-2xl font-bold text-white">
            Select a service to book with {business?.name}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {businessServices.map((srv) => (
            <div
              key={srv.id}
              className="card-surface p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge bg-white/5 text-slate-300 border-white/5 uppercase">
                    {srv.category}
                  </span>
                  <span className="text-lg font-black text-rose-400">
                    {srv.price > 0 ? `$${srv.price}` : 'Complimentary'}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-1">{srv.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{srv.description}</p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {srv.durationMinutes} mins
                </span>

                <button
                  onClick={() => {
                    setSelectedService(srv.id);
                    setShowBookingModal(true);
                  }}
                  className="btn-primary py-1.5 px-3 text-xs"
                >
                  <span>Book Slot</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      {businessFaqs.length > 0 && (
        <section className="bg-[#0a0d16] py-14 px-6 border-y border-white/5">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                Frequently Asked Questions
              </span>
              <h3 className="text-2xl font-bold text-white">
                Common inquiries answered by our AI Assistant
              </h3>
            </div>

            <div className="space-y-4">
              {businessFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="card-surface p-5 space-y-1.5"
                >
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="text-rose-400 font-black">Q:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer Info */}
      <footer className="bg-[#04060a] text-slate-500 py-10 px-6 mt-auto border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white text-sm">{business?.name}</div>
            <p>{business?.address}</p>
            <p>Phone: {business?.phoneNumber} • Email: {business?.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="btn-secondary"
            >
              Tenant Admin Portal
            </Link>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-[#0e121c] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl">
            {bookedSuccess ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-white">
                  Appointment Confirmed!
                </h3>
                <p className="text-xs text-slate-400">
                  We look forward to seeing you at {business?.name}.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-base font-bold text-white mb-1">
                  Book Your Appointment
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Reserve a time with {business?.name}.
                </p>

                <form onSubmit={handleOnlineBooking} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Eleanor Vance"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Phone Number (For SMS confirmation)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Service / Consultation
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="input-field"
                    >
                      {businessServices.map((srv) => (
                        <option key={srv.id} value={srv.id}>
                          {srv.name} ({srv.price > 0 ? `$${srv.price}` : 'Free'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Desired Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input-field"
                    />
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="btn-secondary flex-1 py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex-1 py-2.5"
                    >
                      Confirm Appointment
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
