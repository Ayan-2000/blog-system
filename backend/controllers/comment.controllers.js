import Comment from "../models/comment.model.js"

export const addComment = async (req, res) => {
  try {
    const { content, postId } = req.body

    if (!content || !postId) {
      return res.status(400).json({ message: "Content and postId are required" })
    }

    const comment = await Comment.create({
      content,
      postId,
      author: req.user._id,
    })

    const populated = await Comment.findById(comment._id).populate("author", "fullName email profilePic role")
    return res.status(201).json(populated)
  } catch (err) {
    return res.status(500).json(`add comment error ${err}`)
  }
}

export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params
    const comments = await Comment.find({ postId })
      .populate("author", "fullName email profilePic role")
      .sort({ createdAt: -1 })

    return res.status(200).json(comments)
  } catch (err) {
    return res.status(500).json(`get comments error ${err}`)
  }
}

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params
    const comment = await Comment.findById(id)

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" })
    }

    // Check if author or admin
    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this comment" })
    }

    await Comment.findByIdAndDelete(id)
    return res.status(200).json({ message: "Comment deleted successfully" })
  } catch (err) {
    return res.status(500).json(`delete comment error ${err}`)
  }
}
