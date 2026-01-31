require("dotenv").config();
const sendEmail = require("./utils/sendEmail");

const test = async () => {
    console.log("Attempting to send test email...");
    console.log(`Host: ${process.env.SMTP_HOST}`);
    console.log(`User: ${process.env.SMTP_EMAIL}`);
    
    try {
        await sendEmail({
            email: process.env.SMTP_EMAIL, // Send to self
            subject: "SMTP Test - Success",
            message: "<h1>It Works!</h1><p>Your SMTP credentials are correct.</p>"
        });
        console.log("✅ Email sent successfully!");
    } catch (error) {
        console.error("❌ Failed to send email:");
        console.error(error);
    }
};

test();
