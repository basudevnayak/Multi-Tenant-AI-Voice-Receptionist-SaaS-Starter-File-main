export * from './database';

export interface VoiceState {
  isCalling: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  isSpeakerMuted: boolean;
  callDuration: number;
  activeAgentId: string | null;
  activeBusinessId: string | null;
  transcript: Array<{
    id: string;
    speaker: 'ai' | 'caller';
    text: string;
    timestamp: number;
  }>;
  audioLevels: number[];
  error: string | null;
}

export interface IndustryConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  badge: string;
  defaultPrompt: string;
  defaultGreeting: string;
  sampleServices: Array<{ name: string; durationMinutes: number; price: number; category: string }>;
  sampleFaqs: Array<{ question: string; answer: string; category: string }>;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
}