const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Settings = require("./models/settingsModel");
const connectDB = require("./config/db");

dotenv.config();

const updateSettings = async () => {
  try {
    // 1. Connect to DB
    await connectDB();

    console.log("Fetching existing settings...");
    
    // 2. Find existing settings
    let settings = await Settings.findOne();

    if (settings) {
        console.log("Current Settings Found:", JSON.stringify(settings, null, 2));

        // 3. Update/Merge Logic
        // Ensure 'store' object exists
        if (!settings.store) {
            settings.store = {};
        }

        // Set lowStockThreshold if not set (or just force update if that's what user wants, 
        // but 'keep as is and do not reset' implies preserving others).
        // Since schema default is 5, it might be auto-set on load if using strict mode, 
        // but to be explicit we set it.
        if (settings.store.lowStockThreshold === undefined) {
             console.log("Adding 'lowStockThreshold: 5'...");
             settings.store.lowStockThreshold = 5;
        } else {
             console.log(`'lowStockThreshold' already exists: ${settings.store.lowStockThreshold}. Ensuring it is preserved.`);
        }
        
        // Ensure acceptingOrders exists
        if (settings.store.acceptingOrders === undefined) {
             settings.store.acceptingOrders = true;
        }

        // 4. Save
        const updatedSettings = await settings.save();
        console.log("Settings Successfully Updated/Merged:", JSON.stringify(updatedSettings, null, 2));
    } else {
        // Create if missing
        console.log("No settings found. Creating new...");
        const newSettings = await Settings.create({
            store: {
                lowStockThreshold: 5,
                acceptingOrders: true
            }
        });
        console.log("New Settings Created:", newSettings);
    }

    process.exit();
  } catch (error) {
    console.error("Error updating settings:", error);
    process.exit(1);
  }
};

updateSettings();
