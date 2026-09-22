import React, { useState } from "react"
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../../utils/firebase.js"
import { FcGoogle } from "react-icons/fc"

const SignUp = () => {
  const primaryColor = "#ff4d2d"
  const hoverColor = "#e64323"
  const bgColor = "#fff9f6"
  const borderColor = "#ddd"

  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState("user")
  const navigate = useNavigate()
  const { login } = useAuth()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mobile, setMobile] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      setError("Please fill all required fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, password, mobile, role },
        { withCredentials: true }
      )
      navigate("/signin")
    } catch (err) {
      setError(err?.response?.data?.message || "Sign up failed")
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
          role,
        },
        { withCredentials: true }
      )
      login(result.data.user, result.data.token)
      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Google sign up failed")
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
          Create your account to start writing and reading blog posts
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1 text-sm">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            placeholder="Enter Your Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

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
            Set Password
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

        {/* Mobile No */}
        <div className="mb-4">
          <label htmlFor="mobile" className="block text-gray-700 font-medium mb-1 text-sm">
            Mobile No.
          </label>
          <input
            id="mobile"
            type="text"
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
            placeholder="Enter Your Mobile No."
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-1 text-sm">
            Role
          </label>
          <div className="flex gap-2">
            {["user", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                className="flex-1 border rounded-lg px-3 py-2 text-center font-medium transition-colors cursor-pointer capitalize text-sm"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : { border: `1px solid ${borderColor}`, color: "#555" }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-center text-xs mb-3">{error}</p>}

        {/* Sign Up Button */}
        <button
          className="w-full font-semibold py-2.5 rounded-lg text-white transition duration-200 cursor-pointer text-sm"
          style={{ backgroundColor: primaryColor }}
          onClick={handleSignUp}
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-xs uppercase font-medium">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Google Sign Up Button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2.5 rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-50 transition duration-200 cursor-pointer"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <FcGoogle className="text-lg" />
          Continue with Google
        </button>

        {/* Link to Sign In */}
        <p
          className="text-center text-xs text-gray-600 mt-4 cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          Already have an account?{" "}
          <span style={{ color: primaryColor }} className="font-semibold">
            Sign In
          </span>
        </p>
      </div>
    </div>
  )
}

export default SignUp
