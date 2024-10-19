import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/authServices"; // Ensure this path is correct
import { Flex } from "antd";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Function to manually decode the JWT token
  const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Retrieve user data from the token when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken); // Save the decoded token user data
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login"); // Redirect to login page after logout
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

        {/* Avatar with Dropdown */}
        <div className="relative">
          <div className="user-group" style={{ display: 'flex', justifyItems: 'center' }}>
            {/* User Info */}
            {user && (
              <span className="mx-2 mt-2  text-gray-800 font-semibold">
                {user.Fullname} {/* Display the user's full name */}
              </span>
            )}
            <button onClick={toggleDropdown} className="focus:outline-none">
              <img
                src="https://via.placeholder.com/40" // Placeholder for Avatar
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-400"
              />
            </button>



          </div>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setDropdownOpen(false)}
              >
                Profile
              </Link>
              <button
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
