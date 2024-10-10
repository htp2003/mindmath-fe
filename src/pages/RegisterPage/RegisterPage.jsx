import React from 'react';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import picture from '../../assets/img/pngegg.png';
import videoBg from '../../assets/video/manim.mp4';

const Register = () => {
    return (
        //bg-gradient-to-r from-sky-300 to-indigo-400
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
                className="absolute top-0 left-0 w-full h-full object-cover blur-sm"
            >
                <source src={videoBg} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="hero-content flex flex-col lg:flex-row items-center justify-center lg:gap-20 gap-10">
                {/* Mindmath Title */}
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold animate-colorChange">Mindmath</h1>
                    <h3 className="py-6 text-lg px-0 text-white">
                        Join our MindMath community today and get access to exclusive features and content.
                    </h3>
                </div>

                {/* Register Form */}
                <div className="w-full max-w-lg flex justify-center">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default Register;
