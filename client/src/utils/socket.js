import { io } from 'socket.io-client';

let socket = null;
let activeSubscribers = 0;

/**
 * getSocket()
 * Creates and returns the shared socket instance connecting to backend server.
 * Uses VITE_API_URL origin if provided, otherwise falls back to window.location.
 */
export function getSocket() {
  if (!socket) {
    const apiUrl = import.meta.env.VITE_API_URL;
    let socketUrl = undefined;
    if (apiUrl && !apiUrl.startsWith('/')) {
      try {
        socketUrl = new URL(apiUrl).origin;
      } catch {
        socketUrl = undefined;
      }
    }

    socket = io(socketUrl, {
      autoConnect: false,
      reconnection: true,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

/**
 * connectSocket()
 * Increments active subscribers and connects socket if disconnected.
 */
export function connectSocket() {
  activeSubscribers++;
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

/**
 * disconnectSocket()
 * Decrements active subscribers and disconnects socket when nobody uses it.
 */
export function disconnectSocket() {
  activeSubscribers = Math.max(0, activeSubscribers - 1);
  if (activeSubscribers === 0 && socket) {
    socket.disconnect();
    socket = null;
  }
}
