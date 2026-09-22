import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "Technology",
  },
  image: {
    type: String,
    default: "",
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true })

const Post = mongoose.models.Post || mongoose.model("Post", postSchema)
export default Post
