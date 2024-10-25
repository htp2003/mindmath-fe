import React, { useState, useEffect } from "react";
import { getCurrentUser, updateUserProfile, changePassword } from "../services/authServices";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState(null);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordValidation, setPasswordValidation] = useState({
    match: true,
    message: ""
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const userData = getCurrentUser();
      if (userData) {
        setFullname(userData.Fullname || "");
        setEmail(userData.Email || "");
        setPhoneNumber(userData.PhoneNumber || "");

        // Use the correct Avatar field from token
        const avatarUrl = userData.Avatar;
        if (avatarUrl && avatarUrl.includes('mindmath.blob.core.windows.net')) {
          setCurrentAvatarUrl(avatarUrl);
          setAvatarPreview(avatarUrl);
        } else {
          setAvatarPreview("https://via.placeholder.com/150");
        }
      } else {
        setError("No user data found");
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        e.target.value = '';
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed');
        e.target.value = '';
        return;
      }

      setAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError(null);

    try {
      const userData = {
        fullname,
        email,
        phoneNumber,
        avatar
      };

      const result = await updateUserProfile(userData);

      // Check for the new avatar URL in the response using the correct field name
      const newAvatarUrl = result.Avatar || result.avatar;

      if (newAvatarUrl && newAvatarUrl.includes('mindmath.blob.core.windows.net')) {
        setCurrentAvatarUrl(newAvatarUrl);
        setAvatarPreview(newAvatarUrl);

        // Update the token to include the new avatar URL
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const updatedToken = {
              ...decodedToken,
              Avatar: newAvatarUrl // Use the correct field name
            };
            // You might want to update your auth context or state management here
          } catch (err) {
            console.error("Error updating token:", err);
          }
        }
      }

      alert("Profile updated successfully!");
      setAvatar(null); // Clear the file input state
      await fetchUserData(); // Refresh user data
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile: " + (err.message || "Unknown error"));
    } finally {
      setSubmitLoading(false);
    }
  };


  useEffect(() => {
    if (newPassword || confirmPassword) {
      validatePasswords(newPassword, confirmPassword);
    }
  }, [newPassword, confirmPassword]);

  const validatePasswords = (newPass, confirmPass) => {
    // Trim the passwords to remove any whitespace
    const trimmedNew = (newPass || "").trim();
    const trimmedConfirm = (confirmPass || "").trim();

    if (!trimmedNew || !trimmedConfirm) {
      return true; // Don't show error if fields are empty
    }

    if (trimmedNew !== trimmedConfirm) {
      setPasswordValidation({
        match: false,
        message: "New passwords do not match"
      });
      return false;
    }

    if (trimmedNew.length < 6) {
      setPasswordValidation({
        match: false,
        message: "Password must be at least 6 characters long"
      });
      return false;
    }

    setPasswordValidation({
      match: true,
      message: ""
    });
    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setPasswordError("");

    // Final validation before submission
    if (!validatePasswords(newPassword, confirmPassword)) {
      return;
    }

    try {
      const result = await changePassword(oldPassword, newPassword);
      alert(result.message || "Password changed successfully!");

      // Reset form and close modal
      setShowResetPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordValidation({ match: true, message: "" });
    } catch (err) {
      setPasswordError(err.message || "Failed to change password");
    }
  };



  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-error">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <form onSubmit={handleSubmit}>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className={`btn btn-neutral ${submitLoading ? 'loading' : ''}`}
                    disabled={submitLoading}
                  >
                    {submitLoading ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>

              <div className="divider">OR</div>

              <button
                onClick={() => setShowResetPassword(true)}
                className="btn btn-info w-full"
              >
                Reset Password
              </button>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <img
                  src={avatarPreview || "https://via.placeholder.com/150"}
                  alt="Avatar"
                  className="rounded-full w-full h-full object-cover"
                />
                {(avatar || currentAvatarUrl) && (
                  <button
                    onClick={() => {
                      if (avatar) {
                        setAvatar(null);
                        URL.revokeObjectURL(avatarPreview);
                        setAvatarPreview(currentAvatarUrl || "https://via.placeholder.com/150");
                      } else {
                        setCurrentAvatarUrl(null);
                        setAvatarPreview("https://via.placeholder.com/150");
                      }
                    }}
                    className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error"
                  >
                    ×
                  </button>
                )}
              </div>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Upload Avatar</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                />
                <label className="label">
                  <span className="label-text-alt">Max file size: 5MB</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResetPassword && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reset Password</h3>

            {passwordError && (
              <div className="alert alert-error mt-2">
                <span>{passwordError}</span>
              </div>
            )}

            {!passwordValidation.match && passwordValidation.message && (
              <div className="alert alert-warning mt-2">
                <span>{passwordValidation.message}</span>
              </div>
            )}

            <form onSubmit={handleResetPassword}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Old Password</span>
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value.trim())}
                  className="input input-bordered"
                  required
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input input-bordered"
                  required
                  minLength={6}
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Minimum 6 characters
                  </span>
                </label>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`input input-bordered ${confirmPassword && !passwordValidation.match ? 'input-error' : ''
                    }`}
                  required
                  minLength={6}
                />
              </div>

              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-neutral"
                  disabled={
                    !oldPassword ||
                    !newPassword ||
                    !confirmPassword ||
                    !passwordValidation.match
                  }
                >
                  Change Password
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setShowResetPassword(false);
                    setPasswordError("");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                    setPasswordValidation({ match: true, message: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;