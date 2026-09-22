import jwt from "jsonwebtoken"

const genToken = async (userId) => {
  try {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || "mysecretkey", {
      expiresIn: "7d",
    })
    return token
  } catch (err) {
    console.log(err)
  }
}

export default genToken
