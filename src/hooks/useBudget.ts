import { useEffect, useMemo, useState } from 'react';
import { getBudget, initDb, upsertBudget } from '@/services/storage/db';

export function useBudget() {
  const [income, setIncome] = useState(0);
  const [fixed, setFixed] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await initDb();
      const b = await getBudget();
      if (b) {
        setIncome(b.income);
        setFixed(b.fixedExpenses);
      }
      setLoading(false);
    })();
  }, []);

  const available = useMemo(() => income - fixed, [income, fixed]);
  const recommend = useMemo(() => {
    const save = Math.max(0, available * 0.2);
    const invest = Math.max(0, available * 0.1);
    return { save, invest };
  }, [available]);

  const persist = async (ni: number, nf: number) => {
    setIncome(ni);
    setFixed(nf);
    await upsertBudget(ni, nf);
  };

  return { loading, income, fixed, setIncome, setFixed, available, recommend, persist };
}
