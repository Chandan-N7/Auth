import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URI)
        console.log("Database Connected")
    } catch (error) {
        console.log("error connecting database", error.message)
        process.exit(1)
    }
}