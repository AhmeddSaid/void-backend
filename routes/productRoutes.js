const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  getCategories,
} = require("../controllers/productController");

// Helper to check if functions are loaded correctly
if (!getProducts || !getProductById) {
  console.error(
    "ERROR: Product Controller functions not loaded. Check productController.js exports.",
  );
}

// 1. Specific routes first to avoid conflict with :id
router.route("/categories").get(getCategories);

// 2. Base routes
router.route("/").get(getProducts);

// 3. Parameterized routes last
router.route("/:id").get(getProductById);

module.exports = router;
