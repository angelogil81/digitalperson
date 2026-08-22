// Integrações nativas (Capacitor). No navegador tudo isso é ignorado.
let started = false;

export async function initNative() {
  if (started || typeof window === "undefined") return;
  started = true;

  try {
    const { Capacitor } = await import("@capacitor/core");
    if (!Capacitor.isNativePlatform()) return;

    const [{ StatusBar, Style }, { SplashScreen }, { App }] = await Promise.all([
      import("@capacitor/status-bar"),
      import("@capacitor/splash-screen"),
      import("@capacitor/app"),
    ]);

    await StatusBar.setStyle({ style: Style.Dark });
    await StatusBar.setBackgroundColor({ color: "#0B0F0C" });
    await SplashScreen.hide();

    // Botão físico "voltar" do Android
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else App.exitApp();
    });
  } catch {
    // plugin ausente — segue como web normal
  }
}
