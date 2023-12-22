import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import UserManager from '../controllers/dao/userManager.js';
import bcrypt from 'bcrypt';

const userManager = new UserManager();

passport.use('signUp', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    async (req, email, password, done) => {
        try {
            const user = await userManager.createUser(req.body.username, email, password, req.body.role);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.use('login', new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const user = await userManager.login(email, password);
            if (!user) {
                return done(null, false, { message: 'Invalid credentials' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

export default passport;