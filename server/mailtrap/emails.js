import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js"
import { transporter, sender } from "./mailer.js"

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const res = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        });
        console.log("Verification email sent successfully", res);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Error sending verification email");
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const res = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Welcome!",
            html: `<h1>Welcome, ${name}!</h1><p>We're excited to have you on board.</p>`
        });
        console.log("Welcome email sent successfully", res);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error("Error sending welcome email");
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const res = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        });
        console.log("Password reset email sent successfully", res);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Error sending password reset email");
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const res = await transporter.sendMail({
            from: `"${sender.name}" <${sender.email}>`,
            to: email,
            subject: "Password reset successfully",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        console.log("Reset success email sent successfully", res);
    } catch (error) {
        console.error("Error sending reset success email:", error);
        throw new Error("Error sending reset success email");
    }
};
