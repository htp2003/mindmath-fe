import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, getCurrentUserInfo, getCurrentUser } from "../services/authServices";
import { getWalletBalance } from "../services/walletService"; // Nhập hàm lấy số dư
import { Home, Wallet, User, LogOut, Video, BookOpen, Menu, Bell } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [balance, setBalance] = useState(null); // Thêm state cho balance
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

  const fetchUserData = async () => {
    try {
      const userData = await getCurrentUserInfo();
      if (userData) {
        setUser(prev => ({
          ...prev,
          ...userData
        }));

        // Lấy balance người dùng
        const currentUser = getCurrentUser();
        if (currentUser) {
          const walletData = await getWalletBalance(currentUser.id); // Lấy balance
          setBalance(walletData.balance); // Giả sử balance được trả về từ API là walletData.balance
        }

        // Chỉ set avatarUrl nếu có và hợp lệ
        if (userData.avatar && userData.avatar.includes('mindmath.blob.core.windows.net')) {
          setAvatarUrl(userData.avatar);
          setAvatarError(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
      fetchUserData();
    }

    // Thêm event listener cho sự kiện cập nhật avatar
    const handleAvatarUpdate = (event) => {
      setAvatarUrl(event.detail.avatarUrl);
      setAvatarError(false); // Reset error state khi có update mới
    };

    window.addEventListener('avatarUpdate', handleAvatarUpdate);

    // Cleanup function
    return () => {
      window.removeEventListener('avatarUpdate', handleAvatarUpdate);
    };
  }, []);

  const handleImageError = () => {
    setAvatarError(true);
    setAvatarUrl(null);
  };

  const renderAvatar = (size = 'small') => {
    const sizeClasses = size === 'small'
      ? "h-8 w-8"
      : "h-10 w-10";

    if (avatarError || !avatarUrl) {
      return (
        <div className={`${sizeClasses} rounded-full bg-blue-600 flex items-center justify-center text-white font-medium`}>
          {getInitials(user?.name || user?.Fullname || "U")}
        </div>
      );
    }

    return (
      <img
        className={`${sizeClasses} rounded-full object-cover border-2 border-gray-200`}
        src={avatarUrl}
        alt={user?.name || user?.Fullname}
        onError={handleImageError}
      />
    );
  };

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
          className={`flex items-center px-4 py-2 rounded-lg ${isActive ? "bg-blue-100 text-blue-700" : "hover:bg-blue-50"
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

  const renderBalanceIcon = () => {
    if (balance !== null) {
      return (
        <div className="flex items-center">
          <Wallet size={16} className="mr-1 text-gray-600" /> {/* Icon ví */}
          <span className="text-sm text-gray-600">
            ${balance} {/* Chỉ hiển thị số dư */}
          </span>
        </div>
      );
    }
    return null; // Hoặc có thể hiển thị một loading spinner
  };

  if (!user) {
    return null; // hoặc render một skeleton/loading state
  }

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
                <NavLink to="/user-dashboard" icon={Wallet}>Dashboard</NavLink>
                <NavLink to="/leaderboard" icon={BookOpen}>Leaderboard</NavLink>
              </ul>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user && (
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
                      {renderAvatar('small')}
                      <div className="ml-3 text-left">
                        <p className="text-sm font-medium text-gray-700">
                          {user.name || user.Fullname}
                        </p>
                        {renderBalanceIcon()} {/* Hiển thị balance bên dưới tên người dùng */}
                      </div>
                    </div>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-900">
                          {user.name || user.Fullname}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email || user.Email}
                        </p>
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
      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <NavLink to="/" icon={Home}>Home</NavLink>
            <NavLink to="/create" icon={Video}>Create</NavLink>
            <NavLink to="/videos" icon={BookOpen}>Videos</NavLink>
            <NavLink to="/user-dashboard" icon={Wallet}>Dashboard</NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
