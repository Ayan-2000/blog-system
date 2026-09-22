import React from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext.jsx"
import { FaUserCircle } from "react-icons/fa"

const Nav = () => {
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"

  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/signin")
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight" style={{ color: primaryColor }}>
              Blogify
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm transition"
            >
              Home
            </Link>

            {user && (
              <Link
                to="/create-post"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition"
              >
                Create Post
              </Link>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-gray-900 font-medium text-sm transition"
              >
                Admin Panel
              </Link>
            )}
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FaUserCircle className="text-gray-400 text-2xl" />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-gray-800">{user.fullName || user.email}</p>
                    <span
                      className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm"
                      style={{
                        backgroundColor: user.role === "admin" ? "#ffe4de" : "#e5edff",
                        color: user.role === "admin" ? primaryColor : "#2563eb",
                      }}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer text-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/signin")}
                  className="text-xs font-medium px-3.5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition cursor-pointer text-gray-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="text-xs font-semibold px-3.5 py-2 rounded-lg text-white transition cursor-pointer"
                  style={{ backgroundColor: primaryColor }}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
