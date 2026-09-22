import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import CommentSection from "../components/CommentSection.jsx"
import { FaUserCircle, FaArrowLeft, FaEdit, FaTrash } from "react-icons/fa"

const PostDetail = () => {
  const primaryColor = "#ff4d2d"
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${serverUrl}/api/posts/${slug}`)
        setPost(res.data)
      } catch (err) {
        setError("Article not found or has been removed.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return

    try {
      await axios.delete(`${serverUrl}/api/posts/${post._id}`, {
        withCredentials: true,
      })
      navigate("/")
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete post")
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500 font-medium">
        Loading article...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-xl border border-gray-200 text-center shadow-xs">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Post Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">{error || "Could not find article."}</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-lg text-white text-xs font-semibold"
          style={{ backgroundColor: primaryColor }}
        >
          Back to Home
        </Link>
      </div>
    )
  }

  const isAuthor = user?._id === post.author?._id
  const isAdmin = user?.role === "admin"
  const canModify = isAuthor || isAdmin

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Top back navigation */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <FaArrowLeft /> Back to all posts
      </button>

      {/* Article Header */}
      <div className="mb-6">
        <span
          className="text-xs font-semibold uppercase px-2.5 py-1 rounded-sm inline-block mb-3"
          style={{ backgroundColor: "#fff0eb", color: primaryColor }}
        >
          {post.category || "General"}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* Author & Date & Edit/Delete actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2.5">
            <FaUserCircle className="text-gray-400 text-3xl" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post.author?.fullName || "Author"}
              </p>
              <p className="text-xs text-gray-500">
                Published on {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Edit / Delete Buttons */}
          {canModify && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/edit-post/${post._id}`)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-100 transition cursor-pointer"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-600 hover:bg-red-100 transition cursor-pointer"
              >
                <FaTrash /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cover Image */}
      {post.image && (
        <div className="rounded-xl overflow-hidden mb-8 border border-gray-200 shadow-2xs">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-96 object-cover"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
        </div>
      )}

      {/* Article Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <div className="prose prose-slate max-w-none text-gray-800 text-base leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Comment Section Component */}
      <CommentSection postId={post._id} />
    </div>
  )
}

export default PostDetail
