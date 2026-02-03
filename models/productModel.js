const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // 'slug' is the URL-friendly version of the name (e.g., "void-black-hoodie")
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },

    price: { type: Number, required: true }, // Original / Retail Price
    salePrice: { type: Number }, // Discounted / Selling Price (Optional)
    compareAtPrice: { type: Number }, // DEPRECATED: Keeping for backup temporarily

    category: { type: String, required: true }, // e.g., 'Hoodies', 'Pants'

    // Images
    coverImage: { type: String, required: true },
    images: [String], // Array of additional image URLs

    // Inventory Logic
    variants: [
      {
        color: { type: String, required: true }, // e.g., "Black"
        colorCode: { type: String, required: true }, // e.g., "#000000" (for the color swatch on frontend)
        size: { type: String, required: true }, // e.g., "L"
        stock: { type: Number, default: 0, required: true }, // Stock for this specific size/color
        sku: String, // Optional: VOID-HOODIE-BLK-L
      },
    ],

    // Sales Stats
    isFeatured: { type: Boolean, default: false }, // If true, shows on Homepage Hero
    isNew: { type: Boolean, default: true },
    isPreOrder: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    soldCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
