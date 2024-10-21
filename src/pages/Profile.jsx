import React, { useState, useEffect } from "react";
import { storage } from "../firebase"; // Import firebase storage
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getCurrentUser, updateUserProfile } from "../services/authServices";

const Profile = () => {
  const [avatar, setAvatar] = useState(null);
  const [avatarURL, setAvatarURL] = useState("https://via.placeholder.com/150");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = () => {
    try {
      setLoading(true);
      const userData = getCurrentUser();
      console.log("Fetched user data:", userData);
      if (userData) {
        setFullname(userData.Fullname || userData.fullname || "");
        setUsername(userData.UserName || userData.userName || "");
        setEmail(userData.Email || userData.email || "");
        setPhoneNumber(userData.PhoneNumber || userData.phoneNumber || "");
      } else {
        setError("No user data found");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data: " + err.message);
      setLoading(false);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleUpload = () => {
    if (avatar) {
      const avatarRef = ref(storage, `avatars/${avatar.name}`);
      uploadBytes(avatarRef, avatar)
        .then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setAvatarURL(url);
            alert("Avatar uploaded successfully!");
            setAvatar(null);
          });
        })
        .catch((error) => {
          console.error("Error uploading avatar: ", error);
        });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting user data:", {
        fullname,
        email,
        phoneNumber,
      });
      const result = await updateUserProfile({
        fullname,
        email,
        phoneNumber,
      });
      console.log("Update result:", result);
      alert(result.message || "Profile updated successfully!");
      // Optionally refresh user data after update
      fetchUserData();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile: " + err.message);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Handle password reset logic (you might want to create a separate API endpoint for this)
    console.log({
      oldPassword,
      newPassword,
    });
    setShowResetPassword(false);
    setOldPassword("");
    setNewPassword("");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
                  <button type="submit" className="btn btn-neutral">
                    Save Profile
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
              <img
                src={avatarURL}
                alt="Avatar"
                className="rounded-full w-32 h-32 mb-4"
              />
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
                <button
                  type="button"
                  onClick={handleUpload}
                  className="btn btn-neutral mt-2"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showResetPassword && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Reset Password</h3>
            <form onSubmit={handleResetPassword}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Old Password</span>
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
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
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn btn-neutral">
                  Reset Password
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowResetPassword(false)}
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