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

    // 3. Create Products (Based on User Request)
    const description = "Crafted from premium Heavyweight Brushed Fleece (350-500 GSM), this hoodie is designed to provide the ultimate structure and warmth. The 'Sponge' fabric technology offers a dense, puffy feel that holds its shape, featuring a super-soft brushed interior for maximum comfort. Weighing up to 1kg, it’s a true winter essential built to last.";
    
    // Helper to generate variants for S-2XL with 5 stock each
    const createVariants = (color, colorCode) => {
      const sizes = ["S", "M", "L", "XL", "2XL"];
      return sizes.map(size => ({
        color,
        colorCode,
        size,
        stock: 5,
        sku: `VOID-HOODIE-${color.toUpperCase().substring(0, 3)}-${size}`
      }));
    };

    const sampleProducts = [
      {
        name: "VOID Heavyweight Hoodie - Black",
        slug: "void-heavyweight-hoodie-black",
        description: description,
        price: 1800, // Original Price
        salePrice: 1500, // Selling Price
        category: "Hoodies",
        coverImage: "/assets/products/black-hoodie-front.png", // Using local placeholder path convention
        images: ["/assets/products/black-hoodie-back.png"],
        variants: createVariants("Black", "#000000"),
        isFeatured: true, // Show on home
        isNew: true,
        isPreOrder: false,
      },
      {
        name: "VOID Heavyweight Hoodie - White",
        slug: "void-heavyweight-hoodie-white",
        description: description,
        price: 1800,
        salePrice: 1500,
        category: "Hoodies",
        coverImage: "/assets/products/white-hoodie-front.png",
        images: ["/assets/products/white-hoodie-back.png"],
        variants: createVariants("White", "#FFFFFF"),
        isFeatured: true,
        isNew: true,
        isPreOrder: false,
      },
      {
        name: "VOID Heavyweight Hoodie - Grey",
        slug: "void-heavyweight-hoodie-grey",
        description: description,
        price: 1800,
        salePrice: 1500,
        category: "Hoodies",
        coverImage: "/assets/products/grey-hoodie-front.png",
        images: ["/assets/products/grey-hoodie-back.png"],
        variants: createVariants("Grey", "#808080"),
        isFeatured: true,
        isNew: true,
        isPreOrder: false,
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
