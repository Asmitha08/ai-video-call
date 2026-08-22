/**
 * Room lifecycle event handlers — create, join, leave.
 *
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 * @param {import('../services/roomManager.js').RoomManager} roomManager
 */
export function registerRoomHandlers(io, socket, roomManager) {
  // ── Create Room ───────────────────────────────────────────────────────────────
  socket.on('room:create', ({ displayName } = {}, callback) => {
    const room = roomManager.createRoom(socket.id, { displayName });
    socket.join(room.roomId);
    console.log(`[room:create] ${socket.id} (${displayName}) → room ${room.roomId}`);
    if (typeof callback === 'function') callback({ roomId: room.roomId });
  });

  // ── Join Room ─────────────────────────────────────────────────────────────────
  socket.on('room:join', ({ roomId, displayName }, callback) => {
    const room = roomManager.joinRoom(roomId, socket.id, { displayName });
    if (!room) {
      if (typeof callback === 'function') callback({ error: 'Room not found' });
      return;
    }

    socket.join(roomId);

    // Notify existing participants about the new joiner (includes their displayName)
    socket.to(roomId).emit('room:participant-joined', {
      socketId: socket.id,
      displayName,
    });

    if (typeof callback === 'function') {
      // Return existing participants (excluding the joiner) so they can initiate offers
      callback({
        roomId,
        participants: [...room.participants.values()].filter(
          (p) => p.socketId !== socket.id
        ),
      });
    }
  });

  // ── Leave Room ────────────────────────────────────────────────────────────────
  socket.on('room:leave', () => {
    const room = roomManager.getRoomBySocket(socket.id);
    if (!room) return;
    socket.leave(room.roomId);
    roomManager.removeParticipant(socket.id);
    io.to(room.roomId).emit('room:participant-left', { socketId: socket.id });
    console.log(`[room:leave] ${socket.id} left ${room.roomId}`);
  });
}
