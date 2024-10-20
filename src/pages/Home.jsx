import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Video, Search, BookOpen, Coins, PlusCircle } from "lucide-react";

const Home = () => {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Searching for:", searchQuery);
    // navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="hero bg-white rounded-lg shadow-lg mb-12 py-12">
          <div className="hero-content text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
                Mindmath
              </h1>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-800">Creator</h2>
              <p className="py-4 text-lg sm:text-xl md:text-2xl font-semibold leading-relaxed text-gray-600">
                Instantly turn your text inputs into publish-worthy math videos. Simplify the process, generate scripts, and add video clips with ease. Create professional math content at scale!
              </p>
              <div className="mt-8 space-x-4 flex justify-center">
                <Link to="/create" className="btn btn-primary btn-lg rounded-full font-bold">Start Creating</Link>
                <Link to="/videos" className="btn btn-outline btn-lg rounded-full font-bold">Browse Videos</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <form onSubmit={handleSearch} className="flex justify-center">
            <input
              type="text"
              placeholder="Search for math videos..."
              className="input input-bordered w-full max-w-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary ml-2">
              <Search size={24} />
            </button>
          </form>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <FeatureCard
            icon={<Video className="w-12 h-12 text-primary mb-4" />}
            title="Create Videos"
            description="Generate professional math videos with ease using AI-powered tools."
          />
          <FeatureCard
            icon={<Coins className="w-12 h-12 text-warning mb-4" />}
            title="Use Coins"
            description="Spend coins to create more complex and longer videos."
          />
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-success mb-4" />}
            title="Learn Math"
            description="Enhance your math skills with visually appealing content."
          />
          <FeatureCard
            icon={<PlusCircle className="w-12 h-12 text-info mb-4" />}
            title="Collaborate"
            description="Share and collaborate on video creation with other teachers."
          />
        </div>

        {/* Call-to-Action */}
        <div className="text-center bg-blue-600 text-white py-12 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Math Teaching?</h2>
          <p className="text-xl mb-6">Join thousands of teachers creating engaging math videos!</p>
          <Link to="/register" className="btn btn-secondary btn-lg">Sign Up Now</Link>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body items-center text-center">
      {icon}
      <h2 className="card-title">{title}</h2>
      <p>{description}</p>
    </div>
  </div>
);

export default Home;