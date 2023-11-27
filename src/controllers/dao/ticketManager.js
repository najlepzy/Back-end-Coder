import { formatTicketDates } from "../../utils/dateFormat.js";
import Ticket from "../../models/ticketSchema.js";
import { User, Admin, SubAdmin } from "../../models/userSchema.js";
import { getIo } from '../../config/socketIo.js';

class TicketManager {

    async createTicket(userId, message) {
        if (!userId || !message) {
            throw new Error('All fields (userId, message) are required');
        }

        const user = await User.findById(userId) || await Admin.findById(userId) || await SubAdmin.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.role !== 'user') {
            throw 'Only users can create tickets';
        }
        let ticket = await Ticket.findOne({ userId });

        if (ticket) {
            ticket.messages.push({ text: message, createdAt: Date.now(), role: user.role });
        } else {
            ticket = new Ticket({
                userId,
                messages: [{ text: message, createdAt: Date.now(), role: user.role }]
            });
        }


        try {
            const savedTicket = await ticket.save();
            const formattedTicket = formatTicketDates(savedTicket);

            return formattedTicket; // Return formattedTicket instead of savedTicket
        } catch (error) {
            throw new Error('Error saving ticket: ' + error.message);
        }
    }


    async addMessage(userId, message) {
        if (!userId || !message) {
            throw new Error('All fields (userId, message) are required');
        }

        let ticket = await Ticket.findOne({ userId });

        if (!ticket) {
            throw new Error('Ticket not found for user: ' + userId);
        }

        ticket.messages.push({ text: message, createdAt: Date.now(), role: 'user' });

        ticket.markModified('message');

        try {
            const savedTicket = await ticket.save();
            const io = getIo();
            io.emit('messageAdded', { ticketId: savedTicket._id, message });
            return formatTicketDates(savedTicket);
        } catch (error) {
            throw new Error('Error saving ticket: ' + error.message);
        }
    }

    async addAdminMessage(adminId, ticketId, message) {
        const adminUser = await Admin.findById(adminId) || await SubAdmin.findById(adminId);
        if (!adminUser) {
            throw new Error('Admin user not found');
        }

        let ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const newMessage = { text: message, createdAt: Date.now(), role: adminUser.role };
        ticket.messages.push(newMessage);

        ticket.markModified('messages');

        try {
            const savedTicket = await ticket.save();
            const formattedTicket = formatTicketDates(savedTicket);
            const io = getIo();
            io.emit('adminMessageAdded', { ticketId: savedTicket._id, message: newMessage });

            return formattedTicket;
        } catch (error) {
            throw new Error('Error saving ticket: ' + error.message);
        }
    }

    async getAllTickets(user) {
        try {
            const tickets = await Ticket.find().populate('userId', 'username');
            return tickets.map(ticket => formatTicketDates(ticket));
        } catch (error) {
            throw new Error('Error getting tickets: ' + error.message);
        }
    }

    async getUserTickets(userId) {
        try {
            const tickets = await Ticket.find({ userId });
            return tickets.map(ticket => {
                ticket = ticket.toObject();
                ticket.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                return ticket;
            });
        } catch (error) {
            throw new Error('Error getting user tickets: ' + error.message);
        }
    }
    async addAdminReply(adminId, ticketId, message) {
        const adminUser = await Admin.findById(adminId) || await SubAdmin.findById(adminId);
        if (!adminUser) {
            throw new Error('Admin user not found');
        }

        let ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        const reply = { text: message, createdAt: Date.now(), role: adminUser.role };
        ticket.messages.push(reply);

        ticket.markModified('messageReply');

        try {
            const savedTicket = await ticket.save();
            const formattedTicket = formatTicketDates(savedTicket);
            const io = getIo();
            io.emit('adminReplyAdded', { ticketId: savedTicket._id, message: formattedTicket.messageReply[formattedTicket.messageReply.length - 1] });

            io.emit('messageReplyUpdated', formattedTicket.messageReply[formattedTicket.messageReply.length - 1]);

            return formattedTicket;
        } catch (error) {
            throw new Error('Error saving ticket: ' + error.message);
        }
    }
}

export default TicketManager;