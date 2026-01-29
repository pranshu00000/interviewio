import React, { useState, useEffect } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useNavigate } from 'react-router-dom';

interface IUser {
    id: string;
    name: string;
    role: string;
}

const TeacherDashboard: React.FC = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [duration, setDuration] = useState(60);
    const [participants, setParticipants] = useState<IUser[]>([]);

    useEffect(() => {
        if (!socket) return;
        socket.emit('join_session', { name: 'Teacher', role: 'teacher' });

        socket.on('update_user_list', (users: IUser[]) => {
            // Filter out self if needed, or just show everyone. 
            // Usually teacher wants to see *students*.
            const students = users.filter(u => u.role === 'student');
            setParticipants(students);
        });

        return () => {
            socket.off('update_user_list');
        };
    }, [socket]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const createPoll = (e: React.FormEvent) => {
        e.preventDefault();
        if (socket && question && options.every(opt => opt.trim())) {
            socket.emit('create_poll', { question, options, duration });
            setQuestion('');
            setOptions(['', '', '', '']);
            alert('Poll Created!');
        }
    };

    const handleKick = (socketId: string) => {
        if (confirm("Are you sure you want to kick this student?")) {
            socket?.emit('kick_student', { socketId });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-[Inter]">
            {/* Main Content */}
            <div className="flex-1 p-6 md:p-12 flex flex-col items-center">
                <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm p-8 md:p-12 relative">
                    {/* View History Link - Top Right */}
                    <button
                        onClick={() => navigate('/history')}
                        className="absolute top-8 right-8 text-gray-400 hover:text-[#6F6AF8] transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        History
                    </button>

                    <div className="mb-2 flex ">
                        <span className="bg-[#6F6AF8] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                            Intervue Poll
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Let's <span className="text-gray-900">Get Started</span></h1>
                    <p className="text-gray-500 mb-10 text-sm">
                        you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
                    </p>

                    <form onSubmit={createPoll}>
                        {/* Wrapper for form fields to ensure consistent spacing */}
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-semibold text-gray-900">Enter your question</label>
                                    <div className="relative">
                                        <select
                                            value={duration}
                                            onChange={(e) => setDuration(Number(e.target.value))}
                                            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 text-sm cursor-pointer"
                                        >
                                            <option value={30}>30 seconds</option>
                                            <option value={60}>60 seconds</option>
                                            <option value={120}>2 minutes</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Type your question here..."
                                    className="w-full bg-gray-100 border-none rounded-lg p-4 text-gray-900 focus:ring-2 focus:ring-[#6F6AF8] transition resize-none h-32"
                                    required
                                />
                                <div className="text-right text-xs text-gray-400 mt-1">0/100</div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-semibold text-gray-900">Edit Options</label>
                                    <label className="block text-sm font-semibold text-gray-900 mr-4">Is it Correct?</label>
                                </div>

                                <div className="space-y-3">
                                    {options.map((opt, index) => (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className="w-6 flex justify-center">
                                                <span className="w-6 h-6 flex items-center justify-center bg-[#6F6AF8] text-white rounded-full text-xs font-bold">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                                placeholder={`Option ${index + 1}`}
                                                className="flex-1 bg-gray-100 border-none rounded-md p-3 text-gray-900 focus:ring-2 focus:ring-[#6F6AF8] transition"
                                                required
                                            />
                                            <div className="flex items-center gap-2">
                                                <input type="radio" name={`correct-${index}`} className="text-[#6F6AF8] focus:ring-[#6F6AF8]" />
                                                <label className="text-sm text-gray-600">Yes</label>
                                                <input type="radio" name={`correct-${index}`} className="text-[#6F6AF8] focus:ring-[#6F6AF8]" />
                                                <label className="text-sm text-gray-600">No</label>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setOptions([...options, ''])}
                                    className="mt-4 text-[#6F6AF8] border border-[#6F6AF8] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#6F6AF8] hover:text-white transition"
                                >
                                    + Add More option
                                </button>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="bg-[#6F6AF8] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#5B56D6] transition shadow-lg hover:shadow-xl"
                                >
                                    Ask Question
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Sidebar for Participants */}
            <div className="w-80 bg-white border-l border-gray-200 hidden xl:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Participants</h3>
                    <p className="text-sm text-gray-500">{participants.length} Active Students</p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {participants.length === 0 ? (
                        <div className="text-center text-gray-400 text-sm mt-10">No students joined yet.</div>
                    ) : (
                        participants.map((user) => (
                            <div key={user.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-[#6F6AF8] flex items-center justify-center text-xs font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                                </div>
                                <button
                                    onClick={() => handleKick(user.id)}
                                    className="text-xs text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-700 transition px-2 py-1 rounded border border-red-200 hover:bg-red-50"
                                >
                                    Kick
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default TeacherDashboard;
