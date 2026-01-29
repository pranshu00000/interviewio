import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { usePollTimer } from '../hooks/usePollTimer';

const StudentView: React.FC = () => {
    const socket = useSocket();
    const [name, setName] = useState(sessionStorage.getItem('studentName') || '');
    const [isJoined, setIsJoined] = useState(!!sessionStorage.getItem('studentName'));
    const [currentPoll, setCurrentPoll] = useState<any>(null);
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const { remainingTime, isExpired } = usePollTimer(
        currentPoll?.startTime,
        currentPoll?.duration || 0
    );

    useEffect(() => {
        if (currentPoll) {
            const votedPolls = JSON.parse(sessionStorage.getItem('votedPolls') || '[]');
            if (votedPolls.includes(currentPoll._id)) {
                setHasVoted(true);
            } else {
                setHasVoted(false);
                setSelectedOption(null);
            }
        }
    }, [currentPoll]);

    useEffect(() => {
        if (!socket) return;

        socket.emit('request_state');
        socket.on('poll_state', (poll) => setCurrentPoll(poll));
        socket.on('poll_created', (poll) => {
            setCurrentPoll(poll);
            setHasVoted(false);
        });
        socket.on('poll_updated', (poll) => {
            setCurrentPoll(poll);
        });

        return () => {
            socket.off('poll_state');
            socket.off('poll_created');
            socket.off('poll_updated');
        };
    }, [socket]);

    const handleJoin = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            sessionStorage.setItem('studentName', name);
            setIsJoined(true);
        }
    };

    const handleSubmitVote = () => {
        if (socket && currentPoll && selectedOption !== null) {
            socket.emit('submit_vote', { pollId: currentPoll._id, optionIndex: selectedOption });
            setHasVoted(true);

            const votedPolls = JSON.parse(sessionStorage.getItem('votedPolls') || '[]');
            votedPolls.push(currentPoll._id);
            sessionStorage.setItem('votedPolls', JSON.stringify(votedPolls));
        }
    };

    if (!isJoined) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 font-[Inter]">
                <div className="text-center mb-8">
                    <span className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                        Intervue Poll
                    </span>
                    <h1 className="text-3xl font-bold text-gray-900 mt-4">Let's <span className="text-gray-900">Get Started</span></h1>
                    <p className="text-gray-500 mt-2 text-sm max-w-md mx-auto">
                        If you're a student, you'll be able to <b>submit your answers</b>, participate in live polls, and see how your responses compare with your classmates
                    </p>
                </div>

                <form onSubmit={handleJoin} className="w-full max-w-md">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Enter your Name</label>
                        <input
                            type="text"
                            placeholder="Rahul Bajaj"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-gray-100 border-none rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-[#6F6AF8] transition"
                            required
                        />
                    </div>
                    <div className="flex justify-center">
                        <button type="submit" className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-12 py-3 rounded-full font-semibold hover:bg-[#5B56D6] transition shadow-lg hover:shadow-xl">
                            Continue
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-[Inter] flex flex-col items-center">
            <div className="w-full max-w-4xl">
                {!currentPoll || !currentPoll.isActive ? (
                    <div className="text-center py-20">
                        <div className="mb-6 flex justify-center">
                            <span className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                                Intervue Poll
                            </span>
                        </div>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6F6AF8] mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-gray-900">Wait for the teacher to ask questions..</h2>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <h2 className="text-lg font-bold text-gray-900">Question 1</h2>
                            <div className={`flex items-center gap-1 text-sm font-semibold ${isExpired ? 'text-red-500' : 'text-red-500'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                                </svg>
                                <span>{isExpired ? '00:00' : `00:${remainingTime.toString().padStart(2, '0')}`}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-8">
                            <div className="bg-[#565656] text-white p-4 text-sm font-medium">
                                {currentPoll.question}
                            </div>
                            <div className="bg-white p-4 space-y-3">
                                {hasVoted || isExpired ? (
                                    currentPoll.options.map((option: any, idx: number) => {
                                        const totalVotes = currentPoll.options.reduce((sum: number, o: any) => sum + o.votes, 0);
                                        const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                                        return (
                                            <div key={idx} className="relative">
                                                <div className="flex items-center w-full h-10 bg-gray-100 rounded-md overflow-hidden relative">
                                                    <div
                                                        className="h-full bg-[#6F6AF8] opacity-80"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                    <div className="absolute inset-0 flex justify-between items-center px-4 text-sm font-medium text-gray-700">
                                                        <div className="flex items-center gap-3">
                                                            <span className="w-5 h-5 flex items-center justify-center bg-white rounded-full text-xs text-[#6F6AF8] shadow-sm">
                                                                {idx + 1}
                                                            </span>
                                                            <span className="text-gray-800">{option.text}</span>
                                                        </div>
                                                        <span className="text-gray-900 font-bold">{percentage}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    currentPoll.options.map((option: any, index: number) => (
                                        <div
                                            key={index}
                                            onClick={() => setSelectedOption(index)}
                                            className={`
                                                flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition
                                                ${selectedOption === index
                                                    ? 'border-[#6F6AF8] bg-[#6F6AF8]/5'
                                                    : 'border-gray-100 hover:border-gray-200 bg-gray-50'}
                                            `}
                                        >
                                            <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs font-bold transition
                                                 ${selectedOption === index ? 'bg-[#6F6AF8] text-white' : 'bg-gray-200 text-gray-500'}
                                             `}>
                                                {index + 1}
                                            </span>
                                            <span className="text-gray-800 text-sm font-medium">{option.text}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {!hasVoted && !isExpired && (
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSubmitVote}
                                    disabled={selectedOption === null}
                                    className={`px-8 py-2 rounded-full font-semibold transition shadow-lg
                                        ${selectedOption !== null
                                            ? 'bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white hover:bg-[#5B56D6] hover:shadow-xl'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                                    `}
                                >
                                    Submit
                                </button>
                            </div>
                        )}

                        {hasVoted && (
                            <div className="text-center mt-6">
                                <span className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-4 py-2 rounded-full text-sm font-semibold">
                                    Answer Submitted
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="fixed bottom-8 right-8">
                <div className="bg-[#6F6AF8] p-3 rounded-full text-white shadow-lg cursor-pointer hover:bg-[#5B56D6] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default StudentView;
