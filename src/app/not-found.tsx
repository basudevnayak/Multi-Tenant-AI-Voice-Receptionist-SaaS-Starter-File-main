import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#07090e] text-white">
      <div className="w-16 h-16 rounded-2xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black text-2xl mb-4 shadow-lg shadow-rose-600/20">
        404
      </div>
      <h2 className="text-2xl font-bold mb-2 text-white">Page Not Found</h2>
      <p className="text-xs text-slate-400 mb-6 max-w-sm">
        The requested resource or dashboard view could not be located.
      </p>
      <Link
        href="/dashboard"
        className="btn-primary px-6 py-2.5"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}