import { Server } from 'socket.io';

let io;

export function startIo(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('IO connected');

        socket.on('event', (data) => {
            console.log(data);
        });

        socket.on('disconnect', () => {
            console.log('A client has disconnected');
        });
    });
}

export function getIo() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }
    return io;
}