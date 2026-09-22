import React, { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "../context/AuthContext.jsx"
import { serverUrl } from "../App.jsx"
import { FaTrash, FaUserCircle } from "react-icons/fa"
import { Link } from "react-router-dom"

const CommentSection = ({ postId }) => {
  const primaryColor = "#ff4d2d"
  const { user } = useAuth()

  const [comments, setComments] = useState([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/comments/post/${postId}`)
      setComments(res.data)
    } catch (err) {
      console.log("Error fetching comments:", err)
    }
  }

  useEffect(() => {
    if (postId) {
      fetchComments()
    }
  }, [postId])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    setError("")

    try {
      await axios.post(
        `${serverUrl}/api/comments`,
        { content, postId },
        { withCredentials: true }
      )
      setContent("")
      fetchComments()
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to post comment")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

    try {
      await axios.delete(`${serverUrl}/api/comments/${commentId}`, {
        withCredentials: true,
      })
      fetchComments()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete comment")
    }
  }

  return (
    <div className="mt-10 pt-8 border-t border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        Comments ({comments.length})
      </h3>

      {/* Add Comment Form */}
      {user ? (
        <form onSubmit={handleAddComment} className="mb-8">
          <textarea
            rows="3"
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-orange-500 bg-white"
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="text-white text-xs font-semibold px-4 py-2 rounded-lg cursor-pointer transition disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8 text-center text-sm text-gray-700">
          Want to join the discussion?{" "}
          <Link to="/signin" className="font-semibold underline" style={{ color: primaryColor }}>
            Sign In
          </Link>{" "}
          to write a comment.
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-white border border-gray-100 rounded-lg p-4 shadow-2xs flex justify-between items-start gap-4"
            >
              <div className="flex gap-3">
                <FaUserCircle className="text-gray-400 text-2xl shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {c.author?.fullName || "Anonymous"}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">
                    {c.content}
                  </p>
                </div>
              </div>

              {/* Delete Button (if author or admin) */}
              {(user?._id === c.author?._id || user?.role === "admin") && (
                <button
                  onClick={() => handleDeleteComment(c._id)}
                  title="Delete comment"
                  className="text-gray-400 hover:text-red-500 p-1 cursor-pointer transition"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default CommentSection
