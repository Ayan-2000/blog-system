import express from "express"
import {
  createPost,
  getPosts,
  getPostBySlug,
  updatePost,
  deletePost,
  restorePost,
} from "../controllers/post.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const postRouter = express.Router()

postRouter.get("/", getPosts)
postRouter.get("/:slug", getPostBySlug)
postRouter.post("/", isAuth, createPost)
postRouter.put("/:id", isAuth, updatePost)
postRouter.delete("/:id", isAuth, deletePost)
postRouter.patch("/:id/restore", isAuth, restorePost)

export default postRouter
