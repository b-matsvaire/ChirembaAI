import connectDB from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const users = await User.find({}, { password: 0 }); // Exclude passwords
      res.status(200).json({ users });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}