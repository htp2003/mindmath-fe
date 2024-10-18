import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authServices";
import { toast } from "react-hot-toast";
const LoginForm = () => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const response = await login(formData);
      console.log("Login response:", response);

      const decodedToken = response.decodedToken; // Get the decoded token
      console.log("Decoded Token:", decodedToken); // Log the decoded token

      // Check user roles
      const roles =
        decodedToken[

          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ] || [];
      console.log("User Roles:", roles); // Log the user roles

      // Navigate based on roles
      if (roles.includes("Admin") && roles.includes("Teacher")) {
        toast.success(`Welcome, admin ${decodedToken.Fullname}!`, {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          position: "top-center",
          duration: 4000,
          id: "welcome-toast-admin",
        });
        navigate("/admin"); // Navigate to admin page if Admin or Teacher
      } else if (roles.includes("Teacher")) {
        toast.success(`Welcome, ${decodedToken.Fullname}!`, {
          position: "top-center",
          duration: 4000,
          id: "welcome-toast",
        });
        navigate("/"); // Navigate to home page if only Teacher
      } else {
        toast.success(`Welcome, ${decodedToken.Fullname}!`, {
          position: "top-center",
          duration: 4000,
          id: "welcome-toast",
        });
        navigate("/"); // Default navigation for other roles
      }

      setSuccess(true); // Indicate success
    } catch (err) {
      setError(err.message); // Set error message if login fails
    }
  };

  return (
    <div className="card w-96 bg-blue-100 shadow-xl bg-opacity-60">
      <div className="card-body">
        <h2 className="card-title justify-center text-2xl font-bold mb-4">
          Login
        </h2>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">Login successful!</div>
        )}
        <form onSubmit={handleSubmit}>
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
          <div className="form-control mt-6">
            <button type="submit" className="btn btn-primary w-full">
              Login
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Do not have an account?{" "}
            <Link to="/register" className="text-blue-700 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
