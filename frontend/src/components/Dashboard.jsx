import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
            {/* Navigation */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg">
                            <span className="text-xl font-bold text-white">D</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white">DevClash</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-white">
                            <User size={20} />
                            <span className="font-medium">{user.username || user.email}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 font-medium px-4 py-2 rounded-lg border border-red-500/30 transition"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Welcome Card */}
                    <div className="md:col-span-3 bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Welcome back, {user.username}! 👋
                        </h2>
                        <p className="text-purple-200 text-lg">
                            Ready to practice some competitive coding challenges?
                        </p>
                    </div>

                    {/* Practice Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition cursor-pointer">
                        <div className="text-4xl mb-4">🎯</div>
                        <h3 className="text-xl font-bold text-white mb-2">Practice</h3>
                        <p className="text-purple-200 text-sm">
                            Solve coding challenges and improve your skills
                        </p>
                    </div>

                    {/* Compete Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition cursor-pointer">
                        <div className="text-4xl mb-4">⚔️</div>
                        <h3 className="text-xl font-bold text-white mb-2">Compete</h3>
                        <p className="text-purple-200 text-sm">
                            Challenge other developers in real-time competitions
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-purple-400 transition cursor-pointer">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-white mb-2">Statistics</h3>
                        <p className="text-purple-200 text-sm">
                            Track your progress and view detailed analytics
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
