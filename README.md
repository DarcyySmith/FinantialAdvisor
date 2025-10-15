# 💰 SmartFinance Advisor

> Tu asesor financiero personal con IA - Gestiona tu presupuesto, ahorra inteligentemente y recibe consejos personalizados

[![React Native](https://img.shields.io/badge/React%20Native-0.74-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)

## ✨ Características

### 📊 Gestión de Presupuesto
- **Ingresos y gastos mensuales** con cálculo automático de disponible
- **Guardado persistente** de datos en el dispositivo
- **Recomendaciones automáticas** de distribución (20% ahorro, 10% inversión, 70% gastos)
- Indicador visual de estado de guardado

### 💡 Plan de Ahorros Inteligente
- **Calculadora de metas** - Define cuánto quieres ahorrar
- **Cálculo de plazos** - Descubre en cuántos meses alcanzarás tu meta
- **Validación de viabilidad** - Verifica si tu meta es realista con tu presupuesto
- **Consejos prácticos** de ahorro y finanzas personales

### 🤖 Asesor IA con ChatGPT
- **Modo Demo** - Funciona sin configuración con respuestas inteligentes predefinidas
- **Modo IA Completo** - Integración con OpenAI GPT-3.5 para consejos personalizados
- **Contexto automático** - El chat conoce tu situación financiera
- **Interfaz moderna** tipo WhatsApp con historial de conversación
- Sugerencias de preguntas comunes

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+ LTS
- npm o yarn
- Expo Go app (para probar en móvil)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/SmartFinanceAdvisor.git
cd SmartFinanceAdvisor

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start
```

### Ejecutar la App

```bash
# Web
npm run web

# Android (requiere Android Studio o dispositivo)
npm run android

# iOS (requiere macOS y Xcode)
npm run ios
```

## 🔧 Configuración (Opcional)

### Chat con IA Real (OpenAI)

El chat funciona en modo demo por defecto. Para activar respuestas con IA real:

1. **Obtén una API Key de OpenAI**
   - Ve a [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Crea una cuenta y genera una nueva clave

2. **Configura tu clave**
   ```bash
   # Crea un archivo .env en la raíz del proyecto
   echo "OPENAI_API_KEY=tu_clave_aqui" > .env
   ```

3. **Reinicia la app**
   ```bash
   npm start
   ```

**⚠️ IMPORTANTE:** Nunca compartas tu API key ni la subas a GitHub. El archivo `.env` está en `.gitignore` por seguridad.

### Costos de OpenAI
- GPT-3.5-turbo: ~$0.002 por 1000 tokens
- Una conversación típica: $0.01 - $0.05
- Muy económico para uso personal

## 📱 Uso de la App

1. **Configura tu presupuesto**
   - Ingresa tus ingresos mensuales
   - Ingresa tus gastos fijos
   - Presiona "Guardar Presupuesto"

2. **Explora el Plan de Ahorros**
   - Presiona "📊 Ver Plan de Ahorros Detallado"
   - Usa las calculadoras para definir metas
   - Revisa los consejos de ahorro

3. **Habla con el Asesor IA**
   - Presiona "🤖 Hablar con Asesor IA"
   - Haz preguntas sobre finanzas personales
   - Recibe consejos basados en tu presupuesto

## 🏗️ Estructura del Proyecto

```
SmartFinanceAdvisor/
├── App.tsx                      # Pantalla principal de presupuesto
├── PlanAhorrosScreen.tsx        # Pantalla de plan de ahorros
├── ChatScreen.tsx               # Chat con asesor IA
├── app.config.js                # Configuración de Expo
├── package.json                 # Dependencias
├── .env.example                 # Ejemplo de variables de entorno
├── INSTRUCCIONES_CHAT_IA.md    # Guía detallada del chat
└── src/
    ├── components/              # Componentes reutilizables
    ├── hooks/                   # Custom hooks
    ├── screens/                 # Pantallas adicionales
    ├── services/                # Servicios (API, storage)
    └── theme/                   # Colores y estilos

```

## 🔒 Seguridad

- ✅ Archivo `.env` en `.gitignore` - API keys nunca se suben a GitHub
- ✅ Variables de entorno gestionadas con `expo-constants`
- ✅ Datos del usuario guardados localmente con AsyncStorage
- ✅ Sin recolección de datos externos

**Nota:** Para producción, considera usar un backend para manejar las llamadas a APIs externas y no exponer claves en el cliente.

## 🛠️ Tecnologías

- **React Native** - Framework multiplataforma
- **Expo** - Herramientas de desarrollo
- **TypeScript** - Tipado estático
- **AsyncStorage** - Persistencia local
- **OpenAI API** - Integración con ChatGPT
- **React Hooks** - Gestión de estado

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si tienes preguntas o problemas:
- Revisa [INSTRUCCIONES_CHAT_IA.md](./INSTRUCCIONES_CHAT_IA.md) para ayuda con el chat
- Abre un issue en GitHub
- Consulta la documentación de [Expo](https://docs.expo.dev/)

---

Hecho con ❤️ para ayudarte a mejorar tus finanzas personales
