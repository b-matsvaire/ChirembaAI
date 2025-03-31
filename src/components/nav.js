import Link from "next/link";
import { useState, useEffect } from "react";

export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to manage profile dropdown
  const [user, setUser] = useState(null); // Store user information

  useEffect(() => {
    // Fetch user session on component mount
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user); // Assuming API sends the user's data
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user session:", err);
        setIsLoggedIn(false);
      });
  }, []);

  const handleLogout = () => {
    // Logout API call
    fetch("/api/logout", { method: "POST" })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token"); // Clear local storage token (if used)
          setIsLoggedIn(false);
          setUser(null);
          window.location.href = "/"; // Redirect to the home page
        }
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-slate-300">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center space-x-3 rtl:space-x-reverse"
      >
        <img
          src="/logo.jpeg" // Place your logo in the `public` folder of your Next.js project
          alt="Logo"
          className="h-10 rounded-full w-35"
        />
      </Link>

      {/* Profile or Sign Up */}
      <div className="flex items-center space-x-4 rtl:space-x-reverse">
        {isLoggedIn ? (
          // Show user profile icon with dropdown
          <div className="relative">
            <img
              src="/user.png" // Place your user profile icon in the `public` folder
              alt="User"
              className="h-10 w-10 rounded-full cursor-pointer"
              onClick={() => setIsDropdownOpen((prev) => !prev)} // Toggle dropdown visibility
            />
            {isDropdownOpen && (
              <div className="absolute z-50 right-0 mt-2 w-48 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg shadow-lg">
                <div className="px-4 py-2 text-slate-300">
                  <strong>{user?.username}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // Show Sign Up and Login buttons
          <div className="flex space-x-4">
            <a href="/signup">
              <button
                type="button"
                className="text-lg text-slate-300 bg-gradient-to-r from-blue-500 to-emerald-500 hover:opacity-90 focus:outline-none font-bold rounded-full px-6 py-2"
              >
                Sign Up
              </button>
            </a>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          data-collapse-toggle="navbar-sticky"
          type="button"
          className="inline-flex items-center p-3 w-12 h-12 justify-center text-slate-300 rounded-lg md:hidden hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
          aria-controls="navbar-sticky"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}