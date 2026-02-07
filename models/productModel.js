const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameAr: { type: String }, // Localized Name (Optional)
    
    // 'slug' is the URL-friendly version of the name (e.g., "void-black-hoodie")
    slug: { type: String, required: true, unique: true },
    
    description: { type: String, required: true },
    descriptionAr: { type: String }, // Localized Description (Optional)

    // SEO / Metadata
    metaTitle: { type: String }, // English Meta Title
    metaTitleAr: { type: String }, // Arabic Meta Title
    metaDescription: { type: String }, // English Meta Description
    metaDescriptionAr: { type: String }, // Arabic Meta Description
    keywords: { type: String },

    // Detailed Specifications
    specifications: {
      composition: { type: String }, // e.g., "100% Cotton"
      compositionAr: { type: String },
      fabricType: { type: String }, // "Heavyweight Brushed Fleece"
      fabricTypeAr: { type: String },
      weightGsm: { type: String }, // "350–500 GSM"
      fitType: { type: String }, // "Relaxed / Oversized"
      fitTypeAr: { type: String },
      features: [String], // Array of strings (English)
      featuresAr: [String] // Array of strings (Arabic)
    },

    // Size Chart
    sizeChart: {
      unit: { type: String, default: "cm" },
      notes: { type: String },
      notesAr: { type: String },
      sizes: [
        {
          size: { type: String, required: true }, // S, M, L...
          chestWidth: { type: Number },
          bodyLength: { type: Number }
        }
      ]
    },

    // Care Instructions
    careInstructions: [String], // English
    careInstructionsAr: [String], // Arabic

    price: { type: Number, required: true }, // Original / Retail Price
    salePrice: { type: Number }, // Discounted / Selling Price (Optional)
    compareAtPrice: { type: Number }, // DEPRECATED: Keeping for backup temporarily

    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Category",
      required: true 
    },

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
