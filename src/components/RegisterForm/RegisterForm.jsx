import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authServices';
import { Loader2, User, Mail, Phone, Lock } from 'lucide-react';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        email: '',
        password: '',
        phoneNumber: '',
        userName: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card w-full max-w-md bg-white shadow-xl">
            <div className="card-body p-6">
                <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm mb-3">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-600 p-2 rounded-lg text-sm mb-3">
                        Registration successful!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Full Name Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="fullname"
                                    placeholder="Full Name"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    className="input input-bordered w-full h-10 pl-9 text-sm bg-gray-50 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Username Input */}
                        <div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    name="userName"
                                    placeholder="Username"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="input input-bordered w-full h-10 pl-9 text-sm bg-gray-50 focus:bg-white transition-colors"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Email Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 pl-9 text-sm bg-gray-50 focus:bg-white transition-colors"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Phone Number Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="input input-bordered w-full h-10 pl-9 text-sm bg-gray-50 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                                <Lock className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered w-full h-10 pl-9 text-sm bg-gray-50 focus:bg-white transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary w-full h-10 mt-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            "Create Account"
                        )}
                    </button>
                </form>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <button
                    onClick={() => { }}
                    className="btn btn-outline w-full h-10 flex items-center justify-center gap-2 hover:bg-black"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    Sign up with Google
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;