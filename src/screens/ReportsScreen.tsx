import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { colors } from '@/theme/colors';
import CategoryChart from '@/components/CategoryChart';
import { buildCategoryChartData } from '@/services/analytics';
import { getBudget } from '@/services/storage/db';

export default function ReportsScreen() {
  const [data, setData] = useState<{ x: string; y: number }[]>([]);
  const [income, setIncome] = useState(0);
  const [fixed, setFixed] = useState(0);

  useEffect(() => {
    (async () => {
      const d = await buildCategoryChartData();
      setData(d);
      const b = await getBudget();
      setIncome(b?.income ?? 0);
      setFixed(b?.fixedExpenses ?? 0);
    })();
  }, []);

  const totalExpenses = data.reduce((acc, it) => acc + it.y, 0);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Reportes</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ color: colors.text }}>Ingresos: ${income.toFixed(2)}</Text>
        <Text style={{ color: colors.text }}>Gastos fijos: ${fixed.toFixed(2)}</Text>
        <Text style={{ color: colors.text }}>Gastos variables (recibos): ${totalExpenses.toFixed(2)}</Text>
        <Text style={{ color: colors.text, marginTop: 6 }}>
          Balance: ${(income - fixed - totalExpenses).toFixed(2)}
        </Text>
      </View>

      <Text style={{ color: colors.text, fontSize: 16, marginBottom: 8 }}>Gastos por categoría</Text>
      <CategoryChart data={data} />
    </ScrollView>
  );
}
