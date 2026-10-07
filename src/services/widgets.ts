import { WidgetConfig } from '@/types';

export function generateWidgetEmbedCode(config: WidgetConfig, businessSlug: string, baseUrl: string = 'https://ai-voice-receptionist.io'): { scriptTag: string; iframeTag: string } {
  const scriptTag = `<!-- Multi-Tenant AI Voice Receptionist Widget -->
<script
  src="${baseUrl}/widget.js"
  data-business-slug="${businessSlug}"
  data-primary-color="${config.primaryColor}"
  data-position="${config.position}"
  data-button-text="${config.buttonText}"
  defer
></script>`;

  const iframeTag = `<!-- AI Voice Assistant Embed Iframe -->
<iframe
  src="${baseUrl}/sites/${businessSlug}?embed=true"
  width="420"
  height="640"
  style="border: none; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);"
  allow="microphone"
  title="${config.title}"
></iframe>`;

  return { scriptTag, iframeTag };
}