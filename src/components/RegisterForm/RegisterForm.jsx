import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { register } from '../../services/authServices';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        fullname: '',
        gender: '',
        dateOfBirth: '',
        email: '',
        password: '',
        phoneNumber: '',
        userName: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await register(formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="card w-full max-w-4xl bg-blue-100 shadow-xl mx-auto bg-opacity-60">
            <div className="card-body">
                <h2 className="card-title justify-center text-2xl font-bold mb-4">Register</h2>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert alert-success">Registration successful!</div>}

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                placeholder="John Doe"
                                value={formData.fullname}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Username */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Username</span>
                            </label>
                            <input
                                type="text"
                                name="userName"
                                placeholder="Your username"
                                value={formData.userName}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Gender */}
                        {/* <div className="form-control">
                            <label className="label">
                                <span className="label-text">Gender</span>
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="select select-bordered"
                                required
                            >
                                <option value="" disabled>Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div> */}

                        {/* Date of Birth */}
                        {/* <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date of Birth</span>
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div> */}

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Phone Number */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone Number</span>
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="0123456789"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input input-bordered"
                                required
                            />
                        </div>
                    </div>

                    {/* Register Button */}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary w-full">Register</button>
                    </div>
                </form>

                {/* Link to Login */}
                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-500 hover:underline">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
