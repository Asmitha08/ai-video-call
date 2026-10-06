# 🌐 AICall — Real-Time Multilingual Video Conferencing & Offline Speech Translation

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://vercel.com)
[![Render Backend](https://img.shields.io/badge/Render-Online-46E3B7?logo=render)](https://ai-video-call-1.onrender.com)
[![Flutter Mobile](https://img.shields.io/badge/Flutter-iOS%20%7C%20Android-02569B?logo=flutter)](https://flutter.dev)
[![WebRTC](https://img.shields.io/badge/WebRTC-P2P%20Mesh-orange?logo=webrtc)](https://webrtc.org)
[![Languages](https://img.shields.io/badge/Languages-25%20Supported-blue)](#-supported-languages-25-total--600-pairs)
[![Offline Translation](https://img.shields.io/badge/Offline%20Engine-100%25%20Embedded-brightgreen)](#-embedded-offline-translation-engine)

An enterprise-grade, peer-to-peer WebRTC video calling platform with **continuous multilingual Speech-to-Text (STT)**, **instant live subtitle translation**, **neural Text-to-Speech (TTS) voice dubbing**, and a **100% offline edge translation engine** operating with zero latency across 25 global and Indic languages.

---

## 🚀 Live Deployments

- **Backend Signaling & Translation Server (Render)**: [`https://ai-video-call-1.onrender.com`](https://ai-video-call-1.onrender.com)
- **Frontend Web Application (Vercel)**: Deployed with automatic fallback and edge-offline translation.
- **GitHub Repository**: [`https://github.com/Asmitha08/ai-video-call`](https://github.com/Asmitha08/ai-video-call)

---

## ✨ Key Features

### 1. ⚡ 100% Offline Edge Translation Engine (0 ms Latency)
- **Zero Cloud Dependency**: Runs completely inside browser and mobile client memory without needing an internet connection.
- **Embedded Research Datasets**: Curated from premier open NLP benchmarks:
  - **Meta AI NLLB FLORES-200** (*Costa-jussà et al., Meta AI 2022*)
  - **AI4Bharat IndicTrans** (*Ramesh et al., ACL 2022*)
  - **Tatoeba Translation Project** (*Jörg Tiedemann, EAMT 2020*)
  - **OPUS-100 Multilingual Corpus** (*Zhang et al., ACL 2020*)
- **Deterministic Number Translation (0–1000)**: Translates compound spoken numbers (*e.g., "eighty-nine" $\rightarrow$ "ఎనభై తొమ్మిది"* in Telugu, *"नवासी"* in Hindi, *"ochenta y nueve"* in Spanish) and digit sequences (*"Call me at 89"*).
- **Morphological Lemmatizer**: 146 irregular lemma rules handle verb inflections (*"speaking"* $\rightarrow$ *"speak"*, *"went"* $\rightarrow$ *"go"*), plurals (*"friends"* $\rightarrow$ *"friend"*), and adverbs (*"clearly"* $\rightarrow$ *"clear"*).
- **Interactive Offline Translate Bar**: Floating dataset explorer tab featuring sentence and vocabulary lookups, category filtering, and direct audio synthesis.

### 2. 🎙️ Continuous Real-Time Speech Recognition (STT)
- Sub-second speech recognition with automatic session restart.
- Background noise gating and echo loopback suppression (prevents laptop speakers from feeding into mic during TTS playback).
- Voice confidence thresholding filters out breathing, clicks, static, and ambient noise.

### 3. 🔊 Neural Text-To-Speech (TTS) & Universal Phonetic Fallback
- **Cloud Neural Voice**: Deep learning neural vocoder models (MsEdgeTTS) produce natural, human-like voice readouts.
- **Universal Phonetic Romanization Fallback**: If a client device lacks native Indic/Asian OS voice engines, the engine dynamically generates Romanized phonetic transcriptions (*e.g., 89 $\rightarrow$ "Enabhai Thommidi"*) so audio synthesis never fails silently.

### 4. 📹 Low-Latency Peer-to-Peer Video Calling (WebRTC)
- Direct encrypted mesh peer-to-peer audio and video streaming.
- Dynamic layout grid with active speaker indicator and Picture-in-Picture (PiP) local stream preview.
- Camera flip (front/back), audio mute/unmute, and screen-sharing support.

### 5. 📱 Cross-Platform Flutter Mobile App (`flutter_app/`)
- Native **Android & iOS** app built with Flutter 3.
- Connects directly to the Render backend server worldwide over 4G/5G/Wi-Fi or over local LAN.
- Features identical continuous STT, floating translated captions, and voice readouts.

### 6. 📝 Live Transcript Drawer
- Full chronological transcript history with speaker timestamps.
- One-click copy to clipboard and `.txt` file export for meeting documentation.

---

## 🌍 Supported Languages (25 Total / 600 Pairs)

| Region | Languages Supported |
|---|---|
| **Indic Languages** | Telugu (te), Hindi (hi), Tamil (ta), Kannada (kn), Malayalam (ml), Marathi (mr), Bengali (bn), Gujarati (gu), Punjabi (pa) |
| **European Languages** | English (en), Spanish (es), French (fr), German (de), Portuguese (pt), Italian (it), Dutch (nl), Russian (ru) |
| **Asian Languages** | Chinese (zh), Japanese (ja), Korean (ko), Vietnamese (vi), Thai (th), Indonesian (id) |
| **Middle Eastern** | Arabic (ar), Turkish (tr) |

---

## 🏗️ Architecture & Technology Stack

```
                          ┌─────────────────────────────┐
                          │     Client Applications     │
                          │   React (Web) / Flutter     │
                          └──────────────┬──────────────┘
                                         │
                    ┌────────────────────┴────────────────────┐
                    ▼                                         ▼
        [100% Offline Path]                               [Online Path]
    • Embedded Parallel Corpus                    • WebRTC Signaling (Socket.IO)
    • 233-Word Lexicon + Lemmatizer               • MsEdgeTTS Neural Vocoder
    • 0–1000 Compound Numeral Engine              • Google Clients5 Fallback
    • Romanized Phonetic Audio Fallback           • Cloud REST API (/api/translate)
```

- **Frontend Web**: React 18, Vite, Simple-Peer, Socket.IO Client, Vanilla CSS Modules.
- **Mobile Client**: Flutter 3 (Dart), `flutter_webrtc`, `socket_io_client`, `speech_to_text`, `flutter_tts`.
- **Backend Signaling**: Node.js, Express, Socket.IO 4, `msedge-tts`, UUID, CORS.
- **Deployment**: Vercel (Frontend), Render (Signaling & Neural TTS Backend).

---

## 📂 Repository Structure

```
ai-video-call/
├── client/                        # React 18 + Vite Web Application
│   ├── src/
│   │   ├── components/            # UI components (OfflineTranslateBar, VideoGrid, etc.)
│   │   ├── context/               # TranslationContext & RoomContext
│   │   ├── lib/                   # offlineTranslator, offlineDataset, offlineNumbers, offlineLexicon
│   │   └── pages/                 # HomePage, CallPage
│   ├── vercel.json                # Vercel SPA routing configuration
│   └── vite.config.js             # Vite configuration with HTTPS support
├── server/                        # Node.js + Express + Socket.IO Backend
│   ├── src/
│   │   ├── handlers/              # Signaling, room, and translation event handlers
│   │   ├── services/              # TTS service, STT service, translation service
│   │   └── lib/                   # Self-contained offline translation library
│   └── package.json               # Server dependencies
├── flutter_app/                   # Cross-Platform Flutter Mobile Application
│   ├── lib/                       # Screens, services, models, and widgets
│   ├── android/                   # Android native manifest with camera/mic permissions
│   └── ios/                       # iOS runner with camera/mic usage descriptions
├── render.yaml                    # Render Cloud deployment blueprint
├── vercel.json                    # Root Vercel monorepo configuration
└── README.md                      # Project documentation
```

---

## 💻 Running Locally

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Asmitha08/ai-video-call.git
cd ai-video-call
npm run install:all
```

### 2. Start the Backend Server
```bash
npm run dev:server
```
*Backend runs on `http://localhost:4000` (and LAN IP `http://192.168.0.x:4000`).*

### 3. Start the Web Client
```bash
npm run dev:client
```
*Frontend runs on `https://localhost:5173` with self-signed SSL.*

### 4. Run the Flutter Mobile App
```bash
cd flutter_app
flutter pub get
flutter run
```
*Enter your PC's IP or Render URL in the mobile app server field.*

---

## ☁️ Deployment Guide

### Deploying the Backend to Render
1. Open [dashboard.render.com](https://dashboard.render.com) and click **New +** $\rightarrow$ **Web Service**.
2. Connect repository **`Asmitha08/ai-video-call`**.
3. Set **Root Directory** to `server`.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Select the **Free** instance plan and click **Deploy**.
6. Copy your live Render URL (*e.g., `https://ai-video-call-1.onrender.com`*).

### Deploying the Frontend to Vercel
1. Open [vercel.com/new](https://vercel.com/new) and import **`Asmitha08/ai-video-call`**.
2. Set **Root Directory** to `client` and **Framework Preset** to `Vite`.
3. Under **Environment Variables**, add:
   - `VITE_SERVER_URL`: `https://ai-video-call-1.onrender.com`
4. Click **Deploy**.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
