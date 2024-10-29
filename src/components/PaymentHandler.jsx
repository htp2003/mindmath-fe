import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handlePaymentReturn, checkTransactionStatus } from '../../services/transactionService';

const PaymentHandler = () => {
    const [status, setStatus] = useState('processing');
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handlePayment = async () => {
            try {
                // Lấy query params từ URL
                const queryParams = new URLSearchParams(location.search);
                const params = {};
                queryParams.forEach((value, key) => {
                    params[key] = value;
                });

                // Xử lý kết quả từ VNPay
                const result = handlePaymentReturn(params);

                if (!result.isValid) {
                    setStatus('failed');
                    setError('Invalid transaction signature');
                    return;
                }

                if (!result.isSuccess) {
                    setStatus('failed');
                    setError('Payment was not successful');
                    return;
                }

                // Kiểm tra trạng thái giao dịch với backend
                const transactionStatus = await checkTransactionStatus(result.transactionId);

                if (transactionStatus.status === 'completed') {
                    setStatus('success');
                } else {
                    setStatus('failed');
                    setError('Transaction verification failed');
                }

            } catch (err) {
                setStatus('failed');
                setError(err.message);
            }
        };

        handlePayment();
    }, [location.search]);

    const handleClose = () => {
        // Chuyển hướng về trang chính hoặc trang mua coins
        navigate('/buy-coins');
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                {status === 'processing' && (
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-lg">Processing your payment...</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
                        <p className="text-gray-600 mb-6">Your coins have been added to your account.</p>
                        <button
                            onClick={handleClose}
                            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
                        >
                            Continue
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
                        {error && <p className="text-gray-600 mb-6">{error}</p>}
                        <button
                            onClick={handleClose}
                            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentHandler;