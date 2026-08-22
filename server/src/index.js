import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { registerSignalingHandlers } from './handlers/signalingHandlers.js';
import { registerRoomHandlers } from './handlers/roomHandlers.js';
import { registerTranslationHandlers } from './handlers/translationHandlers.js';
import { translateText } from './services/translationService.js';
import { roomManager } from './services/roomManager.js';
import { transcribeAudio } from './services/sttService.js';

const app = express();
const httpServer = createServer(app);

// ── CORS ───────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.CLIENT_ORIGIN
  ? (process.env.CLIENT_ORIGIN === '*' ? true : process.env.CLIENT_ORIGIN.split(',').map(s => s.trim()))
  : [
      /^https?:\/\/localhost(:\d+)?$/,
      /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
      /^https?:\/\/192\.168\.\d+\.\d+(:\d+)?$/,   // LAN
      /^https?:\/\/10\.\d+\.\d+\.\d+(:\d+)?$/,    // LAN (10.x)
      /^https?:\/\/172\.(1[6-9]|2\d|3[01])\.\d+\.\d+(:\d+)?$/,  // LAN (172.x)
      /https:\/\/.*\.vercel\.app$/,               // Vercel apps
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '25mb' }));

// ── Socket.IO ──────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: corsOptions,
  maxHttpBufferSize: 1e7, // 10MB
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  registerRoomHandlers(io, socket, roomManager);
  registerSignalingHandlers(io, socket, roomManager);
  registerTranslationHandlers(io, socket, roomManager);

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
    roomManager.removeParticipant(socket.id);
  });
});

// ── REST endpoints ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.get('/api/rooms/:roomId', (req, res) => {
  const room = roomManager.getRoom(req.params.roomId);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json(room.toPublic());
});

app.post('/api/stt', async (req, res) => {
  const { audioBase64, mimeType = 'audio/webm', sourceLang = 'en' } = req.body;
  if (!audioBase64) return res.status(400).json({ error: 'audioBase64 is required' });
  try {
    const buffer = Buffer.from(audioBase64, 'base64');
    const transcript = await transcribeAudio(buffer, mimeType, sourceLang);
    res.json({ transcript, sourceLang });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang = 'auto', targetLang = 'en' } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });
  try {
    const translatedText = await translateText(text, sourceLang, targetLang);
    res.json({ translatedText, sourceLang, targetLang });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start (bind on all interfaces so LAN devices can reach it) ─────────────────
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Signaling server running on:`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   http://192.168.56.1:${PORT}  (LAN)`);
});
