import { Business, Agent, ServiceItem, KnowledgeItem, Appointment, Lead, CallLog } from '@/types';

export interface AIResponseResult {
  text: string;
  actionTaken?: string;
  toolCall?: {
    name: 'book_appointment' | 'capture_lead' | 'transfer_call' | 'answer_faq';
    data: any;
  };
  detectedSentiment: 'positive' | 'neutral' | 'negative';
  suggestedOutcome: string;
}

export function generateAIResponse(
  userSpeech: string,
  business: Business,
  agent: Agent,
  services: ServiceItem[],
  knowledge: KnowledgeItem[],
  existingAppointments: Appointment[]
): AIResponseResult {
  const query = userSpeech.toLowerCase().trim();

  // 1. Emergency / Urgent Check
  if (
    query.includes('emergency') ||
    query.includes('chest pain') ||
    query.includes('bleeding') ||
    query.includes('accident') ||
    query.includes('911') ||
    query.includes('unconscious')
  ) {
    const emergencyFaq = knowledge.find(k => k.category === 'urgent_protocol');
    return {
      text: emergencyFaq
        ? emergencyFaq.answer
        : `This sounds urgent. If you are experiencing a life-threatening emergency, please dial 911 immediately. I am also transferring you to our on-call supervisor right now.`,
      toolCall: {
        name: 'transfer_call',
        data: { target: agent.forwardingPhone || '+1 (800) 555-0100', reason: 'Emergency medical triage' },
      },
      detectedSentiment: 'neutral',
      suggestedOutcome: 'Transferred to Emergency Care',
      actionTaken: `Emergency transfer initiated to ${agent.forwardingPhone || 'staff line'}`,
    };
  }

  // 2. Transfer to Human Request
  if (
    query.includes('talk to a human') ||
    query.includes('speak to a person') ||
    query.includes('representative') ||
    query.includes('agent') ||
    query.includes('manager') ||
    query.includes('transfer me')
  ) {
    return {
      text: `I understand. I am transferring you directly to our human front desk team at ${business.phoneNumber}. Please hold on for just a moment.`,
      toolCall: {
        name: 'transfer_call',
        data: { target: agent.forwardingPhone || business.phoneNumber, reason: 'Caller requested human agent' },
      },
      detectedSentiment: 'neutral',
      suggestedOutcome: 'Transferred to Human Representative',
      actionTaken: `Call transferred to ${business.phoneNumber}`,
    };
  }

  // 3. Appointment Booking Intent
  if (
    query.includes('book') ||
    query.includes('schedule') ||
    query.includes('appointment') ||
    query.includes('visit') ||
    query.includes('reserve') ||
    query.includes('consultation') ||
    query.includes('showing') ||
    query.includes('oil change') ||
    query.includes('cleaning')
  ) {
    // Find relevant service
    const matchedService =
      services.find(s =>
        query.includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().split(' ').some(word => word.length > 3 && query.includes(word))
      ) || services[0];

    const requestedService = matchedService ? matchedService.name : 'General Consultation';
    const priceText = matchedService && matchedService.price > 0 ? ` for $${matchedService.price}` : '';

    return {
      text: `I'd be happy to schedule your ${requestedService}${priceText}. We have availability today at 2:30 PM, 4:00 PM, or tomorrow at 10:00 AM. Which time works best for you?`,
      toolCall: {
        name: 'book_appointment',
        data: {
          serviceId: matchedService?.id,
          serviceName: requestedService,
          proposedTimes: ['Today at 2:30 PM', 'Today at 4:00 PM', 'Tomorrow at 10:00 AM'],
        },
      },
      detectedSentiment: 'positive',
      suggestedOutcome: 'Appointment Requested / Proposed',
      actionTaken: `Checked slot availability for ${requestedService}`,
    };
  }

  // 4. Pricing / Cost Inquiries
  if (
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('how much') ||
    query.includes('fee') ||
    query.includes('rate') ||
    query.includes('quote')
  ) {
    const serviceList = services
      .slice(0, 3)
      .map(s => `${s.name} is ${s.price > 0 ? `$${s.price}` : 'complimentary'}`)
      .join(', ');

    return {
      text: `Here is our standard pricing at ${business.name}: ${serviceList}. Would you like me to book any of these services for you?`,
      toolCall: {
        name: 'answer_faq',
        data: { topic: 'pricing' },
      },
      detectedSentiment: 'positive',
      suggestedOutcome: 'Pricing Information Provided',
      actionTaken: 'Shared service catalog pricing',
    };
  }

  // 5. Hours & Location Inquiries
  if (
    query.includes('hours') ||
    query.includes('open') ||
    query.includes('close') ||
    query.includes('where are you') ||
    query.includes('address') ||
    query.includes('location') ||
    query.includes('parking')
  ) {
    return {
      text: `${business.name} is located at ${business.address}. We are open Monday through Friday from 8:30 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. Would you like directions or to schedule a visit?`,
      toolCall: {
        name: 'answer_faq',
        data: { topic: 'hours_location' },
      },
      detectedSentiment: 'neutral',
      suggestedOutcome: 'Hours & Location Provided',
      actionTaken: 'Provided physical address and operating hours',
    };
  }

  // 6. Knowledge Base Match
  for (const item of knowledge) {
    const match = item.keywords.some(k => query.includes(k.toLowerCase())) || query.includes(item.question.toLowerCase().slice(0, 15));
    if (match) {
      return {
        text: item.answer,
        toolCall: {
          name: 'answer_faq',
          data: { id: item.id, question: item.question },
        },
        detectedSentiment: 'positive',
        suggestedOutcome: 'FAQ Answered',
        actionTaken: `Answered question: "${item.question}"`,
      };
    }
  }

  // 7. General Inquiry / Default Conversational Response
  return {
    text: `Thank you for reaching out to ${business.name}. I am ${agent.name}. I can help you book appointments, review our available services, explain pricing, or answer questions about our location. What can I do for you today?`,
    toolCall: {
      name: 'capture_lead',
      data: { query: userSpeech },
    },
    detectedSentiment: 'positive',
    suggestedOutcome: 'Inquiry Handled',
    actionTaken: 'Provided business assistance menu',
  };
}
