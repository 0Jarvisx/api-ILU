import { Server, Socket } from 'socket.io';

export const SocketIOHandler = {
  init(io: Server): void {
    io.on('connection', (socket: Socket) => {
      console.log(`[WS] Cliente conectado: ${socket.id}`);

      socket.on('ping', () => {
        socket.emit('pong', { timestamp: new Date().toISOString() });
      });

      socket.on('disconnect', () => {
        console.log(`[WS] Cliente desconectado: ${socket.id}`);
      });
    });
  },
};
