import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.personaldigital.mobile",
  appName: "Personal Digital",
  webDir: "capacitor-www",
  server: {
    // O app é um web app SSR (TanStack Start), por isso o APK carrega a versão
    // publicada. Para rodar 100% offline seria necessário um build estático.
    url: "https://digitalperson.lovable.app",
    cleartext: false,
    androidScheme: "https",
  },
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
