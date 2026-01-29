import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

    const handleContinue = () => {
        if (selectedRole === 'student') {
            navigate('/student');
        } else if (selectedRole === 'teacher') {
            navigate('/teacher');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-4xl text-center">
                <div className="mb-8 flex justify-center">
                    <span className="bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
                        Intervue Poll
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Welcome to the <span className="text-gray-900">Live Polling System</span>
                </h1>
                <p className="text-gray-500 mb-12 max-w-2xl mx-auto">
                    Please select the role that best describes you to begin using the live polling system
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-10">
                    {/* Student Card */}
                    <div
                        onClick={() => setSelectedRole('student')}
                        className={`cursor-pointer bg-white p-8 rounded-2xl border-2 transition-all duration-200 text-left ${selectedRole === 'student'
                            ? 'border-[#6F6AF8] shadow-lg ring-1 ring-[#6F6AF8]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Student</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        </p>
                    </div>

                    {/* Teacher Card */}
                    <div
                        onClick={() => setSelectedRole('teacher')}
                        className={`cursor-pointer bg-white p-8 rounded-2xl border-2 transition-all duration-200 text-left ${selectedRole === 'teacher'
                            ? 'border-[#6F6AF8] shadow-lg ring-1 ring-[#6F6AF8]'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2">I'm a Teacher</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Submit answers and view live poll results in real-time.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={handleContinue}
                        disabled={!selectedRole}
                        className={`px-12 py-3 rounded-full text-white font-medium transition-all duration-200 ${selectedRole
                            ? 'bg-gradient-to-r from-[#8F64E1] to-[#1D68BD] hover:bg-[#5B56D6] shadow-lg hover:shadow-xl'
                            : 'bg-[#6F6AF8]/50 cursor-not-allowed'
                            }`}
                    >
                        Continue
                    </button>

                    <button
                        onClick={() => navigate('/history')}
                        className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                    >
                        View Poll History
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
