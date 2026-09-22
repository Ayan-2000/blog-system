import React, { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { serverUrl } from "../App.jsx"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => localStorage.getItem("token") || "")

  const login = (userData, userToken) => {
    setUser(userData)
    setToken(userToken || "")
    localStorage.setItem("user", JSON.stringify(userData))
    if (userToken) {
      localStorage.setItem("token", userToken)
    }
  }

  const logout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
    } catch (err) {
      console.log("Sign out error:", err)
    } finally {
      setUser(null)
      setToken("")
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
