const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
} = require("../controllers/productController");

// Helper to check if functions are loaded correctly
if (!getProducts || !getProductById) {
  console.error(
    "ERROR: Product Controller functions not loaded. Check productController.js exports.",
  );
}

router.route("/").get(getProducts);
router.route("/:id").get(getProductById);

module.exports = router;
