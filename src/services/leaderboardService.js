// leaderboardService.js
import { getUsers } from './userService';
import { getTransactionHistory } from './walletService';

export const getTeacherLeaderboard = async (period = 'all') => {
    try {
        // 1. Lấy danh sách tất cả users
        const users = await getUsers();

        // 2. Lấy transaction history cho từng user và tính tổng
        const leaderboardPromises = users.map(async (user) => {
            const transactions = await getTransactionHistory(user.id);

            // Lọc transactions theo period và status Success
            const filteredTransactions = transactions.filter(trans => {
                const transDate = new Date(trans.createdAt);
                const now = new Date();

                if (period === 'week') {
                    const weekAgo = new Date(now.setDate(now.getDate() - 7));
                    return transDate >= weekAgo && trans.status === 'Success';
                } else if (period === 'month') {
                    const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
                    return transDate >= monthAgo && trans.status === 'Success';
                }
                return trans.status === 'Success';
            });

            // Tính tổng coins
            const totalCoins = filteredTransactions.reduce((sum, trans) => sum + trans.amount, 0);

            return {
                id: user.id,
                name: user.fullname,
                avatar: user.avatar,
                totalCoins: totalCoins
            };
        });

        // 3. Đợi tất cả promises hoàn thành
        let leaderboard = await Promise.all(leaderboardPromises);

        // 4. Sắp xếp theo totalCoins và thêm rank
        leaderboard = leaderboard
            .sort((a, b) => b.totalCoins - a.totalCoins)
            .map((teacher, index) => ({
                ...teacher,
                rank: index + 1
            }))
            .slice(0, 10); // Chỉ lấy top 10

        return leaderboard;
    } catch (error) {
        console.error('Error generating leaderboard:', error);
        throw error;
    }
};