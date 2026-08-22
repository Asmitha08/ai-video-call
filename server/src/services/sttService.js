import fs from 'fs';
import os from 'os';
import path from 'path';

/**
 * Dedicated Speech-to-Text (STT) Service.
 * Transcribes audio buffers (WebM/WAV/OGG) into text with multi-language support:
 * English (en), Telugu (te), Hindi (hi), Spanish (es), Tamil (ta), etc.
 */

export async function transcribeAudio(audioBuffer, mimeType = 'audio/webm', sourceLang = 'en') {
  if (!audioBuffer || audioBuffer.length < 500) return '';

  const cleanLang = sourceLang ? sourceLang.split('-')[0].toLowerCase() : 'en';

  // ── 1. Groq Whisper API (Ultra-Fast ~150ms) ────────────────────────────────
  if (process.env.GROQ_API_KEY) {
    try {
      const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'webm';
      const formData = new FormData();
      const fileBlob = new Blob([audioBuffer], { type: mimeType });
      formData.append('file', fileBlob, `audio.${ext}`);
      formData.append('model', 'whisper-large-v3-turbo');
      if (cleanLang && cleanLang !== 'auto') {
        formData.append('language', cleanLang);
      }

      const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.text && data.text.trim()) {
          console.log(`[stt:groq] transcribed (${cleanLang}):`, data.text);
          return data.text.trim();
        }
      }
    } catch (err) {
      console.warn('[stt:groq] failed:', err.message);
    }
  }

  // ── 2. OpenAI Whisper API ──────────────────────────────────────────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const ext = mimeType.includes('wav') ? 'wav' : mimeType.includes('ogg') ? 'ogg' : 'webm';
      const formData = new FormData();
      const fileBlob = new Blob([audioBuffer], { type: mimeType });
      formData.append('file', fileBlob, `audio.${ext}`);
      formData.append('model', 'whisper-1');
      if (cleanLang && cleanLang !== 'auto') {
        formData.append('language', cleanLang);
      }

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.text && data.text.trim()) {
          console.log(`[stt:openai] transcribed (${cleanLang}):`, data.text);
          return data.text.trim();
        }
      }
    } catch (err) {
      console.warn('[stt:openai] failed:', err.message);
    }
  }

  // ── 3. Wit.ai Multi-Language Free Speech Recognition ──────────────────────
  try {
    const witTokens = {
      en: 'NN37Z3EUGK3N6V656H2K3W6D2Y3Z6N6V',
      es: 'NN37Z3EUGK3N6V656H2K3W6D2Y3Z6N6V',
      hi: 'NN37Z3EUGK3N6V656H2K3W6D2Y3Z6N6V',
      te: 'NN37Z3EUGK3N6V656H2K3W6D2Y3Z6N6V',
      ta: 'NN37Z3EUGK3N6V656H2K3W6D2Y3Z6N6V',
    };

    const token = process.env.WIT_AI_TOKEN || witTokens[cleanLang] || witTokens.en;
    const res = await fetch('https://api.wit.ai/speech', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': mimeType || 'audio/webm',
      },
      body: audioBuffer,
    });

    if (res.ok) {
      const raw = await res.text();
      const lines = raw.split('\r\n').filter(Boolean);
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json?.text && json.text.trim()) {
            console.log(`[stt:wit] transcribed (${cleanLang}):`, json.text);
            return json.text.trim();
          }
        } catch {}
      }
    }
  } catch (err) {
    console.warn('[stt:wit] failed:', err.message);
  }

  return '';
}
