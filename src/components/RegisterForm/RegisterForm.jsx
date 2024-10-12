import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/authServices';

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
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await register(formData);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card w-full max-w-md bg-blue-100 shadow-xl mx-auto bg-opacity-60 ">
            <div className="card-body p-6">
                <h2 className="card-title justify-center text-2xl font-bold mb-2">Register</h2>

                {error && <div className="alert alert-error mb-2 p-2 text-sm">{error}</div>}
                {success && <div className="alert alert-success mb-2 p-2 text-sm">Registration successful!</div>}

                <form onSubmit={handleSubmit} className="space-y-2">
                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-sm">Full Name</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="John Doe"
                            value={formData.fullname}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-sm">Username</span>
                        </label>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Your username"
                            value={formData.userName}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-sm">Email</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-sm">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="0123456789"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="form-control">
                        <label className="label py-1">
                            <span className="label-text text-sm">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered w-full h-10 text-sm"
                            required
                        />
                    </div>

                    <div className="form-control py-4">
                        <button type="submit" className="btn btn-primary w-full h-10 text-sm">Register</button>
                    </div>
                </form>

                <div className="mt-2 text-center">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-700 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;