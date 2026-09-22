import express from "express"
import { signIn, signOut, signUp, getMe, googleAuth } from "../controllers/auth.controllers.js"
import isAuth from "../middlewares/isAuth.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signin", signIn)
authRouter.post("/google", googleAuth)
authRouter.get("/signout", signOut)
authRouter.get("/me", isAuth, getMe)

export default authRouter
