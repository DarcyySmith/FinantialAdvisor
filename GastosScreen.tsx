import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

interface GastoCategoria {
  categoria: string;
  monto: number;
  porcentaje: number;
}

interface GastosScreenProps {
  onVolver: () => void;
}

export default function GastosScreen({ onVolver }: GastosScreenProps) {
  const [gastos, setGastos] = useState<GastoCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalGastos, setTotalGastos] = useState(0);

  const seleccionarArchivo = async () => {
    try {
      setLoading(true);
      
      // Abrir selector de archivos
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/csv',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setLoading(false);
        return;
      }

      const fileUri = result.assets[0].uri;

      // Leer el archivo de forma compatible con web y móvil
      let fileContent: string;
      
      if (fileUri.startsWith('http') || fileUri.startsWith('blob:')) {
        // Para web: usar fetch
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const reader = new FileReader();
        
        fileContent = await new Promise((resolve, reject) => {
          reader.onload = (e) => {
            const base64 = (e.target?.result as string).split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // Para móvil: usar FileSystem
        fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      // Procesar Excel
      procesarExcel(fileContent);
    } catch (error) {
      console.error('Error al seleccionar archivo:', error);
      Alert.alert('Error', 'No se pudo leer el archivo. Asegúrate de que sea un archivo Excel válido.');
      setLoading(false);
    }
  };

  const procesarExcel = (base64: string) => {
    try {
      // Convertir base64 a workbook
      const workbook = XLSX.read(base64, { type: 'base64' });
      
      // Obtener la primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertir a JSON
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (data.length === 0) {
        Alert.alert('Archivo vacío', 'El archivo Excel no contiene datos.');
        setLoading(false);
        return;
      }

      // Procesar datos y agrupar por categoría
      const gastosAgrupados = agruparPorCategoria(data);
      
      if (gastosAgrupados.length === 0) {
        Alert.alert(
          'Formato incorrecto',
          'El archivo debe tener columnas "Categoria" y "Monto" (o "Categoría" y "Monto").'
        );
        setLoading(false);
        return;
      }

      setGastos(gastosAgrupados);
      setLoading(false);
      Alert.alert('¡Éxito!', `Se cargaron ${gastosAgrupados.length} categorías de gastos.`);
    } catch (error) {
      console.error('Error al procesar Excel:', error);
      Alert.alert('Error', 'No se pudo procesar el archivo Excel.');
      setLoading(false);
    }
  };

  const agruparPorCategoria = (data: any[]): GastoCategoria[] => {
    const categorias: { [key: string]: number } = {};

    // Detectar nombres de columnas (con o sin tilde)
    const primeraFila = data[0];
    const columnaCategoriaKey = Object.keys(primeraFila).find(
      key => key.toLowerCase().includes('categor')
    );
    const columnaMontoKey = Object.keys(primeraFila).find(
      key => key.toLowerCase().includes('monto') || key.toLowerCase().includes('precio') || key.toLowerCase().includes('total')
    );

    if (!columnaCategoriaKey || !columnaMontoKey) {
      return [];
    }

    // Agrupar por categoría
    data.forEach((row) => {
      const categoria = String(row[columnaCategoriaKey] || 'Sin categoría').trim();
      const monto = parseFloat(row[columnaMontoKey]) || 0;

      if (categorias[categoria]) {
        categorias[categoria] += monto;
      } else {
        categorias[categoria] = monto;
      }
    });

    // Calcular total
    const total = Object.values(categorias).reduce((sum, val) => sum + val, 0);
    setTotalGastos(total);

    // Convertir a array y calcular porcentajes
    return Object.entries(categorias)
      .map(([categoria, monto]) => ({
        categoria,
        monto,
        porcentaje: (monto / total) * 100,
      }))
      .sort((a, b) => b.monto - a.monto);
  };

  const crearDatosGraficaPie = () => {
    return gastos.map((gasto, index) => ({
      x: gasto.categoria,
      y: gasto.monto,
      label: `${gasto.categoria}\n$${gasto.monto.toFixed(2)}`,
    }));
  };

  const crearDatosGraficaBarra = () => {
    return gastos.slice(0, 8).map((gasto) => ({
      x: gasto.categoria.length > 10 ? gasto.categoria.substring(0, 10) + '...' : gasto.categoria,
      y: gasto.monto,
    }));
  };

  const colores = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TouchableOpacity style={styles.backButton} onPress={onVolver}>
        <Text style={styles.backButtonText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>📊 Análisis de Gastos</Text>
      <Text style={styles.subtitle}>Importa tu Excel y visualiza tus gastos</Text>

      {/* Botón de importar */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📁 Importar Archivo Excel</Text>
        <Text style={styles.instructionText}>
          Tu archivo debe tener las columnas:{'\n'}
          • <Text style={styles.bold}>Categoria</Text> (ej: Comida, Transporte, etc.){'\n'}
          • <Text style={styles.bold}>Monto</Text> (ej: 150.50)
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={seleccionarArchivo}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.uploadButtonText}>📤 Seleccionar Archivo Excel</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.downloadTemplateButton}
          onPress={() => {
            Alert.alert(
              'Plantilla de Excel',
              'Crea un archivo Excel con estas columnas:\n\nCategoria | Monto\nComida | 150.50\nTransporte | 80.00\nEntretenimiento | 120.00\n\nPuedes agregar tantas filas como necesites.'
            );
          }}
        >
          <Text style={styles.downloadTemplateText}>💡 Ver ejemplo de formato</Text>
        </TouchableOpacity>
      </View>

      {/* Resumen de gastos */}
      {gastos.length > 0 && (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>💰 Resumen Total</Text>
            <Text style={styles.totalAmount}>${totalGastos.toFixed(2)}</Text>
            <Text style={styles.totalLabel}>Total de gastos del mes</Text>
            <Text style={styles.categoriesCount}>{gastos.length} categorías</Text>
          </View>

          {/* Gráfica de Pie */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🥧 Distribución por Categoría</Text>
            <View style={styles.chartContainer}>
              <VictoryPie
                data={crearDatosGraficaPie()}
                colorScale={colores}
                labelRadius={({ innerRadius }) => (innerRadius as number) + 40}
                style={{
                  labels: { fill: '#e2e8f0', fontSize: 10, fontWeight: 'bold' },
                }}
                height={300}
              />
            </View>
          </View>

          {/* Gráfica de Barras */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Top Categorías</Text>
            <VictoryChart
              theme={VictoryTheme.material}
              domainPadding={{ x: 20 }}
              height={300}
            >
              <VictoryAxis
                style={{
                  axis: { stroke: '#334155' },
                  tickLabels: { fill: '#94a3b8', fontSize: 10, angle: -45 },
                  grid: { stroke: 'none' },
                }}
              />
              <VictoryAxis
                dependentAxis
                style={{
                  axis: { stroke: '#334155' },
                  tickLabels: { fill: '#94a3b8', fontSize: 10 },
                  grid: { stroke: '#1e293b' },
                }}
              />
              <VictoryBar
                data={crearDatosGraficaBarra()}
                style={{
                  data: { fill: '#3b82f6' },
                }}
              />
            </VictoryChart>
          </View>

          {/* Lista detallada */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Detalle por Categoría</Text>
            {gastos.map((gasto, index) => (
              <View key={index} style={styles.gastoItem}>
                <View style={styles.gastoHeader}>
                  <View style={styles.gastoInfo}>
                    <View
                      style={[
                        styles.colorDot,
                        { backgroundColor: colores[index % colores.length] },
                      ]}
                    />
                    <Text style={styles.gastoCategoria}>{gasto.categoria}</Text>
                  </View>
                  <Text style={styles.gastoMonto}>${gasto.monto.toFixed(2)}</Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${gasto.porcentaje}%`,
                        backgroundColor: colores[index % colores.length],
                      },
                    ]}
                  />
                </View>
                <Text style={styles.gastoPorcentaje}>{gasto.porcentaje.toFixed(1)}% del total</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Mensaje si no hay datos */}
      {gastos.length === 0 && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>No hay datos cargados</Text>
          <Text style={styles.emptyText}>
            Importa un archivo Excel para ver tus gráficas de gastos
          </Text>
        </View>
      )}
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
  instructionText: {
    fontSize: 14,
    color: '#94a3b8',
    lineHeight: 22,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '600',
    color: '#e2e8f0',
  },
  uploadButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  downloadTemplateButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  downloadTemplateText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#10b981',
    textAlign: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoriesCount: {
    fontSize: 16,
    color: '#60a5fa',
    textAlign: 'center',
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
  },
  gastoItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  gastoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gastoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  gastoCategoria: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e2e8f0',
    flex: 1,
  },
  gastoMonto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#0f172a',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  gastoPorcentaje: {
    fontSize: 12,
    color: '#94a3b8',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
