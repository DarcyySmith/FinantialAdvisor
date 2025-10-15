import { listExpensesByCategory } from '@/services/storage/db';

export async function buildCategoryChartData() {
  const rows = await listExpensesByCategory();
  return rows.map(r => ({ x: r.category, y: Number(r.total) }));
}
