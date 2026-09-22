import React, { useState, useEffect } from "react"
import axios from "axios"
import { serverUrl } from "../App.jsx"
import PostCard from "../components/PostCard.jsx"
import { FaSearch } from "react-icons/fa"

const categories = ["All", "Technology", "Design", "Lifestyle", "Business"]

const Home = () => {
  const primaryColor = "#ff4d2d"

  const [posts, setPosts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let url = `${serverUrl}/api/posts?`
      if (selectedCategory !== "All") url += `category=${selectedCategory}&`
      if (searchTerm.trim()) url += `search=${encodeURIComponent(searchTerm.trim())}`

      const res = await axios.get(url)
      setPosts(res.data)
    } catch (err) {
      console.log("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchPosts()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
          Discover Articles & Stories
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-base text-gray-600">
          A modern full-stack MERN blog platform with user authentication, role management, and discussions.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-6 max-w-lg mx-auto flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search posts by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-orange-500 shadow-2xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-sm" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg text-white text-sm font-semibold cursor-pointer transition"
            style={{ backgroundColor: primaryColor }}
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
              selectedCategory === cat
                ? "text-white shadow-xs"
                : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
            }`}
            style={selectedCategory === cat ? { backgroundColor: primaryColor } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">Loading posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 max-w-md mx-auto p-8">
          <h3 className="text-lg font-bold text-gray-700">No Posts Found</h3>
          <p className="text-gray-500 text-xs mt-1">
            Try adjusting your search query or selected category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
