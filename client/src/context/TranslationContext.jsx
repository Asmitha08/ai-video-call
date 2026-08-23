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

const TranslationContext = createContext(null);

export function TranslationProvider({ children }) {
  const { room, localStream, isAudioMuted } = useCall();

  // Settings
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [myLanguage, setMyLanguage] = useState('en'); // spoken source language (en, te, hi, es, ta)
  const [targetLanguage, setTargetLanguage] = useState('te'); // subtitle & TTS target language (default: Telugu)
  const [speakTranslations, setSpeakTranslations] = useState(true); // TTS voice read-aloud
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

  // Pre-load synthesis voices for TTS
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        try { synthVoicesRef.current = window.speechSynthesis.getVoices(); } catch {}
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // ── Bulletproof Multi-Tier Translation Helper ────────────────────────────
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

      // Tier 1: Socket.IO Server Translation (if connected)
      if (socket.connected) {
        try {
          const translated = await new Promise((resolve, reject) => {
            const timer = setTimeout(() => reject(new Error('socket timeout')), 3000);
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

      // Tier 2: Backend REST API (/api/translate)
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: cleanText, sourceLang: sLang, targetLang: tLang }),
        });
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

      // Tier 3: Direct Browser Google Translate GTX (Zero Backend Dependency)
      try {
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
          sLang
        )}&tl=${encodeURIComponent(tLang)}&dt=t&q=${encodeURIComponent(cleanText)}`;
        const gRes = await fetch(gUrl);
        if (gRes.ok) {
          const gData = await gRes.json();
          if (Array.isArray(gData) && Array.isArray(gData[0])) {
            const translated = gData[0]
              .map((item) => (item && item[0] ? item[0] : ''))
              .join('')
              .trim();
            if (translated) {
              clientTranslationCache.current.set(cacheKey, translated);
              return translated;
            }
          }
        }
      } catch (err) {
        console.warn('[translate:google-direct] fallback:', err.message);
      }

      // Tier 4: Direct Browser MyMemory Free API Fallback
      try {
        const sl = sLang === 'auto' ? 'en' : sLang;
        const mUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          cleanText
        )}&langpair=${encodeURIComponent(sl)}|${encodeURIComponent(tLang)}`;
        const mRes = await fetch(mUrl);
        if (mRes.ok) {
          const mData = await mRes.json();
          if (mData?.responseData?.translatedText) {
            const translated = mData.responseData.translatedText.trim();
            clientTranslationCache.current.set(cacheKey, translated);
            return translated;
          }
        }
      } catch (err) {
        console.warn('[translate:mymemory-direct] failed:', err.message);
      }

      return cleanText;
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

  // ── Text-to-Speech (TTS) Voice Synthesis (Deep Learning Neural TTS) ─────────
  const speakText = useCallback(
    async (text, langCode) => {
      if (!speakTranslations || !text || !text.trim()) return;
      const targetCode = (langCode || targetLanguage || 'en').split('-')[0].toLowerCase();

      // 1. Try Deep Learning Neural TTS from server
      try {
        const audioData = await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 3000);
          socket.emit('caption:tts', { text: text.trim(), targetLang: targetCode }, (res) => {
            clearTimeout(timeout);
            if (res?.audioBase64) resolve(res);
            else reject(new Error(res?.error || 'no neural audio'));
          });
        });

        if (audioData?.audioBase64) {
          if (activeAudioRef.current) {
            try { activeAudioRef.current.pause(); } catch {}
          }
          const audio = new Audio(`data:${audioData.mimeType || 'audio/mp3'};base64,${audioData.audioBase64}`);
          audio.volume = 1.0;
          activeAudioRef.current = audio;
          await audio.play();
          console.log(`[tts:neural] playing voice (${audioData.voice})`);
          return;
        }
      } catch (err) {
        console.warn('[tts:neural] falling back to browser synthesis:', err.message);
      }

      // 2. Fallback to browser SpeechSynthesis
      if ('speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const targetLangObj = getLanguageByCode(targetCode);
          const bcp47 = targetLangObj.bcp47 || 'en-US';

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = bcp47;
          utterance.rate = 1.0;
          utterance.volume = 1.0;

          const voices = synthVoicesRef.current.length
            ? synthVoicesRef.current
            : window.speechSynthesis.getVoices();

          const matchedVoice = voices.find(
            (v) => v.lang.toLowerCase() === bcp47.toLowerCase() || v.lang.startsWith(targetCode)
          );
          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          window.speechSynthesis.speak(utterance);
        } catch (synthErr) {
          console.warn('[tts:synth] error:', synthErr);
        }
      }
    },
    [speakTranslations, targetLanguage]
  );

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

      // Record to transcript history if final
      if (isFinal && originalText.trim()) {
        const entry = {
          id: `${socketId}-${now}`,
          speakerId: socketId,
          displayName,
          originalText,
          translatedText: translatedText || originalText,
          sourceLang,
          targetLang,
          timestamp: now,
        };

        setTranscriptHistory((prev) => [...prev, entry]);

        // Speak incoming translated speech out loud via TTS
        if (socketId !== socket.id) {
          speakText(translatedText || originalText, targetLang);
        }
      }
    },
    [speakText]
  );

  // ── High-Accuracy Speech Recognition Engine ───────────────────────────────
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition || !captionsEnabled || isAudioMuted || !room) {
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch {}
        recognitionRef.current = null;
      }
      setIsTranscribing(false);
      return;
    }

    isListeningRef.current = true;
    let recognition = null;

    try {
      const myLangObj = getLanguageByCode(myLanguage);
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = myLangObj.bcp47 || 'en-US';

      recognition.onstart = () => {
        setIsTranscribing(true);
      };

      recognition.onresult = async (event) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item && item[0]) {
            if (item.isFinal) {
              finalTranscript += item[0].transcript;
            } else {
              interim += item[0].transcript;
            }
          }
        }

        const activeText = (finalTranscript || interim).trim();
        if (!activeText) return;

        const isFinal = Boolean(finalTranscript);
        const myLangCode = myLanguage.split('-')[0];

        const activeSocketId = socket.id || 'local';

        // Broadcast to all participants in the room
        socket.emit('caption:speak', {
          text: activeText,
          sourceLang: myLangCode,
          isFinal,
          displayName: room?.displayName || 'You',
        });

        // Translate for local subtitle view
        const translated = await translate(activeText, myLangCode, targetLanguage);

        updateCaption({
          socketId: activeSocketId,
          displayName: room?.displayName || 'You',
          originalText: activeText,
          translatedText: translated,
          sourceLang: myLangCode,
          targetLang: targetLanguage,
          isFinal,
        });
      };

      recognition.onerror = (e) => {
        if (e.error === 'no-speech' || e.error === 'aborted') return;
        console.warn('[speech:recognition] error:', e.error);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          isListeningRef.current = false;
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current && captionsEnabled && !isAudioMuted && room) {
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => {
            if (isListeningRef.current) {
              try { recognition.start(); } catch {}
            }
          }, 800);
        } else {
          setIsTranscribing(false);
        }
      };

      recognition.start();
      recognitionRef.current = recognition;

    } catch (err) {
      console.warn('[speech:init] failed:', err);
    }

    return () => {
      isListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      if (recognition) {
        try {
          recognition.onend = null;
          recognition.onerror = null;
          recognition.abort();
        } catch {}
      }
      setIsTranscribing(false);
    };
  }, [captionsEnabled, isAudioMuted, room, myLanguage, targetLanguage, translate, updateCaption]);

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

      // Translate the incoming text in real time
      const translated = await translate(activeText, sourceLang, targetLanguage);

      updateCaption({
        socketId: fromSocketId,
        displayName: displayName || 'Participant',
        originalText: activeText,
        translatedText: translated,
        sourceLang,
        targetLang: targetLanguage,
        isFinal: isFinal ?? true,
      });
    };

    socket.on('caption:receive', handleRemoteCaption);

    return () => {
      socket.off('caption:receive', handleRemoteCaption);
    };
  }, [captionsEnabled, targetLanguage, translate, updateCaption]);

  // ── Manual Caption / Chat ─────────────────────────────────────────────────
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

      const translated = await translate(clean, myLangCode, targetLanguage);

      updateCaption({
        socketId: activeSocketId,
        displayName: room?.displayName || 'You',
        originalText: clean,
        translatedText: translated,
        sourceLang: myLangCode,
        targetLang: targetLanguage,
        isFinal: true,
      });
    },
    [myLanguage, targetLanguage, room?.displayName, translate, updateCaption]
  );

  const toggleCaptions = () => setCaptionsEnabled((prev) => !prev);
  const toggleSpeakTranslations = () => setSpeakTranslations((prev) => !prev);
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
    isTranscribing,
    sendManualCaption,
    liveCaptions,
    transcriptHistory,
    clearTranscript,
    speakText,
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
