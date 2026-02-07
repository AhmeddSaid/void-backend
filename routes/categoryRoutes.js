const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
} = require("../controllers/categoryController");

// Base Routes
router.route("/")
    .get(getCategories)
    .post(createCategory); // Add Auth middleware here later

// ID Routes
router.route("/:id").get(getCategoryById);

module.exports = router;
