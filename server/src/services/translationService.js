/**
 * Fast multi-provider translation service with in-memory caching.
 * Supports 25+ languages with automatic fallback across multiple providers.
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

  // ── Provider 1: Google Clients5 Translation Endpoint (Fastest & Reliable) ───
  try {
    const url = `https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=${encodeURIComponent(
      sLang
    )}&tl=${encodeURIComponent(tLang)}&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

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

  // ── Provider 2: Google Translate Single with dict-chrome-ex ────────────────
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${encodeURIComponent(
      sLang
    )}&tl=${encodeURIComponent(tLang)}&dt=t&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translated = data[0]
          .map((item) => (item && item[0] ? item[0] : ''))
          .join('')
          .trim();
        if (translated) {
          translationCache.set(cacheKey, translated);
          return translated;
        }
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 2 (single) error:', err.message);
  }

  // ── Provider 3: Google Mobile Web Translation Endpoint ─────────────────────
  try {
    const url = `https://translate.google.com/m?sl=${encodeURIComponent(
      sLang
    )}&tl=${encodeURIComponent(tLang)}&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (res.ok) {
      const html = await res.text();
      const match = html.match(/class="result-container">([\s\S]*?)<\/div>/);
      if (match && match[1]) {
        const decoded = decodeHtmlEntities(match[1]).trim();
        if (decoded) {
          translationCache.set(cacheKey, decoded);
          return decoded;
        }
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 3 (m.google) error:', err.message);
  }

  // ── Provider 4: MyMemory Translation API (With Matches Fallback) ───────────
  try {
    const sl = sLang === 'auto' ? 'en' : sLang;
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      cleanText
    )}&langpair=${encodeURIComponent(sl)}|${encodeURIComponent(tLang)}`;

    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      let translated = data?.responseData?.translatedText;
      if ((!translated || !translated.trim()) && Array.isArray(data?.matches)) {
        const validMatch = data.matches.find(
          (m) => m && m.translation && m.translation.trim()
        );
        if (validMatch) {
          translated = validMatch.translation;
        }
      }

      if (translated && translated.trim()) {
        const result = decodeHtmlEntities(translated).trim();
        translationCache.set(cacheKey, result);
        return result;
      }
    }
  } catch (err) {
    console.warn('[translation] Provider 4 (MyMemory) error:', err.message);
  }

  // ── Provider 5: Gemini AI / OpenAI (Optional API Keys) ────────────────────
  if (process.env.GEMINI_API_KEY) {
    try {
      const gUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
      const gRes = await fetch(gUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate the following text accurately from ${sLang} to ${tLang}. Output ONLY the translated text without notes or markdown:\n\n${cleanText}`,
                },
              ],
            },
          ],
        }),
      });
      if (gRes.ok) {
        const gData = await gRes.json();
        const genText =
          gData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (genText) {
          translationCache.set(cacheKey, genText);
          return genText;
        }
      }
    } catch (err) {
      console.warn('[translation] Gemini AI error:', err.message);
    }
  }

  // Fallback: return original text if all translation APIs fail
  return cleanText;
}
