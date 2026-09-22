import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../utils/token.js"

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body

    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User Already exist" })
    }

    if (password && password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 character" })
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : ""

    user = await User.create({
      fullName,
      email,
      role: role || "user",
      mobile: mobile || "",
      password: hashedPassword,
    })

    const token = await genToken(user._id)
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    const userObj = user.toObject ? user.toObject() : { ...user }
    delete userObj.password

    return res.status(201).json({ user: userObj, token })
  } catch (err) {
    return res.status(500).json(`sign up error ${err}`)
  }
}

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body

    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "User Not Exist" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect Password" })
    }

    const token = await genToken(user._id)
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    const userObj = user.toObject ? user.toObject() : { ...user }
    delete userObj.password

    return res.status(200).json({ user: userObj, token })
  } catch (err) {
    return res.status(500).json(`sign in error ${err}`)
  }
}

export const signOut = async (req, res) => {
  try {
    res.clearCookie("token")
    return res.status(200).json({ message: "Logged out successfully" })
  } catch (err) {
    return res.status(500).json(`sign out error ${err}`)
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(`get me error ${err}`)
  }
}

export const googleAuth = async (req, res) => {
  try {
    const { fullName, email, profilePic, role } = req.body

    let user = await User.findOne({ email })

    if (!user) {
      user = await User.create({
        fullName: fullName || email.split("@")[0],
        email,
        profilePic: profilePic || "",
        role: role || "user",
      })
    }

    const token = await genToken(user._id)
    res.cookie("token", token, {
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    })

    const userObj = user.toObject ? user.toObject() : { ...user }
    delete userObj.password

    return res.status(200).json({ user: userObj, token })
  } catch (err) {
    return res.status(500).json(`google auth error ${err}`)
  }
}

