import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.personaldigital.mobile",
  appName: "Personal Digital",
  // App Android nativo: o bundle web é empacotado dentro do APK (offline-first).
  // Gere com `npm run android:build` (CAPACITOR=1 vite build + cap sync).
  webDir: "dist/client",
  android: {
    backgroundColor: "#0B0F0C",
    allowMixedContent: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: "#0B0F0C",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0B0F0C",
    },
  },
};

export default config;
