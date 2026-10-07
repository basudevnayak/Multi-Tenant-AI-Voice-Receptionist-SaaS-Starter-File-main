'use client';

import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import { useBusinessStore } from '@/store/business';
import { useVoiceStore } from '@/store/voice';
import { generateWidgetEmbedCode } from '@/services/widgets';
import {
  Code2,
  Copy,
  Check,
  ExternalLink,
  Bot,
  PhoneCall,
  Layout,
} from 'lucide-react';
import Link from 'next/link';

export default function WidgetBuilderPage() {
  const { getActiveBusiness, getActiveWidgetConfig, updateWidgetConfig, getActiveAgents } =
    useBusinessStore();
  const { openCallModal } = useVoiceStore();

  const business = getActiveBusiness();
  const widgetConfig = getActiveWidgetConfig();
  const agents = getActiveAgents();

  const [title, setTitle] = useState(widgetConfig?.title || 'AI Voice Assistant');
  const [subtitle, setSubtitle] = useState(
    widgetConfig?.subtitle || 'Talk or chat in real-time'
  );
  const [primaryColor, setPrimaryColor] = useState(
    widgetConfig?.primaryColor || '#f43f5e'
  );
  const [buttonText, setButtonText] = useState(
    widgetConfig?.buttonText || 'Talk to AI Assistant'
  );
  const [greeting, setGreeting] = useState(
    widgetConfig?.greeting || 'Hi! How can I help you today?'
  );
  const [position, setPosition] = useState<'bottom-right' | 'bottom-left'>(
    widgetConfig?.position || 'bottom-right'
  );

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const { scriptTag, iframeTag } = generateWidgetEmbedCode(
    {
      id: widgetConfig?.id || 'w_1',
      businessId: business?.id || 'biz_1',
      title,
      subtitle,
      primaryColor,
      buttonText,
      greeting,
      position,
      isActive: true,
    },
    business?.slug || 'tenant'
  );

  const handleSaveConfig = () => {
    if (!business) return;
    updateWidgetConfig(business.id, {
      title,
      subtitle,
      primaryColor,
      buttonText,
      greeting,
      position,
    });
  };

  const copyToClipboard = (text: string, type: 'script' | 'iframe') => {
    navigator.clipboard.writeText(text);
    if (type === 'script') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
    } else {
      setCopiedIframe(true);
      setTimeout(() => setCopiedIframe(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#07090e]">
      <DashboardHeader
        title="Embeddable AI Voice Widget"
        subtitle={`Generate a custom AI voice receptionist widget for ${business?.name}'s external website`}
      />

      <main className="p-6 space-y-6 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Customizer Controls */}
          <div className="lg:col-span-6 card-surface p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Widget Customization
                </h3>
                <p className="text-[11px] text-slate-400">
                  Tune appearance and greeting for {business?.name}
                </p>
              </div>
              <button
                onClick={handleSaveConfig}
                className="btn-primary py-1.5"
              >
                Save Settings
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Widget Header Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Subtitle Description
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Brand Theme Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-9 rounded-xl cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="input-field font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Floating Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as 'bottom-right' | 'bottom-left')}
                  className="input-field"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Floating Button Label
              </label>
              <input
                type="text"
                value={buttonText}
                onChange={(e) => setButtonText(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Assistant Initial Greeting
              </label>
              <textarea
                rows={2}
                value={greeting}
                onChange={(e) => setGreeting(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          {/* Live Interactive Preview */}
          <div className="lg:col-span-6 bg-[#04060a] border border-white/5 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[440px]">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Live External Website Preview
                </span>
                <Link
                  href="/widget-demo"
                  target="_blank"
                  className="text-xs font-bold text-rose-400 hover:underline flex items-center gap-1"
                >
                  <span>Full Demo Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="mt-4 p-4 rounded-2xl bg-[#0e121c] border border-white/5 text-xs space-y-2">
                <div className="h-3 w-32 bg-white/10 rounded" />
                <div className="h-2 w-48 bg-white/5 rounded" />
                <p className="text-[11px] text-slate-400 pt-2">
                  This simulates how the floating assistant button and popup voice receptionist appear to visitors on your client&apos;s web domain.
                </p>
              </div>
            </div>

            {/* Simulated Floating Widget */}
            <div className={`pt-8 flex ${position === 'bottom-right' ? 'justify-end' : 'justify-start'}`}>
              <div className="w-80 bg-[#0e121c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-pop-in">
                <div
                  className="p-4 text-white flex items-center gap-2.5"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-xs">{title}</div>
                    <div className="text-[10px] text-white/80">{subtitle}</div>
                  </div>
                </div>

                <div className="p-4 space-y-3 bg-[#07090e]">
                  <div className="p-3 bg-[#141926] rounded-2xl text-[11px] text-slate-200 border border-white/5 shadow-2xs">
                    {greeting}
                  </div>

                  <button
                    onClick={() => openCallModal(agents[0]?.id, business?.id)}
                    className="w-full py-2.5 px-3 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all hover:opacity-90 active:scale-95"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>{buttonText}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Embed Code Snippets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-rose-400" />
                Option 1: JavaScript Embed Script
              </span>
              <button
                onClick={() => copyToClipboard(scriptTag, 'script')}
                className="btn-secondary py-1 text-xs"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-[#04060a] border border-white/5 text-rose-300 font-mono text-[11px] overflow-x-auto">
              <code>{scriptTag}</code>
            </pre>
          </div>

          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layout className="w-4 h-4 text-rose-400" />
                Option 2: Responsive HTML Iframe
              </span>
              <button
                onClick={() => copyToClipboard(iframeTag, 'iframe')}
                className="btn-secondary py-1 text-xs"
              >
                {copiedIframe ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIframe ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-2xl bg-[#04060a] border border-white/5 text-rose-300 font-mono text-[11px] overflow-x-auto">
              <code>{iframeTag}</code>
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
