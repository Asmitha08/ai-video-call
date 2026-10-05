# 📱 AI Video Call - Flutter Mobile App

A cross-platform **Flutter (iOS & Android)** mobile application for real-time peer-to-peer video calling with **continuous multilingual Speech-to-Text (STT) recognition**, **neural Text-to-Speech (TTS) voice synthesis**, and **instant subtitle translation** (Telugu, Hindi, English, Spanish, Tamil, and more).

---

## 🚀 Key Features

1. **High-Performance WebRTC Video Calling**
   - Low-latency peer-to-peer audio & video streams with `flutter_webrtc`.
   - Picture-in-Picture (PIP) local stream preview and adaptive remote grid.
   - Front/Back camera switching & Audio mute/unmute toggles.

2. **Real-Time Speech-to-Text (STT) Recognition**
   - Continuous on-device voice transcription powered by `speech_to_text`.
   - Native recognition support for **Telugu (te-IN)**, **Hindi (hi-IN)**, **Tamil (ta-IN)**, **English (en-US)**, and **Spanish (es-ES)**.
   - Auto-rearm debounce engine for non-stop dictation without unexpected timeouts.

3. **Neural & Device Text-to-Speech (TTS)**
   - Automatic voice readout of incoming translated captions.
   - Dual-engine fallback: Server Deep-Learning Neural Vocoder MP3 stream (`MsEdgeTTS` / `OpenAI`) + On-device native voice (`flutter_tts`).

4. **Multi-Tier Translation Engine**
   - Client-side translation cache with fallbacks across Socket.IO, Backend REST API, and Google endpoints.

5. **Glassmorphic Floating Subtitle Overlay & Transcript Drawer**
   - 12-second persistent live caption overlay with speaker badge and language indicator.
   - Full scrollable transcript history drawer with 1-click clipboard export.

---

## 📂 Project Structure

```
flutter_app/
├── android/
│   └── app/src/main/AndroidManifest.xml   # Camera, Audio & Network permissions
├── ios/
│   └── Runner/Info.plist                  # Camera, Mic & Speech Usage Strings
├── lib/
│   ├── main.dart                          # App Entry Point & Dark Theme
│   ├── models/
│   │   ├── caption_model.dart             # Live subtitle & transcript data model
│   │   └── language_model.dart            # Supported languages & BCP-47 codes
│   ├── services/
│   │   ├── socket_service.dart            # Socket.IO signaling & room events
│   │   ├── webrtc_service.dart            # Peer connections, renderers & tracks
│   │   ├── speech_service.dart            # Continuous STT Speech Recognition
│   │   ├── tts_service.dart               # Neural audio & device TTS synthesis
│   │   └── translation_service.dart       # Multi-tier translation & caching
│   ├── widgets/
│   │   ├── live_caption_card.dart         # Floating live subtitle banner
│   │   ├── transcript_bottom_sheet.dart   # Full conversation history log
│   │   └── language_selector_dialog.dart  # Language picker modal
│   └── screens/
│       ├── home_screen.dart               # Room creation, joining & setup
│       └── call_screen.dart               # Active video call interface
└── pubspec.yaml                           # Flutter dependencies
```

---

## 🛠️ Getting Started & Setup

### 1. Prerequisites
- Install the [Flutter SDK](https://docs.flutter.dev/get-started/install) (version 3.0.0 or higher).
- Android Studio / VS Code with Flutter extension.
- Physical Android/iOS device or Android Emulator / iOS Simulator.

### 2. Start the Backend Signaling & Translation Server
From the root project directory:
```bash
cd ../server
npm install
npm run dev
```
The server will run on `http://localhost:5000`.

### 3. Run the Flutter App
Navigate into `flutter_app/`:
```bash
cd flutter_app
flutter pub get
flutter run
```

### 4. Server URL Configuration for Devices
- **Android Emulator**: Use `http://10.0.2.2:5000` (prefilled by default).
- **iOS Simulator**: Use `http://localhost:5000`.
- **Physical Phone (Android/iPhone)**: Connect your phone to the same Wi-Fi network as your PC and enter your computer's local IP address (e.g., `http://192.168.1.100:5000`).

---

## 🎙️ Speech Recognition (STT) & Text-to-Speech (TTS) Flow

```
[Speaker Talks into Mic]
         │
         ▼
[SpeechRecognitionService (STT)]  --> Transcribes speech in speaker's language (e.g., English)
         │
         ├─────────────────────────────────────────┐
         ▼                                         ▼
[SocketService (caption:speak)]          [TranslationService]
   Broadcasts to room peers                Translates for local view
         │                                         │
         ▼                                         ▼
[Remote Peer Receives Subtitle]          [LiveCaptionCard Overlay]
         │
         ▼
[TextToSpeechService (TTS)]
   Reads translated text aloud
   (e.g., Telugu Neural Voice)
```
