import express from 'express';
import ProductManager from '../controllers/dao/productManager.js';
import TicketManager from '../controllers/dao/ticketManager.js';
import UserManager from '../controllers/dao/userManager.js';

const handlebarsRouter = express.Router();
const productManager = new ProductManager();
const userManager = new UserManager();
const ticketManager = new TicketManager();

/* products */
handlebarsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('home', { products });
});

handlebarsRouter.get('/realtime-products', async (req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
});
/* products */

/* accs */

handlebarsRouter.get('/login', async (req, res) => {
    res.render('login');
});
handlebarsRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userManager.login(email, password);
        req.session.user = user;

        res.cookie('token', token, { httpOnly: true });
        const redirectPath = user.role === 'user' ? '/chat' : (user.role === 'admin' || user.role === 'subAdmin') ? '/support-chat' : '/login';
        res.redirect(redirectPath);
    } catch (error) {
        res.status(500).render('login', { error: error.toString() });
    }
});

handlebarsRouter.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: err.toString() });
        }
        res.clearCookie('token');
        res.status(200).end();
    });
});

/* accs */
/* realtimeChat */
handlebarsRouter.get('/support-chat', async (req, res) => {
    const tickets = await ticketManager.getAllTickets();
    const user = req.session.user;
    if (user) {
        res.render('adminViewChat', { tickets, username: user.username });
    } else {
        res.redirect('/login');
    }
});
handlebarsRouter.get('/chat', async (req, res) => {
    const user = req.session.user;
    if (user) {
        try {
            const tickets = await userManager.getUserTickets(user._id);
            // Obtener todos los mensajes en una sola matriz
            const messages = tickets.flatMap(ticket => ticket.message);

            res.render('chat', { tickets, messages, username: user.username, userId: user._id });
        } catch (error) {
            res.status(500).send('Error fetching user tickets');
        }
    } else {
        res.redirect('/login');
    }
});
/* realtimeChat */

export default handlebarsRouter;