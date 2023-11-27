import { format } from 'date-fns';

export function formatTicketDates(ticket) {
    let ticketObj = ticket.toObject();
    ticketObj.messages = ticketObj.messages.map(msg => ({
        ...msg,
        createdAt: format(msg.createdAt, 'HH:mm')
    }));



    return ticketObj;
}