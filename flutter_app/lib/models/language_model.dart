class Language {
  final String code;
  final String bcp47;
  final String name;
  final String flag;

  const Language({
    required this.code,
    required this.bcp47,
    required this.name,
    required this.flag,
  });

  static const List<Language> supportedLanguages = [
    Language(code: 'en', bcp47: 'en-US', name: 'English', flag: '🇺🇸'),
    Language(code: 'te', bcp47: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳'),
    Language(code: 'hi', bcp47: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳'),
    Language(code: 'es', bcp47: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸'),
    Language(code: 'ta', bcp47: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳'),
    Language(code: 'fr', bcp47: 'fr-FR', name: 'French (Français)', flag: '🇫🇷'),
    Language(code: 'de', bcp47: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪'),
    Language(code: 'zh', bcp47: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳'),
    Language(code: 'ja', bcp47: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵'),
    Language(code: 'ko', bcp47: 'ko-KR', name: 'Korean (한국어)', flag: '🇰🇷'),
    Language(code: 'pt', bcp47: 'pt-BR', name: 'Portuguese (Português)', flag: '🇧🇷'),
    Language(code: 'it', bcp47: 'it-IT', name: 'Italian (Italiano)', flag: '🇮🇹'),
    Language(code: 'ru', bcp47: 'ru-RU', name: 'Russian (Русский)', flag: '🇷🇺'),
    Language(code: 'ar', bcp47: 'ar-SA', name: 'Arabic (العربية)', flag: '🇸🇦'),
    Language(code: 'bn', bcp47: 'bn-IN', name: 'Bengali (বাংলা)', flag: '🇧🇩'),
    Language(code: 'mr', bcp47: 'mr-IN', name: 'Marathi (मराठी)', flag: '🇮🇳'),
    Language(code: 'gu', bcp47: 'gu-IN', name: 'Gujarati (ગુજરાતી)', flag: '🇮🇳'),
    Language(code: 'kn', bcp47: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳'),
    Language(code: 'ml', bcp47: 'ml-IN', name: 'Malayalam (മലയാളം)', flag: '🇮🇳'),
    Language(code: 'pa', bcp47: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', flag: '🇮🇳'),
  ];

  static Language getByCode(String? code) {
    if (code == null || code.isEmpty) return supportedLanguages.first;
    final clean = code.split('-').first.toLowerCase();
    return supportedLanguages.firstWhere(
      (lang) => lang.code == clean,
      orElse: () => supportedLanguages.first,
    );
  }
}
