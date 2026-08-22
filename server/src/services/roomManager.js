import { v4 as uuidv4 } from 'uuid';

/**
 * Represents a single video call room.
 */
class Room {
  constructor(roomId, hostSocketId) {
    this.roomId = roomId;
    this.hostSocketId = hostSocketId;
    /** @type {Map<string, Participant>} socketId → participant info */
    this.participants = new Map();
    this.createdAt = Date.now();
  }

  addParticipant(socketId, meta = {}) {
    this.participants.set(socketId, { socketId, joinedAt: Date.now(), ...meta });
  }

  removeParticipant(socketId) {
    this.participants.delete(socketId);
  }

  get size() {
    return this.participants.size;
  }

  toPublic() {
    return {
      roomId: this.roomId,
      participantCount: this.size,
      participants: [...this.participants.values()],
      createdAt: this.createdAt,
    };
  }
}

/**
 * Singleton service that manages all active rooms.
 */
class RoomManager {
  constructor() {
    /** @type {Map<string, Room>} roomId → Room */
    this.rooms = new Map();
    /** @type {Map<string, string>} socketId → roomId */
    this.socketToRoom = new Map();
  }

  createRoom(hostSocketId, meta = {}) {
    const roomId = uuidv4().slice(0, 8).toUpperCase();
    const room = new Room(roomId, hostSocketId);
    room.addParticipant(hostSocketId, { role: 'host', ...meta });
    this.rooms.set(roomId, room);
    this.socketToRoom.set(hostSocketId, roomId);
    console.log(`[room] created: ${roomId} by ${hostSocketId}`);
    return room;
  }

  joinRoom(roomId, socketId, meta = {}) {
    const room = this.rooms.get(roomId);
    if (!room) return null;
    room.addParticipant(socketId, { role: 'guest', ...meta });
    this.socketToRoom.set(socketId, roomId);
    console.log(`[room] ${socketId} joined ${roomId}`);
    return room;
  }

  removeParticipant(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    if (!roomId) return;
    const room = this.rooms.get(roomId);
    if (room) {
      room.removeParticipant(socketId);
      if (room.size === 0) {
        this.rooms.delete(roomId);
        console.log(`[room] deleted empty room: ${roomId}`);
      }
    }
    this.socketToRoom.delete(socketId);
  }

  getRoom(roomId) {
    return this.rooms.get(roomId) || null;
  }

  getRoomBySocket(socketId) {
    const roomId = this.socketToRoom.get(socketId);
    return roomId ? this.rooms.get(roomId) : null;
  }
}

export const roomManager = new RoomManager();
