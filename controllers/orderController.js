const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");
const Coupon = require("../models/couponModel");

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Guest Checkout) or Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentResult,
    couponCode,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
  } else {
    let finalTotalPrice = totalPrice;
    let validCoupon = null;

    // --- COUPON VALIDATION & OPTIMISTIC USAGE INCREMENT ---
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

      if (coupon) {
        // 1. Basic Checks
        const isValid =
          coupon.isActive &&
          new Date() <= coupon.expirationDate &&
          (coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit);

        // 2. User Limit Check
        let isUserValid = true;
        if (req.user) {
          const userUsage = coupon.usedBy.find(
            (entry) => entry.user.toString() === req.user._id.toString()
          );
          if (userUsage && userUsage.count >= coupon.userUsageLimit) {
            isUserValid = false;
          }
        }

        if (isValid && isUserValid) {
          // Calculate Discount
          let discountAmount = 0;
          if (coupon.discountType === "PERCENTAGE") {
            discountAmount = itemsPrice * (coupon.discount / 100);
          } else {
            discountAmount = coupon.discount;
          }
          discountAmount = Math.min(discountAmount, itemsPrice);

          // Update Total
          finalTotalPrice = itemsPrice + shippingPrice - discountAmount;
          validCoupon = coupon;

          // Increment Usage
          coupon.usedCount += 1;
          if (req.user) {
            const userIndex = coupon.usedBy.findIndex(
              (entry) => entry.user.toString() === req.user._id.toString()
            );
            if (userIndex !== -1) {
              coupon.usedBy[userIndex].count += 1;
            } else {
              coupon.usedBy.push({ user: req.user._id, count: 1 });
            }
          }
          await coupon.save();
        } else {
           res.status(400);
           throw new Error("Coupon is invalid, expired, or usage limit reached");
        }
      } else {
        res.status(400);
        throw new Error("Invalid coupon code");
      }
    }

    // --- CREATE ORDER WITH ROLLBACK ---
    try {
      const order = new Order({
        orderItems,
        user: req.user ? req.user._id : undefined,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice: finalTotalPrice,
        paymentResult,
        isPaid: paymentMethod === "Instapay" ? false : undefined,
        coupon: validCoupon
          ? {
              code: validCoupon.code,
              discount: validCoupon.discount,
              discountType: validCoupon.discountType,
            }
          : undefined,
      });

      const createdOrder = await order.save();

      // --- SEND CONFIRMATION EMAIL (Async - don't block response) ---
      // We wrap in try-catch so email failure doesn't crash the request
      try {
        const recipientEmail = shippingAddress.email || (req.user && req.user.email);

        if (recipientEmail) {
           const sendEmail = require("../utils/sendEmail");
           const { generateOrderEmail } = require("../utils/emailTemplates");
           
           const emailHtml = generateOrderEmail(createdOrder, process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000');
           
           await sendEmail({
             email: recipientEmail,
             subject: `Order Confirmation #${createdOrder.order_id} - VOID`,
             message: emailHtml,
           });
        }
      } catch (emailError) {
        console.error("Email send failed:", emailError);
        // We do NOT rollback order for email failure.
      }

      res.status(201).json(createdOrder);

    } catch (error) {
      // ROLLBACK COUPON USAGE
      if (validCoupon) {
        validCoupon.usedCount = Math.max(0, validCoupon.usedCount - 1);
        if (req.user) {
           const userIndex = validCoupon.usedBy.findIndex(
              (entry) => entry.user.toString() === req.user._id.toString()
           );
           if (userIndex !== -1) {
              validCoupon.usedBy[userIndex].count = Math.max(0, validCoupon.usedBy[userIndex].count - 1);
           }
        }
        await validCoupon.save();
      }
      throw error;
    }
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public (Secure this in production)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  // Find orders where 'user' matches the ID from the token
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  // Populate user info so we know WHO bought it
  const orders = await Order.find({})
    .populate("user", "id name")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc    Update order to delivered/shipped
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // You can toggle statuses here. Simple version:
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = req.body.status || "Delivered"; // Allow passing 'Shipped' etc.

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
