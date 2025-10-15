// Expo dynamic app config with dotenv
// Load .env if present
try { require('dotenv').config(); } catch {}

export default ({ config }) => ({
  expo: {
    name: "SmartFinance Advisor",
    slug: "smartfinance-advisor",
    version: "1.0.0",
    scheme: "smartfinance",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#0f172a"
    },
    updates: { fallbackToCacheTimeout: 0 },
    assetBundlePatterns: ["**/*"],
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0f172a"
      },
      package: "com.smartfinance.advisor"
    },
    web: { bundler: "metro" },
    extra: {
      visionProvider: process.env.VISION_PROVIDER || "mock",
      aiProvider: process.env.AI_PROVIDER || "mock",
      googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY || null,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || null,
      supabaseUrl: process.env.SUPABASE_URL || null,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || null,
      eas: { projectId: process.env.EAS_PROJECT_ID || null }
    }
  }
});
