/**
 * Fast multi-provider translation service with in-memory caching.
 * Supports 25+ languages with fallback between free translation providers.
 */

const translationCache = new Map();

/**
 * Normalizes text and generates a cache key.
 */
function getCacheKey(text, sourceLang, targetLang) {
  return `${sourceLang}->${targetLang}:${text.trim().toLowerCase()}`;
}

/**
 * Translates text from sourceLang to targetLang.
 * @param {string} text
 * @param {string} sourceLang (e.g. 'en', 'es', 'fr', 'auto')
 * @param {string} targetLang (e.g. 'es', 'en', 'hi', 'fr')
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

  // ── Provider 1: Google Translate public endpoint (Fast, highly accurate) ────
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(
      sLang
    )}&tl=${encodeURIComponent(tLang)}&dt=t&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item) => (item && item[0] ? item[0] : ''))
          .join('');
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 1 error:', err.message);
  }

  // ── Provider 2: MyMemory Translation API (Free Fallback) ───────────────────
  try {
    const sl = sLang === 'auto' ? 'en' : sLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      cleanText
    )}&langpair=${encodeURIComponent(sl)}|${encodeURIComponent(tLang)}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data?.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 2 error:', err.message);
  }

  // Fallback: return original text if all translation APIs fail
  return cleanText;
}
