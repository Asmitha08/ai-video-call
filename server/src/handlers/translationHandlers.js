import { translateText } from '../services/translationService.js';
import { transcribeAudio } from '../services/sttService.js';

/**
 * Socket.IO handlers for real-time speech-to-text captions and translations.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * @param {import('../services/roomManager.js').RoomManager} roomManager
 */
export function registerTranslationHandlers(io, socket, roomManager) {
  // ── 1. Real-time Audio Chunk from Microphone (WebRTC localStream) ──────────
  socket.on(
    'caption:audio',
    async ({ audioData, mimeType, sourceLang, displayName }, callback) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || !audioData) {
        if (typeof callback === 'function') callback({ error: 'No room or audio data' });
        return;
      }

      try {
        // Convert array buffer or base64 to Buffer
        let buffer;
        if (Buffer.isBuffer(audioData)) {
          buffer = audioData;
        } else if (typeof audioData === 'string') {
          const base64Data = audioData.includes('base64,')
            ? audioData.split('base64,')[1]
            : audioData;
          buffer = Buffer.from(base64Data, 'base64');
        } else if (audioData instanceof ArrayBuffer) {
          buffer = Buffer.from(audioData);
        } else {
          buffer = Buffer.from(audioData);
        }

        if (!buffer || buffer.length < 100) {
          if (typeof callback === 'function') callback({ text: '' });
          return;
        }

        // Transcribe via backend STT service
        const transcript = await transcribeAudio(buffer, mimeType || 'audio/webm', sourceLang || 'en');

        if (transcript && transcript.trim()) {
          const payload = {
            fromSocketId: socket.id,
            displayName: displayName || 'Participant',
            originalText: transcript.trim(),
            sourceLang: sourceLang || 'en',
            isFinal: true,
            timestamp: Date.now(),
          };

          // Broadcast to all participants in the room (including sender)
          io.to(room.roomId).emit('caption:receive', payload);

          if (typeof callback === 'function') {
            callback({ text: transcript.trim() });
          }
        } else {
          if (typeof callback === 'function') callback({ text: '' });
        }
      } catch (err) {
        console.warn('[caption:audio] error:', err.message);
        if (typeof callback === 'function') callback({ error: err.message });
      }
    }
  );

  // ── 2. Direct Text / Chat Caption ──────────────────────────────────────────
  socket.on(
    'caption:speak',
    async ({ text, sourceLang, isFinal, displayName }) => {
      const room = roomManager.getRoomBySocket(socket.id);
      if (!room || !text || !text.trim()) return;

      const payload = {
        fromSocketId: socket.id,
        displayName: displayName || 'Speaker',
        originalText: text.trim(),
        sourceLang: sourceLang || 'en',
        isFinal: Boolean(isFinal),
        timestamp: Date.now(),
      };

      // Broadcast to other participants in the room
      socket.to(room.roomId).emit('caption:receive', payload);
    }
  );

  // ── 3. On-Demand Translation ──────────────────────────────────────────────
  socket.on(
    'caption:translate',
    async ({ text, sourceLang, targetLang }, callback) => {
      try {
        const translated = await translateText(text, sourceLang, targetLang);
        if (typeof callback === 'function') {
          callback({ translatedText: translated });
        }
      } catch (err) {
        if (typeof callback === 'function') {
          callback({ error: err.message, translatedText: text });
        }
      }
    }
  );

  // ── 4. Deep Learning Neural Text-To-Speech (TTS) ───────────────────────────
  socket.on('caption:tts', async ({ text, targetLang }, callback) => {
    try {
      const { synthesizeNeuralSpeech } = await import('../services/ttsService.js');
      const result = await synthesizeNeuralSpeech(text, targetLang);
      if (typeof callback === 'function') {
        if (result?.audioBase64) {
          callback({ audioBase64: result.audioBase64, mimeType: result.mimeType, voice: result.voice });
        } else {
          callback({ error: 'TTS synthesis returned empty audio' });
        }
      }
    } catch (err) {
      console.warn('[caption:tts] error:', err.message);
      if (typeof callback === 'function') {
        callback({ error: err.message });
      }
    }
  });
}
