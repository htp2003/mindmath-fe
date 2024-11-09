// WalletSection.jsx
import React, { useState, useEffect } from 'react';
import { getWalletBalance, getTransactionHistory } from '../../services/walletService';
import { getCurrentUser } from '../../services/authServices';

const WalletSection = () => {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                setLoading(true);
                const currentUser = getCurrentUser();
                if (!currentUser?.id) {
                    throw new Error('User not found');
                }

                const [balanceData, transactionsData] = await Promise.all([
                    getWalletBalance(currentUser.id),
                    getTransactionHistory(currentUser.id)
                ]);

                setBalance(balanceData.balance);
                setTransactions(transactionsData);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching wallet data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWalletData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title">Wallet Balance</h2>
                <p className="text-2xl font-bold mb-4">${balance}</p>
                <div className="overflow-x-auto">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index}>
                                    <td>{new Date(transaction.createdAt).toLocaleDateString('vi-VN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</td>
                                    <td>{transaction.description}</td>
                                    <td className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}>
                                        ${transaction.amount}
                                    </td>
                                    <td>
                                        <span className={`px-2 py-1 rounded-full text-xs ${transaction.status === 'Success'
                                                ? 'bg-green-100 text-green-800'
                                                : transaction.status === 'Failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default WalletSection;