import { create } from 'zustand';
import { TranscriptEntry } from '@/types';

interface VoiceStoreState {
  isOpen: boolean;
  isCalling: boolean;
  isConnecting: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  isMuted: boolean;
  isSpeakerMuted: boolean;
  callDuration: number;
  activeAgentId: string | null;
  activeBusinessId: string | null;
  transcript: TranscriptEntry[];
  audioLevels: number[];
  error: string | null;

  // Actions
  openCallModal: (agentId?: string, businessId?: string) => void;
  closeCallModal: () => void;
  startCall: (agentId: string, businessId: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeakerMute: () => void;
  setIsSpeaking: (speaking: boolean) => void;
  setIsListening: (listening: boolean) => void;
  setAudioLevels: (levels: number[]) => void;
  addTranscriptEntry: (entry: TranscriptEntry) => void;
  clearTranscript: () => void;
  incrementDuration: () => void;
  setError: (error: string | null) => void;
}

export const useVoiceStore = create<VoiceStoreState>((set, get) => ({
  isOpen: false,
  isCalling: false,
  isConnecting: false,
  isSpeaking: false,
  isListening: false,
  isMuted: false,
  isSpeakerMuted: false,
  callDuration: 0,
  activeAgentId: null,
  activeBusinessId: null,
  transcript: [],
  audioLevels: [20, 45, 75, 90, 60, 40, 70, 30],
  error: null,

  openCallModal: (agentId, businessId) =>
    set({
      isOpen: true,
      activeAgentId: agentId || null,
      activeBusinessId: businessId || null,
      error: null,
    }),

  closeCallModal: () => {
    const { endCall } = get();
    endCall();
    set({ isOpen: false });
  },

  startCall: (agentId: string, businessId: string) =>
    set({
      isCalling: true,
      isConnecting: true,
      activeAgentId: agentId,
      activeBusinessId: businessId,
      callDuration: 0,
      transcript: [],
      error: null,
    }),

  endCall: () =>
    set({
      isCalling: false,
      isConnecting: false,
      isSpeaking: false,
      isListening: false,
      callDuration: 0,
    }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  toggleSpeakerMute: () => set((state) => ({ isSpeakerMuted: !state.isSpeakerMuted })),

  setIsSpeaking: (speaking: boolean) => set({ isSpeaking: speaking }),

  setIsListening: (listening: boolean) => set({ isListening: listening }),

  setAudioLevels: (levels: number[]) => set({ audioLevels: levels }),

  addTranscriptEntry: (entry: TranscriptEntry) =>
    set((state) => ({
      transcript: [...state.transcript, entry],
    })),

  clearTranscript: () => set({ transcript: [] }),

  incrementDuration: () => set((state) => ({ callDuration: state.callDuration + 1 })),

  setError: (error: string | null) => set({ error }),
}));