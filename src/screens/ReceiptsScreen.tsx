import React from 'react';
import { View, Text, Button, ScrollView, Image } from 'react-native';
import { colors } from '@/theme/colors';
import { useReceipts } from '@/hooks/useReceipts';
import ExpenseCard from '@/components/ExpenseCard';

export default function ReceiptsScreen() {
  const { items, busy, pickAndParse } = useReceipts();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Recibos</Text>

      <Button title={busy ? 'Procesando...' : 'Subir recibo'} onPress={pickAndParse} disabled={busy} />

      <View style={{ height: 12 }} />
      {items.map(item => (
        <View key={item.id}>
          {item.imageUri ? (
            <Image source={{ uri: item.imageUri }} style={{ width: '100%', height: 180, borderRadius: 10, marginBottom: 6 }} />
          ) : null}
          <ExpenseCard item={item} />
        </View>
      ))}

      {!items.length && <Text style={{ color: colors.muted, marginTop: 12 }}>No hay recibos aún.</Text>}
    </ScrollView>
  );
}
