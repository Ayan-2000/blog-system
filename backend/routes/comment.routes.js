import express from "express"
import { addComment, getCommentsByPost, deleteComment } from "../controllers/comment.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const commentRouter = express.Router()

commentRouter.get("/post/:postId", getCommentsByPost)
commentRouter.post("/", isAuth, addComment)
commentRouter.delete("/:id", isAuth, deleteComment)

export default commentRouter
