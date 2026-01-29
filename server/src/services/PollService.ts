import Poll, { IPoll } from '../models/Poll';

export const createPoll = async (question: string, options: string[], duration: number): Promise<IPoll> => {
    await Poll.updateMany({ isActive: true }, { isActive: false });

    const poll = new Poll({
        question,
        options: options.map(opt => ({ text: opt, votes: 0 })),
        duration,
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

    if (poll.startTime) {
        const now = new Date();
        const elapsed = (now.getTime() - poll.startTime.getTime()) / 1000;
        if (elapsed > poll.duration + 5) {
            poll.isActive = false;
            await poll.save();
            return poll;
        }
    }

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
