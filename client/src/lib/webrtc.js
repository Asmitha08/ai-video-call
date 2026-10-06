/**
 * WebRTC configuration supporting offline LAN, local WiFi, and online modes.
 * When offline or on a local network, external Google STUN servers are omitted
 * to prevent DNS resolution timeouts and ICE gathering hangs.
 */

export function getRtcConfig() {
  const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;

  const isLan =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.') ||
      window.location.hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(window.location.hostname) ||
      window.location.hostname.endsWith('.local'));

  // If offline or purely on local LAN / hotspot, don't stall on unreachable public STUN servers
  if (isOffline) {
    return {
      iceServers: [],
      iceCandidatePoolSize: 0,
      iceTransportPolicy: 'all',
    };
  }

  // If on local LAN with potential internet, include STUN without blocking local host candidates
  if (isLan) {
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
      ],
      iceTransportPolicy: 'all',
    };
  }

  return {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
    ],
    iceTransportPolicy: 'all',
  };
}

export const RTC_CONFIG = getRtcConfig();

/**
 * Default media constraints for getUserMedia.
 */
export const DEFAULT_MEDIA_CONSTRAINTS = {
  video: {
    width: { ideal: 1280 },
    height: { ideal: 720 },
    frameRate: { ideal: 30 },
    facingMode: 'user',
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 44100,
  },
};

/**
 * Creates a new RTCPeerConnection configured for current offline/LAN/online environment.
 * @returns {RTCPeerConnection}
 */
export function createPeerConnection() {
  return new RTCPeerConnection(getRtcConfig());
}
