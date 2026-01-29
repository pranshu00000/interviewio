import { Server, Socket } from 'socket.io';
import * as PollService from '../services/PollService';

export const registerPollHandlers = (io: Server, socket: Socket) => {

    socket.on('create_poll', async (data: { question: string, options: string[], duration: number }) => {
        const poll = await PollService.createPoll(data.question, data.options, data.duration);
        io.emit('poll_created', poll); 
        io.emit('poll_updated', poll); 
    });

    socket.on('request_state', async () => {
        const poll = await PollService.getActivePoll();
        if (poll) {
            socket.emit('poll_state', poll);
        }
    });

    socket.on('submit_vote', async (data: { pollId: string, optionIndex: number }) => {
        const updatedPoll = await PollService.submitVote(data.pollId, data.optionIndex);
        if (updatedPoll) {
            io.emit('poll_updated', updatedPoll); 
        }
    });

    socket.on('stop_poll', async (data: { pollId: string }) => {
        const poll = await PollService.closePoll(data.pollId);
        io.emit('poll_closed', poll);
    });
};
