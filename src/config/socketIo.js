import { Server } from 'socket.io';
import TicketManager from '../controllers/dao/ticketManager.js';

let io;
const ticketManager = new TicketManager();

export function startIo(server) {
    io = new Server(server);

    io.on('connection', (socket) => {
        console.log('IO connected');

        socket.on('createTicket', async (data) => {
            try {
                const ticket = await ticketManager.createTicket(data.userId, data.message);
                io.emit('ticketCreated', ticket);
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('getUserTickets', async (data) => {
            try {
                const tickets = await ticketManager.getUserTickets(data.userId);
                socket.emit('userTickets', tickets);
            } catch (error) {
                console.error(error);
            }
        });
        socket.on('getMessages', async (ticketId) => {
            try {
                const ticket = await ticketManager.getTicket(ticketId);
                const lastChecked = ticket.lastChecked;
                const newMessages = ticket.messages.filter(message => message.timestamp > lastChecked);
                if (newMessages.length > 0) {
                    socket.emit('updateChat', ticket);
                    ticket.lastChecked = Date.now();
                    await ticketManager.updateTicket(ticket);
                }
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('register', async (data) => {
            try {
                const ticket = await ticketManager.getTicketById(data.ticketId);
                const lastChecked = ticket.lastChecked;
                const newMessages = ticket.messages.filter(message => message.timestamp > lastChecked);
                if (newMessages.length > 0) {
                    socket.emit('updateChat', ticket);
                    ticket.lastChecked = Date.now();
                    await ticketManager.updateTicket(ticket);
                }
            } catch (error) {
                console.error(error);
            }
        });

        socket.on('event', (data) => {
            console.log(data);
        });

        socket.on('disconnect', () => {
            console.log('A client has disconnected');
        });
    });
};

export function getIo() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized');
    }
    return io;
}

