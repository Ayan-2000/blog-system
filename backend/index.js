import dotenv from "dotenv"
dotenv.config()

import express from "express"
import connectdb from "./config/db.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/auth.routes.js"
import postRouter from "./routes/post.routes.js"
import commentRouter from "./routes/comment.routes.js"
import userRouter from "./routes/user.routes.js"

const app = express()
const PORT = process.env.PORT || 6004

// Connect to MongoDB
connectdb()

// Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Blog API running on port " + PORT })
})

// Route Handlers
app.use("/api/auth", authRouter)
app.use("/api/posts", postRouter)
app.use("/api/comments", commentRouter)
app.use("/api/user", userRouter)
app.use("/api/users", userRouter)

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

export default app
