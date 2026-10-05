import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:permission_handler/permission_handler.dart';
import '../models/language_model.dart';

typedef SpeechResultCallback = void Function(String text, bool isFinal);
typedef SpeechStatusCallback = void Function(bool isListening, String? error);

class SpeechRecognitionService {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isInitialized = false;
  bool _isListening = false;
  bool _shouldKeepListening = false;
  String _currentLocaleId = 'en-US';
  Timer? _restartDebounceTimer;

  SpeechResultCallback? onSpeechResult;
  SpeechStatusCallback? onStatusChanged;
  Function(double level)? onSoundLevelChanged;

  bool get isListening => _isListening;
  bool get isInitialized => _isInitialized;

  Future<bool> initialize() async {
    if (_isInitialized) return true;

    try {
      final status = await Permission.microphone.request();
      if (status != PermissionStatus.granted) {
        onStatusChanged?.call(false, 'Microphone permission denied');
        return false;
      }

      final speechStatus = await Permission.speech.request();
      // On some platforms permission.speech might not be mandatory, but we request it

      _isInitialized = await _speech.initialize(
        onStatus: (status) {
          debugPrint('[STT Status] $status');
          if (status == 'listening') {
            _isListening = true;
            onStatusChanged?.call(true, null);
          } else if (status == 'notListening' || status == 'done') {
            _isListening = false;
            onStatusChanged?.call(false, null);
            // If user intends to keep continuous listening, auto-rearm
            if (_shouldKeepListening) {
              _scheduleRestart();
            }
          }
        },
        onError: (errorNotification) {
          debugPrint('[STT Error] ${errorNotification.errorMsg} (permanent: ${errorNotification.permanent})');
          if (errorNotification.errorMsg != 'error_no_match' &&
              errorNotification.errorMsg != 'error_speech_timeout') {
            onStatusChanged?.call(false, errorNotification.errorMsg);
          }
          if (_shouldKeepListening) {
            _scheduleRestart();
          }
        },
      );

      return _isInitialized;
    } catch (e) {
      debugPrint('[STT Init Exception] $e');
      onStatusChanged?.call(false, e.toString());
      return false;
    }
  }

  void _scheduleRestart() {
    _restartDebounceTimer?.cancel();
    _restartDebounceTimer = Timer(const Duration(milliseconds: 350), () {
      if (_shouldKeepListening && !_speech.isListening) {
        startListening(localeId: _currentLocaleId);
      }
    });
  }

  Future<void> startListening({String? localeId}) async {
    if (!_isInitialized) {
      final ok = await initialize();
      if (!ok) return;
    }

    if (localeId != null && localeId.isNotEmpty) {
      _currentLocaleId = localeId;
    }

    _shouldKeepListening = true;

    try {
      await _speech.listen(
        onResult: (result) {
          final words = result.recognizedWords.trim();
          if (words.isNotEmpty) {
            onSpeechResult?.call(words, result.finalResult);
          }
        },
        localeId: _currentLocaleId,
        listenFor: const Duration(seconds: 30),
        pauseFor: const Duration(seconds: 3),
        partialResults: true,
        cancelOnError: false,
        listenMode: stt.ListenMode.dictation,
        onSoundLevelChange: (level) {
          onSoundLevelChanged?.call(level);
        },
      );
    } catch (e) {
      debugPrint('[STT Listen Exception] $e');
    }
  }

  Future<void> stopListening() async {
    _shouldKeepListening = false;
    _restartDebounceTimer?.cancel();
    try {
      await _speech.stop();
      _isListening = false;
      onStatusChanged?.call(false, null);
    } catch (e) {
      debugPrint('[STT Stop Exception] $e');
    }
  }

  void changeLanguage(Language language) {
    _currentLocaleId = language.bcp47;
    if (_shouldKeepListening) {
      stopListening().then((_) {
        startListening(localeId: _currentLocaleId);
      });
    }
  }

  void dispose() {
    _shouldKeepListening = false;
    _restartDebounceTimer?.cancel();
    _speech.cancel();
  }
}
