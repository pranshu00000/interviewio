import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

const CreatePollForm: React.FC = () => {
    const socket = useSocket();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);
    const [duration, setDuration] = useState(60);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, '']);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (socket && question && options.every(o => o.trim())) {
            socket.emit('create_poll', { question, options, duration });
            // Reset form or separate state?
            // For now, maybe clear logic or just show "Active Poll" in parent
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Question</label>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration (seconds)</label>
                <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded p-2"
                    min="10"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Options</label>
                {options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded p-2 mb-2"
                        placeholder={`Option ${index + 1}`}
                        required
                    />
                ))}
                <button type="button" onClick={addOption} className="text-sm text-blue-600 hover:underline">
                    + Add Option
                </button>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700">
                Start Poll
            </button>
        </form>
    );
};

export default CreatePollForm;
