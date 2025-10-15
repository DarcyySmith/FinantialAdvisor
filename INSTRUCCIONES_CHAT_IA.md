# 🤖 Configuración del Chat con IA

## Cómo activar el Asesor IA con ChatGPT

El chat funciona en **dos modos**:

### 1. Modo Demo (Sin API Key) ✅
- **Ya está funcionando** sin configuración adicional
- Respuestas predefinidas inteligentes basadas en tu presupuesto
- Consejos sobre ahorro, inversión, deudas y gastos
- Perfecto para probar la funcionalidad

### 2. Modo IA Completo (Con API Key de OpenAI) 🚀
Para obtener respuestas personalizadas con ChatGPT:

#### Paso 1: Obtener tu API Key de OpenAI
1. Ve a [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Crea una cuenta o inicia sesión
3. Haz clic en "Create new secret key"
4. Copia la clave (empieza con `sk-...`)

#### Paso 2: Configurar la API Key
1. Crea un archivo `.env` en la raíz del proyecto (al lado de `package.json`)
2. Agrega esta línea:
   ```
   OPENAI_API_KEY=tu_clave_aqui
   ```
3. Reemplaza `tu_clave_aqui` con tu clave real

#### Paso 3: Reiniciar la app
```bash
# Detén el servidor actual (Ctrl+C)
# Luego reinicia:
npm start
```

## 💰 Costos de OpenAI
- **GPT-3.5-turbo**: ~$0.002 por 1000 tokens (muy económico)
- Una conversación típica: $0.01 - $0.05
- Puedes establecer límites de gasto en tu cuenta de OpenAI

## 🔒 Seguridad
- **NUNCA** compartas tu API key
- **NUNCA** la subas a GitHub
- El archivo `.env` está en `.gitignore` por seguridad
- Usa variables de entorno en producción

## ✨ Características del Chat

### Con o sin API Key:
- 💬 Interfaz de chat moderna
- 📊 Contexto automático de tu presupuesto
- 💡 Sugerencias de preguntas
- ⏱️ Timestamps en mensajes
- 📱 Diseño responsive

### Solo con API Key:
- 🧠 Respuestas personalizadas con IA
- 💭 Memoria de conversación
- 🎯 Consejos específicos para tu situación
- 📈 Análisis financiero detallado

## 🐛 Solución de Problemas

### "Error al procesar tu mensaje"
- Verifica tu conexión a internet
- Confirma que tu API key es correcta
- Revisa que tengas créditos en tu cuenta OpenAI

### "Modo demo"
- Es normal si no has configurado la API key
- El modo demo sigue siendo muy útil

### La app no reconoce mi API key
- Asegúrate de reiniciar completamente la app
- Verifica que el archivo `.env` esté en la raíz del proyecto
- Confirma que no haya espacios extra en la clave

## 📝 Ejemplos de Preguntas

Prueba preguntar:
- "¿Cómo puedo ahorrar más dinero?"
- "¿Dónde debería invertir mi dinero?"
- "¿Cómo puedo reducir mis gastos?"
- "¿Cuánto debería tener en mi fondo de emergencia?"
- "¿Es mejor pagar deudas o invertir?"
- "Dame consejos para mejorar mi salud financiera"

## 🎉 ¡Listo!

Ahora puedes usar el Asesor IA desde la pantalla principal:
1. Ingresa tu presupuesto
2. Presiona "🤖 Hablar con Asesor IA"
3. ¡Empieza a hacer preguntas!
