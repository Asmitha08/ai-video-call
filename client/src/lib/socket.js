import { io } from 'socket.io-client';

/**
 * Derive the signaling server URL from the current page origin.
 *
 * In development: Vite proxies /socket.io → localhost:4000, so we connect
 * to the SAME origin as the page (e.g. http://192.168.56.1:5173).
 * This means share links like http://192.168.56.1:5173/join/XXXX
 * automatically point to the right server — no hardcoded IPs needed.
 *
 * In production: set VITE_SERVER_URL to your deployed server URL.
 */
const envUrl = import.meta.env.VITE_SERVER_URL;
const SOCKET_URL = (envUrl && envUrl.trim().length > 0) ? envUrl.trim() : window.location.origin;

console.log('[socket] connecting to:', SOCKET_URL);

// Singleton socket instance shared across the app
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  // Socket.IO path must match what Vite proxies (/socket.io is the default)
  path: '/socket.io',
});

socket.on('connect', () => console.log('[socket] connected:', socket.id));
socket.on('disconnect', (reason) => console.log('[socket] disconnected:', reason));
socket.on('connect_error', (err) => console.error('[socket] error:', err.message));
