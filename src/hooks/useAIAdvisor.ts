import { useState } from 'react';
import { getAIProvider } from '@/services/ai';
import { getBudget, listExpensesByCategory } from '@/services/storage/db';

export function useAIAdvisor() {
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);

  const send = async (text: string) => {
    setBusy(true);
    try {
      setMessages(prev => [...prev, { role: 'user', content: text }]);
      const [budget, byCat] = await Promise.all([getBudget(), listExpensesByCategory()]);
      const provider = await getAIProvider();
      const reply = await provider.chat(
        [{ role: 'user', content: text }],
        { budget: budget ? { income: budget.income, fixedExpenses: budget.fixedExpenses } : null, expensesByCategory: byCat }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setBusy(false);
    }
  };

  return { busy, messages, send };
}
