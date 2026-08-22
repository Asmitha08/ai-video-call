import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

/**
 * Deep Learning Neural Text-To-Speech (TTS) Service.
 * Generates natural human-like voice synthesis using Deep Learning Neural Vocoder models.
 */

// Voice mapping for Edge Neural Models
const NEURAL_VOICE_MAP = {
  te: 'te-IN-ShrutiNeural',      // Telugu (Female)
  'te-in': 'te-IN-ShrutiNeural',
  hi: 'hi-IN-SwaraNeural',       // Hindi (Female)
  'hi-in': 'hi-IN-SwaraNeural',
  ta: 'ta-IN-PallaviNeural',     // Tamil (Female)
  'ta-in': 'ta-IN-PallaviNeural',
  es: 'es-ES-ElviraNeural',      // Spanish
  'es-es': 'es-ES-ElviraNeural',
  en: 'en-US-JennyNeural',       // English (US)
  'en-us': 'en-US-JennyNeural',
  'en-in': 'en-IN-NeerjaNeural', // English (India)
  fr: 'fr-FR-DeniseNeural',      // French
  de: 'de-DE-KatjaNeural',       // German
  ja: 'ja-JP-NanamiNeural',      // Japanese
  zh: 'zh-CN-XiaoxiaoNeural',    // Chinese (Mandarin)
  ar: 'ar-SA-ZariyahNeural',     // Arabic
  bn: 'bn-IN-TanishaaNeural',    // Bengali
  mr: 'mr-IN-AarohiNeural',      // Marathi
  kn: 'kn-IN-SapnaNeural',       // Kannada
  ml: 'ml-IN-SobhanaNeural',     // Malayalam
  pa: 'pa-IN-OjasNeural',        // Punjabi
  gu: 'gu-IN-DhwaniNeural',      // Gujarati
};

export async function synthesizeNeuralSpeech(text, targetLang = 'en') {
  if (!text || !text.trim()) return null;

  const cleanLang = (targetLang ? targetLang.toLowerCase().trim() : 'en');
  const baseLang = cleanLang.split('-')[0];
  const voiceName = NEURAL_VOICE_MAP[cleanLang] || NEURAL_VOICE_MAP[baseLang] || 'en-US-JennyNeural';

  // ── 1. Edge Neural Deep Learning Vocoder (Free & High Quality) ──────────
  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = tts.toStream(text.trim());

    const chunks = [];
    const buffer = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('TTS timeout')), 7000);
      audioStream.on('data', (chunk) => chunks.push(chunk));
      audioStream.on('close', () => {
        clearTimeout(timeout);
        resolve(Buffer.concat(chunks));
      });
      audioStream.on('error', (err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });

    if (buffer && buffer.length > 500) {
      console.log(`[tts:edge-neural] generated ${buffer.length} bytes for voice "${voiceName}"`);
      return {
        audioBase64: buffer.toString('base64'),
        mimeType: 'audio/mp3',
        voice: voiceName,
      };
    }
  } catch (err) {
    console.warn(`[tts:edge-neural] voice "${voiceName}" failed:`, err.message);
  }

  // ── 2. OpenAI Deep Learning Neural TTS (tts-1) Fallback ───────────────────
  if (process.env.OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text.trim(),
          voice: 'alloy',
        }),
      });

      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        const buffer = Buffer.from(arrayBuf);
        console.log(`[tts:openai] generated ${buffer.length} bytes`);
        return {
          audioBase64: buffer.toString('base64'),
          mimeType: 'audio/mp3',
          voice: 'openai-alloy',
        };
      }
    } catch (err) {
      console.warn('[tts:openai] failed:', err.message);
    }
  }

  // ── 3. Google TTS Fallback ────────────────────────────────────────────────
  try {
    const encoded = encodeURIComponent(text.trim());
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encoded}&tl=${baseLang}&client=tw-ob`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });
    if (res.ok) {
      const arrayBuf = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuf);
      console.log(`[tts:google] generated ${buffer.length} bytes`);
      return {
        audioBase64: buffer.toString('base64'),
        mimeType: 'audio/mp3',
        voice: `google-${baseLang}`,
      };
    }
  } catch (err) {
    console.warn('[tts:google] fallback failed:', err.message);
  }

  return null;
}
