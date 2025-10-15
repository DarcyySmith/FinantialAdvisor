# SmartFinance Advisor (Expo + TypeScript)

Asesor financiero personal con IA. Funcionalidades:

- Gestión de presupuesto (ingresos, gastos fijos, disponible, recomendaciones de ahorro/inversión)
- Análisis de gastos con imagen (facturas/recibos) vía proveedor de visión (mock/Google Vision)
- Chatbot asesor con IA (mock/OpenAI) usando historial de gastos
- Reportes con gráficas (Victory Native)
- Persistencia local con SQLite (Expo)

## Requisitos
- Node.js LTS
- Expo CLI (se instala al correr los scripts)

## Configuración
1. Copia `.env.example` a `.env` y ajusta los valores.
2. Opcional: configura proveedores reales (`VISION_PROVIDER=google`, `AI_PROVIDER=openai`) y agrega tus claves.

## Scripts
- `npm install`
- `npm run start`
- `npm run android` / `npm run ios` / `npm run web`

## Estructura
```
SmartFinanceAdvisor/
  app.config.js
  App.tsx
  src/
    navigation/
    screens/
    components/
    services/
      ai/
      vision/
      storage/
    hooks/
    theme/
```

## Notas de privacidad y seguridad
- Las claves se inyectan vía `app.config.js` -> `extra` y se leen con `expo-constants`. No se deben commitear claves.
- Para OCR/IA real, considera rutear las llamadas a un backend propio si no deseas exponer claves en cliente.
