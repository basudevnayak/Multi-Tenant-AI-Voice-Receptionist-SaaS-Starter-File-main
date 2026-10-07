'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useVoiceStore } from '@/store/voice';
import { useBusinessStore } from '@/store/business';
import { generateAIResponse } from '@/ai/tools';
import { CallLog, Appointment, Lead } from '@/types';

export function useRealtimeVoice() {
  const voiceStore = useVoiceStore();
  const businessStore = useBusinessStore();

  const activeBusiness = businessStore.getActiveBusiness();
  const activeAgents = businessStore.getActiveAgents();
  const activeServices = businessStore.getActiveServices();
  const activeKnowledge = businessStore.getActiveKnowledge();
  const activeAppointments = businessStore.getActiveAppointments();

  const activeAgent =
    activeAgents.find((a) => a.id === voiceStore.activeAgentId) ||
    activeAgents[0] || {
      id: 'default_agent',
      businessId: activeBusiness?.id || 'biz_1',
      name: 'Dr. Maya (AI Receptionist)',
      role: 'Clinical Receptionist & Triage',
      type: 'inbound',
      voiceId: 'alloy',
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      systemPrompt: 'You are an AI receptionist.',
      greetingMessage: 'Thank you for calling. My name is Maya, your AI assistant. How may I assist you today?',
      status: 'active',
      maxCallDurationSeconds: 600,
      autoBookAppointments: true,
      collectLeadInfo: true,
      createdAt: new Date().toISOString(),
    };

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isListeningRef = useRef<boolean>(false);
  const isCallingRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false);

  const [liveInterimTranscript, setLiveInterimTranscript] = useState<string>('');
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean>(false);

  // Sync refs for event listeners
  useEffect(() => {
    isCallingRef.current = voiceStore.isCalling;
    isSpeakingRef.current = voiceStore.isSpeaking;
  }, [voiceStore.isCalling, voiceStore.isSpeaking]);

  // Initialize Speech Synthesis and Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = true;
          recognition.interimResults = true;
          recognition.lang = 'en-US';

          recognition.onresult = (event: any) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript;
              if (event.results[i].isFinal) {
                final += transcript;
              } else {
                interim += transcript;
              }
            }

            if (interim) {
              setLiveInterimTranscript(interim);
            }

            if (final.trim()) {
              setLiveInterimTranscript('');
              handleUserSpeech(final.trim());
            }
          };

          recognition.onerror = (event: any) => {
            console.warn('Speech Recognition notice:', event.error);
            if (event.error === 'not-allowed') {
              voiceStore.setError('Microphone access was denied. Please allow microphone permissions in your browser.');
            }
          };

          recognition.onend = () => {
            isListeningRef.current = false;
            // Auto restart recognition if call is active and AI is not speaking
            if (isCallingRef.current && !isSpeakingRef.current && !voiceStore.isMuted) {
              try {
                recognition.start();
                isListeningRef.current = true;
              } catch (e) {
                // Ignore start collision
              }
            }
          };

          recognitionRef.current = recognition;
        } catch (err) {
          console.warn('Speech recognition not available:', err);
        }
      }
    }

    return () => {
      stopCallAudio();
    };
  }, []);

  // Real Hardware Microphone Analyser for Waveforms
  const startMicAnalyser = async () => {
    try {
      if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      setMicPermissionGranted(true);

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevels = () => {
        if (!analyserRef.current || !isCallingRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Map 8 distinct frequency bands
        const levels = [];
        const step = Math.floor(dataArray.length / 8);
        for (let i = 0; i < 8; i++) {
          const val = dataArray[i * step] || 0;
          // Scale 0-255 to 15-100%
          const pct = Math.max(12, Math.min(100, Math.floor((val / 255) * 100) + 10));
          levels.push(pct);
        }

        voiceStore.setAudioLevels(levels);
        animFrameRef.current = requestAnimationFrame(updateLevels);
      };

      updateLevels();
    } catch (err) {
      console.warn('Microphone stream initialization info:', err);
      // Fallback animated waveform
      startFallbackWaveform();
    }
  };

  const stopMicAnalyser = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startFallbackWaveform = () => {
    const timer = setInterval(() => {
      if (!isCallingRef.current) {
        clearInterval(timer);
        return;
      }
      const levels = Array.from({ length: 8 }, () =>
        voiceStore.isSpeaking || voiceStore.isListening
          ? Math.floor(Math.random() * 70) + 25
          : 12
      );
      voiceStore.setAudioLevels(levels);
    }, 150);
  };

  // Call duration counter
  useEffect(() => {
    if (voiceStore.isCalling) {
      timerRef.current = setInterval(() => {
        voiceStore.incrementDuration();
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [voiceStore.isCalling]);

  // Start Speech Recognition Listening
  const startListening = useCallback(() => {
    if (recognitionRef.current && !voiceStore.isMuted) {
      try {
        if (!isListeningRef.current) {
          recognitionRef.current.start();
          isListeningRef.current = true;
        }
      } catch (e) {
        // Recognition already active
      }
      voiceStore.setIsListening(true);
    }
  }, [voiceStore.isMuted]);

  // Stop Speech Recognition Listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        isListeningRef.current = false;
      } catch (e) {}
    }
    voiceStore.setIsListening(false);
  }, []);

  // Text-to-Speech Engine
  const speakText = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!synthRef.current || voiceStore.isSpeakerMuted) {
        if (onEnd) setTimeout(onEnd, 1500);
        return;
      }

      // Stop listening while AI is talking
      stopListening();
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = activeAgent.voiceSpeed || 1.0;
      utterance.pitch = activeAgent.voicePitch || 1.0;

      // Select natural voice
      const voices = synthRef.current.getVoices();
      if (voices.length > 0) {
        const preferredVoice =
          voices.find(
            (v) =>
              v.lang.startsWith('en') &&
              (v.name.includes('Google') ||
                v.name.includes('Natural') ||
                v.name.includes('Samantha') ||
                v.name.includes('Karen') ||
                v.name.includes('Daniel') ||
                v.name.includes('Zira'))
          ) || voices[0];
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        voiceStore.setIsSpeaking(true);
        voiceStore.setIsListening(false);
      };

      utterance.onend = () => {
        voiceStore.setIsSpeaking(false);
        if (isCallingRef.current && !voiceStore.isMuted) {
          voiceStore.setIsListening(true);
          startListening();
        }
        if (onEnd) onEnd();
      };

      utterance.onerror = () => {
        voiceStore.setIsSpeaking(false);
        if (isCallingRef.current && !voiceStore.isMuted) {
          voiceStore.setIsListening(true);
          startListening();
        }
        if (onEnd) onEnd();
      };

      synthRef.current.speak(utterance);
    },
    [activeAgent, voiceStore.isSpeakerMuted, voiceStore.isMuted, startListening, stopListening]
  );

  const stopCallAudio = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    stopListening();
    stopMicAnalyser();
    voiceStore.setIsSpeaking(false);
    voiceStore.setIsListening(false);
  }, [stopListening]);

  // Initiate Call Session
  const startCallSession = useCallback(
    async (agentId?: string, businessId?: string) => {
      const targetBiz = businessId || activeBusiness?.id || 'biz_healthcare_01';
      const targetAgent = agentId || activeAgent?.id || 'agent_health_01';

      voiceStore.startCall(targetAgent, targetBiz);
      isCallingRef.current = true;

      // Request microphone access & start visualizer
      await startMicAnalyser();

      setTimeout(() => {
        const greeting = activeAgent.greetingMessage || 'Hello! How can I assist you today?';
        voiceStore.addTranscriptEntry({
          speaker: 'ai',
          text: greeting,
          timestamp: Date.now(),
        });
        speakText(greeting);
      }, 500);
    },
    [activeBusiness, activeAgent, speakText]
  );

  // Process User Speech Input
  const handleUserSpeech = useCallback(
    (userInput: string) => {
      if (!userInput.trim() || !isCallingRef.current) return;

      stopListening();
      setLiveInterimTranscript('');

      // Add user transcript entry
      voiceStore.addTranscriptEntry({
        speaker: 'caller',
        text: userInput,
        timestamp: Date.now(),
      });

      if (!activeBusiness) return;

      // Generate intelligent contextual response
      const aiResponse = generateAIResponse(
        userInput,
        activeBusiness,
        activeAgent,
        activeServices,
        activeKnowledge,
        activeAppointments
      );

      setTimeout(() => {
        voiceStore.addTranscriptEntry({
          speaker: 'ai',
          text: aiResponse.text,
          timestamp: Date.now(),
        });

        // Execute dynamic tool calling mutations
        if (aiResponse.toolCall) {
          if (aiResponse.toolCall.name === 'book_appointment') {
            const newApt: Appointment = {
              id: `apt_${Date.now().toString().slice(-6)}`,
              businessId: activeBusiness.id,
              agentId: activeAgent.id,
              serviceId: aiResponse.toolCall.data.serviceId || activeServices[0]?.id,
              serviceName: aiResponse.toolCall.data.serviceName || activeServices[0]?.name,
              customerName: 'Live Voice Caller',
              customerPhone: '+1 (555) 019-2834',
              startTime: new Date(Date.now() + 4 * 3600000).toISOString(),
              endTime: new Date(Date.now() + 4.75 * 3600000).toISOString(),
              status: 'confirmed',
              notes: `Booked during live voice call via ${activeAgent.name}. Topic: "${userInput}"`,
              bookedVia: 'ai_voice',
              createdAt: new Date().toISOString(),
            };
            businessStore.addAppointment(newApt);
          } else if (aiResponse.toolCall.name === 'capture_lead') {
            const newLead: Lead = {
              id: `lead_${Date.now().toString().slice(-5)}`,
              businessId: activeBusiness.id,
              name: 'Live Voice Caller',
              phone: '+1 (555) 019-2834',
              status: 'new',
              score: 85,
              source: 'AI Voice Receptionist',
              interest: userInput,
              aiSummary: `Captured from call with ${activeAgent.name}: "${userInput}"`,
              lastContactAt: new Date().toISOString(),
              createdAt: new Date().toISOString(),
            };
            businessStore.addLead(newLead);
          }
        }

        speakText(aiResponse.text);
      }, 350);
    },
    [
      activeBusiness,
      activeAgent,
      activeServices,
      activeKnowledge,
      activeAppointments,
      speakText,
      stopListening,
    ]
  );

  // End Call & automatically persist call log
  const endCallSession = useCallback(() => {
    isCallingRef.current = false;
    stopCallAudio();

    if (voiceStore.transcript.length > 0 && activeBusiness) {
      const callDuration = voiceStore.callDuration || 18;
      const callerEntries = voiceStore.transcript.filter((t) => t.speaker === 'caller');
      const lastCallerText = callerEntries[callerEntries.length - 1]?.text || 'General Inquiry';

      const newLog: CallLog = {
        id: `call_${Date.now().toString().slice(-6)}`,
        businessId: activeBusiness.id,
        agentId: activeAgent.id,
        agentName: activeAgent.name,
        callerName: 'Live Voice Caller',
        callerPhone: '+1 (555) 019-2834',
        direction: 'inbound',
        durationSeconds: callDuration,
        status: 'completed',
        sentiment: 'positive',
        aiSummary: `Live interactive call concluded. Caller topic: "${lastCallerText}". Handled by ${activeAgent.name}.`,
        outcome: 'Completed & Logged',
        actionTaken: 'Saved transcript to CRM call history',
        cost: Number((callDuration * 0.0003 + 0.01).toFixed(3)),
        createdAt: new Date().toISOString(),
        transcript: voiceStore.transcript,
      };

      businessStore.addCallLog(newLog);
      businessStore.updateBusiness(activeBusiness.id, {
        minutesUsed: activeBusiness.minutesUsed + Math.ceil(callDuration / 60),
      });
    }

    voiceStore.endCall();
  }, [voiceStore, activeBusiness, activeAgent, stopCallAudio]);

  return {
    voiceStore,
    activeBusiness,
    activeAgent,
    startCallSession,
    endCallSession,
    handleUserSpeech,
    speakText,
    startListening,
    stopListening,
    liveInterimTranscript,
    micPermissionGranted,
  };
}