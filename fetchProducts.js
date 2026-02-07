const mongoose = require("mongoose");
const Product = require("./models/productModel");
const dotenv = require("dotenv");

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

const fetchProducts = async () => {
  await connectDB();
  const products = await Product.find({}, "name slug description");
  console.log(JSON.stringify(products, null, 2));
  process.exit();
};

fetchProducts();
