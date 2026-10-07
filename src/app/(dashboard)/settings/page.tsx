'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { WeekDays } from '@/types';
import {
  Building2,
  Clock,
  Save,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { getActiveBusiness, updateBusiness } = useBusinessStore();
  const business = getActiveBusiness();

  const [name, setName] = useState(business?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(business?.phoneNumber || '');
  const [email, setEmail] = useState(business?.email || '');
  const [address, setAddress] = useState(business?.address || '');
  const [timezone, setTimezone] = useState(business?.timezone || 'America/New_York');
  const [saved, setSaved] = useState(false);

  const [hours, setHours] = useState(
    business?.businessHours || {
      monday: { open: '08:30', close: '18:00', isOpen: true },
      tuesday: { open: '08:30', close: '18:00', isOpen: true },
      wednesday: { open: '08:30', close: '18:00', isOpen: true },
      thursday: { open: '08:30', close: '18:00', isOpen: true },
      friday: { open: '08:30', close: '17:00', isOpen: true },
      saturday: { open: '09:00', close: '14:00', isOpen: true },
      sunday: { open: '10:00', close: '14:00', isOpen: false },
    }
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    updateBusiness(business.id, {
      name,
      phoneNumber,
      email,
      address,
      timezone,
      businessHours: hours,
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const days: WeekDays[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Tenant & Phone Line Settings"
        subtitle={`Configure business profile, dedicated AI phone numbers, and working hours for ${business?.name}`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <form onSubmit={handleSave} className="space-y-6">
          {/* General Business Info */}
          <div className="card-surface p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Building2 className="w-4 h-4 text-rose-400" />
                <span>Business Organization Profile</span>
              </div>
              <button
                type="submit"
                className="btn-primary"
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{saved ? 'Saved Successfully!' : 'Save Settings'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Assigned AI Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Support & Notification Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Timezone
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="input-field"
                >
                  <option value="America/New_York">Eastern Time (US & Canada)</option>
                  <option value="America/Chicago">Central Time (US & Canada)</option>
                  <option value="America/Denver">Mountain Time (US & Canada)</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                  <option value="Europe/London">London (GMT)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-300 mb-1">
                  Physical Office Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="card-surface p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm text-white pb-3 border-b border-white/5">
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Business Operating Hours (AI references for appointment scheduling)</span>
            </div>

            <div className="space-y-2.5">
              {days.map((day) => {
                const dayHour = hours[day] || { open: '09:00', close: '17:00', isOpen: true };
                return (
                  <div
                    key={day}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-[#141926] border border-white/5"
                  >
                    <div className="flex items-center gap-3 w-32">
                      <input
                        type="checkbox"
                        checked={dayHour.isOpen}
                        onChange={(e) =>
                          setHours({
                            ...hours,
                            [day]: { ...dayHour, isOpen: e.target.checked },
                          })
                        }
                        className="rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-bold capitalize text-white">
                        {day}
                      </span>
                    </div>

                    {dayHour.isOpen ? (
                      <div className="flex items-center gap-2 text-slate-300">
                        <input
                          type="time"
                          value={dayHour.open}
                          onChange={(e) =>
                            setHours({
                              ...hours,
                              [day]: { ...dayHour, open: e.target.value },
                            })
                          }
                          className="px-3 py-1.5 border border-white/10 rounded-xl bg-[#07090e] text-white"
                        />
                        <span className="text-slate-500 font-bold">to</span>
                        <input
                          type="time"
                          value={dayHour.close}
                          onChange={(e) =>
                            setHours({
                              ...hours,
                              [day]: { ...dayHour, close: e.target.value },
                            })
                          }
                          className="px-3 py-1.5 border border-white/10 rounded-xl bg-[#07090e] text-white"
                        />
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Closed</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
