/**
 * Supported languages for Speech-to-Text and AI Translation.
 * Primary focus: English, Telugu, Hindi, Spanish, and Tamil.
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'en', bcp47: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'te', bcp47: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳' },
  { code: 'hi', bcp47: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳' },
  { code: 'es', bcp47: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸' },
  { code: 'ta', bcp47: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳' },
  { code: 'fr', bcp47: 'fr-FR', name: 'French (Français)', flag: '🇫🇷' },
  { code: 'de', bcp47: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪' },
  { code: 'zh', bcp47: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳' },
  { code: 'ja', bcp47: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵' },
  { code: 'ko', bcp47: 'ko-KR', name: 'Korean (한국어)', flag: '🇰🇷' },
  { code: 'pt', bcp47: 'pt-BR', name: 'Portuguese (Português)', flag: '🇧🇷' },
  { code: 'it', bcp47: 'it-IT', name: 'Italian (Italiano)', flag: '🇮🇹' },
  { code: 'ru', bcp47: 'ru-RU', name: 'Russian (Русский)', flag: '🇷🇺' },
  { code: 'ar', bcp47: 'ar-SA', name: 'Arabic (العربية)', flag: '🇸🇦' },
  { code: 'bn', bcp47: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇧🇩' },
  { code: 'mr', bcp47: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳' },
  { code: 'gu', bcp47: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳' },
  { code: 'kn', bcp47: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳' },
  { code: 'ml', bcp47: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳' },
  { code: 'pa', bcp47: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳' },
  { code: 'nl', bcp47: 'nl-NL', name: 'Dutch (Nederlands)', flag: '🇳🇱' },
  { code: 'tr', bcp47: 'tr-TR', name: 'Turkish (Türkçe)', flag: '🇹🇷' },
  { code: 'vi', bcp47: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', flag: '🇻🇳' },
  { code: 'th', bcp47: 'th-TH', name: 'Thai (ไทย)', flag: '🇹🇭' },
  { code: 'id', bcp47: 'id-ID', name: 'Indonesian (Bahasa Indonesia)', flag: '🇮🇩' },
];

export function getLanguageByCode(code) {
  if (!code) return SUPPORTED_LANGUAGES[0];
  const c = code.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.find((l) => l.code === c) || SUPPORTED_LANGUAGES[0];
}
