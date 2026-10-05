import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import '../models/caption_model.dart';
import '../models/language_model.dart';
import '../services/socket_service.dart';
import '../services/webrtc_service.dart';
import '../services/speech_service.dart';
import '../services/tts_service.dart';
import '../services/translation_service.dart';
import '../widgets/live_caption_card.dart';
import '../widgets/transcript_bottom_sheet.dart';
import '../widgets/language_selector_dialog.dart';

class CallScreen extends StatefulWidget {
  final String serverUrl;
  final String displayName;
  final String? roomId;
  final bool isHost;
  final Language myLanguage;
  final Language targetLanguage;

  const CallScreen({
    super.key,
    required this.serverUrl,
    required this.displayName,
    this.roomId,
    required this.isHost,
    required this.myLanguage,
    required this.targetLanguage,
  });

  @override
  State<CallScreen> createState() => _CallScreenState();
}

class _CallScreenState extends State<CallScreen> {
  late final SocketService _socketService;
  late final WebRtcService _webrtcService;
  late final SpeechRecognitionService _speechService;
  late final TextToSpeechService _ttsService;

  String? _activeRoomId;
  bool _isConnected = false;
  bool _isSpeechRecogActive = true;
  bool _isTtsActive = true;

  late Language _currentMyLanguage;
  late Language _currentTargetLanguage;

  CaptionModel? _currentLiveCaption;
  Timer? _captionClearTimer;
  final List<CaptionModel> _transcriptHistory = [];

  @override
  void initState() {
    super.initState();
    _currentMyLanguage = widget.myLanguage;
    _currentTargetLanguage = widget.targetLanguage;

    _socketService = SocketService();
    _webrtcService = WebRtcService(socketService: _socketService);
    _speechService = SpeechRecognitionService();
    _ttsService = TextToSpeechService();

    _initializeCall();
  }

  Future<void> _initializeCall() async {
    await _webrtcService.initialize();
    await _webrtcService.startLocalStream();
    await _ttsService.initialize();
    _ttsService.setTargetLanguage(_currentTargetLanguage.code);

    _webrtcService.onStateChanged = () {
      if (mounted) setState(() {});
    };

    // Socket Event Wiring
    _socketService.onConnectionChange = (connected) {
      if (mounted) setState(() => _isConnected = connected);
    };

    _socketService.onJoinedRoom = (roomId, participants) {
      if (mounted) setState(() => _activeRoomId = roomId);
      // Initiate WebRTC offers to existing participants
      for (final p in participants) {
        if (p is Map && p['socketId'] != null) {
          _webrtcService.initiateCall(p['socketId'].toString());
        }
      }
    };

    _socketService.onParticipantJoined = (socketId, name) {
      debugPrint('[Room] Participant joined: $socketId ($name)');
    };

    _socketService.onParticipantLeft = (socketId) {
      _webrtcService.removePeer(socketId);
    };

    _socketService.onOfferReceived = (fromSocketId, sdp) {
      _webrtcService.handleOffer(fromSocketId, sdp);
    };

    _socketService.onAnswerReceived = (fromSocketId, sdp) {
      _webrtcService.handleAnswer(fromSocketId, sdp);
    };

    _socketService.onIceCandidateReceived = (fromSocketId, candidate) {
      _webrtcService.handleIceCandidate(fromSocketId, candidate);
    };

    // Live Captions from socket
    _socketService.onCaptionReceived = (caption) async {
      // Translate for my target language if different
      String translated = caption.originalText;
      if (caption.sourceLang != _currentTargetLanguage.code) {
        translated = await TranslationService.translate(
          text: caption.originalText,
          sourceLang: caption.sourceLang,
          targetLang: _currentTargetLanguage.code,
          serverBaseUrl: widget.serverUrl,
        );
      }

      final updated = caption.copyWith(
        translatedText: translated,
        targetLang: _currentTargetLanguage.code,
      );

      _showLiveCaption(updated);

      if (caption.isFinal) {
        if (mounted) {
          setState(() {
            _transcriptHistory.add(updated);
          });
        }
        // Speak aloud via TTS if not from self
        if (caption.speakerId != _socketService.socketId && _isTtsActive) {
          _ttsService.speak(
            text: updated.translatedText,
            langCode: _currentTargetLanguage.code,
            socketService: _socketService,
          );
        }
      }
    };

    // Connect to backend server
    _socketService.connect(widget.serverUrl);

    // Wait a moment for socket connection then create/join room
    Future.delayed(const Duration(milliseconds: 600), () async {
      if (widget.isHost) {
        final rId = await _socketService.createRoom(widget.displayName);
        if (mounted && rId != null) {
          setState(() => _activeRoomId = rId);
        }
      } else if (widget.roomId != null) {
        final success = await _socketService.joinRoom(widget.roomId!, widget.displayName);
        if (mounted && success) {
          setState(() => _activeRoomId = widget.roomId);
        }
      }

      // Initialize Continuous Speech Recognition
      _startSpeechRecognition();
    });
  }

  void _startSpeechRecognition() async {
    _speechService.onSpeechResult = (words, isFinal) async {
      if (!_isSpeechRecogActive || _webrtcService.isAudioMuted) return;

      // Broadcast to all participants in room
      _socketService.broadcastSpeechCaption(
        text: words,
        sourceLang: _currentMyLanguage.code,
        isFinal: isFinal,
        displayName: widget.displayName,
      );

      // Also translate locally to preview on my own screen
      final translated = await TranslationService.translate(
        text: words,
        sourceLang: _currentMyLanguage.code,
        targetLang: _currentTargetLanguage.code,
        serverBaseUrl: widget.serverUrl,
      );

      final myCaption = CaptionModel(
        id: 'local-${DateTime.now().millisecondsSinceEpoch}',
        speakerId: _socketService.socketId ?? 'local',
        displayName: '${widget.displayName} (You)',
        originalText: words,
        translatedText: translated,
        sourceLang: _currentMyLanguage.code,
        targetLang: _currentTargetLanguage.code,
        isFinal: isFinal,
        timestamp: DateTime.now().millisecondsSinceEpoch,
      );

      _showLiveCaption(myCaption);

      if (isFinal) {
        if (mounted) {
          setState(() {
            _transcriptHistory.add(myCaption);
          });
        }
      }
    };

    await _speechService.initialize();
    _speechService.startListening(localeId: _currentMyLanguage.bcp47);
  }

  void _showLiveCaption(CaptionModel caption) {
    if (!mounted) return;
    _captionClearTimer?.cancel();
    setState(() {
      _currentLiveCaption = caption;
    });

    _captionClearTimer = Timer(const Duration(seconds: 12), () {
      if (mounted) {
        setState(() {
          _currentLiveCaption = null;
        });
      }
    });
  }

  void _showLanguageSelector({required bool isSource}) {
    showDialog(
      context: context,
      builder: (context) => LanguageSelectorDialog(
        title: isSource ? 'Change Spoken Language (STT)' : 'Change Target Subtitle Language (TTS)',
        selectedLanguage: isSource ? _currentMyLanguage : _currentTargetLanguage,
        onSelected: (lang) {
          setState(() {
            if (isSource) {
              _currentMyLanguage = lang;
              _speechService.changeLanguage(lang);
            } else {
              _currentTargetLanguage = lang;
              _ttsService.setTargetLanguage(lang.code);
            }
          });
        },
      ),
    );
  }

  void _showTranscriptHistory() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => TranscriptBottomSheet(
        transcriptHistory: _transcriptHistory,
        onSpeakText: (text, langCode) {
          _ttsService.speak(
            text: text,
            langCode: langCode,
            socketService: _socketService,
          );
        },
      ),
    );
  }

  void _leaveCall() {
    _speechService.dispose();
    _ttsService.dispose();
    _socketService.leaveRoom();
    _socketService.disconnect();
    _webrtcService.dispose();
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _captionClearTimer?.cancel();
    _speechService.dispose();
    _ttsService.dispose();
    _webrtcService.dispose();
    _socketService.disconnect();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final remoteRenderersList = _webrtcService.remoteRenderers.values.toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Stack(
          children: [
            // ── 1. Video Feeds ────────────────────────────────────────────────
            Positioned.fill(
              child: remoteRenderersList.isNotEmpty
                  ? RTCVideoView(
                      remoteRenderersList.first,
                      objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover,
                    )
                  : Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(24),
                            decoration: BoxDecoration(
                              color: const Color(0xFF1E293B),
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white12),
                            ),
                            child: const Icon(Icons.person_search_rounded, size: 48, color: Color(0xFF818CF8)),
                          ),
                          const SizedBox(height: 16),
                          const Text(
                            'Waiting for other participants to join...',
                            style: TextStyle(color: Colors.white70, fontSize: 15, fontWeight: FontWeight.w500),
                          ),
                          const SizedBox(height: 8),
                          if (_activeRoomId != null)
                            InkWell(
                              onTap: () {
                                Clipboard.setData(ClipboardData(text: _activeRoomId!));
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Room code copied to clipboard')),
                                );
                              },
                              child: Container(
                                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF6366F1).withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: const Color(0xFF6366F1)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Room Code: ${_activeRoomId!}',
                                      style: const TextStyle(color: Color(0xFF818CF8), fontWeight: FontWeight.bold),
                                    ),
                                    const SizedBox(width: 6),
                                    const Icon(Icons.copy_rounded, color: Color(0xFF818CF8), size: 14),
                                  ],
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
            ),

            // ── 2. Local Picture-in-Picture Video ──────────────────────────────
            Positioned(
              top: 16,
              right: 16,
              width: 110,
              height: 150,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.3), width: 1.5),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.4),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: _webrtcService.isVideoOff
                      ? const Center(
                          child: Icon(Icons.videocam_off_rounded, color: Colors.white54, size: 28),
                        )
                      : RTCVideoView(
                          _webrtcService.localRenderer,
                          mirror: true,
                          objectFit: RTCVideoViewObjectFit.RTCVideoViewObjectFitCover,
                        ),
                ),
              ),
            ),

            // ── 3. Top Info Bar (Room ID & Language Badges) ─────────────────────
            Positioned(
              top: 16,
              left: 16,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.65),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white12),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: _isConnected ? const Color(0xFF10B981) : const Color(0xFFEF4444),
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      _activeRoomId != null ? 'Room: ${_activeRoomId!}' : 'Connecting...',
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(width: 10),
                    InkWell(
                      onTap: () => _showLanguageSelector(isSource: true),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${_currentMyLanguage.flag} ${_currentMyLanguage.code.toUpperCase()}',
                          style: const TextStyle(color: Colors.white, fontSize: 11),
                        ),
                      ),
                    ),
                    const Text(' → ', style: TextStyle(color: Colors.white70, fontSize: 11)),
                    InkWell(
                      onTap: () => _showLanguageSelector(isSource: false),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6366F1).withOpacity(0.4),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${_currentTargetLanguage.flag} ${_currentTargetLanguage.code.toUpperCase()}',
                          style: const TextStyle(color: Color(0xFF818CF8), fontSize: 11, fontWeight: FontWeight.bold),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // ── 4. Live Subtitles Overlay ──────────────────────────────────────
            if (_currentLiveCaption != null)
              Positioned(
                left: 16,
                right: 16,
                bottom: 110,
                child: LiveCaptionCard(
                  caption: _currentLiveCaption!,
                  onSpeakTap: () {
                    _ttsService.speak(
                      text: _currentLiveCaption!.translatedText,
                      langCode: _currentTargetLanguage.code,
                      socketService: _socketService,
                    );
                  },
                ),
              ),

            // ── 5. Bottom Call Controls Toolbar ────────────────────────────────
            Positioned(
              left: 0,
              right: 0,
              bottom: 16,
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: const Color(0xFF1E293B).withOpacity(0.9),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: Colors.white12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Mic Mute
                      _buildControlButton(
                        icon: _webrtcService.isAudioMuted ? Icons.mic_off_rounded : Icons.mic_rounded,
                        active: !_webrtcService.isAudioMuted,
                        onTap: () => _webrtcService.toggleAudio(),
                        tooltip: _webrtcService.isAudioMuted ? 'Unmute' : 'Mute',
                      ),

                      // Video Toggle
                      _buildControlButton(
                        icon: _webrtcService.isVideoOff ? Icons.videocam_off_rounded : Icons.videocam_rounded,
                        active: !_webrtcService.isVideoOff,
                        onTap: () => _webrtcService.toggleVideo(),
                        tooltip: _webrtcService.isVideoOff ? 'Start Video' : 'Stop Video',
                      ),

                      // Switch Camera
                      _buildControlButton(
                        icon: Icons.flip_camera_ios_rounded,
                        active: true,
                        onTap: () => _webrtcService.switchCamera(),
                        tooltip: 'Flip Camera',
                      ),

                      // Speech-to-Text Recognition Toggle
                      _buildControlButton(
                        icon: _isSpeechRecogActive ? Icons.subtitles_rounded : Icons.subtitles_off_rounded,
                        active: _isSpeechRecogActive,
                        activeColor: const Color(0xFF38BDF8),
                        onTap: () {
                          setState(() {
                            _isSpeechRecogActive = !_isSpeechRecogActive;
                            if (_isSpeechRecogActive) {
                              _speechService.startListening(localeId: _currentMyLanguage.bcp47);
                            } else {
                              _speechService.stopListening();
                            }
                          });
                        },
                        tooltip: _isSpeechRecogActive ? 'Speech Recog ON' : 'Speech Recog OFF',
                      ),

                      // Neural Text-to-Speech (TTS Readout) Toggle
                      _buildControlButton(
                        icon: _isTtsActive ? Icons.volume_up_rounded : Icons.volume_off_rounded,
                        active: _isTtsActive,
                        activeColor: const Color(0xFF10B981),
                        onTap: () {
                          setState(() {
                            _isTtsActive = !_isTtsActive;
                            _ttsService.setEnabled(_isTtsActive);
                          });
                        },
                        tooltip: _isTtsActive ? 'TTS Voice ON' : 'TTS Voice OFF',
                      ),

                      // Transcript Drawer
                      _buildControlButton(
                        icon: Icons.chat_bubble_outline_rounded,
                        active: true,
                        onTap: _showTranscriptHistory,
                        tooltip: 'Transcript',
                      ),

                      // End Call
                      InkWell(
                        onTap: _leaveCall,
                        borderRadius: BorderRadius.circular(24),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: const BoxDecoration(
                            color: Color(0xFFEF4444),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.call_end_rounded, color: Colors.white, size: 22),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildControlButton({
    required IconData icon,
    required bool active,
    required VoidCallback onTap,
    String? tooltip,
    Color? activeColor,
  }) {
    final color = active ? (activeColor ?? const Color(0xFF818CF8)) : Colors.white38;

    return Tooltip(
      message: tooltip ?? '',
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(24),
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: active ? color.withOpacity(0.15) : Colors.white.withOpacity(0.06),
            shape: BoxShape.circle,
          ),
          child: Icon(icon, color: color, size: 20),
        ),
      ),
    );
  }
}
