import React from "react"
import { Link } from "react-router-dom"
import { FaUserCircle } from "react-icons/fa"

const PostCard = ({ post }) => {
  const primaryColor = "#ff4d2d"
  const defaultImage = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800"

  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : ""

  return (
    <div className="bg-white rounded-xl shadow-xs overflow-hidden border border-gray-200 hover:shadow-md transition flex flex-col">
      {/* Cover Image */}
      <Link to={`/post/${post.slug || post._id}`}>
        <img
          src={post.image || defaultImage}
          alt={post.title}
          className="w-full h-48 object-cover hover:scale-102 transition duration-300"
          onError={(e) => {
            e.target.src = defaultImage
          }}
        />
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          <span
            className="text-xs font-semibold uppercase px-2 py-0.5 rounded-sm"
            style={{ backgroundColor: "#fff0eb", color: primaryColor }}
          >
            {post.category || "General"}
          </span>

          {/* Title */}
          <Link to={`/post/${post.slug || post._id}`}>
            <h3 className="text-lg font-bold text-gray-900 mt-2 line-clamp-2 hover:text-[#ff4d2d] transition">
              {post.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mt-2 line-clamp-3">
            {post.content}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <FaUserCircle className="text-gray-400 text-base" />
            <span className="font-medium text-gray-700">
              {post.author?.fullName || "Author"}
            </span>
          </div>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  )
}

export default PostCard
