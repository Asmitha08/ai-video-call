# 🌐 AI Video Calling App

An AI-powered real-time video calling application featuring peer-to-peer WebRTC video/audio streaming, Socket.IO signaling, and live multilingual speech-to-text translation and captions.

---

## ✨ Features

- **P2P Video & Audio Calling**: Low-latency mesh WebRTC calling with Simple-Peer & Socket.IO.
- **AI Live Captions & Translation**: Real-time speech-to-text and subtitle translation across multiple languages.
- **Transcript Drawer**: Live transcript history with timestamps and download options.
- **Responsive Modern UI**: Sleek, glassmorphism-inspired dark mode interface.
- **Multi-Device / Local Network Support**: Test across mobile phones and PCs on the same LAN/Wi-Fi via HTTPS.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Simple-Peer, Socket.IO Client, Vanilla CSS Modules
- **Backend**: Node.js, Express, Socket.IO, dotenv, CORS, UUID
- **Signaling & Media**: WebSockets & WebRTC

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Variables
Create `.env` in both `client` and `server` folders using the provided `.env.example` templates:

**Server (`server/.env`):**
```env
PORT=4000
CORS_ORIGIN=*
# Optional translation / AI API keys (e.g. Gemini / OpenAI / LibreTranslate)
```

**Client (`client/.env`):**
```env
VITE_SERVER_URL=http://localhost:4000
VITE_LAN_IP=
```

---

## 💻 Running Locally

Start the backend and frontend in separate terminals:

### Terminal 1: Backend Server
```bash
npm run dev:server
```
Runs at: `http://localhost:4000`

### Terminal 2: Frontend Client
```bash
npm run dev:client
```
Runs at: `https://localhost:5173`

---

## 📱 Testing Across Mobile Devices (LAN)
1. Ensure your PC and phone are on the same Wi-Fi network.
2. Find your PC's local IP address (e.g., `192.168.1.50`).
3. Open `https://<YOUR_PC_IP>:5173` on your mobile browser.
4. Accept the self-signed SSL certificate prompt to allow camera and microphone access.
