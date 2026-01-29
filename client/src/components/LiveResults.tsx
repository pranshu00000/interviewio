import React from 'react';

interface PollOption {
    text: string;
    votes: number;
}

interface Poll {
    question: string;
    options: PollOption[];
}

interface LiveResultProps {
    poll: Poll | null;
}

const LiveResults: React.FC<LiveResultProps> = ({ poll }) => {
    if (!poll) return <div className="text-gray-500">No active poll. Start one!</div>;

    const totalVotes = poll.options.reduce((acc, opt) => acc + opt.votes, 0);

    return (
        <div className="bg-white p-6 rounded shadow mt-6">
            <h2 className="text-xl font-bold mb-4">{poll.question}</h2>
            <div className="space-y-4">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes ? Math.round((option.votes / totalVotes) * 100) : 0;
                    return (
                        <div key={index}>
                            <div className="flex justify-between text-sm mb-1">
                                <span>{option.text}</span>
                                <span>{percentage}% ({option.votes})</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <p className="mt-4 text-sm text-gray-500">Total Votes: {totalVotes}</p>
        </div>
    );
};

export default LiveResults;
