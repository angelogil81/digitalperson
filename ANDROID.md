# Personal Digital — App Android nativo (Capacitor)

O app agora é **nativo e offline-first**: todo o bundle web é empacotado dentro do
APK (`dist/client`), sem depender do site publicado. Os dados continuam no
dispositivo (localStorage) e o login usa a nuvem via HTTPS.

## 1. Pré-requisitos

- Node 20+
- Android Studio (Android SDK 34 + JDK 17)
- `ANDROID_HOME` configurado

## 2. Clonar e instalar

```bash
git clone <seu-repo>
cd <seu-repo>
npm install
```

## 3. Gerar o bundle nativo e a plataforma Android

```bash
npm run build:capacitor   # build 100% client-side em dist/client
npx cap add android       # só na primeira vez
npm run android:build     # rebuild + cap sync android
npx cap open android
```

Rode no emulador ou celular pelo botão ▶ do Android Studio.

## 4. Gerar o APK

Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**

Ou via linha de comando:

```bash
cd android
./gradlew assembleDebug     # APK de teste
./gradlew assembleRelease   # release (precisa de keystore)
```

Saída em `android/app/build/outputs/apk/`.

## 5. Assinatura para a Play Store

```bash
keytool -genkey -v -keystore personal-digital.keystore -alias personaldigital \
  -keyalg RSA -keysize 2048 -validity 10000
```

Configure `signingConfigs` em `android/app/build.gradle` e gere o AAB:

```bash
./gradlew bundleRelease
```

## 6. Atualizações

Como o conteúdo agora vive dentro do APK, cada mudança no app exige
`npm run android:build` e uma nova versão do APK/AAB (é assim que funciona um
app nativo). O `versionCode`/`versionName` ficam em `android/app/build.gradle`.

## 7. Ícone e splash

```bash
npm i -D @capacitor/assets
# icon.png (1024x1024) e splash.png (2732x2732) em ./assets
npx capacitor-assets generate --android
```
