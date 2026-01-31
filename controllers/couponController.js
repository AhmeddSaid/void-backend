const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Public (but User ID optional for usage check)
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, userId } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Please provide a coupon code");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase() });

  if (!coupon) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }

  // 1. Check Active Status
  if (!coupon.isActive) {
    res.status(400);
    throw new Error("Coupon is inactive");
  }

  // 2. Check Expiration
  if (new Date() > coupon.expirationDate) {
    res.status(400);
    throw new Error("Coupon has expired");
  }

  // 3. Check Global Usage Limit
  if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
    res.status(400);
    throw new Error("Coupon usage limit reached");
  }

  // 4. Check User Usage Limit (if user is logged in)
  if (userId) {
    const userUsage = coupon.usedBy.find(
      (entry) => entry.user.toString() === userId
    );

    if (userUsage && userUsage.count >= coupon.userUsageLimit) {
      res.status(400);
      throw new Error(`You have already used this coupon maximum times`);
    }
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount: coupon.discount,
    discountType: coupon.discountType,
    message: "Coupon applied successfully",
  });
});

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    discount,
    discountType,
    expirationDate,
    usageLimit,
    userUsageLimit,
  } = req.body;

  const couponExists = await Coupon.findOne({ code });

  if (couponExists) {
    res.status(400);
    throw new Error("Coupon already exists");
  }

  const coupon = await Coupon.create({
    code,
    discount,
    discountType,
    expirationDate,
    usageLimit,
    userUsageLimit,
  });

  if (coupon) {
    res.status(201).json(coupon);
  } else {
    res.status(400);
    throw new Error("Invalid coupon data");
  }
});

module.exports = {
  validateCoupon,
  createCoupon,
};
