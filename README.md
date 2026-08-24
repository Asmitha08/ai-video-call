# 🌐 AICall — AI-Powered Video Calling & Live Translation

An AI-powered, real-time video calling application featuring peer-to-peer WebRTC video/audio streaming, Socket.IO signaling, and live multilingual speech-to-text translation and voice synthesis.

---

## 🚀 Live Deployments

- **Backend Signaling & Translation Server (Render)**: [`https://ai-video-call-1.onrender.com`](https://ai-video-call-1.onrender.com)
- **Frontend Web Application (Vercel)**: Deployed on Vercel with automatic Render backend connection.
- **GitHub Repository**: [`https://github.com/Asmitha08/ai-video-call`](https://github.com/Asmitha08/ai-video-call)

---

## ✨ Features

- 📹 **P2P Video & Audio Calling**: Low-latency mesh WebRTC calling with Simple-Peer & Socket.IO.
- 🗣️ **Continuous Speech Recognition**: Real-time voice detection with language selection and auto-reconnecting sessions.
- 🌐 **AI Live Subtitles & Translation**: Multi-tier zero-latency translation engine supporting 25+ languages (Telugu, Hindi, Tamil, Spanish, English, French, German, Japanese, etc.).
- 🔊 **Neural Text-To-Speech (TTS)**: Natural voice read-aloud for incoming translations using Deep Learning Neural voice models.
- 📝 **Live Transcript Drawer**: Real-time conversation transcript history with search, clipboard copy, and `.txt` file export.
- 📱 **Multi-Device & Local Network Support**: Test across mobile phones and PCs on the same Wi-Fi/LAN via HTTPS.
- 🎨 **Modern Dark Glassmorphism UI**: Sleek, responsive interface with floating subtitle badges and call controls.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Simple-Peer, Socket.IO Client, Vanilla CSS Modules
- **Backend**: Node.js, Express, Socket.IO, Edge Neural TTS, dotenv, CORS, UUID
- **Signaling & Media**: WebSockets & WebRTC
- **Hosting & CI/CD**: Vercel (Frontend), Render (Backend), GitHub Actions

---

## 🚀 Getting Started Locally

### 1. Clone the Repository
```bash
git clone https://github.com/Asmitha08/ai-video-call.git
cd ai-video-call
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Variables
Create `.env` files in both `client` and `server` folders using the provided `.env.example` templates:

**Server (`server/.env`):**
```env
PORT=4000
CLIENT_ORIGIN=*
# Optional AI API keys for enhanced translation / STT
# GEMINI_API_KEY=
# OPENAI_API_KEY=
# GROQ_API_KEY=
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

## ☁️ Deployment Guide

### Deploying Backend to Render
1. Create a new **Web Service** on [Render](https://dashboard.render.com).
2. Connect repository `Asmitha08/ai-video-call`.
3. Configuration:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Copy your live Render URL (e.g. `https://ai-video-call-1.onrender.com`).

### Deploying Frontend to Vercel
1. Import repository `Asmitha08/ai-video-call` on [Vercel](https://vercel.com/new).
2. Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_SERVER_URL`: `https://ai-video-call-1.onrender.com`
4. Deploy!

---

## 📱 Testing Across Mobile Devices (LAN)
1. Ensure your PC and mobile phone are connected to the same Wi-Fi network.
2. Find your PC's local IP address (e.g., `192.168.0.230`).
3. Open `https://<YOUR_PC_IP>:5173` on your mobile browser.
4. Accept the self-signed SSL certificate prompt to allow camera and microphone access.
