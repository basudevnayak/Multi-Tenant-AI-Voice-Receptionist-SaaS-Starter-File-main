import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your-openai-api-key') {
      // Return simulated ephemeral session credentials if key not provided
      return NextResponse.json({
        client_secret: {
          value: 'mock_realtime_ephemeral_token_' + Date.now(),
          expires_at: Math.floor(Date.now() / 1000) + 60,
        },
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice: 'alloy',
        status: 'simulated',
      });
    }

    const body = await req.json().catch(() => ({}));
    const voice = body.voice || 'alloy';
    const instructions = body.instructions || 'You are an intelligent, helpful AI Voice Receptionist.';

    // Request ephemeral token from OpenAI Realtime REST API
    const response = await fetch('https://api.openai.com/v1/realtime/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice,
        instructions,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('OpenAI Realtime session error:', errText);
      return NextResponse.json({
        client_secret: {
          value: 'mock_realtime_ephemeral_token_' + Date.now(),
          expires_at: Math.floor(Date.now() / 1000) + 60,
        },
        model: 'gpt-4o-realtime-preview-2024-12-17',
        voice,
        status: 'simulated_fallback',
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Realtime Session Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create voice session' },
      { status: 500 }
    );
  }
}
