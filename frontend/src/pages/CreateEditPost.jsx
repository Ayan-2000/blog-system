import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import { useAuth } from "../context/AuthContext.jsx"
import { FaArrowLeft } from "react-icons/fa"

const categories = ["Technology", "Design", "Lifestyle", "Business", "Education"]

const CreateEditPost = () => {
  const primaryColor = "#ff4d2d"
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const isEdit = Boolean(id)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Technology")
  const [image, setImage] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/signin")
    }
  }, [user, navigate])

  // Load existing post if in edit mode
  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const res = await axios.get(`${serverUrl}/api/posts/${id}`)
          setTitle(res.data.title || "")
          setCategory(res.data.category || "Technology")
          setImage(res.data.image || "")
          setContent(res.data.content || "")
        } catch (err) {
          setError("Failed to load post for editing")
        }
      }
      fetchPost()
    }
  }, [id, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required")
      return
    }

    setLoading(true)
    setError("")

    try {
      if (isEdit) {
        await axios.put(
          `${serverUrl}/api/posts/${id}`,
          { title, category, image, content },
          { withCredentials: true }
        )
      } else {
        await axios.post(
          `${serverUrl}/api/posts`,
          { title, category, image, content },
          { withCredentials: true }
        )
      }

      navigate("/")
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save post")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-900 mb-6 cursor-pointer"
      >
        <FaArrowLeft /> Back to Home
      </button>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 shadow-xs">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isEdit ? "Edit Blog Post" : "Write a New Blog Post"}
        </h2>
        <p className="text-xs text-gray-500 mb-6">
          {isEdit
            ? "Update your article content and details below."
            : "Share your knowledge and ideas with the community."}
        </p>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-xs text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Getting Started with Modern JavaScript"
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Category
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-orange-500"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* Image Preview if provided */}
          {image && (
            <div className="rounded-lg overflow-hidden border border-gray-200 max-h-40">
              <img
                src={image}
                alt="Cover Preview"
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.style.display = "none"
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <div>
            <label className="block text-gray-700 font-medium mb-1 text-sm">
              Article Content *
            </label>
            <textarea
              rows="9"
              required
              placeholder="Write your article here..."
              className="w-full border border-gray-300 rounded-lg p-3.5 text-sm focus:outline-none focus:border-orange-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold py-2.5 rounded-lg text-white transition cursor-pointer text-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {loading ? "Saving Article..." : isEdit ? "Update Article" : "Publish Article"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateEditPost
