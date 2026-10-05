import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:audioplayers/audioplayers.dart';
import '../models/language_model.dart';
import 'socket_service.dart';

class TextToSpeechService {
  final FlutterTts _flutterTts = FlutterTts();
  final AudioPlayer _audioPlayer = AudioPlayer();
  bool _isEnabled = true;
  bool _isPlaying = false;
  String _targetLanguageCode = 'te';

  bool get isEnabled => _isEnabled;
  bool get isPlaying => _isPlaying;

  Future<void> initialize() async {
    try {
      await _flutterTts.setSpeechRate(0.5);
      await _flutterTts.setVolume(1.0);
      await _flutterTts.setPitch(1.0);

      _flutterTts.setStartHandler(() {
        _isPlaying = true;
      });

      _flutterTts.setCompletionHandler(() {
        _isPlaying = false;
      });

      _flutterTts.setErrorHandler((msg) {
        _isPlaying = false;
        debugPrint('[Device TTS Error] $msg');
      });

      _audioPlayer.onPlayerComplete.listen((_) {
        _isPlaying = false;
      });
    } catch (e) {
      debugPrint('[TTS Init Error] $e');
    }
  }

  void setEnabled(bool enabled) {
    _isEnabled = enabled;
    if (!enabled) {
      stop();
    }
  }

  void setTargetLanguage(String langCode) {
    _targetLanguageCode = langCode.split('-').first.toLowerCase();
  }

  Future<void> speak({
    required String text,
    String? langCode,
    SocketService? socketService,
  }) async {
    if (!_isEnabled || text.trim().isEmpty) return;

    final targetCode = (langCode ?? _targetLanguageCode).split('-').first.toLowerCase();
    final cleanText = text.trim();

    // 1. Try Backend Neural TTS over Socket.IO if connected
    if (socketService != null && socketService.isConnected) {
      try {
        final audioBase64 = await socketService.requestNeuralTts(cleanText, targetCode);
        if (audioBase64 != null && audioBase64.isNotEmpty) {
          await _audioPlayer.stop();
          final bytes = base64Decode(audioBase64);
          _isPlaying = true;
          await _audioPlayer.play(BytesSource(bytes));
          debugPrint('[TTS] Playing Server Neural TTS audio for language $targetCode');
          return;
        }
      } catch (e) {
        debugPrint('[TTS Server Fallback] $e');
      }
    }

    // 2. Fallback to Device Native Flutter TTS
    try {
      final lang = Language.getByCode(targetCode);
      await _flutterTts.stop();
      await _flutterTts.setLanguage(lang.bcp47);
      _isPlaying = true;
      await _flutterTts.speak(cleanText);
    } catch (e) {
      debugPrint('[TTS Local Speak Error] $e');
      _isPlaying = false;
    }
  }

  Future<void> stop() async {
    _isPlaying = false;
    try {
      await _flutterTts.stop();
      await _audioPlayer.stop();
    } catch (e) {
      debugPrint('[TTS Stop Error] $e');
    }
  }

  void dispose() {
    stop();
    _audioPlayer.dispose();
  }
}
