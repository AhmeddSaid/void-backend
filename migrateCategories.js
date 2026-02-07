const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel");
const Category = require("./models/categoryModel");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();

  try {
    // 1. Define Categories
    const categoriesData = [
      {
        name: "Hoodies",
        nameAr: "هوديز",
        slug: "hoodies",
        description: "Heavyweight streetwear essentials.",
        descriptionAr: "أساسيات أزياء الشارع الثقيلة.",
        image: "/assets/img/void-hoodie-black.png",
        status: "active",
        displayOrder: 1
      },
      {
        name: "SweatPants",
        nameAr: "بنطلونات رياضية",
        slug: "sweatpants",
        description: "Comfort meets style.",
        descriptionAr: "راحة وأناقة.",
        image: "/assets/img/void-hoodie-black-back.png", // Placeholder
        status: "coming_soon",
        displayOrder: 2
      },
      {
        name: "Perfumes",
        nameAr: "عطور",
        slug: "perfumes",
        description: "Signature scents.",
        descriptionAr: "روائح مميزة.",
        image: "/assets/img/og-image.png", // Placeholder
        status: "coming_soon",
        displayOrder: 3
      },
      {
        name: "Wallets",
        nameAr: "محافظ",
        slug: "wallets",
        description: "Minimalist carry.",
        descriptionAr: "حمل بسيط.",
        image: "/assets/img/og-image.png", // Placeholder
        status: "coming_soon",
        displayOrder: 4
      }
    ];

    // 2. Clear & Insert Categories
    console.log("Clearing old categories...");
    await Category.deleteMany();
    
    console.log("Inserting new categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    
    // Map Slug -> Object
    const catMap = {};
    createdCategories.forEach(cat => {
        catMap[cat.slug] = cat;
        // Also map lowercase name for easier matching if needed
        catMap[cat.name.toLowerCase()] = cat;
    });

    console.log("Category Map:", Object.keys(catMap));

    // 3. Update Products
    console.log("Updating products...");
    const products = await Product.find({});
    
    // In this specific case, all existing products are Hoodies. 
    // Since we wiped the Categories table, the old IDs on products are invalid.
    // We will re-assign them to the new 'Hoodies' category.
    const hoodiesCat = catMap['hoodies'];

    if (!hoodiesCat) {
        throw new Error("Hoodies category not created!");
    }

    for (const product of products) {
        // Just force update to Hoodies for now to fix the broken links
        await Product.updateOne(
            { _id: product._id },
            { $set: { category: hoodiesCat._id } }
        );
        console.log(`Updated ${product.name} -> Category: ${hoodiesCat.name}`);
    }

    console.log("Migration Complete!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
