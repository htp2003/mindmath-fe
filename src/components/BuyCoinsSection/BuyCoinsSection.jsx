import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../../services/authServices';
import { createTransaction, handlePaymentReturn } from '../../services/transactionService';

const COIN_PACKAGES = [
    { coins: 100000, price: 100000, popular: false },
    { coins: 200000, price: 190000, popular: true },
    { coins: 500000, price: 450000, popular: false },
    { coins: 1000000, price: 850000, popular: false },
];

const BuyCoinsSection = () => {
    const navigate = useNavigate();
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [processedTransactions] = useState(new Set()); // Track processed transactions

    useEffect(() => {
        const handlePaymentCallback = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const vnpParams = {};
            let hasVnpParams = false;

            for (const [key, value] of urlParams.entries()) {
                if (key.startsWith('vnp_')) {
                    vnpParams[key] = value;
                    hasVnpParams = true;
                }
            }

            // Only process if we have VNPay params and haven't processed this transaction yet
            if (hasVnpParams && vnpParams.vnp_TxnRef && !processedTransactions.has(vnpParams.vnp_TxnRef)) {
                setLoading(true);
                try {
                    console.log('Starting payment return handling...');

                    // Add transaction to processed set before handling
                    processedTransactions.add(vnpParams.vnp_TxnRef);

                    if (vnpParams.vnp_ResponseCode === '00') {
                        const result = await handlePaymentReturn(vnpParams);
                        console.log('Payment Return Result:', result);

                        if (result.isSuccess) {
                            setSuccess(true);
                            setError(null);
                            localStorage.removeItem('pendingTransaction');

                            // Use navigate instead of reload to prevent infinite loop
                            setTimeout(() => {
                                navigate('/user-dashboard', { replace: true });
                            }, 2000);
                            return;
                        }
                    }

                    setError('Payment verification failed. If your balance was charged, please contact support.');
                    setSuccess(false);

                } catch (error) {
                    console.error('Error handling payment return:', error);
                    setError('An error occurred during payment verification.');
                    setSuccess(false);
                } finally {
                    setLoading(false);
                    // Clean up URL params immediately using navigate
                    navigate('/user-dashboard', {
                        replace: true,
                        state: { fromPayment: true }
                    });
                }
            }
        };

        handlePaymentCallback();
    }, []); // Empty dependency array since we only want this to run once

    const handlePackageSelect = (pkg) => {
        setSelectedPackage(pkg);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^\d+$/.test(value)) {
            setCustomAmount(value);
            setSelectedPackage(null);
        }
    };

    const handlePurchase = async () => {
        try {
            setLoading(true);
            setError(null);

            const currentUser = getCurrentUser();
            if (!currentUser?.id) {
                throw new Error('Please log in to purchase coins');
            }

            const amount = selectedPackage ? selectedPackage.price : parseInt(customAmount);
            const coins = selectedPackage ? selectedPackage.coins : parseInt(customAmount);

            if (!amount || amount < 10000) {
                throw new Error('Please select a package or enter a valid amount');
            }

            // Lưu thông tin giao dịch vào localStorage để có thể truy cập sau khi quay lại
            const transactionInfo = {
                amount,
                coins,
                timestamp: Date.now()
            };
            localStorage.setItem('pendingTransaction', JSON.stringify(transactionInfo));

            const { paymentUrl } = await createTransaction(
                currentUser.id,
                amount,
                `Purchase ${coins} coins`
            );

            // Redirect to VNPay payment page
            window.location.href = paymentUrl;

        } catch (err) {
            setError(err.message);
            console.error('Error initiating purchase:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            {loading && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4">
                    <span className="block sm:inline">Processing payment...</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> Payment completed successfully.</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            {/* Coin Packages */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {COIN_PACKAGES.map((pkg, index) => (
                    <div
                        key={index}
                        className={`relative rounded-lg border p-4 cursor-pointer transition-all ${selectedPackage === pkg
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                            }`}
                        onClick={() => handlePackageSelect(pkg)}
                    >
                        {pkg.popular && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                                Popular
                            </span>
                        )}
                        <div className="text-center">
                            <h3 className="text-xl font-bold mb-2">{pkg.coins} Coins</h3>
                            <p className="text-gray-600 mb-2">{(pkg.price).toLocaleString()} VND</p>
                            <p className="text-sm text-gray-500">
                                {((pkg.price / pkg.coins)).toFixed(1)}K VND/coin
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Amount */}
            <div className="max-w-md mx-auto mb-8">
                <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-4">Custom Amount</h3>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            value={customAmount}
                            onChange={handleCustomAmountChange}
                            placeholder="Enter number of coins"
                            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="text-gray-600">
                            = {customAmount ? (parseInt(customAmount) * 1000).toLocaleString() : 0} VND
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Button */}
            <div className="text-center">
                <button
                    onClick={handlePurchase}
                    disabled={loading || (!selectedPackage && !customAmount)}
                    className={`px-6 py-2 rounded text-white ${loading || (!selectedPackage && !customAmount)
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                >
                    {loading ? 'Processing...' : 'Purchase Now'}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    You will be redirected to VNPay to complete your purchase
                </p>
            </div>

            {/* Information Section */}
            <div className="mt-8 bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">About Coins</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Coins can be used to unlock premium features and content</li>
                    <li>Purchases are processed securely through VNPay</li>
                    <li>Coins will be added to your account immediately after successful payment</li>
                    <li>For any issues, please contact our support team</li>
                </ul>
            </div>
        </div>
    );
};

export default BuyCoinsSection;