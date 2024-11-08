import React, { useState, useEffect } from 'react';
import { getTeacherLeaderboard } from '../../services/leaderboardService';
import { ShieldAlert } from 'lucide-react';

const TeacherLeaderboard = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('all');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const data = await getTeacherLeaderboard(period);
                setTeachers(data);
                setError(null);
            } catch (error) {
                setError('unauthorized');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [period]);

    if (loading) {
        return <div className="text-center p-4">Loading...</div>;
    }

    if (error === 'unauthorized') {
        return (
            <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-center mb-4">
                        <ShieldAlert className="w-12 h-12 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-4">
                        Account Verification Required
                    </h3>
                    <div className="text-center text-gray-600 space-y-3">
                        <p>
                            Your account is currently under verification. This content is only accessible to verified administrators.
                        </p>
                        <p className="text-sm">
                            Please contact our support team for more information about the verification process.
                        </p>
                    </div>
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => window.open('mailto:phathtse172750@fpt.edu.vn', '_blank')}
                            className="px-4 py-2 border border-yellow-500 text-yellow-600 rounded-md hover:bg-yellow-50 transition-colors duration-200"
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Top Rechargers</h2>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="all">All Time</option>
                    <option value="month">This Month</option>
                    <option value="week">This Week</option>
                </select>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left">Rank</th>
                            <th className="p-4 text-left">Teacher</th>
                            <th className="p-4 text-right">Total Coins</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map((teacher) => (
                            <tr key={teacher.id} className="border-t hover:bg-gray-50">
                                <td className="p-4">
                                    <span className={`
                                        inline-flex items-center justify-center w-8 h-8 rounded-full
                                        ${teacher.rank === 1 ? 'bg-yellow-100 text-yellow-700' : ''}
                                        ${teacher.rank === 2 ? 'bg-blue-100 text-gray-700' : ''}
                                        ${teacher.rank === 3 ? 'bg-amber-300 text-amber-700' : ''}
                                    `}>
                                        {teacher.rank}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {teacher.avatar && (
                                            <img
                                                src={teacher.avatar}
                                                alt={teacher.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        )}
                                        <span className="font-medium">{teacher.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-right font-medium">
                                    {teacher.totalCoins.toLocaleString()} coins
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherLeaderboard;