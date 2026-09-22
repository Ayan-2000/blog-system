import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ message: "User not authenticated" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey")
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" })
    }

    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    req.user = user
    next()
  } catch (err) {
    return res.status(500).json({ message: `auth error ${err}` })
  }
}

export default isAuth
