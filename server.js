const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes"); // <--- Import

// 1. Load Config
dotenv.config();

// 2. Connect to Database
connectDB();

// 3. Initialize App
const app = express();

// 4. Middleware
app.use(express.json()); // Allows accepting JSON data
app.use(cors()); // Allows frontend to talk to backend
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev")); // Logs requests to console
}

// 5. Base Route
app.get("/", (req, res) => {
  res.send("VOID API is running...");
});

// MOUNT ROUTES
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes); // <--- Mount

// 6. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
