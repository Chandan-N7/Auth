import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized -No Token Provided" })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECERET)
        if (!decoded ) {
            return res.status(401).json({ message: "Unauthorized -Invalid Token" })
        }
        const user = await User.findById(decoded.userId).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        req.user = user
        next();
    } catch (error) {

    }
}