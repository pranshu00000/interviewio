import { Server, Socket } from 'socket.io';
import * as PollService from '../services/PollService';

export const registerPollHandlers = (io: Server, socket: Socket) => {

    // Teacher: Create Poll
    socket.on('create_poll', async (data: { question: string, options: string[], duration: number }) => {
        const poll = await PollService.createPoll(data.question, data.options, data.duration);
        io.emit('poll_created', poll); // Broadcast to all students
        io.emit('poll_updated', poll); // Update teacher dashboard
    });

    // Student: Join (just to get current state)
    socket.on('request_state', async () => {
        const poll = await PollService.getActivePoll();
        if (poll) {
            socket.emit('poll_state', poll);
        }
    });

    // Student: Vote
    socket.on('submit_vote', async (data: { pollId: string, optionIndex: number }) => {
        const updatedPoll = await PollService.submitVote(data.pollId, data.optionIndex);
        if (updatedPoll) {
            io.emit('poll_updated', updatedPoll); // Real-time update
        }
    });

    // Teacher: Stop Poll (optional)
    socket.on('stop_poll', async (data: { pollId: string }) => {
        const poll = await PollService.closePoll(data.pollId);
        io.emit('poll_closed', poll);
    });
};
