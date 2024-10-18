import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';


const Login = () => {
    return (
        <div className="overflow-y-scroll snap-y snap-mandatory h-screen">
            {/* Hero Section (Full Screen) */}
            <div className="relative min-h-screen bg-black flex items-center justify-center  snap-start"
                style={{
                    background: "linear-gradient(180deg, rgba(233,237,83,1) 0%, rgba(246,249,154,1) 45%, rgba(238,246,205,1) 100%)"
                }}>

                {/* Hero Content (Login Form) */}
                <div className="hero-content flex flex-col lg:flex-row items-center justify-center lg:gap-20 gap-10 relative z-10" >
                    {/* Mindmath Title */}
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-bold animate-colorChange text-white">
                            Mindmath
                        </h1>
                        <h3 className="py-6 text-lg px-0 text-black">
                            Welcome back! Log in to access your account and enjoy our services.
                        </h3>
                    </div>

                    {/* Login Form */}
                    <div className="w-full max-w-lg flex justify-center">
                        <LoginForm />
                    </div>
                </div>
            </div>



            {/* Main Features Section (Full Screen) */}
            <div className="relative min-h-screen bg-white flex items-center justify-center  snap-start"
                style={{
                    background: "linear-gradient(360deg, rgba(233,237,83,1) 0%, rgba(246,249,154,1) 45%, rgba(238,246,205,1) 100%)"
                }}>

                <div className="container mx-auto text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">
                        Why Choose Mindmath?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="feature-item bg-red-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Interactive Learning
                            </h3>
                            <p className="text-gray-600">
                                Learn through interactive videos and animations that make complex topics simple and fun.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="feature-item bg-blue-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Comprehensive Resources
                            </h3>
                            <p className="text-gray-600">
                                Access a variety of mathematical resources, including problem sets, videos, and tutorials.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="feature-item bg-green-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Flexible and Accessible
                            </h3>
                            <p className="text-gray-600">
                                Access your learning materials anytime, anywhere, and at your own pace.
                            </p>
                        </div>
                        {/* Feature 4 */}
                        <div className="feature-item bg-purple-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Personalized Learning
                            </h3>
                            <p className="text-gray-600">
                                Track your progress and personalize your learning journey based on your strengths and weaknesses.
                            </p>
                        </div>
                        {/* Feature 5 */}
                        <div className="feature-item bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Real-Time Feedback
                            </h3>
                            <p className="text-gray-600">
                                Get instant feedback on your answers to practice problems and improve your skills quickly.
                            </p>
                        </div>
                        {/* Feature 6 */}
                        <div className="feature-item bg-orange-100 p-6 rounded-lg shadow-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Collaborative Learning
                            </h3>
                            <p className="text-gray-600">
                                Join study groups and collaborate with peers to solve problems and share insights.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
