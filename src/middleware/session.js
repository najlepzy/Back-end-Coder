import session from 'express-session';
import config from '../utils/dotenvConfig.js';
import dotenv from "dotenv";

dotenv.config();

export default function sessionMiddleware() {
    return session({
        secret: config.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    });
}