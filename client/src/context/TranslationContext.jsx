import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { socket } from '../lib/socket.js';
import { useCall } from './CallContext.jsx';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../lib/languages.js';
import { translateOffline, getPhoneticFallback } from '../lib/offlineTranslator.js';

// Common acoustic noise, breathing, throat clearing, and non-speech filler tokens
const NOISE_TOKENS = new Set([
  'uh', 'um', 'umm', 'uhh', 'ah', 'ahh', 'eh', 'er', 'oh', 'hmm', 'hm', 'hmmm',
  'shh', 'shhh', 'sh', 'psst', 'ha', 'haha', 'tsk', 'grunt', 'cough', 'snort',
  'gasp', 'sigh', 'click', 'clicks', 'clack', 'tick', 'buzz', 'static', 'beep',
  'woosh', 'throat', 'inaudible', 'applause', 'music', 'laughter', 'noise',
  'coughing', 'mhm', 'mm', 'mmm', 'mm-hmm', 'uh-huh', 'huh', 'ooh', 'whoa',
  'pfft', 'pff', 'brr', 'ach', 'oops', 'clearing', 'whisper', 'breath', 'breathing'
]);

/**
 * Validates whether a recognized sound is actual human speech or background noise/artifact.
 */
function isNoiseOrGibberish(rawText, confidence = 1.0, lang = 'en') {
  if (!rawText) return true;
  const text = rawText.trim();
  if (!text) return true;

  // 1. Confidence threshold: Chrome emits confidence < 0.50 for ambient noise/clicks
  if (confidence > 0 && confidence < 0.50) {
    return true;
  }

  // 2. Bracketed sound effect markers like [Music], [Laughter], (inaudible)
  if (/^[(\[][a-zA-Z\s]+[)\]]$/.test(text)) {
    return true;
  }

  // Normalize punctuation and whitespace
  const clean = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?"'…]/g, '').trim();
  if (!clean) return true;

  // Single characters in any language (unless specific grammatical words like 'I' or 'a')
  if (clean.length < 2 && !['a', 'i', 'я', '我'].includes(clean)) {
    return true;
  }

  // 3. Acoustic noise filler check
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  // If every word in the utterance is an acoustic filler/noise token
  if (words.every((w) => NOISE_TOKENS.has(w))) {
    return true;
  }

  // 4. Repeated character gibberish (e.g., "shhhh", "ssss", "zzzzz", "kkkkk")
  if (/(.)\1{2,}/.test(clean)) {
    return true;
  }

  // 5. Isolated single consonant or acoustic pop in Latin languages
  const baseLang = (lang || 'en').split('-')[0].toLowerCase();
  const latinLangs = ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'tr', 'vi', 'id'];

  if (latinLangs.includes(baseLang)) {
    if (words.length === 1) {
      const single = words[0];
      if (single.length === 1 && !['a', 'i'].includes(single)) {
        return true;
      }
      if (single.length === 2 && !/[aeiouy]/.test(single)) {
        return true;
      }
    }
  }

  return false;
}

const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const { room, localStream, isAudioMuted } = useCall();

  // Settings
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [myLanguage, setMyLanguage] = useState('en'); // spoken source language (en, te, hi, es, ta)
  const [targetLanguage, setTargetLanguage] = useState('te'); // subtitle & TTS target language (default: Telugu)
  const [speakTranslations, setSpeakTranslations] = useState(true); // TTS voice read-aloud
  const [hearSelfTranslation, setHearSelfTranslation] = useState(false); // Default to false to eliminate mic-to-speaker feedback loop
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Live subtitles on screen: socketId -> { displayName, originalText, translatedText, sourceLang, targetLang, isFinal, timestamp }
  const [liveCaptions, setLiveCaptions] = useState({});

  // Full transcript history
  const [transcriptHistory, setTranscriptHistory] = useState([]);

  // Active timers & refs
  const captionTimeoutsRef = useRef(new Map());
  const recognitionRef = useRef(null);
  const restartTimerRef = useRef(null);
  const isListeningRef = useRef(false);
  const clientTranslationCache = useRef(new Map());
  const synthVoicesRef = useRef([]);
  const activeUtteranceRef = useRef(null);
  const lastSpokenRef = useRef({ text: '', time: 0 });
  const lastFinalTranscriptRef = useRef({ text: '', time: 0 });
  const lastTtsEndTimeRef = useRef(0);
  const lastTtsSpokenPhrasesRef = useRef([]);
  const spokenUtteranceKeysRef = useRef(new Set());
  const hearSelfTranslationRef = useRef(hearSelfTranslation);
  hearSelfTranslationRef.current = hearSelfTranslation;

  // Pre-load synthesis voices for TTS and auto-unlock on user interaction
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        try { synthVoicesRef.current = window.speechSynthesis.getVoices(); } catch {}
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    const unlockAudio = () => {
      if ('speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        } catch {}
      }
    };

    window.addEventListener('click', unlockAudio, { passive: true });
    window.addEventListener('touchstart', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  // ── Synchronous Instant Translation Lookup (0ms latency) ─────────────────
  const translateSync = useCallback((text, sourceLang, targetLang) => {
    if (!text || !text.trim()) return '';
    const cleanText = text.trim();
    const s = (sourceLang || 'en').split('-')[0].toLowerCase();
    const t = (targetLang || 'te').split('-')[0].toLowerCase();
    if (s === t && s !== 'auto') return cleanText;

    const cacheKey = `${s}->${t}:${cleanText.toLowerCase()}`;
    if (clientTranslationCache.current.has(cacheKey)) {
      return clientTranslationCache.current.get(cacheKey);
    }

    const offline = translateOffline(cleanText, s, t);
    return offline || cleanText;
  }, []);

  // ── Bulletproof Offline-First Fast Translation Helper ───────────────────
  const translate = useCallback(
    async (text, sourceLang, targetLang) => {
      if (!text || !text.trim()) return '';
      const cleanText = text.trim();
      const sLang = sourceLang ? sourceLang.split('-')[0].toLowerCase() : 'auto';
      const tLang = targetLang ? targetLang.split('-')[0].toLowerCase() : 'en';

      if (sLang === tLang && sLang !== 'auto') return cleanText;

      const cacheKey = `${sLang}->${tLang}:${cleanText.toLowerCase()}`;
      if (clientTranslationCache.current.has(cacheKey)) {
        return clientTranslationCache.current.get(cacheKey);
      }

      // Check offline dictionary match first
      const offlineMatch = translateOffline(cleanText, sLang, tLang);
      if (offlineMatch && offlineMatch.toLowerCase() !== cleanText.toLowerCase()) {
        clientTranslationCache.current.set(cacheKey, offlineMatch);
      }

      // If user is completely offline, return immediately in 0ms!
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        return offlineMatch || cleanText;
      }

      // Tier 1: Socket.IO Server Translation (if connected) with fast 1s timeout
      if (socket.connected) {
        try {
          const translated = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('socket timeout')), 1200);
            socket.emit(
              'caption:translate',
              { text: cleanText, sourceLang: sLang, targetLang: tLang },
              (response) => {
                clearTimeout(timer);
                if (response?.translatedText && response.translatedText.trim()) {
                  resolve(response.translatedText.trim());
                } else {
                  reject(new Error('empty socket translation'));
                }
              }
            );
          });
          if (translated) {
            clientTranslationCache.current.set(cacheKey, translated);
            return translated;
          }
        } catch (err) {
          console.warn('[translate:socket] fallback:', err.message);
        }
      }

      // Tier 2: Backend REST API (/api/translate) with 1s timeout
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, sourceLang: sLang, targetLang: tLang }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data.translatedText && data.translatedText.trim()) {
            const translated = data.translatedText.trim();
            clientTranslationCache.current.set(cacheKey, translated);
            return translated;
          }
        }
      } catch (err) {
        console.warn('[translate:api] fallback:', err.message);
      }

      // Tier 3: Direct Browser Google Clients5 Translation Endpoint
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1200);
        const gUrl = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(
          sLang
        )}&tl=${encodeURIComponent(tLang)}&q=${encodeURIComponent(cleanText)}`;
        const gRes = await fetch(gUrl, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (Array.isArray(gData) && gData[0]) {
            const translated =
              typeof gData[0] === 'string'
                ? gData[0]
                : Array.isArray(gData[0])
                ? gData[0][0]
                : String(gData[0]);
            if (translated && translated.trim()) {
              const resText = translated.trim();
              clientTranslationCache.current.set(cacheKey, resText);
              return resText;
            }
          }
        }
      } catch (err) {
        console.warn('[translate:clients5-direct] fallback:', err.message);
      }

      // Tier 4: Direct Offline Fallback (0ms, 100% offline)
      const fallbackResult = offlineMatch || cleanText;
      clientTranslationCache.current.set(cacheKey, fallbackResult);
      return fallbackResult;
    },
    []
  );

  // ── Unlock TTS on any screen click/touch ──────────────────────────────────
  const unlockTTS = useCallback(() => {
    if ('speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        const silent = new SpeechSynthesisUtterance(' ');
        silent.volume = 0.01;
        window.speechSynthesis.speak(silent);
      } catch {}
    }
  }, []);

  const activeAudioRef = useRef(null);

  // ── Text-to-Speech (TTS) Voice Synthesis Engine (25 Languages Offline-Ready) ─
  const speakText = useCallback(
    async (text, langCode) => {
      if (!speakTranslations || !text || !text.trim()) return;
      const cleanText = text.trim();
      const targetCode = (langCode || targetLanguage || 'en').split('-')[0].toLowerCase();

      // Prevent immediate duplicate re-speaking within 2.5 seconds
      const now = Date.now();
      if (lastSpokenRef.current.text === cleanText && now - lastSpokenRef.current.time < 2500) {
        return;
      }
      lastSpokenRef.current = { text: cleanText, time: now };

      // Immediately cancel any previous ongoing audio/speech to prevent stutter or overlaps
      if (activeAudioRef.current) {
        try {
          activeAudioRef.current.pause();
          activeAudioRef.current.currentTime = 0;
        } catch {}
      }
      if ('speechSynthesis' in window) {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          window.speechSynthesis.cancel();
        } catch {}
      }

      // Record spoken phrase for echo loop suppression
      lastTtsSpokenPhrasesRef.current.push(cleanText.toLowerCase());
      if (lastTtsSpokenPhrasesRef.current.length > 8) {
        lastTtsSpokenPhrasesRef.current.shift();
      }

      // ── Helper to execute on-device browser SpeechSynthesis with clean phonetic fallback ──
      const playOnDeviceSpeech = () => {
        if (!('speechSynthesis' in window)) return;
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          window.speechSynthesis.cancel();

          const targetLangObj = getLanguageByCode(targetCode);
          const bcp47 = targetLangObj.bcp47 || 'en-US';

          const voices = synthVoicesRef.current.length
            ? synthVoicesRef.current
            : window.speechSynthesis.getVoices();

          // 1. Exact BCP-47 match
          let matchedVoice = voices.find((v) => v.lang.toLowerCase() === bcp47.toLowerCase());

          // 2. Language prefix match (e.g., 'te' -> 'te-IN')
          if (!matchedVoice) {
            matchedVoice = voices.find((v) => v.lang.toLowerCase().startsWith(targetCode));
          }

          // 3. Voice name match
          if (!matchedVoice && targetLangObj.name) {
            const simpleName = targetLangObj.name.split(' ')[0].toLowerCase();
            matchedVoice = voices.find((v) => v.name.toLowerCase().includes(simpleName));
          }

          // Strict target language enforcement:
          // ONLY the specified language chosen for translation can be spoken!
          // NEVER speak using an English or other foreign voice when targetCode is a different language!
          if (!matchedVoice) {
            if (targetCode !== 'en') {
              console.warn(`[tts] Only the specified language (${targetCode}) is permitted. No device voice found for ${targetCode}; skipping fallback to avoid foreign language mismatch.`);
              return;
            }
            matchedVoice = voices.find((v) => v.default) || voices[0];
          }

          if (!matchedVoice) return;

          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.lang = matchedVoice.lang || bcp47;
          utterance.rate = 1.0;
          utterance.volume = 1.0;
          utterance.voice = matchedVoice;

          utterance.onstart = () => {
            lastTtsEndTimeRef.current = Date.now() + 8000;
          };
          utterance.onend = () => {
            activeUtteranceRef.current = null;
            lastTtsEndTimeRef.current = Date.now();
          };
          utterance.onerror = (e) => {
            console.warn('[tts:speechSynthesis] error:', e.error);
            activeUtteranceRef.current = null;
            lastTtsEndTimeRef.current = Date.now();
          };

          activeUtteranceRef.current = utterance;
          window.speechSynthesis.speak(utterance);
        } catch (synthErr) {
          console.warn('[tts:synth] fatal error:', synthErr);
        }
      };

      // 1. If offline, immediately use browser on-device speech synthesis (0 network delay)
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        playOnDeviceSpeech();
        return;
      }

      // 2. Try Deep Learning Neural TTS from server (if online and connected)
      try {
        let audioBase64 = null;
        let mimeType = 'audio/mp3';
        let voice = null;

        if (socket.connected) {
          try {
            const res = await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => reject(new Error('timeout')), 4500);
              socket.emit('caption:tts', { text: cleanText, targetLang: targetCode }, (resp) => {
                clearTimeout(timeout);
                if (resp?.audioBase64) resolve(resp);
                else reject(new Error(resp?.error || 'no neural audio'));
              });
            });
            audioBase64 = res?.audioBase64;
            mimeType = res?.mimeType || 'audio/mp3';
            voice = res?.voice;
          } catch {}
        }

        // Fast HTTP REST fallback if socket was busy
        if (!audioBase64) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            const res = await fetch('/api/tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ text: cleanText, targetLang: targetCode }),
              signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (res.ok) {
              const data = await res.json();
              if (data?.audioBase64) {
                audioBase64 = data.audioBase64;
                mimeType = data.mimeType || 'audio/mp3';
                voice = data.voice;
              }
            }
          } catch {}
        }

        if (audioBase64) {
          if (activeAudioRef.current) {
            try {
              activeAudioRef.current.pause();
              activeAudioRef.current.currentTime = 0;
            } catch {}
          }
          const audio = new Audio(`data:${mimeType};base64,${audioBase64}`);
          audio.volume = 1.0;
          activeAudioRef.current = audio;

          audio.onplay = () => {
            lastTtsEndTimeRef.current = Date.now() + 8000;
          };
          audio.onended = () => {
            lastTtsEndTimeRef.current = Date.now();
          };
          audio.onerror = () => {
            lastTtsEndTimeRef.current = Date.now();
          };

          await audio.play();
          console.log(`[tts:neural] playing voice (${voice})`);
          return;
        }
      } catch (err) {
        console.warn('[tts:neural] falling back to on-device synthesis:', err.message);
      }

      // 3. Fallback to on-device SpeechSynthesis (100% Offline-Safe)
      playOnDeviceSpeech();
    },
    [speakTranslations, targetLanguage]
  );

  // ── Voice test helper (All 25 Languages) ───────────────────────────────────
  const testVoice = useCallback((customLang) => {
    const code = (customLang || targetLanguage || 'en').split('-')[0].toLowerCase();
    const samplePhrases = {
      en: 'Hello! This is live AI neural translation voice.',
      te: 'నమస్కారం! ఇది ప్రత్యక్ష ఏఐ వాయిస్ అనువాదం.',
      hi: 'नमस्ते! यह लाइव एआई वॉयस अनुवाद है।',
      ta: 'வணக்கம்! இது நேரடி AI குரல் மொழிபெயர்ப்பு.',
      kn: 'ನಮಸ್ಕಾರ! ಇದು ಲೈವ್ ಎಐ ಧ್ವನಿ ಅನುವಾದ.',
      ml: 'നമസ്കാരം! ഇത് ലൈവ് എഐ വോയ്‌സ് വിവർത്തനമാണ്.',
      mr: 'नमस्कार! हे थेट एआय व्हॉइस भाषांतर आहे.',
      bn: 'নমস্কার! এটি লাইভ এআই ভয়েস অনুবাদ।',
      gu: 'નમસ્તે! આ લાઈવ એઆઈ વોઈસ અનુવાદ છે.',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਇਹ ਲਾਈਵ ਏਆਈ ਆਵਾਜ਼ ਅਨੁਵਾਦ ਹੈ।',
      es: '¡Hola! Esta es la traducción de voz con IA en tiempo real.',
      fr: 'Bonjour! Ceci est la traduction vocale IA en direct.',
      de: 'Hallo! Dies ist die Live-KI-Sprachübersetzung.',
      zh: '你好！这是实时AI语音翻译。',
      ja: 'こんにちは！これはリアルタイムAI音声翻訳です。',
      ko: '안녕하세요! 실시간 AI 음성 번역입니다.',
      pt: 'Olá! Esta é a tradução de voz por IA em tempo real.',
      it: 'Ciao! Questa è la traduzione vocale AI in tempo reale.',
      ru: 'Здравствуйте! Это голосовой перевод на базе ИИ в реальном времени.',
      ar: 'مرحبا! هذه ترجمة صوتية بالذكاء الاصطناعي في الوقت الفعلي.',
      nl: 'Hallo! Dit is de live AI-stemvertaling.',
      tr: 'Merhaba! Bu canlı yapay zeka sesli çevirisidir.',
      vi: 'Xin chào! Đây là bản dịch giọng nói AI trực tiếp.',
      th: 'สวัสดี! นี่คือการแปลเสียง AI แบบเรียลไทม์',
      id: 'Halo! Ini adalah terjemahan suara AI langsung.'
    };
    const sample = samplePhrases[code] || `Hello! AI translation voice is active for ${code}.`;
    speakText(sample, code);
  }, [speakText, targetLanguage]);

  // ── Push / update live subtitle (Persistent 12s duration) ─────────────────
  const updateCaption = useCallback(
    ({ socketId, displayName, originalText, translatedText, sourceLang, targetLang, isFinal }) => {
      const now = Date.now();

      setLiveCaptions((prev) => ({
        ...prev,
        [socketId]: {
          displayName,
          originalText,
          translatedText: translatedText || originalText,
          sourceLang,
          targetLang,
          isFinal: isFinal ?? true,
          timestamp: now,
        },
      }));

      // Keep subtitle visible and stable for 12 seconds so users can read it
      if (captionTimeoutsRef.current.has(socketId)) {
        clearTimeout(captionTimeoutsRef.current.get(socketId));
      }

      captionTimeoutsRef.current.set(
        socketId,
        setTimeout(() => {
          setLiveCaptions((prev) => {
            const next = { ...prev };
            delete next[socketId];
            return next;
          });
        }, 12000)
      );

      // Record to transcript history if final and speak strictly ONCE per utterance in chosen language
      if (isFinal && originalText.trim()) {
        const cleanOrig = originalText.trim().toLowerCase();
        const turnKey = `${socketId}:${cleanOrig}`;
        const alreadySpoken = spokenUtteranceKeysRef.current.has(turnKey);

        const sLangCode = (sourceLang || 'en').split('-')[0].toLowerCase();
        const tLangCode = (targetLang || targetLanguage || 'en').split('-')[0].toLowerCase();
        const isCrossLanguage = sLangCode !== tLangCode;

        // Is the text actually in the target language (not raw untranslated source words)?
        const isTranslated = !isCrossLanguage || (
          translatedText &&
          translatedText.trim() &&
          translatedText.trim().toLowerCase() !== originalText.trim().toLowerCase()
        );

        const isSelf = socketId === socket.id || socketId === 'local';
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

        // Only commit to spoken if the text is in the target language (or user is completely offline)
        if (!alreadySpoken && (isTranslated || isOffline)) {
          spokenUtteranceKeysRef.current.add(turnKey);
          if (spokenUtteranceKeysRef.current.size > 120) {
            const first = spokenUtteranceKeysRef.current.values().next().value;
            spokenUtteranceKeysRef.current.delete(first);
          }

          const entry = {
            id: `${socketId}-${now}`,
            turnKey,
            speakerId: socketId,
            displayName,
            originalText,
            translatedText: translatedText || originalText,
            sourceLang,
            targetLang: tLangCode,
            timestamp: now,
          };

          setTranscriptHistory((prev) => [...prev, entry]);

          // Only speak if:
          // 1. Remote participant speech OR user explicitly enabled hearSelfTranslation
          // 2. AND the text is strictly in the chosen target language
          if (!isSelf || hearSelfTranslationRef.current) {
            const speechContent = isTranslated ? translatedText : (isCrossLanguage ? null : originalText);
            if (speechContent && speechContent.trim()) {
              speakText(speechContent.trim(), tLangCode);
            }
          }
        } else {
          // If already spoken or was waiting for the true target language translation:
          if (translatedText) {
            setTranscriptHistory((prev) =>
              prev.map((item) =>
                item.turnKey === turnKey ? { ...item, translatedText } : item
              )
            );

            // If it was delayed waiting for the verified target language translation:
            if (!alreadySpoken && isTranslated) {
              spokenUtteranceKeysRef.current.add(turnKey);
              if (!isSelf || hearSelfTranslationRef.current) {
                speakText(translatedText.trim(), tLangCode);
              }
            }
          }
        }
      }
    },
    [speakText]
  );

  const [sttError, setSttError] = useState(null);

  // ── Stable State Refs (Prevents Re-render Abortion Loops) ────────────────
  const updateCaptionRef = useRef(updateCaption);
  updateCaptionRef.current = updateCaption;

  const translateRef = useRef(translate);
  translateRef.current = translate;

  const myLangRef = useRef(myLanguage);
  myLangRef.current = myLanguage;

  const targetLangRef = useRef(targetLanguage);
  targetLangRef.current = targetLanguage;

  const roomRef = useRef(room);
  roomRef.current = room;

  const isAudioMutedRef = useRef(isAudioMuted);
  isAudioMutedRef.current = isAudioMuted;

  const captionsEnabledRef = useRef(captionsEnabled);
  captionsEnabledRef.current = captionsEnabled;

  // ── High-Accuracy Speech Recognition Engine ───────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    let activeSession = null;
    let isStopped = false;
    let restartTimer = null;
    let isStarting = false;

    if (!captionsEnabled || isAudioMuted || !room) {
      setIsTranscribing(false);
      return;
    }

    if (!SpeechRecognition) {
      setSttError('Speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    function startSession() {
      if (isStopped || isStarting) return;
      isStarting = true;

      try {
        if (activeSession) {
          try {
            activeSession.onend = null;
            activeSession.onerror = null;
            activeSession.onresult = null;
            activeSession.abort();
          } catch {}
          activeSession = null;
        }

        const langObj = getLanguageByCode(myLangRef.current);
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;
        recognition.lang = langObj.bcp47 || 'en-US';

        recognition.onstart = () => {
          isStarting = false;
          if (!isStopped) {
            setIsTranscribing(true);
            setSttError(null);
            console.log('[speech:recognition] listening active for lang:', recognition.lang);
          }
        };

        recognition.onresult = async (event) => {
          if (isStopped || isAudioMutedRef.current || !captionsEnabledRef.current) return;

          const currentMyLang = (myLangRef.current || 'en').split('-')[0];
          const currentTargetLang = targetLangRef.current || 'te';
          const currentRoom = roomRef.current;
          const activeSocketId = socket.id || 'local';

          // Echo suppression: check if TTS is playing through laptop speakers
          const isTtsSpeakingNow =
            (window.speechSynthesis && window.speechSynthesis.speaking) ||
            (activeAudioRef.current && !activeAudioRef.current.paused) ||
            Date.now() - lastTtsEndTimeRef.current < 900;

          // Hard echo gate: if TTS is actively speaking aloud, discard mic input to prevent acoustic loopback
          if (isTtsSpeakingNow) return;

          let interim = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            if (item && item[0]) {
              const rawChunk = (item[0].transcript || '').trim();
              const confidence = typeof item[0].confidence === 'number' ? item[0].confidence : 1.0;

              // Filter out ambient background noise, static, breaths, clicks (< 0.52 confidence)
              if (confidence > 0 && confidence < 0.52) {
                continue;
              }

              // Filter out non-speech noise and filler tokens
              if (isNoiseOrGibberish(rawChunk, confidence, currentMyLang)) {
                continue;
              }

              if (item.isFinal) {
                finalTranscript += rawChunk + ' ';
              } else {
                interim += rawChunk;
              }
            }
          }

          const activeText = (finalTranscript || interim).trim();
          if (!activeText) return;

          // Secondary noise and length validation
          if (isNoiseOrGibberish(activeText, 1.0, currentMyLang)) return;
          if (activeText.length < 2 && !['a', 'i', 'y', 'o', '我', '你', '好'].includes(activeText.toLowerCase())) {
            return;
          }

          // Discard speaker acoustic loopback if phrase matches recently spoken TTS
          const isEcho = lastTtsSpokenPhrasesRef.current.some(
            (spoken) => spoken.includes(activeText.toLowerCase()) || activeText.toLowerCase().includes(spoken)
          );
          if (isEcho && Date.now() - lastTtsEndTimeRef.current < 3000) {
            return;
          }

          const isFinal = Boolean(finalTranscript.trim());

          // Prevent rapid duplicate repeats of the exact same final sentence within 3000ms
          const now = Date.now();
          if (isFinal) {
            if (lastFinalTranscriptRef.current.text === activeText && now - lastFinalTranscriptRef.current.time < 3000) {
              return;
            }
            lastFinalTranscriptRef.current = { text: activeText, time: now };
          }

          const fastTranslation = translateSync(activeText, currentMyLang, currentTargetLang);

          if (updateCaptionRef.current) {
            updateCaptionRef.current({
              socketId: activeSocketId,
              displayName: currentRoom?.displayName || 'You',
              originalText: activeText,
              translatedText: fastTranslation,
              sourceLang: currentMyLang,
              targetLang: currentTargetLang,
              isFinal,
            });
          }

          socket.emit('caption:speak', {
            text: activeText,
            sourceLang: currentMyLang,
            isFinal,
            displayName: currentRoom?.displayName || 'You',
          });

          if (isFinal && typeof navigator !== 'undefined' && navigator.onLine) {
            translateRef.current(activeText, currentMyLang, currentTargetLang)
              .then((enriched) => {
                if (enriched && updateCaptionRef.current) {
                  updateCaptionRef.current({
                    socketId: activeSocketId,
                    displayName: currentRoom?.displayName || 'You',
                    originalText: activeText,
                    translatedText: enriched,
                    sourceLang: currentMyLang,
                    targetLang: currentTargetLang,
                    isFinal: true,
                  });
                }
              })
              .catch(() => {});
          }
        };

        recognition.onerror = (e) => {
          isStarting = false;
          if (e.error === 'no-speech' || e.error === 'aborted') {
            return;
          }
          console.warn('[speech:recognition] error:', e.error);
          if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
            setSttError('Microphone access blocked for speech recognition. Please click the 🔒 icon in your browser URL bar and allow Microphone access.');
            isStopped = true;
            setIsTranscribing(false);
          } else if (e.error === 'audio-capture') {
            setSttError('No microphone detected. Please check your microphone connection.');
          } else if (e.error === 'network') {
            setSttError('Offline mode: Desktop Chrome requires internet for voice recognition. Use the Offline Quick-Translate bar below to translate & speak in all 25 languages offline!');
          }
        };

        recognition.onend = () => {
          isStarting = false;
          if (isStopped || !captionsEnabledRef.current || isAudioMutedRef.current || !roomRef.current) {
            setIsTranscribing(false);
            return;
          }

          // Restart session smoothly with fresh instance
          if (restartTimer) clearTimeout(restartTimer);
          restartTimer = setTimeout(() => {
            if (!isStopped && captionsEnabledRef.current && !isAudioMutedRef.current && roomRef.current) {
              startSession();
            }
          }, 250);
        };

        recognition.start();
        activeSession = recognition;
        recognitionRef.current = recognition;
      } catch (err) {
        isStarting = false;
        console.warn('[speech:session] start error:', err);
        if (!isStopped) {
          if (restartTimer) clearTimeout(restartTimer);
          restartTimer = setTimeout(startSession, 1000);
        }
      }
    }

    startSession();

    return () => {
      isStopped = true;
      isStarting = false;
      if (restartTimer) clearTimeout(restartTimer);
      if (activeSession) {
        try {
          activeSession.onend = null;
          activeSession.onerror = null;
          activeSession.onresult = null;
          activeSession.abort();
        } catch {}
      }
      setIsTranscribing(false);
    };
  }, [captionsEnabled, isAudioMuted, room, myLanguage]);

  // ── Receive captions from server (Live Broadcast) ─────────────────────────
  useEffect(() => {
    const handleRemoteCaption = async ({
      fromSocketId,
      displayName,
      originalText,
      text,
      sourceLang,
      isFinal,
    }) => {
      const activeText = originalText || text;
      if (!captionsEnabled || !activeText) return;

      // Translate the incoming text in real time with instant offline fallback
      const fastTranslated = translateSync(activeText, sourceLang, targetLanguage);

      updateCaption({
        socketId: fromSocketId,
        displayName: displayName || 'Participant',
        originalText: activeText,
        translatedText: fastTranslated,
        sourceLang,
        targetLang: targetLanguage,
        isFinal: isFinal ?? true,
      });

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        translate(activeText, sourceLang, targetLanguage).then((enriched) => {
          if (enriched) {
            updateCaption({
              socketId: fromSocketId,
              displayName: displayName || 'Participant',
              originalText: activeText,
              translatedText: enriched,
              sourceLang,
              targetLang: targetLanguage,
              isFinal: true,
            });
          }
        }).catch(() => {});
      }
    };

    socket.on('caption:receive', handleRemoteCaption);

    return () => {
      socket.off('caption:receive', handleRemoteCaption);
    };
  }, [captionsEnabled, targetLanguage, translate, translateSync, updateCaption]);

  // ── Manual Caption / Chat (Instant 0ms Offline Translation) ───────────────
  const sendManualCaption = useCallback(
    async (text) => {
      if (!text || !text.trim()) return;
      const clean = text.trim();
      const myLangCode = myLanguage.split('-')[0];

      const activeSocketId = socket.id || 'local';

      socket.emit('caption:speak', {
        text: clean,
        sourceLang: myLangCode,
        isFinal: true,
        displayName: room?.displayName || 'You',
      });

      // Synchronous offline instant translation (0ms)
      const fastTranslation = translateSync(clean, myLangCode, targetLanguage);

      updateCaption({
        socketId: activeSocketId,
        displayName: room?.displayName || 'You',
        originalText: clean,
        translatedText: fastTranslation,
        sourceLang: myLangCode,
        targetLang: targetLanguage,
        isFinal: true,
      });

      // Asynchronous online enrichment if internet is available
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        translate(clean, myLangCode, targetLanguage).then((enriched) => {
          if (enriched && enriched !== fastTranslation) {
            updateCaption({
              socketId: activeSocketId,
              displayName: room?.displayName || 'You',
              originalText: clean,
              translatedText: enriched,
              sourceLang: myLangCode,
              targetLang: targetLanguage,
              isFinal: true,
            });
          }
        }).catch(() => {});
      }
    },
    [myLanguage, targetLanguage, room?.displayName, translate, translateSync, updateCaption]
  );

  const toggleCaptions = () => setCaptionsEnabled((prev) => !prev);
  const toggleSpeakTranslations = () => setSpeakTranslations((prev) => !prev);
  const toggleHearSelfTranslation = () => setHearSelfTranslation((prev) => !prev);
  const clearTranscript = () => setTranscriptHistory([]);

  const value = {
    captionsEnabled,
    toggleCaptions,
    unlockTTS,
    myLanguage,
    setMyLanguage,
    targetLanguage,
    setTargetLanguage,
    speakTranslations,
    setSpeakTranslations,
    toggleSpeakTranslations,
    hearSelfTranslation,
    setHearSelfTranslation,
    toggleHearSelfTranslation,
    isTranscribing,
    sttError,
    sendManualCaption,
    liveCaptions,
    transcriptHistory,
    clearTranscript,
    speakText,
    testVoice,
    supportedLanguages: SUPPORTED_LANGUAGES,
    myLanguageObj: getLanguageByCode(myLanguage),
    targetLanguageObj: getLanguageByCode(targetLanguage),
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export const useTranslation = () => {
  const ctx = useContext(TranslationContext);
  if (!ctx) throw new Error('useTranslation must be used within <TranslationProvider>');
  return ctx;
};
