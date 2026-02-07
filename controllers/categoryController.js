const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  // Optional: Filter by status if query param exists
  // e.g. /api/categories?status=active
  const filter = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }

  // If public request (not admin), maybe we hide 'disabled'? 
  // For now, let frontend handle hiding, or just return all non-disabled
  // filter.status = { $ne: 'disabled' };

  const categories = await Category.find(filter).sort({ displayOrder: 1, createdAt: 1 });
  res.json(categories);
});

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, nameAr, slug, status } = req.body;

  const categoryExists = await Category.findOne({ slug });
  if (categoryExists) {
    res.status(400);
    throw new Error("Category already exists");
  }

  const category = await Category.create({
    name,
    nameAr,
    slug,
    status: status || 'active'
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error("Invalid category data");
  }
});

module.exports = {
  getCategories,
  getCategoryById,
  createCategory
};
