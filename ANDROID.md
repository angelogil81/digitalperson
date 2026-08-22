# Personal Digital — APK Android (Capacitor)

O projeto já está configurado com Capacitor. Siga os passos abaixo no VS Code.

## 1. Pré-requisitos

- Node 20+
- Android Studio (com Android SDK 34 e JDK 17)
- Variável `ANDROID_HOME` configurada

## 2. Baixar o projeto e instalar

No GitHub do projeto (botão **Export to GitHub** no Lovable), clone e rode:

```bash
git clone <seu-repo>
cd <seu-repo>
npm install
```

## 3. Adicionar a plataforma Android

```bash
npx cap add android
npx cap sync android
```

Isso cria a pasta `android/` (projeto Gradle nativo).

## 4. Abrir no Android Studio

```bash
npx cap open android
```

Rode no emulador ou celular pelo botão ▶.

## 5. Gerar o APK

No Android Studio: **Build → Build Bundle(s)/APK(s) → Build APK(s)**.

Ou por linha de comando:

```bash
cd android
./gradlew assembleDebug        # APK de teste
./gradlew assembleRelease      # APK para publicar (precisa de keystore)
```

O APK sai em `android/app/build/outputs/apk/`.

## 6. Assinatura para a Play Store

```bash
keytool -genkey -v -keystore personal-digital.keystore -alias personaldigital \
  -keyalg RSA -keysize 2048 -validity 10000
```

Em `android/app/build.gradle`, adicione o `signingConfigs` com esse keystore e depois gere o AAB:

```bash
./gradlew bundleRelease
```

## Como funciona

O `capacitor.config.ts` aponta o WebView para `https://digitalperson.lovable.app`.
Sempre que você publicar no Lovable, o app Android recebe a atualização
automaticamente — sem precisar de novo APK.

Se quiser trocar o domínio, edite `server.url` em `capacitor.config.ts` e rode
`npx cap sync android`.

## Ícone e splash

```bash
npm i -D @capacitor/assets
# coloque icon.png (1024x1024) e splash.png (2732x2732) em ./assets
npx capacitor-assets generate --android
```
