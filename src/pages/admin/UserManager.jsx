import React, { useEffect, useState } from "react";
import { getUsers, toggleUserStatus } from "../../services/userService";
import { notification } from "antd"; // Import the notification component from Ant Design

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

const toggleUserStatusHandler = async (userId, currentStatus) => {
  const newStatus = !currentStatus; // Toggle the current status
  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === userId ? { ...user, active: newStatus } : user
    )
  );

  try {
    // Call toggleUserStatus and expect a boolean response
    await toggleUserStatus(userId, newStatus);

    // Show success notification
    notification.success({
      message: "Success",
      description: `User status updated to ${
        newStatus ? "Active" : "Blocked"
      }.`,
    });
  } catch (error) {
    console.error("Error updating user status:", error);

    // Revert the status back to the original in case of error
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, active: currentStatus } : user
      )
    );

    // Show error notification
    notification.error({
      message: "Error",
      description: "Failed to update user status. Please try again.",
    });
  }
};



  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 text-left">Avatar</th>
            <th className="py-2 px-4 text-left">Full Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Username</th>
            <th className="py-2 px-4 text-left">Phone Number</th>
            <th className="py-2 px-4 text-left">Role</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-2 px-4">
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full"
                />
              </td>
              <td className="py-2 px-4">{user.fullname}</td>
              <td className="py-2 px-4">{user.email}</td>
              <td className="py-2 px-4">{user.userName}</td>
              <td className="py-2 px-4">{user.phoneNumber}</td>
              <td className="py-2 px-4">{user.roles}</td>
              <td className="py-2 px-4 text-center">
                <button
                  className={`${
                    user.active ? "text-green-500" : "text-red-500"
                  }`}
                  onClick={() => toggleUserStatusHandler(user.id, user.active)}
                >
                  {user.active ? "Active" : "Blocked"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
