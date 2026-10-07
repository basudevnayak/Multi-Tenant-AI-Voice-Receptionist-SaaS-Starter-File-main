import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Multi-Tenant AI Voice Receptionist Widget Service Active',
    version: '1.0.0',
    capabilities: [
      'realtime_voice_stt_tts',
      'tool_calling_appointment_booking',
      'crm_lead_qualification',
      'human_operator_escalation',
    ],
  });
}