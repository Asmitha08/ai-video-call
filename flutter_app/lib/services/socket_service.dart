import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../models/caption_model.dart';

class SocketService {
  IO.Socket? _socket;
  String? _serverUrl;

  bool get isConnected => _socket?.connected ?? false;
  String? get socketId => _socket?.id;

  // Callbacks
  Function(bool connected)? onConnectionChange;
  Function(String roomId, List<dynamic> participants)? onJoinedRoom;
  Function(String socketId, String displayName)? onParticipantJoined;
  Function(String socketId)? onParticipantLeft;
  Function(String fromSocketId, dynamic sdp)? onOfferReceived;
  Function(String fromSocketId, dynamic sdp)? onAnswerReceived;
  Function(String fromSocketId, dynamic candidate)? onIceCandidateReceived;
  Function(String fromSocketId, bool audioEnabled, bool videoEnabled)? onMediaStateChanged;
  Function(CaptionModel caption)? onCaptionReceived;

  void connect(String url) {
    if (_socket != null && _socket!.connected) return;
    _serverUrl = url;

    _socket = IO.io(
      url,
      IO.OptionBuilder()
          .setTransports(['websocket', 'polling'])
          .disableAutoConnect()
          .enableReconnection()
          .setReconnectionAttempts(10)
          .setReconnectionDelay(1000)
          .build(),
    );

    _socket!.onConnect((_) {
      debugPrint('[Socket] Connected: ${_socket!.id}');
      onConnectionChange?.call(true);
    });

    _socket!.onDisconnect((_) {
      debugPrint('[Socket] Disconnected');
      onConnectionChange?.call(false);
    });

    _socket!.onConnectError((err) {
      debugPrint('[Socket Error] $err');
      onConnectionChange?.call(false);
    });

    // Room events
    _socket!.on('room:participant-joined', (data) {
      if (data is Map) {
        onParticipantJoined?.call(
          data['socketId']?.toString() ?? '',
          data['displayName']?.toString() ?? 'Participant',
        );
      }
    });

    _socket!.on('room:participant-left', (data) {
      if (data is Map) {
        onParticipantLeft?.call(data['socketId']?.toString() ?? '');
      }
    });

    // Signaling events
    _socket!.on('signal:offer', (data) {
      if (data is Map) {
        onOfferReceived?.call(
          data['fromSocketId']?.toString() ?? '',
          data['sdp'],
        );
      }
    });

    _socket!.on('signal:answer', (data) {
      if (data is Map) {
        onAnswerReceived?.call(
          data['fromSocketId']?.toString() ?? '',
          data['sdp'],
        );
      }
    });

    _socket!.on('signal:ice-candidate', (data) {
      if (data is Map) {
        onIceCandidateReceived?.call(
          data['fromSocketId']?.toString() ?? '',
          data['candidate'],
        );
      }
    });

    // Media states
    _socket!.on('media:state-change', (data) {
      if (data is Map) {
        onMediaStateChanged?.call(
          data['fromSocketId']?.toString() ?? '',
          data['audioEnabled'] ?? true,
          data['videoEnabled'] ?? true,
        );
      }
    });

    // Live Subtitles / Captions
    _socket!.on('caption:receive', (data) {
      if (data is Map) {
        final caption = CaptionModel.fromJson(Map<String, dynamic>.from(data));
        onCaptionReceived?.call(caption);
      }
    });

    _socket!.connect();
  }

  Future<String?> createRoom(String displayName) async {
    final completer = Completer<String?>();
    _socket?.emitWithAck('room:create', {'displayName': displayName}, ack: (response) {
      if (response is Map && response['roomId'] != null) {
        completer.complete(response['roomId'].toString());
      } else {
        completer.complete(null);
      }
    });
    return completer.future.timeout(const Duration(seconds: 6), onTimeout: () => null);
  }

  Future<bool> joinRoom(String roomId, String displayName) async {
    final completer = Completer<bool>();
    _socket?.emitWithAck('room:join', {'roomId': roomId, 'displayName': displayName}, ack: (response) {
      if (response is Map && response['error'] == null) {
        final participants = response['participants'] as List? ?? [];
        onJoinedRoom?.call(roomId, participants);
        completer.complete(true);
      } else {
        completer.complete(false);
      }
    });
    return completer.future.timeout(const Duration(seconds: 6), onTimeout: () => false);
  }

  void leaveRoom() {
    _socket?.emit('room:leave');
  }

  void sendOffer(String targetSocketId, dynamic sdp) {
    _socket?.emit('signal:offer', {
      'targetSocketId': targetSocketId,
      'sdp': sdp,
    });
  }

  void sendAnswer(String targetSocketId, dynamic sdp) {
    _socket?.emit('signal:answer', {
      'targetSocketId': targetSocketId,
      'sdp': sdp,
    });
  }

  void sendIceCandidate(String targetSocketId, dynamic candidate) {
    _socket?.emit('signal:ice-candidate', {
      'targetSocketId': targetSocketId,
      'candidate': candidate,
    });
  }

  void sendMediaState({required bool audioEnabled, required bool videoEnabled}) {
    _socket?.emit('media:state-change', {
      'audioEnabled': audioEnabled,
      'videoEnabled': videoEnabled,
    });
  }

  void broadcastSpeechCaption({
    required String text,
    required String sourceLang,
    required bool isFinal,
    required String displayName,
  }) {
    _socket?.emit('caption:speak', {
      'text': text,
      'sourceLang': sourceLang,
      'isFinal': isFinal,
      'displayName': displayName,
    });
  }

  Future<String?> requestNeuralTts(String text, String targetLang) async {
    final completer = Completer<String?>();
    _socket?.emitWithAck(
      'caption:tts',
      {'text': text, 'targetLang': targetLang},
      ack: (response) {
        if (response is Map && response['audioBase64'] != null) {
          completer.complete(response['audioBase64'].toString());
        } else {
          completer.complete(null);
        }
      },
    );
    return completer.future.timeout(const Duration(seconds: 5), onTimeout: () => null);
  }

  void disconnect() {
    _socket?.disconnect();
    _socket?.dispose();
    _socket = null;
  }
}
