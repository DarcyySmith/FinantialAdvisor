import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/theme/colors';

export type Expense = {
  id?: number;
  title: string;
  amount: number;
  category: string;
  date?: string;
};

export default function ExpenseCard({ item }: { item: Expense }) {
  return (
    <View style={{ backgroundColor: colors.card, padding: 12, borderRadius: 10, marginBottom: 8 }}>
      <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
      <Text style={{ color: colors.muted }}>{item.category}</Text>
      <Text style={{ color: colors.primary, marginTop: 6 }}>${item.amount.toFixed(2)}</Text>
    </View>
  );
}
