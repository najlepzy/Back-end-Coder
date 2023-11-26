import express from 'express';
import TicketManager from '../controllers/dao/ticketManager.js';

const ticketRouter = express.Router();
const ticketManager = new TicketManager();

ticketRouter.post('/', async (req, res) => {
    try {
        const ticket = await ticketManager.createTicket(req.body.userId, req.body.message);
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

ticketRouter.get('/', async (req, res) => {
    try {
        const tickets = await ticketManager.getAllTickets();
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }

    ticketRouter.get('/:id', async (req, res) => {
        try {
            const ticket = await ticketManager.getTicketById(req.params.id);
            res.status(200).json(ticket);
        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    });
});

export default ticketRouter;