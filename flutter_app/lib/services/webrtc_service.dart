import 'package:flutter/foundation.dart';
import 'package:flutter_webrtc/flutter_webrtc.dart';
import 'socket_service.dart';

class WebRtcService {
  final SocketService socketService;

  MediaStream? _localStream;
  final RTCVideoRenderer localRenderer = RTCVideoRenderer();
  final Map<String, RTCVideoRenderer> remoteRenderers = {};
  final Map<String, RTCPeerConnection> _peerConnections = {};

  bool _isAudioMuted = false;
  bool _isVideoOff = false;
  bool _isFrontCamera = true;

  bool get isAudioMuted => _isAudioMuted;
  bool get isVideoOff => _isVideoOff;
  MediaStream? get localStream => _localStream;

  Function()? onStateChanged;

  WebRtcService({required this.socketService});

  Future<void> initialize() async {
    await localRenderer.initialize();
  }

  Future<void> startLocalStream() async {
    final mediaConstraints = <String, dynamic>{
      'audio': {
        'echoCancellation': true,
        'noiseSuppression': true,
        'autoGainControl': true,
      },
      'video': {
        'mandatory': {
          'minWidth': '640',
          'minHeight': '480',
          'minFrameRate': '30',
        },
        'facingMode': _isFrontCamera ? 'user' : 'environment',
        'optional': [],
      }
    };

    try {
      _localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints);
      localRenderer.srcObject = _localStream;
      onStateChanged?.call();
    } catch (e) {
      debugPrint('[WebRTC Local Stream Error] $e');
    }
  }

  final Map<String, dynamic> _iceServers = {
    'iceServers': [
      {'urls': 'stun:stun.l.google.com:19302'},
      {'urls': 'stun:stun1.l.google.com:19302'},
      {'urls': 'stun:stun2.l.google.com:19302'},
    ]
  };

  final Map<String, dynamic> _config = {
    'mandatory': {},
    'optional': [
      {'DtlsSrtpKeyAgreement': true},
    ],
  };

  Future<RTCPeerConnection> _createPeerConnection(String remoteSocketId) async {
    final pc = await createPeerConnection(_iceServers, _config);

    // Add local tracks
    if (_localStream != null) {
      _localStream!.getTracks().forEach((track) {
        pc.addTrack(track, _localStream!);
      });
    }

    pc.onIceCandidate = (candidate) {
      if (candidate.candidate != null) {
        socketService.sendIceCandidate(remoteSocketId, candidate.toMap());
      }
    };

    pc.onTrack = (event) {
      if (event.streams.isNotEmpty) {
        final stream = event.streams[0];
        if (!remoteRenderers.containsKey(remoteSocketId)) {
          final renderer = RTCVideoRenderer();
          renderer.initialize().then((_) {
            renderer.srcObject = stream;
            remoteRenderers[remoteSocketId] = renderer;
            onStateChanged?.call();
          });
        } else {
          remoteRenderers[remoteSocketId]!.srcObject = stream;
          onStateChanged?.call();
        }
      }
    };

    pc.onConnectionState = (state) {
      debugPrint('[PeerConnection ($remoteSocketId)] State: $state');
      if (state == RTCPeerConnectionState.RTCPeerConnectionStateClosed ||
          state == RTCPeerConnectionState.RTCPeerConnectionStateFailed ||
          state == RTCPeerConnectionState.RTCPeerConnectionStateDisconnected) {
        removePeer(remoteSocketId);
      }
    };

    _peerConnections[remoteSocketId] = pc;
    return pc;
  }

  Future<void> initiateCall(String remoteSocketId) async {
    try {
      final pc = await _createPeerConnection(remoteSocketId);
      final offer = await pc.createOffer({
        'mandatory': {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true,
        },
      });
      await pc.setLocalDescription(offer);
      socketService.sendOffer(remoteSocketId, offer.toMap());
    } catch (e) {
      debugPrint('[WebRTC Offer Error] $e');
    }
  }

  Future<void> handleOffer(String remoteSocketId, dynamic sdpData) async {
    try {
      final pc = await _createPeerConnection(remoteSocketId);
      final sdp = RTCSessionDescription(sdpData['sdp'], sdpData['type']);
      await pc.setRemoteDescription(sdp);

      final answer = await pc.createAnswer({
        'mandatory': {
          'OfferToReceiveAudio': true,
          'OfferToReceiveVideo': true,
        },
      });
      await pc.setLocalDescription(answer);
      socketService.sendAnswer(remoteSocketId, answer.toMap());
    } catch (e) {
      debugPrint('[WebRTC Answer Error] $e');
    }
  }

  Future<void> handleAnswer(String remoteSocketId, dynamic sdpData) async {
    try {
      final pc = _peerConnections[remoteSocketId];
      if (pc != null) {
        final sdp = RTCSessionDescription(sdpData['sdp'], sdpData['type']);
        await pc.setRemoteDescription(sdp);
      }
    } catch (e) {
      debugPrint('[WebRTC Remote Sdp Error] $e');
    }
  }

  Future<void> handleIceCandidate(String remoteSocketId, dynamic candidateData) async {
    try {
      final pc = _peerConnections[remoteSocketId];
      if (pc != null) {
        final candidate = RTCIceCandidate(
          candidateData['candidate'],
          candidateData['sdpMid'],
          candidateData['sdpMLineIndex'],
        );
        await pc.addCandidate(candidate);
      }
    } catch (e) {
      debugPrint('[WebRTC Candidate Error] $e');
    }
  }

  void toggleAudio() {
    if (_localStream != null) {
      _isAudioMuted = !_isAudioMuted;
      for (final track in _localStream!.getAudioTracks()) {
        track.enabled = !_isAudioMuted;
      }
      socketService.sendMediaState(
        audioEnabled: !_isAudioMuted,
        videoEnabled: !_isVideoOff,
      );
      onStateChanged?.call();
    }
  }

  void toggleVideo() {
    if (_localStream != null) {
      _isVideoOff = !_isVideoOff;
      for (final track in _localStream!.getVideoTracks()) {
        track.enabled = !_isVideoOff;
      }
      socketService.sendMediaState(
        audioEnabled: !_isAudioMuted,
        videoEnabled: !_isVideoOff,
      );
      onStateChanged?.call();
    }
  }

  Future<void> switchCamera() async {
    if (_localStream != null) {
      final videoTrack = _localStream!.getVideoTracks().firstOrNull;
      if (videoTrack != null) {
        await Helper.switchCamera(videoTrack);
        _isFrontCamera = !_isFrontCamera;
        onStateChanged?.call();
      }
    }
  }

  void removePeer(String socketId) {
    if (_peerConnections.containsKey(socketId)) {
      _peerConnections[socketId]?.close();
      _peerConnections.remove(socketId);
    }
    if (remoteRenderers.containsKey(socketId)) {
      remoteRenderers[socketId]?.dispose();
      remoteRenderers.remove(socketId);
    }
    onStateChanged?.call();
  }

  void dispose() {
    _localStream?.getTracks().forEach((track) => track.stop());
    _localStream?.dispose();
    _localStream = null;

    localRenderer.dispose();
    for (final r in remoteRenderers.values) {
      r.dispose();
    }
    remoteRenderers.clear();

    for (final pc in _peerConnections.values) {
      pc.close();
    }
    _peerConnections.clear();
  }
}
