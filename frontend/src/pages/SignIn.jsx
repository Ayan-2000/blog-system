import React, { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../../utils/firebase.js"
import { FcGoogle } from "react-icons/fc"

const SignIn = () => {
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"
  const bgColor = "#fff9f6"
  const borderColor = "#ddd"

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      )
      login(result.data.user, result.data.token)
      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || "Sign in failed")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await signInWithPopup(auth, googleProvider)
      const result = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          fullName: response.user.displayName,
          email: response.user.email,
          profilePic: response.user.photoURL,
        },
        { withCredentials: true }
      )
      login(result.data.user, result.data.token)
      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Google sign in failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-[85vh] w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2 text-center" style={{ color: primaryColor }}>
          Blogify
        </h1>
        <p className="text-gray-600 mb-6 text-center text-sm">
          Welcome back! Sign in to access your blog dashboard
        </p>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1 text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-1 text-sm">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center text-xs mb-3">{error}</p>}

        {/* Sign In Button */}
        <button
          className="w-full font-semibold py-2.5 rounded-lg text-white transition duration-200 cursor-pointer text-sm"
          style={{ backgroundColor: primaryColor }}
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-xs uppercase font-medium">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition duration-200 cursor-pointer"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <FcGoogle className="text-lg" />
          Continue with Google
        </button>

        {/* Link to Sign Up */}
        <p
          className="text-center text-xs text-gray-600 mt-4 cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Don't have an account?{" "}
          <span style={{ color: primaryColor }} className="font-semibold">
            Sign Up
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignIn
