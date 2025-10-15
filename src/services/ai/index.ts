import Constants from 'expo-constants';

export type AdvisorMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type AdvisorContext = {
  budget?: { income: number; fixedExpenses: number } | null;
  expensesByCategory?: { category: string; total: number }[];
};

export interface AIProvider {
  chat(messages: AdvisorMessage[], context?: AdvisorContext): Promise<string>;
}

export async function getAIProvider(): Promise<AIProvider> {
  const provider = Constants.expoConfig?.extra?.aiProvider || 'mock';
  if (provider === 'openai') {
    const mod = await import('./providers/openai');
    return new mod.OpenAIProvider();
  }
  const mod = await import('./providers/mock');
  return new mod.MockAIProvider();
}
