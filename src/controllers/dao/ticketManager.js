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
            ticket.message.push({ text: message, createdAt: Date.now() });
        } else {
            ticket = new Ticket({
                userId,
                message: [{ text: message, createdAt: Date.now() }]
            });
        }

        try {
            const savedTicket = await ticket.save();
            return formatTicketDates(savedTicket);
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

        ticket.message.push({ text: message, createdAt: Date.now() });

        ticket.markModified('message');

        try {
            const savedTicket = await ticket.save();
            return formatTicketDates(savedTicket);
        } catch (error) {
            throw new Error('Error saving ticket: ' + error.message);
        }
    }

    async getAllTickets() {
        try {
            const tickets = await Ticket.find().populate('userId', 'username');
            return tickets.map(ticket => formatTicketDates(ticket));
        } catch (error) {
            throw new Error('Error getting tickets: ' + error.message);
        }
    }
    async getTicketById(id) {
        try {
            const ticket = await Ticket.findById(id);
            if (ticket) {
                return formatTicketDates(ticket);
            }
        } catch (error) {
            throw new Error('Error getting ticket: ' + error.message);
        }
    }

}

export default TicketManager;