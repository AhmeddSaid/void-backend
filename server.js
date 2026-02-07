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

// 2.1. Initialize Cron Jobs (Abandoned Carts)
const initCronJobs = require("./utils/cronJobs");
initCronJobs();

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

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// ... (Routes above) ...
// MOUNT ROUTES
//! Product Routes
app.use("/api/products", productRoutes);
//! Order Routes
app.use("/api/orders", orderRoutes);
//! User Routes
app.use("/api/users", userRoutes);
//! Cart Routes
app.use("/api/cart", cartRoutes);
//! Category Routes (NEW)
app.use("/api/categories", require("./routes/categoryRoutes"));
//! Coupon Routes
app.use("/api/coupons", require("./routes/couponRoutes"));
//! Settings Routes
app.use("/api/settings", require("./routes/settingsRoutes"));

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// 6. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
