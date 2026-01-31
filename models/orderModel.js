const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    // If the user is logged in (optional)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        // Important for clothes
        size: { type: String, required: true },
        color: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      governorate: { type: String, required: true }, // e.g., Cairo, Giza
      phoneNumber: { type: String, required: true }, // Critical for COD
      email: { type: String, required: false }, // Optional (for guests) but recommended for notifications
    },
    paymentMethod: {
      type: String,
      required: true,
      default: "COD", // 'COD' or 'Instapay'
    },
    // For Instapay proof (optional for now)
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
    },
    coupon: {
      code: { type: String },
      discount: { type: Number },
      discountType: { type: String }, // 'PERCENTAGE' or 'FIXED'
    },
    itemsPrice: { type: Number, required: true, default: 0.0 },
    shippingPrice: { type: Number, required: true, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    isPaid: { type: Boolean, required: true, default: false },
    paidAt: { type: Date },
    isDelivered: { type: Boolean, required: true, default: false },
    deliveredAt: { type: Date },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    },
    order_id: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Helper to generate a 6-character uppercase alphanumeric ID
const generateOrderId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Pre-save hook to ensure the ID is generated and unique
orderSchema.pre("save", async function () {
  if (!this.order_id) {
    let unique = false;
    while (!unique) {
      const id = generateOrderId();
      // Check collision. Note: 'this.constructor' refers to the Model (Order)
      const existingOrder = await this.constructor.findOne({ order_id: id });
      if (!existingOrder) {
        this.order_id = id;
        unique = true;
      }
    }
  }
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
