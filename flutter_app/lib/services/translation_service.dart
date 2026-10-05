import 'dart:convert';
import 'package:http/http.dart' as http;

class TranslationService {
  static final Map<String, String> _cache = {};

  static Future<String> translate({
    required String text,
    required String sourceLang,
    required String targetLang,
    String? serverBaseUrl,
  }) async {
    final cleanText = text.trim();
    if (cleanText.isEmpty) return '';

    final sLang = sourceLang.split('-').first.toLowerCase();
    final tLang = targetLang.split('-').first.toLowerCase();

    if (sLang == tLang && sLang != 'auto') {
      return cleanText;
    }

    final cacheKey = '$sLang->$tLang:${cleanText.toLowerCase()}';
    if (_cache.containsKey(cacheKey)) {
      return _cache[cacheKey]!;
    }

    // 1. Try Backend Server REST API if provided
    if (serverBaseUrl != null && serverBaseUrl.isNotEmpty) {
      try {
        final url = Uri.parse('$serverBaseUrl/api/translate');
        final response = await http
            .post(
              url,
              headers: {'Content-Type': 'application/json'},
              body: jsonEncode({
                'text': cleanText,
                'sourceLang': sLang,
                'targetLang': tLang,
              }),
            )
            .timeout(const Duration(seconds: 4));

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          if (data['translatedText'] != null && data['translatedText'].toString().trim().isNotEmpty) {
            final result = data['translatedText'].toString().trim();
            _cache[cacheKey] = result;
            return result;
          }
        }
      } catch (e) {
        // Fallback to Google endpoints
      }
    }

    // 2. Direct Google Translation Single Client Endpoint
    try {
      final googleUrl = Uri.parse(
        'https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=$sLang&tl=$tLang&dt=t&q=${Uri.encodeComponent(cleanText)}',
      );
      final response = await http.get(googleUrl).timeout(const Duration(seconds: 3));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data is List && data.isNotEmpty && data[0] is List) {
          final buffer = StringBuffer();
          for (final item in data[0]) {
            if (item is List && item.isNotEmpty && item[0] != null) {
              buffer.write(item[0].toString());
            }
          }
          final result = buffer.toString().trim();
          if (result.isNotEmpty) {
            _cache[cacheKey] = result;
            return result;
          }
        }
      }
    } catch (e) {
      // Fallback to MyMemory
    }

    // 3. Direct MyMemory Translation Fallback
    try {
      final myMemoryUrl = Uri.parse(
        'https://api.mymemory.translated.net/get?q=${Uri.encodeComponent(cleanText)}&langpair=$sLang|$tLang',
      );
      final response = await http.get(myMemoryUrl).timeout(const Duration(seconds: 4));
      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final translated = data['responseData']?['translatedText']?.toString().trim();
        if (translated != null && translated.isNotEmpty) {
          _cache[cacheKey] = translated;
          return translated;
        }
      }
    } catch (e) {
      // Return original text if all fail
    }

    return cleanText;
  }
}
