import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WalletSection from '../components/WalletSection/WalletSection';
import VideoSection from '../components/VideoSection/VideoSection';
import BuyCoinsSection from '../components/BuyCoinsSection/BuyCoinsSection';
import { handlePaymentReturn } from '../services/transactionService';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePaymentCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const vnpParams = {};
      let hasVnpParams = false;

      // Kiểm tra xem có params từ VNPay không
      for (const [key, value] of urlParams.entries()) {
        if (key.startsWith('vnp_')) {
          vnpParams[key] = value;
          hasVnpParams = true;
        }
      }

      if (hasVnpParams) {
        const result = handlePaymentReturn(vnpParams);
        setPaymentStatus(result);
        setActiveTab('coins'); // Chuyển về tab coins để hiển thị kết quả

        // Xóa query params
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handlePaymentCallback();
  }, [location.search]);

  // Modal hiển thị kết quả thanh toán
  const PaymentResultModal = ({ status, onClose }) => {
    if (!status) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
          {status.isValid && status.isSuccess ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">Your coins have been added to your account.</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h2>
              <p className="text-gray-600 mb-6">{status.message}</p>
            </div>
          )}
          <button
            onClick={onClose}
            className={`w-full py-2 px-4 rounded ${status.isValid && status.isSuccess
              ? 'bg-green-500 hover:bg-green-600'
              : 'bg-red-500 hover:bg-red-600'
              } text-white transition-colors`}
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === 'wallet' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('wallet')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Wallet
        </a>
        <a
          className={`tab ${activeTab === 'videos' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          My Videos
        </a>
        <a
          className={`tab ${activeTab === 'coins' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('coins')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Buy Coins
        </a>
      </div>

      {activeTab === 'wallet' && <WalletSection />}
      {activeTab === 'videos' && <div>Videos section is in development...</div>}
      {activeTab === 'coins' && <BuyCoinsSection />}

      <PaymentResultModal
        status={paymentStatus}
        onClose={() => setPaymentStatus(null)}
      />
    </div>
  );
};

export default UserDashboard;