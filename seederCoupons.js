const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Coupon = require("./models/couponModel");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const seedCoupons = async () => {
    try {
        await Coupon.deleteMany(); // Clear existing

        const coupons = [
            {
                code: "WELCOME10",
                discount: 10,
                discountType: "PERCENTAGE",
                expirationDate: new Date("2030-01-01"),
                usageLimit: 100,
                userUsageLimit: 1,
            },
            {
                code: "FLAT50",
                discount: 50,
                discountType: "FIXED",
                expirationDate: new Date("2030-01-01"),
                usageLimit: null,
                userUsageLimit: 1,
            },
            {
                code: "EXPIRED",
                discount: 50,
                discountType: "PERCENTAGE",
                expirationDate: new Date("2020-01-01"), // Past date
                usageLimit: 100,
            }
        ];

        await Coupon.insertMany(coupons);

        console.log("Coupons Seeded!");
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedCoupons();
