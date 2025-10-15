import Constants from 'expo-constants';
import type { OCRResult, VisionProvider } from '../index';

export class GoogleVisionProvider implements VisionProvider {
  async parseReceipt(imageBase64: string): Promise<OCRResult> {
    const key = Constants.expoConfig?.extra?.googleVisionApiKey as string | undefined;
    if (!key) throw new Error('Google Vision API key not configured');

    // Minimal annotate request for TEXT_DETECTION
    const resp = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: 'TEXT_DETECTION' }]
          }
        ]
      })
    });

    const data = await resp.json();
    const text: string = data?.responses?.[0]?.fullTextAnnotation?.text || '';

    // Simple heuristics to parse amount and title
    const amountMatch = text.match(/\b(\d+[\.,]\d{2})\b/);
    const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : 0;
    const title = (text.split('\n')[0] || 'Recibo').slice(0, 40);

    // Category guess by keywords
    const lower = text.toLowerCase();
    const category = lower.includes('uber') || lower.includes('taxi') || lower.includes('bus')
      ? 'Transporte'
      : lower.includes('farmacia') || lower.includes('salud')
      ? 'Salud'
      : lower.includes('cine') || lower.includes('netflix') || lower.includes('spotify')
      ? 'Entretenimiento'
      : lower.includes('super') || lower.includes('market') || lower.includes('tienda') || lower.includes('rest')
      ? 'Alimentación'
      : 'Otros';

    return { title, amount, category };
  }
}
