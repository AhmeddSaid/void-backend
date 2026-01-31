const express = require("express");
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders, // Import
  updateOrderToDelivered, // Import
} = require("../controllers/orderController");
const { protect, optionalAuth, admin } = require("../middleware/authMiddleware"); // Import admin

router.route("/").post(optionalAuth, addOrderItems).get(protect, admin, getOrders); // <--- Admin only: Get All Orders

router.route("/myorders").get(protect, getMyOrders);

router.route("/:id").get(getOrderById);

router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered); // <--- Admin only: Update Status

module.exports = router;
