import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { FaUsers, FaFileAlt, FaComments, FaTrash, FaUndo, FaShieldAlt } from "react-icons/fa"

const AdminPanel = () => {
  const primaryColor = "#ff4d2d"
  const { user } = useAuth()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("users") // 'users' or 'posts'
  const [stats, setStats] = useState({
    totalUsers: 0,
    livePosts: 0,
    deletedPosts: 0,
    totalComments: 0,
  })
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Redirect non-admins
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/")
    }
  }, [user, navigate])

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user/stats`, { withCredentials: true })
      setStats(res.data)
    } catch (err) {
      console.log("Error loading admin stats:", err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/user`, { withCredentials: true })
      setUsers(res.data)
    } catch (err) {
      console.log("Error loading users:", err)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/posts?all=true`, { withCredentials: true })
      setPosts(res.data)
    } catch (err) {
      console.log("Error loading posts:", err)
    }
  }

  useEffect(() => {
    if (user?.role === "admin") {
      setLoading(true)
      Promise.all([fetchStats(), fetchUsers(), fetchPosts()]).finally(() => {
        setLoading(false)
      })
    }
  }, [user])

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    try {
      await axios.patch(
        `${serverUrl}/api/user/${userId}/role`,
        { role: newRole },
        { withCredentials: true }
      )
      fetchUsers()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update user role")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return
    try {
      await axios.delete(`${serverUrl}/api/user/${userId}`, { withCredentials: true })
      fetchUsers()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete user")
    }
  }

  const handleSoftDeletePost = async (postId) => {
    try {
      await axios.delete(`${serverUrl}/api/posts/${postId}`, { withCredentials: true })
      fetchPosts()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete post")
    }
  }

  const handleRestorePost = async (postId) => {
    try {
      await axios.patch(`${serverUrl}/api/posts/${postId}/restore`, {}, { withCredentials: true })
      fetchPosts()
      fetchStats()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to restore post")
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500 font-medium">
        Loading Admin Dashboard...
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
          <FaShieldAlt style={{ color: primaryColor }} /> Admin Management Dashboard
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manage system users, moderate live and deleted posts, and monitor metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Users</span>
            <FaUsers className="text-blue-500 text-lg" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Live Posts</span>
            <FaFileAlt className="text-emerald-500 text-lg" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.livePosts}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Deleted Posts</span>
            <FaTrash className="text-rose-500 text-lg" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.deletedPosts}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase">Comments</span>
            <FaComments className="text-amber-500 text-lg" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalComments}</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 transition ${activeTab === "users"
            ? "border-[#ff4d2d] text-[#ff4d2d]"
            : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
        >
          Users ({users.length})
        </button>
        <button
          onClick={() => setActiveTab("posts")}
          className={`pb-3 text-sm font-semibold cursor-pointer border-b-2 transition ${activeTab === "posts"
            ? "border-[#ff4d2d] text-[#ff4d2d]"
            : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
        >
          All Posts ({posts.length})
        </button>
      </div>

      {/* Users Table */}
      {activeTab === "users" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Name</th>
                <th className="px-5 py-3.5">Email</th>
                <th className="px-5 py-3.5">Mobile</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-900">{u.fullName}</td>
                  <td className="px-5 py-4">{u.email}</td>
                  <td className="px-5 py-4">{u.mobile || "N/A"}</td>
                  <td className="px-5 py-4">
                    <span
                      className="px-2 py-0.5 rounded-sm font-bold uppercase text-[10px]"
                      style={{
                        backgroundColor: u.role === "admin" ? "#ffe4de" : "#e5edff",
                        color: u.role === "admin" ? primaryColor : "#2563eb",
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleToggleRole(u._id, u.role)}
                      className="px-2.5 py-1 rounded-sm border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer transition text-xs font-medium"
                    >
                      {u.role === "admin" ? "Make User" : "Make Admin"}
                    </button>
                    {u._id !== user._id && (
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="px-2.5 py-1 rounded-sm bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 cursor-pointer transition text-xs font-medium"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Posts Moderation Table */}
      {activeTab === "posts" && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto shadow-2xs">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Author</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-900 max-w-xs truncate">
                    {p.title}
                  </td>
                  <td className="px-5 py-4">{p.category}</td>
                  <td className="px-5 py-4">{p.author?.fullName || "Author"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`px-2 py-0.5 rounded-sm font-bold uppercase text-[10px] ${p.isDeleted
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                        }`}
                    >
                      {p.isDeleted ? "Deleted" : "Live"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {p.isDeleted ? (
                      <button
                        onClick={() => handleRestorePost(p._id)}
                        className="flex items-center gap-1 ml-auto px-2.5 py-1 rounded-sm bg-emerald-50 border border-emerald-300 text-emerald-700 hover:bg-emerald-100 cursor-pointer transition text-xs font-medium"
                      >
                        <FaUndo className="text-[10px]" /> Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSoftDeletePost(p._id)}
                        className="flex items-center gap-1 ml-auto px-2.5 py-1 rounded-sm bg-rose-50 border border-rose-300 text-rose-700 hover:bg-rose-100 cursor-pointer transition text-xs font-medium"
                      >
                        <FaTrash className="text-[10px]" /> Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
