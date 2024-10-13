import React from 'react';
import LoginForm from '../../components/LoginForm/LoginForm';
import picture from '../../assets/img/pngegg.png';
import videoBg from '../../assets/video/manim1.mp4';


const Login = () => {
    return (
        <div className="hero min-h-screen bg-black flex items-center justify-center">
            {/* <img
                src={picture}
                alt="Mindmath Icon"
                className="absolute left-1/2 transform -translate-x-1/2 mt-20 w-96 opacity-50 z-0 animate-breathing"
            /> */}
            <video
                autoPlay
                loop
                muted
                className="absolute top-0 left-0 w-full h-full object-cover blur-md"
            >
                <source src={videoBg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-content flex flex-col lg:flex-row items-center justify-center lg:gap-20 gap-10 relative">
                {/* Mindmath Title */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold animate-colorChange">Mindmath</h1>
                    <h3 className="py-6 text-lg px-0 text-white">
                        Welcome back! Log in to access your account and enjoy our services.
                    </h3>
                </div>

                {/* Login Form */}
                <div className="w-full max-w-lg flex justify-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
};

export default Login;
