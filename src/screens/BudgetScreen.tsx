import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '@/theme/colors';
import { useBudget } from '@/hooks/useBudget';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

export default function BudgetScreen({ navigation }: NativeStackScreenProps<RootStackParamList, 'Budget'>) {
  const { loading, income, fixed, setIncome, setFixed, available, recommend, persist } = useBudget();
  const [editing, setEditing] = useState(false);

  if (loading) return <Text style={{ color: colors.text, padding: 16 }}>Cargando...</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Tu Presupuesto</Text>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ color: colors.muted, marginBottom: 6 }}>Ingresos mensuales</Text>
        <TextInput
          keyboardType="decimal-pad"
          editable={editing}
          value={String(income || '')}
          onChangeText={t => setIncome(Number(t) || 0)}
          style={{ color: colors.text, backgroundColor: '#0b1220', padding: 10, borderRadius: 8 }}
        />

        <Text style={{ color: colors.muted, marginVertical: 6 }}>Gastos fijos</Text>
        <TextInput
          keyboardType="decimal-pad"
          editable={editing}
          value={String(fixed || '')}
          onChangeText={t => setFixed(Number(t) || 0)}
          style={{ color: colors.text, backgroundColor: '#0b1220', padding: 10, borderRadius: 8 }}
        />

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
          <Button title={editing ? 'Guardar' : 'Editar'} onPress={async () => {
            if (editing) await persist(income, fixed);
            setEditing(!editing);
          }} />
        </View>
      </View>

      <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ color: colors.text }}>Disponible</Text>
        <Text style={{ color: colors.primary, fontSize: 24, fontWeight: '700' }}>${available.toFixed(2)}</Text>
        <Text style={{ color: colors.muted, marginTop: 6 }}>Recomendación</Text>
        <Text style={{ color: colors.text }}>Ahorro sugerido: ${recommend.save.toFixed(2)}</Text>
        <Text style={{ color: colors.text }}>Inversión sugerida: ${recommend.invest.toFixed(2)}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Receipts')}>
          <Text style={{ color: '#60a5fa' }}>Analizar recibos</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Chatbot')}>
          <Text style={{ color: '#60a5fa' }}>Asesor IA</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Reports')}>
          <Text style={{ color: '#60a5fa' }}>Ver reportes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
