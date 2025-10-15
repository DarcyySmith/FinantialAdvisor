import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';

interface PlanAhorrosProps {
  disponible: number;
  onVolver: () => void;
}

export default function PlanAhorrosScreen({ disponible, onVolver }: PlanAhorrosProps) {
  const [metaAhorro, setMetaAhorro] = useState('');
  const [plazoMeses, setPlazoMeses] = useState('');

  // Calcular recomendaciones automáticas
  const ahorroRecomendado = disponible * 0.2;
  const inversionRecomendada = disponible * 0.1;
  const gastosVariables = disponible * 0.7;

  // Calcular cuánto tiempo tomará alcanzar la meta
  const calcularPlazo = () => {
    const meta = parseFloat(metaAhorro) || 0;
    if (meta > 0 && ahorroRecomendado > 0) {
      return Math.ceil(meta / ahorroRecomendado);
    }
    return 0;
  };

  // Calcular cuánto ahorrar mensualmente para alcanzar la meta en el plazo
  const calcularAhorroMensual = () => {
    const meta = parseFloat(metaAhorro) || 0;
    const plazo = parseInt(plazoMeses) || 0;
    if (meta > 0 && plazo > 0) {
      return meta / plazo;
    }
    return 0;
  };

  const mesesNecesarios = calcularPlazo();
  const ahorroMensualNecesario = calcularAhorroMensual();
  const esViable = ahorroMensualNecesario <= disponible;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📊 Plan de Ahorros</Text>
      <Text style={styles.subtitle}>Basado en tu presupuesto disponible</Text>

      {/* Resumen del presupuesto */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💰 Tu Presupuesto Disponible</Text>
        <Text style={styles.amountLarge}>${disponible.toFixed(2)}</Text>
        
        <View style={styles.divider} />
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>💵 Ahorro sugerido (20%)</Text>
          <Text style={styles.breakdownAmount}>${ahorroRecomendado.toFixed(2)}</Text>
        </View>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>📈 Inversión sugerida (10%)</Text>
          <Text style={styles.breakdownAmount}>${inversionRecomendada.toFixed(2)}</Text>
        </View>
        
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>🛒 Gastos variables (70%)</Text>
          <Text style={styles.breakdownAmount}>${gastosVariables.toFixed(2)}</Text>
        </View>
      </View>

      {/* Calculadora de metas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🎯 Calculadora de Metas</Text>
        
        <Text style={styles.label}>¿Cuánto quieres ahorrar?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 5000"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={metaAhorro}
          onChangeText={setMetaAhorro}
        />

        {metaAhorro && mesesNecesarios > 0 && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              ⏱️ Con el ahorro recomendado de ${ahorroRecomendado.toFixed(2)}/mes
            </Text>
            <Text style={styles.resultHighlight}>
              Alcanzarás tu meta en {mesesNecesarios} {mesesNecesarios === 1 ? 'mes' : 'meses'}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <Text style={styles.label}>¿En cuántos meses quieres lograrlo?</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={plazoMeses}
          onChangeText={setPlazoMeses}
        />

        {metaAhorro && plazoMeses && ahorroMensualNecesario > 0 && (
          <View style={[styles.resultBox, !esViable && styles.resultBoxWarning]}>
            <Text style={styles.resultText}>
              💰 Necesitas ahorrar mensualmente:
            </Text>
            <Text style={[styles.resultHighlight, !esViable && styles.textWarning]}>
              ${ahorroMensualNecesario.toFixed(2)}/mes
            </Text>
            {!esViable ? (
              <Text style={styles.warningText}>
                ⚠️ Esta meta excede tu presupuesto disponible. 
                Considera aumentar el plazo o reducir la meta.
              </Text>
            ) : (
              <Text style={styles.successText}>
                ✓ Esta meta es alcanzable con tu presupuesto actual
              </Text>
            )}
          </View>
        )}
      </View>

      {/* Consejos de ahorro */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>💡 Consejos para Ahorrar</Text>
        
        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>1</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Automatiza tu ahorro:</Text> Configura una transferencia automática 
            el día que recibes tu salario.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>2</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Regla 50/30/20:</Text> 50% necesidades, 30% gustos, 20% ahorros e inversión.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>3</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Fondo de emergencia:</Text> Ahorra al menos 3-6 meses de gastos 
            antes de invertir.
          </Text>
        </View>

        <View style={styles.tipItem}>
          <Text style={styles.tipNumber}>4</Text>
          <Text style={styles.tipText}>
            <Text style={styles.tipBold}>Revisa gastos hormiga:</Text> Pequeños gastos diarios pueden 
            sumar mucho al mes.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  amountLarge: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#94a3b8',
    flex: 1,
  },
  breakdownAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#e2e8f0',
    marginBottom: 12,
  },
  resultBox: {
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  resultBoxWarning: {
    borderWidth: 2,
    borderColor: '#ef4444',
  },
  resultText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  resultHighlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  textWarning: {
    color: '#ef4444',
  },
  warningText: {
    fontSize: 13,
    color: '#fbbf24',
    marginTop: 4,
  },
  successText: {
    fontSize: 13,
    color: '#10b981',
    marginTop: 4,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  tipNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: '600',
    color: '#e2e8f0',
  },
});
