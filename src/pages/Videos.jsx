import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const Videos = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);

    // Mock data - replace with actual data
    const categories = [
        { id: 'all', name: 'All Videos' },
        { id: 'algebra', name: 'Algebra' },
        { id: 'geometry', name: 'Geometry' },
        { id: 'calculus', name: 'Calculus' },
        { id: 'statistics', name: 'Statistics' }
    ];

    const mockVideos = Array(12).fill(null).map((_, index) => ({
        id: index + 1,
        title: `Math Video ${index + 1}`,
        description: 'Learn complex mathematical concepts with our easy-to-follow video tutorials.',
        thumbnail: `https://picsum.photos/200/300`,
        views: Math.floor(Math.random() * 10000),
        duration: '10:30',
        author: 'Math Teacher',
        category: categories[Math.floor(Math.random() * categories.length)].id
    }));

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    const filteredVideos = mockVideos.filter(video =>
        (selectedCategory === 'all' || video.category === selectedCategory)
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="container mx-auto px-4 py-8">
                {/* Hero Section with Search */}
                <div className="bg-white rounded-lg shadow-lg mb-8 p-8">
                    <h1 className="text-4xl font-bold text-center mb-6">Math Video Library</h1>
                    <form onSubmit={handleSearch} className="flex justify-center max-w-2xl mx-auto">
                        <div className="join w-full">
                            <input
                                type="text"
                                placeholder="Search for math videos..."
                                className="input input-bordered join-item flex-grow"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary join-item">
                                <Search size={20} />
                                Search
                            </button>
                        </div>
                    </form>
                </div>

                {/* Category Filters */}
                <div className="mb-8">
                    <div className="flex items-center mb-4">
                        <Filter size={20} className="mr-2" />
                        <h2 className="text-xl font-semibold">Filter by Category</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`btn ${selectedCategory === category.id
                                    ? 'btn-primary'
                                    : 'btn-outline'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Video Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {filteredVideos.map((video) => (
                        <div key={video.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <figure className="relative">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                                    {video.duration}
                                </div>
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title text-lg">{video.title}</h2>
                                <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                                    <span>{video.author}</span>
                                    <span>{video.views.toLocaleString()} views</span>
                                </div>
                                <div className="card-actions justify-end mt-4">
                                    <button className="btn btn-primary btn-sm">Watch Now</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center items-center space-x-4">
                    <button
                        className="btn btn-circle"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <span className="text-lg font-semibold">
                        Page {currentPage}
                    </span>
                    <button
                        className="btn btn-circle"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={filteredVideos.length < 12}
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Videos;