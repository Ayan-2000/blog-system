import User from "../models/user.model.js"
import Post from "../models/post.model.js"
import Comment from "../models/comment.model.js"

export const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const users = await User.find().select("-password").sort({ createdAt: -1 })
    return res.status(200).json(users)
  } catch (err) {
    return res.status(500).json(`get users error ${err}`)
  }
}

export const updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const { id } = req.params
    const { role } = req.body

    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(`update role error ${err}`)
  }
}

export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const { id } = req.params
    await User.findByIdAndDelete(id)
    return res.status(200).json({ message: "User deleted successfully" })
  } catch (err) {
    return res.status(500).json(`delete user error ${err}`)
  }
}

export const getDashboardStats = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" })
    }

    const totalUsers = await User.countDocuments()
    const livePosts = await Post.countDocuments({ isDeleted: false })
    const deletedPosts = await Post.countDocuments({ isDeleted: true })
    const totalComments = await Comment.countDocuments()

    return res.status(200).json({
      totalUsers,
      livePosts,
      deletedPosts,
      totalComments,
    })
  } catch (err) {
    return res.status(500).json(`get stats error ${err}`)
  }
}
