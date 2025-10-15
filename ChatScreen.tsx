import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatScreenProps {
  disponible: number;
  ingresos: number;
  gastos: number;
  onVolver: () => void;
}

export default function ChatScreen({ disponible, ingresos, gastos, onVolver }: ChatScreenProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! 👋 Soy tu asesor financiero personal con IA. He revisado tu presupuesto y estoy aquí para ayudarte con recomendaciones personalizadas. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Obtener API key desde las variables de entorno
  const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY || '';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const enviarMensaje = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Verificar si hay API key configurada
      if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your_openai_api_key') {
        // Modo demo sin API key
        const demoResponse = generarRespuestaDemo(inputText);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: demoResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Llamar a la API de OpenAI
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `Eres un asesor financiero experto y amigable. El usuario tiene los siguientes datos financieros:
- Ingresos mensuales: $${ingresos}
- Gastos fijos: $${gastos}
- Disponible: $${disponible}

Proporciona consejos financieros personalizados, prácticos y en español. Sé conciso pero útil. Usa emojis ocasionalmente para ser más amigable.`,
            },
            ...messages.slice(1).map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: 'user',
              content: inputText.trim(),
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error al llamar a OpenAI:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '❌ Lo siento, hubo un error al procesar tu mensaje. Por favor, verifica tu conexión a internet y que tu API key esté configurada correctamente.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Respuestas demo para cuando no hay API key
  const generarRespuestaDemo = (pregunta: string): string => {
    const preguntaLower = pregunta.toLowerCase();

    if (preguntaLower.includes('ahorr')) {
      return `💰 Basado en tu presupuesto disponible de $${disponible.toFixed(2)}, te recomiendo:\n\n1. Ahorra el 20% ($${(disponible * 0.2).toFixed(2)}) automáticamente cada mes\n2. Crea un fondo de emergencia de 3-6 meses de gastos\n3. Considera abrir una cuenta de ahorros de alto rendimiento\n\n¿Quieres saber más sobre algún punto específico?`;
    }

    if (preguntaLower.includes('inver') || preguntaLower.includes('invertir')) {
      return `📈 Para inversión con tu presupuesto:\n\n1. Destina el 10% ($${(disponible * 0.1).toFixed(2)}) para inversiones\n2. Considera fondos indexados para comenzar (bajo riesgo)\n3. Diversifica: 60% acciones, 30% bonos, 10% efectivo\n4. Piensa a largo plazo (5+ años)\n\n⚠️ Recuerda: primero asegura tu fondo de emergencia antes de invertir.`;
    }

    if (preguntaLower.includes('deud') || preguntaLower.includes('préstam')) {
      return `💳 Estrategia para manejar deudas:\n\n1. Lista todas tus deudas con sus tasas de interés\n2. Prioriza pagar las de mayor interés primero\n3. Mantén pagos mínimos en todas, pero extra en la prioritaria\n4. Considera consolidar si las tasas son muy altas\n\nCon $${disponible.toFixed(2)} disponible, podrías destinar $${(disponible * 0.3).toFixed(2)} extra a pagar deudas.`;
    }

    if (preguntaLower.includes('gasto') || preguntaLower.includes('reducir')) {
      return `🛒 Tips para reducir gastos:\n\n1. Revisa suscripciones que no uses\n2. Compara precios antes de comprar\n3. Cocina en casa (ahorra hasta 40%)\n4. Usa transporte público cuando sea posible\n5. Aplica la regla de 24 horas para compras no esenciales\n\nTus gastos fijos son $${gastos}. ¿Hay alguno que puedas negociar o eliminar?`;
    }

    // Respuesta genérica
    return `Entiendo tu pregunta sobre finanzas. Con tu presupuesto actual:\n\n💵 Ingresos: $${ingresos}\n💸 Gastos fijos: $${gastos}\n✅ Disponible: $${disponible.toFixed(2)}\n\nTe recomiendo:\n1. Ahorra 20% ($${(disponible * 0.2).toFixed(2)})\n2. Invierte 10% ($${(disponible * 0.1).toFixed(2)})\n3. Gastos variables 70% ($${(disponible * 0.7).toFixed(2)})\n\n¿Quieres consejos específicos sobre ahorro, inversión o reducción de gastos?\n\n💡 Nota: Estoy en modo demo. Para respuestas más personalizadas con IA, configura tu API key de OpenAI.`;
  };

  const sugerencias = [
    '¿Cómo puedo ahorrar más?',
    '¿Dónde debería invertir?',
    '¿Cómo reduzco gastos?',
    'Consejos para emergencias',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onVolver} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>🤖 Asesor IA</Text>
          <Text style={styles.headerSubtitle}>Disponible: ${disponible.toFixed(2)}</Text>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user' ? styles.userBubble : styles.assistantBubble,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user' ? styles.userText : styles.assistantText,
              ]}
            >
              {message.content}
            </Text>
            <Text style={styles.timestamp}>
              {message.timestamp.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={[styles.messageBubble, styles.assistantBubble]}>
            <ActivityIndicator color="#60a5fa" />
            <Text style={styles.loadingText}>Pensando...</Text>
          </View>
        )}

        {/* Sugerencias rápidas */}
        {messages.length === 1 && !isLoading && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Preguntas sugeridas:</Text>
            {sugerencias.map((sugerencia, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionButton}
                onPress={() => {
                  setInputText(sugerencia);
                }}
              >
                <Text style={styles.suggestionText}>{sugerencia}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escribe tu pregunta..."
          placeholderTextColor="#64748b"
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={enviarMensaje}
          disabled={!inputText.trim() || isLoading}
        >
          <Text style={styles.sendButtonText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    backgroundColor: '#1e293b',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
  },
  headerInfo: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#1e293b',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  assistantText: {
    color: '#e2e8f0',
  },
  timestamp: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 8,
  },
  suggestionsContainer: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
    fontWeight: '600',
  },
  suggestionButton: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionText: {
    color: '#60a5fa',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#e2e8f0',
    fontSize: 15,
    maxHeight: 100,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#334155',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
