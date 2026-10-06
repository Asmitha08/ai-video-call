import { translateOffline } from './offlineTranslator.js';

/**
 * Fast multi-provider translation service with in-memory caching.
 * Supports 25+ languages with automatic fallback across multiple providers and offline dictionary.
 */

const translationCache = new Map();

/**
 * Normalizes text and generates a cache key.
 */
function getCacheKey(text, sourceLang, targetLang) {
  return `${sourceLang}->${targetLang}:${text.trim().toLowerCase()}`;
}

/**
 * Helper to decode HTML entities in scraped text.
 */
function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/**
 * Translates text from sourceLang to targetLang.
 * @param {string} text
 * @param {string} sourceLang (e.g. 'en', 'es', 'fr', 'auto')
 * @param {string} targetLang (e.g. 'es', 'en', 'hi', 'fr', 'te', 'ta')
 * @returns {Promise<string>}
 */
export async function translateText(text, sourceLang = 'auto', targetLang = 'en') {
  if (!text || !text.trim()) return '';

  const cleanText = text.trim();
  const sLang = sourceLang ? sourceLang.split('-')[0].toLowerCase() : 'auto';
  const tLang = targetLang ? targetLang.split('-')[0].toLowerCase() : 'en';

  if (sLang === tLang && sLang !== 'auto') {
    return cleanText;
  }

  const cacheKey = getCacheKey(cleanText, sLang, tLang);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // Fast offline dictionary check
  const offlineMatch = translateOffline(cleanText, sLang, tLang);
  if (offlineMatch && offlineMatch.toLowerCase() !== cleanText.toLowerCase()) {
    translationCache.set(cacheKey, offlineMatch);
  }

  // ── Provider 1: Google Clients5 Translation Endpoint (Fastest & Reliable with 1.2s timeout) ───
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(
      sLang
    )}&tl=${encodeURIComponent(tLang)}&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]) {
        const translated =
          typeof data[0] === 'string'
            ? data[0]
            : Array.isArray(data[0])
            ? data[0][0]
            : String(data[0]);
        if (translated && translated.trim()) {
          const result = translated.trim();
          translationCache.set(cacheKey, result);
          return result;
        }
      } else if (typeof data === 'string' && data.trim()) {
        const result = data.trim();
        translationCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 1 (clients5) error:', err.message);
  }

  // ── Provider 2: Instant Offline Dictionary Fallback (<1ms) ────────────────
  const fallback = offlineMatch || cleanText;
  translationCache.set(cacheKey, fallback);
  return fallback;
}

