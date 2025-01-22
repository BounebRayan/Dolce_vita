import { Server } from 'socket.io';

let io;

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this as per your setup
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A manager connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Manager disconnected:', socket.id);
    });
  });

  return io;
}

export { io };
