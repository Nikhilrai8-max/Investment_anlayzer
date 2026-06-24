import { EventEmitter } from 'events';

export const eventEmitter = new EventEmitter();

export function setupSocket(io) {
  io.on('connection', (socket) => {
    socket.emit('socket_connected', { message: 'AlphaLens socket connected.' });

    const statusUpdate = (payload) => socket.emit('agent_status', payload);
    eventEmitter.on('agent_status', statusUpdate);

    socket.on('disconnect', () => {
      eventEmitter.removeListener('agent_status', statusUpdate);
    });
  });
}
