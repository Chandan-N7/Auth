import bcryptjs from "bcryptjs"
import crypto from "crypto";

import User from "../models/user.model.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from './../utils/generateTokenAndSetCookie.js';
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";


export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      if (!email || !password || !name) {
        return res.status(404).json({ message: "Please fill in all fields" });
      }
  
      const existingUser = await User.findOne({ email });
  
      // If verified user exists
      if (existingUser && existingUser.isVerified) {
        return res.status(400).json({ success: false, message: "User already exists" });
      }
  
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      const verificationToken = generateVerificationCode();
  
      let user;
  
      if (existingUser && !existingUser.isVerified) {
        // Update the existing unverified user
        existingUser.name = name;
        existingUser.password = hashedPassword;
        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;
  
        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
          verificationToken,
          verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
  
        await newUser.save();
        user = newUser;
      }
  
      // Set JWT cookie
      generateTokenAndSetCookie(res, user._id);
  
      // Send verification email
      await sendVerificationEmail(user.email, verificationToken);
  
      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user._doc;
  
      res.status(201).json({
        success: true,
        message: "User created or updated successfully",
        newUser: userWithoutPassword,
      });
  
    } catch (error) {
      console.error("Signup error:", error.message);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email });
        if (!user || !user?.isVerified) {
            return res.status(404).json({ success: false, message: "Invalid credentials" })
        }
        const isPasswordValid = await bcryptjs.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(404).json({ success: false, message: "Invalid credentials" })
        }
        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json({ success: true, message: "Login Successful", user: userWithoutPassword })

    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", { maxAge: 0 })
        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log("Error In Logout Controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired  verification code" })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined
        await user.save();
        await sendWelcomeEmail(user.email, user.name)
        const { password: _, ...userWithoutPassword } = user._doc;
        res.status(200).json({ success: true, message: "Email verified successfully", user: userWithoutPassword })
    } catch (error) {
        console.error("Verify email error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user || !user?.isVerified) {
            return res.status(500).json({ success: false, message: "User not found" });
        }
        // Generate Token
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send Email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`)

        res.status(200).json({ success: true, message: "Password reset link sent to your email" })

    } catch (error) {
        console.error("forgot password error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const ResetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid and expired reset token" });
        }
        // update password
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt)

        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined

        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset Successful", })
    } catch (error) {
        console.error("reset password error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const checkAuth = async (req, res) => {

    try {
        console.log("first")
        res.status(200).json(req.user);
    }
    catch (error) {
        console.log("Error in checkAuth controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}