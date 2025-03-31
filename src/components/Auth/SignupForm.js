// Filepath: src/components/Auth/SignupForm.js
import React, { useState } from "react";

const SignupForm = ({ fetchUsers }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [roleType, setRoleType] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!username || !email || !password || !sex || !age || !roleType) {
      setMessage("Please fill in all fields");
      return;
    }

    // Send the request to the backend
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, sex, age, roleType }),
    });

    const data = await response.json();
    setMessage(data.message);

    if (data.success) {
      // Reset form fields
      setUsername("");
      setEmail("");
      setPassword("");
      setSex("");
      setAge("");
      setRoleType("");
      fetchUsers(); // Refresh the user list
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Add New User</h2>
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
            placeholder="Enter username"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
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
            placeholder="Enter email"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
            required
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
              required
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
              placeholder="Enter age"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              required
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
            required
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

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Add User
        </button>
      </form>

      {/* Display error or success message */}
      {message && <p className="text-sm text-center text-red-500">{message}</p>}
    </div>
  );
};

export default SignupForm;