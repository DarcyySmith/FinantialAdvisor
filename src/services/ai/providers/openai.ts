import Constants from 'expo-constants';
import type { AIProvider, AdvisorContext, AdvisorMessage } from '../index';

export class OpenAIProvider implements AIProvider {
  async chat(messages: AdvisorMessage[], context?: AdvisorContext): Promise<string> {
    const apiKey = Constants.expoConfig?.extra?.openaiApiKey as string | undefined;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    const sysContext = `Eres un asesor financiero. Contexto: ${JSON.stringify(context ?? {})}`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: sysContext }, ...messages]
      })
    });

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content || 'No hay respuesta';
    return text;
  }
}
