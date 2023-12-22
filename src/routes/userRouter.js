import express from 'express';
import UserManager from '../controllers/dao/userManager.js';
import checkBlacklistedToken from '../middleware/checkBlacklistedToken.js';
import { getIo } from '../config/socketIo.js';
import cookieParser from 'cookie-parser';
import passport from "../middleware/passport.js";




const userRouter = express.Router();
const userManager = new UserManager();


userRouter.post('/signUp', passport.authenticate('signUp', { session: false }), (req, res) => {
    res.status(201).json(req.user);
});


userRouter.post('/login', cookieParser(), passport.authenticate('login', { session: false }), (req, res) => {
    try {
        const { user, token } = req.user;
        res.cookie('token', token, { httpOnly: true });
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
        io.emit('userLoggedOut', { token });
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