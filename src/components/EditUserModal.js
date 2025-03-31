import React, { useState } from "react";

const EditUserModal = ({ user, onClose, onUpdate }) => {
  // State for all user details
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email || "");
  const [sex, setSex] = useState(user.sex);
  const [age, setAge] = useState(user.age);
  const [roleType, setRoleType] = useState(user.roleType);
  const [isSuspended, setIsSuspended] = useState(user.isSuspended || false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, sex, age, roleType, isSuspended }),
    });
    const data = await response.json();
    if (response.ok) {
      onUpdate(data.user); // Notify parent component of the update
      onClose(); // Close the modal
    } else {
      setMessage(data.message || "Failed to update user");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            />
          </div>

          {/* Sex and Age */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                Sex
              </label>
              <select
                id="sex"
                value={sex}
                onChange={(e) => setSex(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Role Type */}
          <div>
            <label htmlFor="roleType" className="block text-sm font-medium text-gray-700">
              Role Type
            </label>
            <select
              id="roleType"
              value={roleType}
              onChange={(e) => setRoleType(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            >
              <option value="">Select Your Role</option>
              <option value="Admin">Admin</option>
              <option value="Physician">Physician (Includes Doctors & Specialists)</option>
              <option value="Nurse">Nurse</option>
              <option value="Therapist">Therapist (Includes Physical, Occupational, Speech, and Mental Health Therapists)</option>
              <option value="Medical Technician">Medical Technician (Lab, Radiology, Pharmacy, etc.)</option>
              <option value="Healthcare Assistant">Healthcare Assistant (General Support Roles)</option>
            </select>
          </div>

          {/* Suspension Status */}
          <div>
            <label htmlFor="isSuspended" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="flex items-center mt-1">
              <input
                type="checkbox"
                id="isSuspended"
                checked={isSuspended}
                onChange={(e) => setIsSuspended(e.target.checked)}
                className="mr-2"
              />
              <span>{isSuspended ? "Suspended" : "Active"}</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
        {message && <p className="text-sm text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default EditUserModal;