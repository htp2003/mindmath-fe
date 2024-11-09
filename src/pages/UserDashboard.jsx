import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import WalletSection from '../components/WalletSection/WalletSection';
import VideoSection from '../components/VideoSection/VideoSection';
import BuyCoinsSection from '../components/BuyCoinsSection/BuyCoinsSection';
import VideoHistory from '../components/VideoSection/VideoHistory';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const navigate = useNavigate();
  const location = useLocation();

  // Check for VNPay return and switch to coins tab if necessary
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let hasVnpParams = false;

    for (const [key] of urlParams.entries()) {
      if (key.startsWith('vnp_')) {
        hasVnpParams = true;
        break;
      }
    }

    if (hasVnpParams) {
      setActiveTab('coins');
    }
  }, [location.search]);

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
      {activeTab === 'videos' && <VideoHistory />}
      {activeTab === 'coins' && <BuyCoinsSection />}
    </div>
  );
};

export default UserDashboard;