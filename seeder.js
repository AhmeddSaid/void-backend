const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors"); // Optional: npm install colors for colored logs
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

// Load Models
const User = require("./models/userModel");
const Product = require("./models/productModel");
const Order = require("./models/orderModel");

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed...".red.inverse); // If you installed 'colors'

    // 2. Create Users
    // Hash password manually for seeder
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const createdUsers = await User.insertMany([
      {
        name: "VOID Admin",
        email: "admin@void.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        name: "Test Customer",
        email: "customer@void.com",
        password: hashedPassword,
        role: "customer",
      },
    ]);

    const adminUser = createdUsers[0]._id;

    // 3. Create Products (Based on Brand Guide)
    const sampleProducts = [
      {
        name: "VOID Signature Hoodie - Black",
        slug: "void-signature-hoodie-black",
        description:
          "Heavyweight cotton hoodie with embroidered VOID logo on chest. Minimalist street style.",
        price: 1200,
        compareAtPrice: 1500,
        category: "Hoodies",
        coverImage:
          "https://placehold.co/600x600/000000/FFFFFF?text=VOID+Hoodie", // Placeholder
        images: ["https://placehold.co/600x600/000000/FFFFFF?text=Back+View"],
        variants: [
          { color: "Black", colorCode: "#000000", size: "S", stock: 10 },
          { color: "Black", colorCode: "#000000", size: "M", stock: 15 },
          { color: "Black", colorCode: "#000000", size: "L", stock: 5 },
          { color: "Black", colorCode: "#000000", size: "XL", stock: 0 }, // Out of stock example
        ],
        isFeatured: true,
      },
      {
        name: "Monochrome Tee - White",
        slug: "monochrome-tee-white",
        description:
          "Oversized fit t-shirt with subtle branding. Premium cotton blend.",
        price: 650,
        category: "T-Shirts",
        coverImage:
          "https://placehold.co/600x600/FFFFFF/000000?text=VOID+Tee",
        images: [],
        variants: [
          { color: "White", colorCode: "#FFFFFF", size: "M", stock: 20 },
          { color: "White", colorCode: "#FFFFFF", size: "L", stock: 20 },
        ],
        isFeatured: true,
      },
    ];

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
