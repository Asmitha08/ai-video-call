import { io } from 'socket.io-client';

/**
 * Robust signaling server URL determination.
 * Supports offline LAN, local WiFi hotspots, localhost, and cloud deployment.
 */
function getSocketUrl() {
  const envUrl = import.meta.env.VITE_SERVER_URL;
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim();
  }

  if (typeof window === 'undefined') {
    return 'http://localhost:4000';
  }

  const hostname = window.location.hostname.toLowerCase();

  // If explicitly hosted on cloud domains (e.g. Vercel), use cloud signaling server
  const isCloudHosted = hostname.includes('vercel.app') || hostname.includes('onrender.com');
  if (isCloudHosted) {
    return 'https://ai-video-call-1.onrender.com';
  }

  // Any local network, localhost, 127.0.0.1, or private LAN IP (192.168.*, 10.*, 172.*)
  // connects directly to the local machine origin (which Vite proxies to :4000)
  return window.location.origin;
}

const SOCKET_URL = getSocketUrl();
console.log('[socket] target signaling URL:', SOCKET_URL);

// Singleton socket instance shared across the app
export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 10000,
  // Socket.IO path matches what Vite proxies (/socket.io)
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});

socket.on('connect', () => console.log('[socket] connected successfully:', socket.id));
socket.on('disconnect', (reason) => console.log('[socket] disconnected:', reason));
socket.on('connect_error', (err) => console.warn('[socket] connection notice:', err.message));
