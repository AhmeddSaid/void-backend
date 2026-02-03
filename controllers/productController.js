const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");

// @desc    Fetch all products with Search & Filter
// @route   GET /api/products?keyword=abc
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // 1. Search Logic (by name or description)
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", // Case insensitive
        },
      }
    : {};

  // 2. Category Filter (optional)
  // Usage: /api/products?category=Hoodies
  const category = req.query.category ? { category: req.query.category } : {};

  // Combine filters
  const count = await Product.countDocuments({ ...keyword, ...category });

  // 3. Sorting Logic
  let sort = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case "price-asc":
        sort = { price: 1 };
        break;
      case "price-desc":
        sort = { price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      case "oldest":
        sort = { createdAt: 1 };
        break;
       case "best-selling":
        sort = { soldCount: -1 };
        break; 
      default:
        sort = { createdAt: -1 };
    }
  } else {
    // Default sort
    sort = { createdAt: -1 };
  }

  // 4. Fetch with Filters & Sort
  const products = await Product.find({ ...keyword, ...category }).sort(sort);

  res.json({ products, count });
});

// @desc    Get unique categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Product.distinct("category");
  res.json(categories);
});

// @desc    Fetch single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const param = req.params.id;
  let product;

  // Check if it's a valid MongoDB ObjectId
  if (param.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(param);
  } else {
    // Treat as slug
    product = await Product.findOne({ slug: param });
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// IMPORTANT: Ensure both are exported
module.exports = {
  getProducts,
  getProductById,
  getCategories,
};
