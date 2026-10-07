import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { BusinessProvider } from '@/providers/BusinessProvider';
import VoiceCallModal from '@/components/VoiceCallModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Multi-Tenant AI Voice Receptionist SaaS | Autonomous Calling Platform',
  description:
    'AI Voice Receptionist & Multi-Calling Agents for Hospitals, Real Estate, Local Shops & Services. Inbound/Outbound AI phone calling, automated appointment booking, lead qualification, and CRM integration.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <BusinessProvider>
          {children}
          <VoiceCallModal />
        </BusinessProvider>
      </body>
    </html>
  );
}
