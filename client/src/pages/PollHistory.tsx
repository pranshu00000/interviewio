import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface IPollOption {
    text: string;
    votes: number;
}

interface IPoll {
    _id: string;
    question: string;
    options: IPollOption[];
    startTime: string; // Date string
    duration: number;
    isActive: boolean;
    createdAt: string;
}

const PollHistory: React.FC = () => {
    const [polls, setPolls] = useState<IPoll[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPolls = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/polls');
                if (!response.ok) {
                    throw new Error('Failed to fetch polls');
                }
                const data = await response.json();
                setPolls(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPolls();
    }, []);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-600">Error: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-white p-6 md:p-12 font-[Inter]">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-10 relative">
                    <h1 className="text-3xl font-bold text-gray-900">
                        View <span className="text-gray-900">Poll History</span>
                    </h1>
                    {/* Chat bubble icon bottom right fixed or context? Image shows it bottom right of screen. 
                         For now, keeping "Back" simple or maybe stick to mockup which has no explicit back button but probably browser back.
                         I'll keep a subtle back button for usability.
                     */}
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-8 relative">
                    {/* Scroll bar indicator from mockup? 
                        The mockup shows a custom scroll bar on the right. 
                        Browser default is fine for now.
                    */}

                    {polls.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No polls found.
                        </div>
                    ) : (
                        polls.map((poll, index) => (
                            <div key={poll._id} className="w-full">
                                <h2 className="text-lg font-bold text-gray-900 mb-2">Question {polls.length - index}</h2>

                                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-100">
                                    {/* Question Header - Dark Grey */}
                                    <div className="bg-[#565656] text-white p-4 text-sm font-medium">
                                        {poll.question}
                                    </div>

                                    {/* Options Body */}
                                    <div className="bg-white p-4 space-y-3">
                                        {poll.options.map((option, idx) => {
                                            const totalVotes = poll.options.reduce((sum, o) => sum + o.votes, 0);
                                            const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                                            return (
                                                <div key={idx} className="relative">
                                                    {/* Progress Bar Container */}
                                                    <div className="flex items-center w-full h-10 bg-gray-100 rounded-md overflow-hidden relative">
                                                        {/* Purple Filter Bar */}
                                                        <div
                                                            className="h-full bg-[#6F6AF8] opacity-80"
                                                            style={{ width: `${percentage}%` }}
                                                        ></div>

                                                        {/* Text and Percentage Overlay */}
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
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* Floating Chat Icon (Static for now) */}
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

export default PollHistory;
