import connectDB from "@/utils/db";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB();

  const { userId } = req.query;

  if (req.method === "PUT") {
    try {
      const { username, email, sex, age, roleType, isSuspended } = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { username, email, sex, age, roleType, isSuspended },
        { new: true }
      );
      res.status(200).json({ user: updatedUser });
    } catch (err) {
      res.status(500).json({ message: "Failed to update user" });
    }
  } else if (req.method === "DELETE") {
    try {
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}