/**
 * WebRTC signaling handlers — relay SDP offers/answers and ICE candidates
 * between peers through Socket.IO without interpreting media.
 */

/**
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * @param {import('../services/roomManager.js').RoomManager} roomManager
 */
export function registerSignalingHandlers(io, socket, roomManager) {
  // ── Offer ────────────────────────────────────────────────────────────────────
  socket.on('signal:offer', ({ targetSocketId, sdp }) => {
    console.log(`[signal] offer: ${socket.id} → ${targetSocketId}`);
    io.to(targetSocketId).emit('signal:offer', {
      fromSocketId: socket.id,
      sdp,
    });
  });

  // ── Answer ───────────────────────────────────────────────────────────────────
  socket.on('signal:answer', ({ targetSocketId, sdp }) => {
    console.log(`[signal] answer: ${socket.id} → ${targetSocketId}`);
    io.to(targetSocketId).emit('signal:answer', {
      fromSocketId: socket.id,
      sdp,
    });
  });

  // ── ICE Candidate ────────────────────────────────────────────────────────────
  socket.on('signal:ice-candidate', ({ targetSocketId, candidate }) => {
    io.to(targetSocketId).emit('signal:ice-candidate', {
      fromSocketId: socket.id,
      candidate,
    });
  });

  // ── Media State (mute/video toggle) ──────────────────────────────────────────
  socket.on('media:state-change', ({ audioEnabled, videoEnabled }) => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room) return;
    socket.to(room.roomId).emit('media:state-change', {
      fromSocketId: socket.id,
      audioEnabled,
      videoEnabled,
    });
  });
}
