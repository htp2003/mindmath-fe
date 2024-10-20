import React, { useState } from 'react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [balance, setBalance] = useState(500);
  const [transactions, setTransactions] = useState([
    { date: '2024-10-01', description: 'Deposit', amount: 100 },
    { date: '2024-10-02', description: 'Video Generation', amount: -50 },
    { date: '2024-10-03', description: 'Coin Purchase', amount: 200 },
  ]);
  const [videos, setVideos] = useState([
    { date: '2024-10-02', title: 'Algebra Basics', status: 'Completed' },
    { date: '2024-10-04', title: 'Geometry 101', status: 'Processing' },
  ]);

  const handleCoinPurchase = (amount) => {
    setBalance(prevBalance => prevBalance + amount);
    setTransactions(prevTransactions => [
      { date: new Date().toISOString().split('T')[0], description: 'Coin Purchase', amount },
      ...prevTransactions
    ]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>

      <div className="tabs tabs-boxed mb-4">
        <a className={`tab ${activeTab === 'wallet' ? 'tab-active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Wallet
        </a>
        <a className={`tab ${activeTab === 'videos' ? 'tab-active' : ''}`} onClick={() => setActiveTab('videos')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          My Videos
        </a>
        <a className={`tab ${activeTab === 'coins' ? 'tab-active' : ''}`} onClick={() => setActiveTab('coins')}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Buy Coins
        </a>
      </div>

      {activeTab === 'wallet' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Wallet Balance</h2>
            <p className="text-2xl font-bold mb-4">${balance.toFixed(2)}</p>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr key={index}>
                      <td>{transaction.date}</td>
                      <td>{transaction.description}</td>
                      <td>${transaction.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'videos' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">My Videos</h2>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video, index) => (
                    <tr key={index}>
                      <td>{video.date}</td>
                      <td>{video.title}</td>
                      <td>{video.status}</td>
                      <td>
                        <button className="btn btn-sm btn-outline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Generate New Video
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'coins' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Buy Coins</h2>
            <div className="flex flex-wrap gap-4 mb-4">
              <button className="btn btn-primary" onClick={() => handleCoinPurchase(100)}>Buy 100 Coins</button>
              <button className="btn btn-primary" onClick={() => handleCoinPurchase(500)}>Buy 500 Coins</button>
              <button className="btn btn-primary" onClick={() => handleCoinPurchase(1000)}>Buy 1000 Coins</button>
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Custom Amount:</span>
              </label>
              <div className="input-group">
                <input type="number" placeholder="Enter amount" className="input input-bordered" id="custom-amount" />
                <button className="btn btn-square" onClick={() => {
                  const amount = document.getElementById('custom-amount').value;
                  handleCoinPurchase(Number(amount));
                }}>
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;