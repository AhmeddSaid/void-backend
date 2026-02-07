const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // English Name
    nameAr: { type: String }, // Arabic Name
    
    slug: { type: String, required: true, unique: true },
    
    description: { type: String },
    descriptionAr: { type: String },
    
    image: { type: String }, // Optional URL for category banner/thumbnail
    
    status: { 
        type: String, 
        enum: ['active', 'disabled', 'coming_soon'],
        default: 'active'
    },
    
    displayOrder: { type: Number, default: 0 } // For custom sorting
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
