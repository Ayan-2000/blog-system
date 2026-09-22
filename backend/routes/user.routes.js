import express from "express"
import { getAllUsers, updateUserRole, deleteUser, getDashboardStats } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const userRouter = express.Router()

userRouter.get("/stats", isAuth, getDashboardStats)
userRouter.get("/", isAuth, getAllUsers)
userRouter.patch("/:id/role", isAuth, updateUserRole)
userRouter.delete("/:id", isAuth, deleteUser)

export default userRouter
