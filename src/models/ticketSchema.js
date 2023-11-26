import mongoose, { Schema } from 'mongoose';

const MessageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TicketSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    message: [MessageSchema]
}, { versionKey: false });

const Ticket = mongoose.model('Tickets', TicketSchema, "Tickets");

export default Ticket;