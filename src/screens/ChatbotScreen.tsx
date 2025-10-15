import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';
import { colors } from '@/theme/colors';
import { useAIAdvisor } from '@/hooks/useAIAdvisor';

export default function ChatbotScreen() {
  const { busy, messages, send } = useAIAdvisor();
  const [input, setInput] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Asesor IA</Text>
        {messages.map((m, idx) => (
          <View key={idx} style={{ backgroundColor: m.role === 'assistant' ? '#0b1220' : '#111827', padding: 10, borderRadius: 10, marginBottom: 8 }}>
            <Text style={{ color: colors.text }}>{m.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={{ padding: 12, backgroundColor: '#0b1220', flexDirection: 'row', gap: 8 }}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Pregunta algo sobre tus finanzas..."
          placeholderTextColor={colors.muted}
          style={{ flex: 1, backgroundColor: '#111827', color: colors.text, borderRadius: 8, paddingHorizontal: 10 }}
        />
        <Button title={busy ? '...' : 'Enviar'} onPress={() => { if (input.trim()) { void send(input.trim()); setInput(''); } }} disabled={busy} />
      </View>
    </View>
  );
}
