import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/authServices';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Dùng để chuyển hướng sau khi login thành công

    // Hàm xử lý khi form thay đổi
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear lỗi cũ

        try {
            const response = await login(formData); // Gửi dữ liệu đến API
            // Xử lý khi login thành công (ví dụ: lưu token vào localStorage và chuyển hướng)
            localStorage.setItem('token', response.token); // Giả sử API trả về token
            navigate('/dashboard'); // Chuyển hướng đến trang dashboard
        } catch (err) {
            setError(err.message); // Hiển thị lỗi nếu có
        }
    };

    return (
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title justify-center text-2xl font-bold mb-4">Login</h2>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit}>``
                    {/* Username */}
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Username</span>
                        </label>
                        <input
                            type="text"
                            name="userName"
                            placeholder="Enter username"
                            value={formData.userName}
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="form-control w-full max-w-xs mt-4">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input input-bordered w-full max-w-xs"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <div className="form-control mt-6">
                        <button type="submit" className="btn btn-primary w-full">Login</button>
                    </div>
                </form>

                {/* Link to Register */}
                <div className="mt-4 text-center">
                    <p className="text-sm">
                        Do not have an account?{" "}
                        <Link to="/register" className="text-blue-500 hover:underline">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
