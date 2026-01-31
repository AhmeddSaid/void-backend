const express = require("express");
const router = express.Router();
const {
  validateCoupon,
  createCoupon,
} = require("../controllers/couponController");
const { protect, admin } = require("../middleware/authMiddleware");

router.post("/validate", validateCoupon);
router.route("/").post(protect, admin, createCoupon);

module.exports = router;
