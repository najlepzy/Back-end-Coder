import mongoose from 'mongoose';

const tokenSchema = new mongoose.Schema({
    token: String
});

const BlacklistedToken = mongoose.model('BlacklistedToken', tokenSchema, 'BlacklistedToken');

export default BlacklistedToken;