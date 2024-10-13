import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State cho dropdown

  // Toggle dropdown khi click vào avatar
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-gray-200 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Links */}
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-800 text-lg font-semibold">
            Home
          </Link>
          <Link to="/wallet" className="text-gray-800 text-lg font-semibold">
            Wallet
          </Link>
        </div>

        {/* Avatar với Dropdown */}
        <div className="relative">
          <button onClick={toggleDropdown} className="focus:outline-none">
            <img
              src="https://via.placeholder.com/40"
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-400"
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)} // Đóng dropdown khi click
              >
                Profile
              </Link>
              <Link
                to="/logout"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)} // Đóng dropdown khi click
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
