import Poll, { IPoll } from '../models/Poll';

// In-memory state for active poll to reduce DB hits for every vote if needed, 
// but for resilience we rely on DB or sync.
// We'll use DB as source of truth.

export const createPoll = async (question: string, options: string[], duration: number): Promise<IPoll> => {
    // Deactivate previous polls
    await Poll.updateMany({ isActive: true }, { isActive: false });

    const poll = new Poll({
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        duration,
        // Starts when teacher triggers it? Or immediately? Requirement says "Receive question instantly when teacher asks it". Let's assume creation = asking for simplicity, or separate 'start' event.
        // Let's assume creation starts it for now, or add a 'start' method.
        // If "Ask a new question" is the action, then it starts immediately.
        startTime: new Date(),
        isActive: true
    });

    return await poll.save();
};

export const getActivePoll = async (): Promise<IPoll | null> => {
    return await Poll.findOne({ isActive: true });
};

export const submitVote = async (pollId: string, optionIndex: number): Promise<IPoll | null> => {
    const poll = await Poll.findById(pollId);
    if (!poll || !poll.isActive) return null;

    // Check if time is up logic could be here, but also client side handles timer.
    // We should validate time on server.
    if (poll.startTime) {
        const now = new Date();
        const elapsed = (now.getTime() - poll.startTime.getTime()) / 1000;
        if (elapsed > poll.duration + 5) { // 5s buffer
            poll.isActive = false;
            await poll.save();
            return poll; // Return closed poll
        }
    }

    // Increment vote
    if (poll.options[optionIndex]) {
        poll.options[optionIndex].votes += 1;
        await poll.save();
    }
    return poll;
};

export const closePoll = async (pollId: string): Promise<IPoll | null> => {
    return await Poll.findByIdAndUpdate(pollId, { isActive: false }, { new: true });
}

export const getAllPolls = async () => {
    return await Poll.find().sort({ createdAt: -1 });
}
