import mongoose, { Schema } from 'mongoose';

/**
 * Schema for a user.
 * @type {mongoose.Schema}
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'subAdmin', 'user'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

/**
 * User model.
 * @type {mongoose.Model}
 */
const User = mongoose.model('Users', UserSchema, "Users");
const Admin = mongoose.model('Admins', UserSchema, "Admins");
const SubAdmin = mongoose.model('SubAdmins', UserSchema, "SubAdmins");

export { User, Admin, SubAdmin };