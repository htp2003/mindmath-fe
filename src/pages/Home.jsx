import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Import react-hot-toast

// Giả sử chúng ta có sẵn hình ảnh cho banner và poster
const bannerImage = "https://via.placeholder.com/1200x400"; // Hình banner
const posters = [
  { id: 1, title: "Poster 1", image: "https://via.placeholder.com/300x400" },
  { id: 2, title: "Poster 2", image: "https://via.placeholder.com/300x400" },
  { id: 3, title: "Poster 3", image: "https://via.placeholder.com/300x400" },
  { id: 4, title: "Poster 4", image: "https://via.placeholder.com/300x400" },
];

const Home = () => {
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

  // Retrieve user data from the token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken); // Save the decoded token user data

    } else {
      // If no token is found, redirect to the login page

      navigate("/login");
    }
  }, [navigate]); // Depend on navigate to avoid unnecessary re-renders

  return (
    <div className="container mx-auto p-4 bg-white">
      {/* Banner */}
      <div className="mb-8">
        <img
          src={bannerImage}
          alt="Banner"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>

      {/* Thanh tìm kiếm */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50"
        />
      </div>

      {/* Poster section */}
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Featured Posters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {posters.map((poster) => (
          <div
            key={poster.id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={poster.image}
              alt={poster.title}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {poster.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
