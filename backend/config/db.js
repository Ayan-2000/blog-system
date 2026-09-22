import mongoose from "mongoose"

const connectdb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mern_blog"
    await mongoose.connect(mongoUri)
    console.log("Connected to MongoDB")
  } catch (err) {
    console.log("MongoDB connection error:", err)
  }
}

export default connectdb
