import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.user);
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
    fetch("/api/logout", { method: "POST" })
      .then((response) => {
        if (response.ok) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUser(null);
          window.location.href = "/";
        }
      })
      .catch((err) => console.error("Logout failed:", err));
  };

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-white/5 backdrop-blur-md border-b border-white/10">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
            ChirembaAI
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          <Link
            href="/"
            className="text-white/90 hover:text-accent-400 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-white/90 hover:text-accent-400 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-white/90 hover:text-accent-400 transition-colors duration-200"
          >
            Contact
          </Link>
          {isLoggedIn && (
            <>
              <Link
                href="/modelgarden"
                className="text-white/90 hover:text-accent-400 transition-colors duration-200"
              >
                SpecialistDoctors
              </Link>
              <Link
                href="/dashboard"
                className="text-white/90 hover:text-accent-400 transition-colors duration-200"
              >
                Dashboard
              </Link>
            </>
          )}
        </div>

        {/* Profile or Sign Up */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 hover:bg-primary-500/20 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.username?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="text-white/90">{user?.username}</span>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-white/90 hover:bg-primary-500/20 rounded-lg transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="px-6 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-full hover:opacity-90 transition-opacity duration-200 font-medium">
                Login
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-10 h-10 text-white/90 hover:bg-white/10 rounded-lg transition-colors duration-200"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}