import Post from "../models/post.model.js"

// Helper to create url slug
const makeSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const createPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required" })
    }

    let slug = makeSlug(title)
    const existing = await Post.findOne({ slug })
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const post = await Post.create({
      title,
      content,
      category: category || "Technology",
      image: image || "",
      slug,
      author: req.user._id,
    })

    const populated = await Post.findById(post._id).populate("author", "fullName email profilePic role")
    return res.status(201).json(populated)
  } catch (err) {
    return res.status(500).json(`create post error ${err}`)
  }
}

export const getPosts = async (req, res) => {
  try {
    const { category, search, all } = req.query
    let query = {}

    // Only show non-deleted posts unless admin requests all
    if (!all || req.user?.role !== "admin") {
      query.isDeleted = false
    }

    if (category && category !== "All") {
      query.category = category
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ]
    }

    const posts = await Post.find(query)
      .populate("author", "fullName email profilePic role")
      .sort({ createdAt: -1 })

    return res.status(200).json(posts)
  } catch (err) {
    return res.status(500).json(`get posts error ${err}`)
  }
}

export const getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params
    let post = await Post.findOne({ slug }).populate("author", "fullName email profilePic role")

    // If not found by slug and slug looks like a MongoDB ObjectId, try finding by ID
    if (!post && slug.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(slug).populate("author", "fullName email profilePic role")
    }

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    return res.status(200).json(post)
  } catch (err) {
    return res.status(500).json(`get post error ${err}`)
  }
}

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params
    const { title, content, category, image } = req.body

    const post = await Post.findById(id)
    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this post" })
    }

    if (title) post.title = title
    if (content) post.content = content
    if (category) post.category = category
    if (image !== undefined) post.image = image

    await post.save()
    const updated = await Post.findById(id).populate("author", "fullName email profilePic role")
    return res.status(200).json(updated)
  } catch (err) {
    return res.status(500).json(`update post error ${err}`)
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    // Check if author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this post" })
    }

    // Soft delete
    post.isDeleted = true
    await post.save()

    return res.status(200).json({ message: "Post deleted successfully", post })
  } catch (err) {
    return res.status(500).json(`delete post error ${err}`)
  }
}

export const restorePost = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can restore posts" })
    }

    const { id } = req.params
    const post = await Post.findById(id)

    if (!post) {
      return res.status(404).json({ message: "Post not found" })
    }

    post.isDeleted = false
    await post.save()

    return res.status(200).json({ message: "Post restored successfully", post })
  } catch (err) {
    return res.status(500).json(`restore post error ${err}`)
  }
}
