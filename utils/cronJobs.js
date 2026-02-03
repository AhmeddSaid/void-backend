const cron = require("node-cron");
const Cart = require("../models/cartModel");
const Settings = require("../models/settingsModel");
const sendEmail = require("../utils/sendEmail");
const { generateAbandonedCartEmail } = require("../utils/emailTemplates");

// Configure Web Push (Removed)

const initCronJobs = () => {
  console.log("Creating Cron Jobs...");

  // Run every 15 minutes to check for abandoned carts
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Abandoned Cart Check...");
    try {
      // 1. Get Settings
      const settings = await Settings.getSettings();
      const { emailEnabled, pushEnabled, delayMinutes } = settings.marketing.abandonedCart;

      if (!emailEnabled && !pushEnabled) return;

      // Calculate time threshold (e.g., Updated more than 60 mins ago)
      // TESTING: Override delayMinutes to 0.1 (6 seconds) to test immediately
      const timeThreshold = new Date(Date.now() - 0.1 * 60 * 1000); 

      console.log(`Cron: Time Threshold is ${timeThreshold.toISOString()}`);

      // 2. Find Candidate Carts
      // Criteria: Updated < threshold AND (Not Emailed OR Not Pushed)
      const abandonedCarts = await Cart.find({
        updatedAt: { $lt: timeThreshold },
        $or: [
            { isAbandonedEmailSent: false }
        ]
      }).populate("user", "email name");

      console.log(`Found ${abandonedCarts.length} potential abandoned carts.`);

      for (const cart of abandonedCarts) {
        console.log(`Processing Cart ${cart._id}.`);
        // --- EMAIL LOGIC ---
        if (emailEnabled && !cart.isAbandonedEmailSent) {
           const recipientEmail = cart.guestEmail || (cart.user ? cart.user.email : null);

           if (recipientEmail && cart.cartItems.length > 0) {
              try {
                const emailHtml = generateAbandonedCartEmail(cart, process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
                
                await sendEmail({
                    email: recipientEmail,
                    subject: "You left something in the VOID...",
                    message: emailHtml
                });

                cart.isAbandonedEmailSent = true;
                console.log(`Abandoned Email sent to ${recipientEmail}`);
              } catch (err) {
                console.error(`Failed to send abandoned email to ${recipientEmail}`, err);
              }
           }
        }

        await cart.save();
      }

    } catch (error) {
      console.error("Cron Job Error:", error);
    }
  });
};

module.exports = initCronJobs;
