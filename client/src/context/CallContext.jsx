import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { socket } from '../lib/socket.js';
import { createPeerConnection, DEFAULT_MEDIA_CONSTRAINTS } from '../lib/webrtc.js';

const CallContext = createContext(null);

export function CallProvider({ children }) {
  const [localStream, setLocalStream] = useState(null);
  // socketId → { stream, displayName, audioEnabled, videoEnabled }
  const [remoteParticipants, setRemoteParticipants] = useState({});
  const [room, setRoom] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [callStatus, setCallStatus] = useState('idle'); // idle|connecting|connected
  const [callError, setCallError] = useState(null);

  // ── Refs (survive closures without triggering re-render) ─────────────────────
  const localStreamRef = useRef(null);      // always current stream
  const peerConnections = useRef(new Map()); // socketId → RTCPeerConnection
  const iceCandidateQueues = useRef(new Map()); // socketId → RTCIceCandidate[]
  const screenTrackRef = useRef(null);

  // Keep ref in sync with state
  useEffect(() => { localStreamRef.current = localStream; }, [localStream]);

  // ── Local Media ───────────────────────────────────────────────────────────────
  async function startLocalStream(constraints = DEFAULT_MEDIA_CONSTRAINTS) {
    // ⧑ Idempotency guard — if a live stream is already open, reuse it.
    const existing = localStreamRef.current;
    if (existing && existing.getTracks().some((t) => t.readyState === 'live')) {
      return existing;
    }

    // 🔒 Browser Security Guard — mediaDevices is undefined on non-HTTPS origins
    if (!navigator?.mediaDevices?.getUserMedia) {
      const msg = window.isSecureContext === false
        ? 'Camera access requires HTTPS. Please open the link starting with https://'
        : 'WebRTC getUserMedia is not supported in this browser.';
      setCallError(msg);
      throw new Error(msg);
    }

    try {
      let stream;
      try {
        // Stage 1: Try requested / ideal constraints
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (firstErr) {
        console.warn('[media] ideal constraints failed, trying basic video+audio:', firstErr.name);
        try {
          // Stage 2: Try basic unconstrained video + audio
          stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        } catch (secondErr) {
          console.warn('[media] video+audio failed, trying audio-only fallback:', secondErr.name);
          // Stage 3: Audio only fallback if camera is blocked/busy
          stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setIsVideoOff(true);
        }
      }

      localStreamRef.current = stream;
      setLocalStream(stream);
      setCallError(null);
      return stream;
    } catch (err) {
      const friendly =
        err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError'
          ? 'Camera/Mic permission blocked. Click the 🔒 padlock or tune icon in your browser address bar and set Camera & Microphone to "Allow".'
          : err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError'
          ? 'No camera or microphone found. Please connect a device or check system settings.'
          : err.name === 'NotReadableError' || err.name === 'TrackStartError' || err.message?.includes('Could not start')
          ? 'Camera is in use by another app or tab (e.g. Zoom, Teams, Chrome). Please close it and reload.'
          : `Could not access media: ${err.message}`;
      setCallError(friendly);
      const richErr = new Error(friendly);
      richErr.original = err;
      throw richErr;
    }
  }

  function stopLocalStream() {
    const s = localStreamRef.current;
    if (s) s.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    setLocalStream(null);
  }

  // ── Mute / Video Toggle ───────────────────────────────────────────────────────
  function toggleAudio() {
    const s = localStreamRef.current;
    if (!s) return;
    const newMuted = !isAudioMuted;
    s.getAudioTracks().forEach((t) => (t.enabled = !newMuted));
    setIsAudioMuted(newMuted);
    socket.emit('media:state-change', {
      audioEnabled: !newMuted,
      videoEnabled: !isVideoOff,
    });
  }

  function toggleVideo() {
    const s = localStreamRef.current;
    if (!s) return;
    const newOff = !isVideoOff;
    s.getVideoTracks().forEach((t) => (t.enabled = !newOff));
    setIsVideoOff(newOff);
    socket.emit('media:state-change', {
      audioEnabled: !isAudioMuted,
      videoEnabled: !newOff,
    });
  }

  // ── Screen Share ──────────────────────────────────────────────────────────────
  async function toggleScreenShare() {
    const s = localStreamRef.current;
    if (!s) return;

    if (isSharingScreen) {
      // Stop screen share — restore camera track
      if (screenTrackRef.current) {
        screenTrackRef.current.stop();
        screenTrackRef.current = null;
      }
      try {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        const camTrack = cam.getVideoTracks()[0];
        replaceVideoTrack(camTrack);
        s.getVideoTracks().forEach((t) => t.stop());
        s.removeTrack(s.getVideoTracks()[0]);
        s.addTrack(camTrack);
      } catch { /* ignore */ }
      setIsSharingScreen(false);
    } else {
      try {
        const screen = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screen.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;
        replaceVideoTrack(screenTrack);
        // Auto-stop when user ends share via browser chrome
        screenTrack.onended = () => {
          setIsSharingScreen(false);
          screenTrackRef.current = null;
        };
        setIsSharingScreen(true);
      } catch (err) {
        console.warn('[screen] share cancelled or denied:', err.message);
      }
    }
  }

  function replaceVideoTrack(newTrack) {
    peerConnections.current.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender) sender.replaceTrack(newTrack);
    });
  }

  // ── Peer Connection Helpers ───────────────────────────────────────────────────
  function createPeer(remoteSocketId, stream) {
    // Avoid duplicate connections
    if (peerConnections.current.has(remoteSocketId)) {
      peerConnections.current.get(remoteSocketId).close();
    }

    const pc = createPeerConnection();
    peerConnections.current.set(remoteSocketId, pc);
    iceCandidateQueues.current.set(remoteSocketId, []);

    // Add local tracks to the connection
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Forward our ICE candidates to the remote peer via the server
    pc.onicecandidate = ({ candidate }) => {
      if (candidate) {
        socket.emit('signal:ice-candidate', {
          targetSocketId: remoteSocketId,
          candidate,
        });
      }
    };

    pc.onicegatheringstatechange = () => {
      console.log(`[ice] ${remoteSocketId} gathering: ${pc.iceGatheringState}`);
    };

    // Receive the remote media stream
    pc.ontrack = ({ streams }) => {
      if (streams && streams[0]) {
        setRemoteParticipants((prev) => ({
          ...prev,
          [remoteSocketId]: {
            ...(prev[remoteSocketId] || {}),
            stream: streams[0],
            audioEnabled: true,
            videoEnabled: true,
          },
        }));
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log(`[webrtc] ${remoteSocketId} → ${state}`);
      if (state === 'connected') setCallStatus('connected');
      if (state === 'failed') {
        // Attempt ICE restart
        console.warn(`[webrtc] connection failed with ${remoteSocketId}, attempting restart`);
        pc.restartIce();
      }
      if (state === 'closed') cleanupPeer(remoteSocketId);
    };

    return pc;
  }

  // Drain any queued ICE candidates once remote description is set
  async function drainIceCandidates(remoteSocketId) {
    const queue = iceCandidateQueues.current.get(remoteSocketId) || [];
    const pc = peerConnections.current.get(remoteSocketId);
    if (!pc) return;
    for (const candidate of queue) {
      try { await pc.addIceCandidate(candidate); } catch (e) { console.warn('[ice] add failed:', e); }
    }
    iceCandidateQueues.current.set(remoteSocketId, []);
  }

  function cleanupPeer(socketId) {
    const pc = peerConnections.current.get(socketId);
    if (pc) { pc.close(); peerConnections.current.delete(socketId); }
    iceCandidateQueues.current.delete(socketId);
    setRemoteParticipants((prev) => {
      const n = { ...prev };
      delete n[socketId];
      return n;
    });
  }

  // ── Room Actions ──────────────────────────────────────────────────────────────
  async function createRoom(displayName = 'Host') {
    setCallError(null);
    const stream = localStreamRef.current || (await startLocalStream());
    const fallbackRoomId = Math.random().toString(36).substring(2, 10).toUpperCase();

    if (!socket.connected) {
      socket.connect();
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('[socket] room:create timed out, opening room locally');
        setRoom({ roomId: fallbackRoomId, displayName, participants: [] });
        setCallStatus('connected');
        resolve(fallbackRoomId);
      }, 3500);

      socket.emit('room:create', { displayName }, (response) => {
        clearTimeout(timeout);
        if (response?.error) {
          console.warn('[socket] room:create error, falling back locally:', response.error);
          setRoom({ roomId: fallbackRoomId, displayName, participants: [] });
          setCallStatus('connected');
          resolve(fallbackRoomId);
          return;
        }
        const assignedRoomId = response?.roomId || fallbackRoomId;
        setRoom({ roomId: assignedRoomId, displayName, participants: [] });
        setCallStatus('connecting');
        resolve(assignedRoomId);
      });
    });
  }

  async function joinRoom(roomId, displayName = 'Guest') {
    setCallError(null);
    const stream = localStreamRef.current || (await startLocalStream());

    if (!socket.connected) {
      socket.connect();
    }

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('[socket] room:join timed out, opening room locally');
        setRoom({ roomId, displayName, participants: [] });
        setCallStatus('connected');
        resolve({ roomId, participants: [] });
      }, 3500);

      socket.emit('room:join', { roomId, displayName }, async (res) => {
        clearTimeout(timeout);
        if (res?.error) {
          console.warn('[socket] room:join error, falling back locally:', res.error);
          setRoom({ roomId, displayName, participants: [] });
          setCallStatus('connected');
          resolve({ roomId, participants: [] });
          return;
        }

        setRoom({ roomId, displayName, participants: res.participants || [] });
        setCallStatus('connecting');

        // Seed display names for existing participants
        const initial = {};
        for (const p of res.participants || []) {
          initial[p.socketId] = {
            displayName: p.displayName || p.socketId.slice(0, 6),
            stream: null,
            audioEnabled: true,
            videoEnabled: true,
          };
        }
        setRemoteParticipants(initial);

        // As the joiner, we initiate offers to all existing participants
        for (const p of res.participants || []) {
          try {
            const pc = createPeer(p.socketId, stream);
            const offer = await pc.createOffer({
              offerToReceiveAudio: true,
              offerToReceiveVideo: true,
            });
            await pc.setLocalDescription(offer);
            socket.emit('signal:offer', { targetSocketId: p.socketId, sdp: offer });
          } catch (err) {
            console.warn('[webrtc] offer creation error:', err);
          }
        }

        resolve(res);
      });
    });
  }

  function leaveRoom() {
    socket.emit('room:leave');
    peerConnections.current.forEach((pc) => pc.close());
    peerConnections.current.clear();
    iceCandidateQueues.current.clear();
    setRemoteParticipants({});
    setRoom(null);
    setCallStatus('idle');
    setIsAudioMuted(false);
    setIsVideoOff(false);
    setIsSharingScreen(false);
    stopLocalStream();
    socket.disconnect();
  }

  // ── Socket Signal Listeners ───────────────────────────────────────────────────
  // Use useCallback + stable ref pattern so handlers always see current stream
  const handleOffer = useCallback(async ({ fromSocketId, sdp, displayName }) => {
    const stream = localStreamRef.current;
    if (!stream) { console.warn('[signal] offer received but no local stream'); return; }

    const pc = createPeer(fromSocketId, stream);

    // Register incoming participant display name
    setRemoteParticipants((prev) => ({
      ...prev,
      [fromSocketId]: {
        ...(prev[fromSocketId] || {}),
        displayName: displayName || fromSocketId.slice(0, 6),
        stream: null,
        audioEnabled: true,
        videoEnabled: true,
      },
    }));

    await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    await drainIceCandidates(fromSocketId);

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('signal:answer', { targetSocketId: fromSocketId, sdp: answer });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = useCallback(async ({ fromSocketId, sdp }) => {
    const pc = peerConnections.current.get(fromSocketId);
    if (!pc) return;
    if (pc.signalingState === 'have-local-offer') {
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      await drainIceCandidates(fromSocketId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleIceCandidate = useCallback(async ({ fromSocketId, candidate }) => {
    const pc = peerConnections.current.get(fromSocketId);
    if (!pc) return;
    const iceCandidate = new RTCIceCandidate(candidate);
    // Queue if remote description isn't set yet
    if (!pc.remoteDescription) {
      const q = iceCandidateQueues.current.get(fromSocketId) || [];
      q.push(iceCandidate);
      iceCandidateQueues.current.set(fromSocketId, q);
    } else {
      try { await pc.addIceCandidate(iceCandidate); } catch (e) { console.warn('[ice]', e); }
    }
  }, []);

  useEffect(() => {
    socket.on('room:participant-joined', ({ socketId, displayName }) => {
      console.log('[room] peer joined:', socketId, displayName);
      // The new peer will send us an offer — just register their name
      setRemoteParticipants((prev) => ({
        ...prev,
        [socketId]: { displayName: displayName || socketId.slice(0, 6), stream: null, audioEnabled: true, videoEnabled: true },
      }));
    });

    socket.on('room:participant-left', ({ socketId }) => {
      cleanupPeer(socketId);
    });

    socket.on('signal:offer', handleOffer);
    socket.on('signal:answer', handleAnswer);
    socket.on('signal:ice-candidate', handleIceCandidate);

    socket.on('media:state-change', ({ fromSocketId, audioEnabled, videoEnabled }) => {
      setRemoteParticipants((prev) => ({
        ...prev,
        [fromSocketId]: { ...(prev[fromSocketId] || {}), audioEnabled, videoEnabled },
      }));
    });

    return () => {
      socket.off('room:participant-joined');
      socket.off('room:participant-left');
      socket.off('signal:offer', handleOffer);
      socket.off('signal:answer', handleAnswer);
      socket.off('signal:ice-candidate', handleIceCandidate);
      socket.off('media:state-change');
    };
  }, [handleOffer, handleAnswer, handleIceCandidate]);

  const value = {
    localStream,
    remoteParticipants,
    room,
    callStatus,
    callError,
    isAudioMuted,
    isVideoOff,
    isSharingScreen,
    startLocalStream,
    stopLocalStream,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    createRoom,
    joinRoom,
    leaveRoom,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export const useCall = () => {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within <CallProvider>');
  return ctx;
};
