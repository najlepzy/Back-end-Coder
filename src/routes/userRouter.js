import express from 'express';
import UserManager from '../controllers/dao/userManager.js';
import checkBlacklistedToken from '../middleware/checkBlacklistedToken.js';
import { getIo } from '../config/socketIo.js';

const userRouter = express.Router();
const userManager = new UserManager();


userRouter.post('/signUp', async (req, res) => {
    try {
        const user = await userManager.createUser(req.body.username, req.body.email, req.body.password, req.body.role);
        const io = getIo();
        io.emit('userCreated', user); // Emit the 'userCreated' event
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


userRouter.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const { user, token } = await userManager.login(email, password, role);
        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});


userRouter.post('/logout', checkBlacklistedToken, async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.sendStatus(401);
    }

    try {
        await userManager.logout(token);
        const io = getIo();
        io.emit('userLoggedOut', { token }); // Emit the 'userLoggedOut' event
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ error: err.toString() });
            }
            res.status(200).json({ message: 'Logged out successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

userRouter.get('/:id/tickets', async (req, res) => {
    try {
        const tickets = await userManager.getUserTickets(req.params.id);
        res.status(200).json(tickets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});
userRouter.delete('/:id/:role?', async (req, res) => {
    try {
        const role = req.params.role || 'user';
        const user = await userManager.deleteUser(req.params.id, role);
        if (user) {
            res.status(200).json({ message: 'User deleted' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

export default userRouter;