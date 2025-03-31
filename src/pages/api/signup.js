// Filepath: src/pages/api/signup.js
import connectDB from "@/utils/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  await connectDB();

  // Destructure the request body
  const { username, email, password, sex, age, roleType } = req.body;

  // Log the request payload for debugging
  console.log("Request Payload:", { username, email, password, sex, age, roleType });

  try {
    // Check if the username or email already exists
    let user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ success: false, message: "Username or email already exists" });
    }

    // Create a new user
    user = new User({
      username,
      email,
      password: await bcrypt.hash(password, 10),
      sex,
      age,
      roleType,
    });

    // Save the user to the database
    await user.save();
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    // Log the full error for debugging
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}