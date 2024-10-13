import React from "react";

const Wallet = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
        <h2 className="text-2xl font-semibold mb-2">Wallet Balance</h2>
        <p className="text-xl font-medium text-gray-800">$500.00</p>
      </div>

      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <div className="bg-white rounded-lg shadow-md p-4">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Date
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Description
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 text-sm text-gray-800">2024-10-01</td>
              <td className="py-2 px-4 text-sm text-gray-800">Deposit</td>
              <td className="py-2 px-4 text-sm text-gray-800">$100.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 text-sm text-gray-800">2024-10-02</td>
              <td className="py-2 px-4 text-sm text-gray-800">Withdrawal</td>
              <td className="py-2 px-4 text-sm text-gray-800">-$50.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 text-sm text-gray-800">2024-10-03</td>
              <td className="py-2 px-4 text-sm text-gray-800">Transfer</td>
              <td className="py-2 px-4 text-sm text-gray-800">-$25.00</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 px-4 text-sm text-gray-800">2024-10-04</td>
              <td className="py-2 px-4 text-sm text-gray-800">Deposit</td>
              <td className="py-2 px-4 text-sm text-gray-800">$200.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Wallet;
