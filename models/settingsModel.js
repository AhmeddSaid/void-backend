const mongoose = require("mongoose");

const settingsSchema = mongoose.Schema(
  {
    marketing: {
      abandonedCart: {
        emailEnabled: { type: Boolean, default: true },
        pushEnabled: { type: Boolean, default: true },
        delayMinutes: { type: Number, default: 60 },
      },
    },
    store: {
      acceptingOrders: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Singleton pattern: Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  const settings = await this.findOne();
  if (settings) return settings;
  return await this.create({});
};

const Settings = mongoose.model("Settings", settingsSchema);

module.exports = Settings;
