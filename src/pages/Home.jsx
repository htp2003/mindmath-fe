import React from "react";

// Giả sử chúng ta có sẵn hình ảnh cho banner và poster
const bannerImage = "https://via.placeholder.com/1200x400"; // Hình banner
const posters = [
  { id: 1, title: "Poster 1", image: "https://via.placeholder.com/300x400" },
  { id: 2, title: "Poster 2", image: "https://via.placeholder.com/300x400" },
  { id: 3, title: "Poster 3", image: "https://via.placeholder.com/300x400" },
  { id: 4, title: "Poster 4", image: "https://via.placeholder.com/300x400" },
];

const Home = () => {
  return (
    <div className="container mx-auto p-4">
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
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Poster section */}
      <h2 className="text-2xl font-bold mb-4">Featured Posters</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {posters.map((poster) => (
          <div
            key={poster.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={poster.image}
              alt={poster.title}
              className="w-full h-auto"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
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
