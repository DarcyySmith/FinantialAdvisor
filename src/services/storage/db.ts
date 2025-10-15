import * as SQLite from 'expo-sqlite';

export type Budget = { id?: number; income: number; fixedExpenses: number; createdAt?: string };
export type Receipt = { id?: number; title: string; amount: number; category: string; imageUri?: string; createdAt?: string };

const db = SQLite.openDatabaseSync('smartfinance.db');

export async function initDb() {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS budget (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      income REAL NOT NULL,
      fixedExpenses REAL NOT NULL,
      createdAt TEXT DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS receipts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      category TEXT NOT NULL,
      imageUri TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );
  `);
}

export async function upsertBudget(income: number, fixedExpenses: number) {
  await db.runAsync('DELETE FROM budget');
  await db.runAsync('INSERT INTO budget (income, fixedExpenses) VALUES (?, ?)', [income, fixedExpenses]);
}

export async function getBudget(): Promise<Budget | null> {
  const res = await db.getAllAsync<Budget>('SELECT * FROM budget ORDER BY id DESC LIMIT 1');
  return res?.[0] || null;
}

export async function addReceipt(r: Omit<Receipt, 'id' | 'createdAt'>) {
  await db.runAsync(
    'INSERT INTO receipts (title, amount, category, imageUri) VALUES (?, ?, ?, ?)',
    [r.title, r.amount, r.category, r.imageUri || null]
  );
}

export async function listReceipts(): Promise<Receipt[]> {
  const res = await db.getAllAsync<Receipt>('SELECT * FROM receipts ORDER BY createdAt DESC');
  return res;
}

export async function listExpensesByCategory(): Promise<{ category: string; total: number }[]> {
  const res = await db.getAllAsync<{ category: string; total: number }>(
    'SELECT category, SUM(amount) as total FROM receipts GROUP BY category ORDER BY total DESC'
  );
  return res;
}
