const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false, // Changed from true to false for Guest support
      ref: "User",
    },
    guestId: { type: String }, // For tracking anonymous sessions
    guestEmail: { type: String }, // Captured during checkout
    pushSubscription: { type: Object }, // Store Web Push subscription JSON
    
    // Notification Flags
    isAbandonedEmailSent: { type: Boolean, default: false },
    isAbandonedPushSent: { type: Boolean, default: false },
    cartItems: [
      {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        color: { type: String, required: true },
        size: { type: String, required: true },
        slug: { type: String, required: true }
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
