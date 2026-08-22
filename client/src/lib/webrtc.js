/**
 * WebRTC configuration with public STUN servers.
 * ICE candidate gathering for NAT traversal.
 */
export const RTC_CONFIG = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

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
    sampleRate: 44100,
  },
};

/**
 * Creates a new RTCPeerConnection pre-configured with STUN servers.
 * @returns {RTCPeerConnection}
 */
export function createPeerConnection() {
  return new RTCPeerConnection(RTC_CONFIG);
}
