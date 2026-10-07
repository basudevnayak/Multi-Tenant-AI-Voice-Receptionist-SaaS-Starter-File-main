import React from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#07090e] text-slate-100 selection:bg-rose-600 selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden bg-[#07090e]">
        {children}
      </div>
    </div>
  );
}
