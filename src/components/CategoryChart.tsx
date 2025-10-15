import React from 'react';
import { View } from 'react-native';
import { VictoryPie } from 'victory-native';
import { colors } from '@/theme/colors';

export type CategoryDatum = { x: string; y: number };

export default function CategoryChart({ data }: { data: CategoryDatum[] }) {
  if (!data?.length) return null;
  return (
    <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12 }}>
      <VictoryPie
        data={data}
        colorScale={[colors.primary, '#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#f59e0b', '#ef4444']}
        innerRadius={60}
        labels={({ datum }) => `${datum.x}: ${datum.y}`}
        style={{ labels: { fill: colors.text, fontSize: 13 } }}
        height={260}
      />
    </View>
  );
}
