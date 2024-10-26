import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authServices";
import { Home, Wallet, User, LogOut, Video, Search, BookOpen, Menu, Bell } from "lucide-react";


const Navbar = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      setAvatarUrl(decodedToken.Avatar);
    }

    // Thêm event listener cho sự kiện cập nhật avatar
    const handleAvatarUpdate = (event) => {
      setAvatarUrl(event.detail.avatarUrl);
    };

    window.addEventListener('avatarUpdate', handleAvatarUpdate);

    // Cleanup function
    return () => {
      window.removeEventListener('avatarUpdate', handleAvatarUpdate);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <li className="list-none">
        <Link
          to={to}
          className={`flex items-center px-4 py-2 rounded-lg ${isActive
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-blue-50"
            }`}
        >
          <Icon size={18} className="mr-2" />
          {children}
        </Link>
      </li>
    );
  };

  // Function to get initials from user name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-600">
                Mindmath
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
              <ul className="flex space-x-4 font-medium">
                <NavLink to="/" icon={Home}>Home</NavLink>
                <NavLink to="/create" icon={Video}>Create</NavLink>
                <NavLink to="/videos" icon={BookOpen}>Videos</NavLink>
                <NavLink to="/user-dashboard" icon={Wallet}>Dashboard</NavLink>
              </ul>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell size={20} className="text-gray-600" />
                </button>
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-3 rounded-full bg-white p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                  >
                    <div className="flex items-center">
                      {user.Avatar ? (
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-gray-200"
                          src={avatarUrl || user.Avatar}
                          alt={user.name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {getInitials(user.name)}
                        </div>
                      )}
                      <div className="ml-3 hidden md:block text-left">
                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                        <p className="text-xs text-gray-500">View profile</p>
                      </div>
                    </div>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <User size={18} className="mr-2" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut size={18} className="mr-2" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Sign in
              </Link>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/create" icon={Video}>Create</NavLink>
            <NavLink to="/videos" icon={BookOpen}>Videos</NavLink>
            <NavLink to="/user-dashboard" icon={Wallet}>Dashboard</NavLink>
          </div>
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  {user.Avatar ? (
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                      src={avatarUrl || user.Avatar}
                      alt={user.name}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {getInitials(user.name)}
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <User size={18} className="inline mr-2" /> Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  <LogOut size={18} className="inline mr-2" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign in
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;