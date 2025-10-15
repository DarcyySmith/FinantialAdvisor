import type { AIProvider, AdvisorContext, AdvisorMessage } from '../index';

export class MockAIProvider implements AIProvider {
  async chat(_messages: AdvisorMessage[], context?: AdvisorContext): Promise<string> {
    const income = context?.budget?.income ?? 0;
    const fixed = context?.budget?.fixedExpenses ?? 0;
    const net = income - fixed;
    const save = Math.max(0, Math.round(net * 0.2));
    const invest = Math.max(0, Math.round(net * 0.1));
    return `Sugerencia: ahorra $${save} y considera invertir $${invest}. Prioriza reducir gastos en la categoría más alta.`;
  }
}
