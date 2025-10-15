import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlanAhorrosScreen from './PlanAhorrosScreen';
import ChatScreen from './ChatScreen';

const STORAGE_KEY = '@presupuesto_mensual';

export default function App() {
  const [ingresos, setIngresos] = useState('');
  const [gastos, setGastos] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [mostrarPlanAhorros, setMostrarPlanAhorros] = useState(false);
  const [mostrarChat, setMostrarChat] = useState(false);

  // Cargar datos al iniciar la app
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const datos = await AsyncStorage.getItem(STORAGE_KEY);
      if (datos !== null) {
        const { ingresos: ing, gastos: gast } = JSON.parse(datos);
        setIngresos(ing);
        setGastos(gast);
        setGuardado(true);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const guardarDatos = async () => {
    try {
      const datos = {
        ingresos,
        gastos,
        fecha: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
      setGuardado(true);
      Alert.alert('✓ Guardado', 'Tus datos han sido guardados correctamente');
    } catch (error) {
      console.error('Error al guardar datos:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos');
    }
  };

  const calcularDisponible = () => {
    const ing = parseFloat(ingresos) || 0;
    const gast = parseFloat(gastos) || 0;
    return ing - gast;
  };

  const disponible = calcularDisponible();

  // Si está en el chat, mostrarlo
  if (mostrarChat) {
    return (
      <ChatScreen
        disponible={disponible}
        ingresos={parseFloat(ingresos) || 0}
        gastos={parseFloat(gastos) || 0}
        onVolver={() => setMostrarChat(false)}
      />
    );
  }

  // Si está en la pantalla de plan de ahorros, mostrarla
  if (mostrarPlanAhorros) {
    return (
      <PlanAhorrosScreen 
        disponible={disponible}
        onVolver={() => setMostrarPlanAhorros(false)}
      />
    );
  }

  // Pantalla principal de presupuesto
  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Smart Finance Advisor</Text>
      <Text style={styles.subtitle}>Tu asesor financiero personal</Text>
      
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>💰 Presupuesto Mensual</Text>
          {guardado && (
            <View style={styles.savedBadge}>
              <Text style={styles.savedText}>✓ Guardado</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.label}>Ingresos mensuales</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 3000"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={ingresos}
          onChangeText={(text) => {
            setIngresos(text);
            setGuardado(false);
          }}
        />
        
        <Text style={styles.label}>Gastos fijos</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 1500"
          placeholderTextColor="#64748b"
          keyboardType="numeric"
          value={gastos}
          onChangeText={(text) => {
            setGastos(text);
            setGuardado(false);
          }}
        />
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={guardarDatos}
        >
          <Text style={styles.saveButtonText}>💾 Guardar Presupuesto</Text>
        </TouchableOpacity>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Disponible</Text>
          <Text style={[styles.resultAmount, disponible < 0 && styles.negative]}>
            ${disponible.toFixed(2)}
          </Text>
        </View>
        
        {disponible > 0 && (
          <>
            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>💡 Recomendaciones</Text>
              <Text style={styles.tipText}>• Ahorro: ${(disponible * 0.2).toFixed(2)} (20%)</Text>
              <Text style={styles.tipText}>• Inversión: ${(disponible * 0.1).toFixed(2)} (10%)</Text>
              <Text style={styles.tipText}>• Gastos variables: ${(disponible * 0.7).toFixed(2)} (70%)</Text>
            </View>

            <TouchableOpacity 
              style={styles.planButton}
              onPress={() => setMostrarPlanAhorros(true)}
            >
              <Text style={styles.planButtonText}>📊 Ver Plan de Ahorros Detallado →</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.chatButton}
              onPress={() => setMostrarChat(true)}
            >
              <Text style={styles.chatButtonText}>🤖 Hablar con Asesor IA →</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  savedBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savedText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#e2e8f0',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 20,
    marginTop: 24,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  resultAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#10b981',
  },
  negative: {
    color: '#ef4444',
  },
  tipsCard: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#cbd5e1',
    marginBottom: 6,
  },
  planButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  planButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  chatButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
