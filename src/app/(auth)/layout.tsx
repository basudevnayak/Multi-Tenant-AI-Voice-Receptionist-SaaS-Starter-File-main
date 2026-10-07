import React from 'react';
import Link from 'next/link';
import { Mic, Sparkles } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#07090e] text-white flex flex-col justify-between p-6 relative overflow-hidden">
      {/* Background Red Glow */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[350px] bg-rose-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-500 flex items-center justify-center text-white shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <Mic className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
              <span>EstateCall</span>
              <span className="text-gradient-crimson">AI</span>
            </div>
            <div className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">
              Multi-Tenant AI Receptionist
            </div>
          </div>
        </Link>

        <Link
          href="/"
          className="btn-secondary text-xs"
        >
          ← Back to Homepage
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center py-10 relative z-10">
        {children}
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 relative z-10">
        © 2026 Multi-Tenant AI Voice Receptionist SaaS • Enterprise HIPAA & Voice AI
      </div>
    </div>
  );
}
