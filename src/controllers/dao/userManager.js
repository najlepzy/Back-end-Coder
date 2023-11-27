import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, SubAdmin, Admin } from "../../models/userSchema.js";
import Ticket from '../../models/ticketSchema.js';
import { getIo } from '../../config/socketIo.js';
import BlacklistedToken from "../../models/tokenSchema.js";

const roleToModel = {
    'admin': Admin,
    'subAdmin': SubAdmin,
    'user': User
};

class UserManager {
    async createUser(username, email, password, role = 'user') {
        const validations = [
            { check: !username || !email || !password, message: 'All fields (username, email, password) are required' },
            { check: password.length < 8, message: 'Password must be at least 8 characters' },
            { check: await roleToModel[role].findOne({ email }), message: 'Email already in use' },
            { check: await roleToModel[role].findOne({ username }), message: 'Username already in use' },
        ];

        for (let validation of validations) {
            if (validation.check) {
                throw validation.message;
            }
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new roleToModel[role]({ username, email, password: hashedPassword, role });
            const savedUser = await user.save();
            const io = getIo();
            io.emit('userCreated', savedUser);
            return savedUser;
        } catch (error) {
            throw new Error('Saving user: ' + error.message);
        }
    }

    async login(email, password) {
        const user = await User.findOne({ email }) || await Admin.findOne({ email }) || await SubAdmin.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign({ id: user._id, role: user.role }, 'token', { expiresIn: '1h' });
        return { user, token };
    }

    async getAllUsers() {
        try {
            return await User.find();
        } catch (error) {
            throw new Error('Getting users: ' + error.message);
        }
    }

    async getUserById(userId) {
        try {
            return await User.findById(userId);
        } catch (error) {
            throw new Error('Getting user: ' + error.message);
        }
    }
    async getUserTickets(userId) {
        try {
            const tickets = await Ticket.find({ userId }).populate('userId', 'username');
            return tickets;
        } catch (error) {
            throw new Error('Getting user tickets: ' + error.message);
        }
    }

    async logout(token) {
        try {
            const blacklistedToken = new BlacklistedToken({ token });
            await blacklistedToken.save();
            const io = getIo();
            io.emit('userLoggedOut', { token });
        } catch (error) {
            throw new Error('Logging out: ' + error.message);
        }
    }

    async isTokenBlacklisted(token) {
        const blacklistedToken = await BlacklistedToken.findOne({ token });
        return blacklistedToken != null;
    }

    async deleteUser(userId, role = 'user') {
        try {
            const user = await roleToModel[role].findByIdAndDelete(userId);
            if (!user) {
                throw new Error('Deleting user: User not found');
            }
            const io = getIo();
            io.emit('userDeleted', user);
            return user;
        } catch (error) {
            throw error.message;
        }
    }

}

export default UserManager;