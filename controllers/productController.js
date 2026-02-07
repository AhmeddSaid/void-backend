const asyncHandler = require("express-async-handler");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const mongoose = require("mongoose");

// @desc    Fetch all products with Search & Filter
// @route   GET /api/products?keyword=abc
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // 1. Expanded Search Logic (Name, Description, Category)
  let keyword = {};
  if (req.query.keyword) {
    const regex = { $regex: req.query.keyword, $options: "i" };
    keyword = {
      $or: [{ name: regex }, { description: regex }, { category: regex }],
    };
  }

  // 2. Filters
  let filters = {};

  // Category
  // Category Filter
  if (req.query.category) {
    // Check if it's a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(req.query.category)) {
        filters.category = req.query.category;
    } else {
        // It's a slug or name, find the category ID
        const categoryDoc = await Category.findOne({ 
            $or: [{ slug: req.query.category }, { name: req.query.category }] 
        });
        
        if (categoryDoc) {
            filters.category = categoryDoc._id;
        } else {
            // Category not found, so no products should match
            // We can return empty, or ignore the filter? 
            // Better to return empty to be accurate.
            return res.json({ products: [], count: 0 });
        }
    }
  }

  // Price Filter (Using 'salePrice' if available, otherwise 'price')
  // Note: For simplicity in partial matching, we filter on 'price' (Original) or 'salePrice' (Discounted)
  // To do this strictly correctly requires aggregation, but for now we'll filter 'price' as the base.
  // IMPROVED: Filter against EITHER price or salePrice being in range.
  // Price Filter (Using Effective Price: Sale Price > 0 ? Sale Price : Price)
  if (req.query.minPrice || req.query.maxPrice) {
    const min = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const max = req.query.maxPrice ? Number(req.query.maxPrice) : 10000000;

    // Use $expr to calculate effective price on the fly for filtering
    // $ifNull checks if salePrice exists and is not null. 
    // However, sometimes salePrice might be 0. We usually want to use salePrice if it is 'truthy' vs strictly not null.
    // A safer check for this specific schema (where salePrice might be undefined or 0) is:
    // $cond: { if: { $gt: ["$salePrice", 0] }, then: "$salePrice", else: "$price" }
    
    filters.$expr = {
      $and: [
        { $gte: [{ $cond: { if: { $gt: ["$salePrice", 0] }, then: "$salePrice", else: "$price" } }, min] },
        { $lte: [{ $cond: { if: { $gt: ["$salePrice", 0] }, then: "$salePrice", else: "$price" } }, max] }
      ]
    };
  }

  // Boolean Filters
  if (req.query.isNew === 'true') {
     filters.isNew = true;
  }
  
  if (req.query.onSale === 'true') {
     // Products where salePrice exists and is less than price
     filters.salePrice = { $exists: true, $ne: null };
     // We can also ensure salePrice < price usually by default if set
  }

  // Stock Filter
  // This is tricky because stock is inside 'variants' array.
  // "In Stock" -> At least one variant has stock > 0
  // "Out of Stock" -> All variants have stock 0
  if (req.query.inStock === 'true') {
     filters["variants.stock"] = { $gt: 0 };
  }
  if (req.query.outOfStock === 'true') {
     // Every variant must be 0? Or just 'not in stock'
     // MongoDB is easier to find 'where variants.stock > 0' is FALSE?
     // Actually: { variants: { $not: { $elemMatch: { stock: { $gt: 0 } } } } }
     filters.variants = { $not: { $elemMatch: { stock: { $gt: 0 } } } };
  }

  // Combine query
  const query = { ...keyword, ...filters };

  // Combine filters
  const count = await Product.countDocuments(query);

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
  const products = await Product.find(query).sort(sort).populate('category');

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
