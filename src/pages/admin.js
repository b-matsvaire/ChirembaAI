import SignupForm from "@/components/Auth/SignupForm";
import EditUserModal from "@/components/EditUserModal";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/navbar";

export default function Admin() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const role = Cookies.get("role");

      if (role === "Admin") {
        setIsAdmin(true);
      } else {
        // router.push("/");
        setIsAdmin(true);
      }

      setIsCheckingRole(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspendUser = async (userId, currentStatus) => {
    try {
      const response = await fetch(`/api/users/${userId}/suspend`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isSuspended: !currentStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        setError('Failed to update user status');
      }
    } catch (err) {
      setError('An error occurred while updating user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        setError('Failed to delete user');
      }
    } catch (err) {
      setError('An error occurred while deleting user');
    }
  };

  const handleUpdateUser = async () => {
    fetchUsers();
    setSelectedUser(null);
  };

  if (isCheckingRole) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>

          <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4">
                {error}
              </div>
            ) : (
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center border-b border-white/10 p-4 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-white font-medium">{user.username}</p>
                      <Badge className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded-full">
                        {user.roleType}
                      </Badge>
                      <Badge
                        className={`${
                          user.isSuspended
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        } px-2 py-1 rounded-full ml-2`}
                      >
                        {user.isSuspended ? "Suspended" : "Active"}
                      </Badge>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Button
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleSuspendUser(user._id, user.isSuspended)}
                        className={`px-4 py-2 ${
                          user.isSuspended
                            ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        } rounded-xl transition-colors`}
                      >
                        {user.isSuspended ? "Activate" : "Suspend"}
                      </Button>
                      <Button
                        onClick={() => handleDeleteUser(user._id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="flex flex-col space-y-4">
            <Button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white rounded-xl font-medium transition-all duration-200"
            >
              {showAddUser ? "Hide Add User Form" : "Add New User"}
            </Button>

            {showAddUser && (
              <Card className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-8">
                <h2 className="text-2xl font-semibold text-white mb-6">Add New User</h2>
                <SignupForm fetchUsers={fetchUsers} />
              </Card>
            )}
          </div>
        </div>
      </main>

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
}
