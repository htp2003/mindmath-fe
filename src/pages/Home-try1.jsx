import React from "react";
import { Link } from "react-router-dom";
import { Search, Video, DollarSign, BookOpen } from "lucide-react";

const Home = () => {
    return (
        <div className="snap-y snap-mandatory h-screen overflow-scroll">
            {/* Hero Section */}
            <section className="snap-start h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100 p-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4 text-center">
                    Create math videos
                    <span className="block text-indigo-600">without leaving your browser.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl text-center">
                    A powerful Manim-based platform for creating stunning math visualizations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <Link to="/create" className="btn btn-primary btn-lg">
                        Get started
                    </Link>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Quick search..."
                            className="input input-bordered input-lg w-full pl-10 pr-4"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                </div>
            </section>

            {/* Create Videos Section */}
            <section className="snap-start h-screen flex items-center justify-center bg-blue-50 p-4">
                <div className="text-center">
                    <Video className="w-24 h-24 text-blue-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Create Videos</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Generate professional math videos with ease using Manim. Our intuitive interface makes it simple to bring your mathematical concepts to life.
                    </p>
                </div>
            </section>

            {/* Use Coins Section */}
            <section className="snap-start h-screen flex items-center justify-center bg-yellow-50 p-4">
                <div className="text-center">
                    <DollarSign className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Use Coins</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Spend coins to create more complex and longer videos. Our flexible coin system allows you to scale your projects as needed.
                    </p>
                </div>
            </section>

            {/* Learn Math Section */}
            <section className="snap-start h-screen flex items-center justify-center bg-green-50 p-4">
                <div className="text-center">
                    <BookOpen className="w-24 h-24 text-green-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Learn Math</h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Enhance your math skills with visually appealing content. Our platform not only helps you create videos but also deepens your understanding of mathematical concepts.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Home;